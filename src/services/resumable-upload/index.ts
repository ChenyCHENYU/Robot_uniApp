/* eslint-disable no-await-in-loop -- 分片必须顺序推进（断点语义） */

/**
 * 断点续传上传服务（通用核心版）
 *
 * 面向大文件（巡检视频/离线采集包等）的分片上传：
 * - 分片读取：App（plus.io slice）/ 小程序（FileSystemManager position 读取）
 * - 状态机：queued → uploading ⇄ paused → completed / failed
 * - 持久化：按环境/账号隔离 job；杀进程后由调用方在登录完成后恢复
 * - 重试：单分片失败自动重试（指数退避，上限 3 次）
 *
 * 后端契约（三个 JSON/二进制接口，均走 http 层携带 token）：
 *   POST /upload/init     { fileName, fileSize, chunkSize, mimeType }
 *                           → { uploadId }
 *   PUT  /upload/chunk    body=二进制分片，x-upload-id/x-chunk-index 请求头
 *   POST /upload/complete { uploadId, fileName } → 业务结果
 *
 * 平台支持：App（plus.io）、微信小程序（getFileSystemManager）；
 * H5 无文件系统切片能力，抛出明确错误（H5 请直接使用 http.upload）。
 */
import {
  initResumableUpload,
  uploadChunk,
  completeResumableUpload,
} from '@/api'
import { logger } from '@/utils/logger'
import config from '@/config/env'
import { useUserStore } from '@/stores/modules/user'
import {
  getRequestContextEpoch,
  onRequestContextChange,
} from '@/services/request-context'

const STORAGE_PREFIX = 'resumable_upload_jobs_v2:'
const DEFAULT_CHUNK_SIZE = 2 * 1024 * 1024
const MIN_CHUNK_SIZE = 256 * 1024
const MAX_CHUNK_SIZE = 8 * 1024 * 1024
const MAX_CHUNK_RETRY = 3

export type UploadJobStatus =
  | 'queued'
  | 'uploading'
  | 'paused'
  | 'failed'
  | 'completed'

export interface ResumableUploadJob {
  id: string
  /** 业务分类标识；实际传输路径由 api/modules/upload.ts 的契约统一声明。 */
  endpoint: string
  /** 调用方须保存为可跨进程访问的文件；设备清理临时文件后无法恢复。 */
  localPath: string
  fileName: string
  fileSize: number
  mimeType: string
  chunkSize: number
  uploadId?: string
  /** 已上传字节数（断点恢复的游标） */
  uploadedBytes: number
  status: UploadJobStatus
  createdAt: number
  updatedAt: number
  lastError?: string
  result?: unknown
}

export interface CreateJobOptions {
  endpoint: string
  filePath: string
  fileName?: string
  fileSize?: number
  mimeType?: string
  chunkSize?: number
}

export interface JobProgress {
  jobId: string
  uploadedBytes: number
  totalBytes: number
  percent: number
}

type ProgressListener = (progress: JobProgress) => void

// ==================== job 持久化 ====================

interface UploadContext {
  storageKey: string
  epoch: number
}

interface UploadRun {
  job: ResumableUploadJob
  context: UploadContext
  removed: boolean
  promise: Promise<unknown>
}

/** 停止任务只结束本次执行，不作为上传失败覆写已暂停/已删除状态。 */
class UploadStoppedError extends Error {
  /** 构造可与网络、业务失败区分的内部停止信号。 */
  constructor() {
    super('上传任务已停止')
    this.name = 'UploadStoppedError'
  }
}

const activeRuns = new Map<string, UploadRun>()

/** 账号标识不使用令牌，避免续期改变归属或把凭证写入任务键。 */
function getUploadContext(): UploadContext {
  const user = useUserStore()
  const account =
    user.loginAccount || user.userInfo?.username || user.userInfo?.id
  if (!user.token || account === undefined || account === '') {
    throw new Error('请先登录并获取账号信息后再操作上传任务')
  }
  const scope = [config.CURRENT_ENV, config.API_BASE_URL, String(account)]
  return {
    storageKey: STORAGE_PREFIX + encodeURIComponent(JSON.stringify(scope)),
    epoch: getRequestContextEpoch(),
  }
}

/** 旧 v1 任务没有账号/环境来源，不自动认领给当前登录者。 */
function loadJobs(context: UploadContext): ResumableUploadJob[] {
  try {
    const raw = uni.getStorageSync(context.storageKey)
    const jobs: unknown = raw ? JSON.parse(String(raw)) : []
    return Array.isArray(jobs) ? jobs : []
  } catch {
    return []
  }
}

/** 任务始终写回创建时的账号环境，禁止异步响应采用新会话的存储键。 */
function saveJobs(context: UploadContext, jobs: ResumableUploadJob[]) {
  uni.setStorageSync(context.storageKey, JSON.stringify(jobs))
}

/** 代次变化立即暂停执行；在途响应不得继续进度、完成请求或下一次重试。 */
onRequestContextChange(() => {
  activeRuns.forEach(run => {
    if (run.removed || run.job.status !== 'uploading') return
    run.job.status = 'paused'
    persistJob(run.job, run.context)
  })
})

/** 每次异步边界重新核对身份、环境和删除状态。 */
function assertRunContext(run: UploadRun, allowPaused = false) {
  if (
    run.removed ||
    run.context.epoch !== getRequestContextEpoch() ||
    run.context.storageKey !== getUploadContext().storageKey ||
    (!allowPaused && run.job.status !== 'uploading')
  ) {
    throw new UploadStoppedError()
  }
}

/** 生成 job 唯一 id */
function genJobId(): string {
  return `job_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

/** 分片大小约束 */
function clampChunkSize(size?: number): number {
  if (!size || !Number.isFinite(size)) return DEFAULT_CHUNK_SIZE
  return Math.min(MAX_CHUNK_SIZE, Math.max(MIN_CHUNK_SIZE, Math.round(size)))
}

// ==================== 文件信息 ====================

/** 读取文件大小（App/MP 通用） */
function getFileSize(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    try {
      plus.io.resolveLocalFileSystemURL(
        filePath,
        entry => {
          ;(
            entry as unknown as {
              file: (cb: (f: { size: number }) => void) => void
            }
          ).file(file => resolve(file.size))
        },
        err => reject(new Error(`读取文件失败: ${JSON.stringify(err)}`))
      )
      return
    } catch (error) {
      reject(error)
      return
    }
    // #endif
    // #ifdef MP-WEIXIN
    try {
      const fsm = uni.getFileSystemManager()
      fsm.stat({
        path: filePath,
        success: res => resolve((res.stats as { size: number }).size),
        fail: err => reject(new Error(err.errMsg || 'stat 失败')),
      })
      return
    } catch (error) {
      reject(error)
      return
    }
    // #endif
    // #ifdef H5
    reject(new Error('H5 端不支持分片上传，请直接使用 http.upload'))
    // #endif
  })
}

/** 读取文件指定字节区间（App: plus.io slice；MP: FileSystemManager position） */
function readFileChunk(
  filePath: string,
  start: number,
  end: number
): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    try {
      plus.io.resolveLocalFileSystemURL(
        filePath,
        entry => {
          const fileEntry = entry as unknown as {
            file: (
              cb: (f: { slice: (s: number, e: number) => Blob }) => void
            ) => void
          }
          fileEntry.file(file => {
            const slice = file.slice(start, end)
            const reader = new plus.io.FileReader()
            const plusFile = slice as any
            reader.onloadend = evt => {
              const target = evt.target as unknown as { result?: string } | null
              const dataUrl = String(target?.result || '')
              const separator = dataUrl.indexOf(',')
              if (separator === -1) {
                reject(new Error('分片读取格式错误'))
                return
              }
              resolve(uni.base64ToArrayBuffer(dataUrl.slice(separator + 1)))
            }
            reader.onerror = () => reject(new Error('分片读取失败'))
            reader.readAsDataURL(plusFile)
          })
        },
        err => reject(new Error(`读取文件失败: ${JSON.stringify(err)}`))
      )
      return
    } catch (error) {
      reject(error)
      return
    }
    // #endif
    // #ifdef MP-WEIXIN
    try {
      const fsm = uni.getFileSystemManager()
      fsm.readFile({
        filePath,
        position: start,
        length: end - start,
        success: res => resolve(res.data as ArrayBuffer),
        fail: err => reject(new Error(err.errMsg || '分片读取失败')),
      })
      return
    } catch (error) {
      reject(error)
      return
    }
    // #endif
    // #ifdef H5
    reject(new Error('H5 端不支持分片读取'))
    // #endif
  })
}

// ==================== 上传状态机 ====================

const progressListeners = new Set<ProgressListener>()

/** 订阅进度（返回取消函数） */
export function onUploadProgress(listener: ProgressListener) {
  progressListeners.add(listener)
  return () => progressListeners.delete(listener)
}

/** 广播进度 */
function notifyProgress(job: ResumableUploadJob) {
  const progress: JobProgress = {
    jobId: job.id,
    uploadedBytes: job.uploadedBytes,
    totalBytes: job.fileSize,
    percent:
      job.fileSize > 0
        ? Math.floor((job.uploadedBytes / job.fileSize) * 100)
        : 0,
  }
  progressListeners.forEach(fn => {
    try {
      fn(progress)
    } catch {
      // 监听器异常不影响上传
    }
  })
}

/** 持久化单个 job */
function persistJob(job: ResumableUploadJob, context: UploadContext) {
  const jobs = loadJobs(context)
  const idx = jobs.findIndex(j => j.id === job.id)
  job.updatedAt = Date.now()
  if (idx >= 0) jobs[idx] = job
  else jobs.push(job)
  saveJobs(context, jobs)
}

/** 创建上传 job（自动入队，需调用 startJob 开始传输） */
export function createUploadJob(
  options: CreateJobOptions
): Promise<ResumableUploadJob> {
  return (async () => {
    const context = getUploadContext()
    const fileSize =
      options.fileSize && options.fileSize > 0
        ? options.fileSize
        : await getFileSize(options.filePath)

    if (context.epoch !== getRequestContextEpoch())
      throw new UploadStoppedError()
    if (!Number.isFinite(fileSize) || fileSize <= 0)
      throw new Error('文件大小无效')
    const job: ResumableUploadJob = {
      id: genJobId(),
      endpoint: options.endpoint,
      localPath: options.filePath,
      fileName: options.fileName || options.filePath.split('/').pop() || 'file',
      fileSize,
      mimeType: options.mimeType || 'application/octet-stream',
      chunkSize: clampChunkSize(options.chunkSize),
      uploadedBytes: 0,
      status: 'queued',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    persistJob(job, context)
    return job
  })()
}

/** 当前分片完成后允许暂停；仅网络失败/5xx 重试，停止或鉴权失败不重发。 */
async function uploadChunkWithRetry(
  run: UploadRun,
  buffer: ArrayBuffer,
  chunkIndex: number
): Promise<number> {
  const { job } = run
  for (let attempt = 0; attempt <= MAX_CHUNK_RETRY; attempt++) {
    assertRunContext(run)
    try {
      await uploadChunk(buffer, {
        silent: true,
        dedupe: false,
        cancelable: false,
        header: {
          'Content-Type': 'application/octet-stream',
          'x-upload-id': job.uploadId || '',
          'x-chunk-index': String(chunkIndex),
        },
      })
      assertRunContext(run, true)
      return buffer.byteLength
    } catch (error) {
      assertRunContext(run)
      if (
        !(error as { retryable?: boolean })?.retryable ||
        attempt === MAX_CHUNK_RETRY
      ) {
        throw error
      }
      await new Promise(resolve =>
        setTimeout(resolve, 1000 * Math.pow(2, attempt))
      )
    }
  }
  throw new Error('分片上传失败')
}

/** init 与已发送分片都保留断点；暂停时不再创建下一次网络操作。 */
async function ensureUploadId(run: UploadRun) {
  const { job } = run
  if (job.uploadId) return
  assertRunContext(run)
  const initRes = await initResumableUpload(
    {
      fileName: job.fileName,
      fileSize: job.fileSize,
      chunkSize: job.chunkSize,
      mimeType: job.mimeType,
    },
    { silent: true, cancelable: false }
  )
  assertRunContext(run, true)
  job.uploadId = initRes?.uploadId
  if (!job.uploadId) throw new Error('初始化上传失败：缺少 uploadId')
  persistJob(job, run.context)
}

/** 单任务顺序执行，内存状态是暂停/删除的共同入口。 */
async function executeUploadJob(run: UploadRun): Promise<unknown> {
  const { job, context } = run
  try {
    await ensureUploadId(run)
    while (job.uploadedBytes < job.fileSize && job.status === 'uploading') {
      const start = job.uploadedBytes
      const end = Math.min(job.fileSize, start + job.chunkSize)
      const chunkIndex = Math.floor(start / job.chunkSize)
      const buffer = await readFileChunk(job.localPath, start, end)
      const sent = await uploadChunkWithRetry(run, buffer, chunkIndex)
      job.uploadedBytes += sent
      persistJob(job, context)
      notifyProgress(job)
    }
    assertRunContext(run)
    const result = await completeResumableUpload(
      { uploadId: job.uploadId, fileName: job.fileName },
      { silent: true, cancelable: false }
    )
    assertRunContext(run, true)
    job.status = 'completed'
    job.result = result
    persistJob(job, context)
    notifyProgress(job)
    return result
  } catch (error) {
    if (
      error instanceof UploadStoppedError ||
      run.removed ||
      context.epoch !== getRequestContextEpoch()
    ) {
      return undefined
    }
    job.status = 'failed'
    job.lastError =
      error instanceof Error
        ? error.message
        : String((error as { message?: string })?.message || error)
    persistJob(job, context)
    logger.error('[resumable-upload] job failed:', job.lastError)
    throw error
  }
}

/** 重复开始共享一次执行；进程退出留下的 uploading 也可继续。 */
export function startUploadJob(jobId: string): Promise<unknown> {
  try {
    const context = getUploadContext()
    const existing = activeRuns.get(jobId)
    if (existing) {
      if (existing.context.storageKey !== context.storageKey) {
        return Promise.reject(new Error('上传任务不属于当前账号或环境'))
      }
      return existing.promise
    }
    const job = loadJobs(context).find(item => item.id === jobId)
    if (!job) return Promise.reject(new Error(`上传任务不存在: ${jobId}`))
    if (job.status === 'completed') return Promise.resolve(job.result)
    job.status = 'uploading'
    job.lastError = undefined
    persistJob(job, context)
    const run: UploadRun = {
      job,
      context,
      removed: false,
      promise: Promise.resolve(),
    }
    activeRuns.set(jobId, run)
    run.promise = Promise.resolve()
      .then(() => executeUploadJob(run))
      .finally(() => {
        if (activeRuns.get(jobId) === run) activeRuns.delete(jobId)
      })
    return run.promise
  } catch (error) {
    return Promise.reject(error)
  }
}

/** 暂停共享执行对象，已发出的分片完成后保留进度并停止。 */
export function pauseUploadJob(jobId: string) {
  const context = getUploadContext()
  const run = activeRuns.get(jobId)
  const job =
    run?.context.storageKey === context.storageKey
      ? run.job
      : loadJobs(context).find(item => item.id === jobId)
  if (job?.status === 'uploading') {
    job.status = 'paused'
    persistJob(job, context)
  }
}

/** 删除时让在途操作失效，迟到响应不能把任务重新写回列表。 */
export function removeUploadJob(jobId: string) {
  const context = getUploadContext()
  const run = activeRuns.get(jobId)
  if (run?.context.storageKey === context.storageKey) run.removed = true
  saveJobs(
    context,
    loadJobs(context).filter(job => job.id !== jobId)
  )
}

/** 登录及文件恢复完成后由调用方显式触发；仅恢复当前账号环境任务。 */
export function resumePendingJobs() {
  const context = getUploadContext()
  loadJobs(context)
    .filter(job => job.status !== 'completed')
    .forEach(job => {
      startUploadJob(job.id).catch(() => {
        // 失败已记录在 job.lastError
      })
    })
}

/** 未登录时返回空列表，不泄露上一个账号任务。 */
export function getUploadJobs(): ResumableUploadJob[] {
  try {
    return loadJobs(getUploadContext())
  } catch {
    return []
  }
}
