/* eslint-disable no-await-in-loop -- 分片必须顺序推进（断点语义） */

/**
 * 断点续传上传服务（通用核心版）
 *
 * 面向大文件（巡检视频/离线采集包等）的分片上传：
 * - 分片读取：App（plus.io slice）/ 小程序（FileSystemManager position 读取）
 * - 状态机：queued → uploading ⇄ paused → completed / failed
 * - 持久化：job 列表写入 uni storage，杀进程后可恢复继续传
 * - 重试：单分片失败自动重试（指数退避，上限 3 次）
 *
 * 后端契约（三个 JSON/二进制接口，均走 http 层携带 token）：
 *   POST {endpoint}/init     { fileName, fileSize, chunkSize, mimeType }
 *                           → { uploadId }
 *   PUT  {endpoint}/chunk?uploadId=&index=  body=二进制分片 → { received: bytes }
 *   POST {endpoint}/complete { uploadId }   → 业务结果
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

const STORAGE_KEY = 'resumable_upload_jobs_v1'
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
  /** 业务端点（如 '/upload/video'），服务将拼接 /init /chunk /complete */
  endpoint: string
  /** 本地文件路径（chooseImage/chooseVideo/相机回调的 tempFilePath） */
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

/** 从 storage 恢复 job 列表 */
function loadJobs(): ResumableUploadJob[] {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    return raw ? (JSON.parse(String(raw)) as ResumableUploadJob[]) : []
  } catch {
    return []
  }
}

/** 持久化 job 列表 */
function saveJobs(jobs: ResumableUploadJob[]) {
  uni.setStorageSync(STORAGE_KEY, JSON.stringify(jobs))
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
function persistJob(job: ResumableUploadJob) {
  const jobs = loadJobs()
  const idx = jobs.findIndex(j => j.id === job.id)
  job.updatedAt = Date.now()
  if (idx >= 0) jobs[idx] = job
  else jobs.push(job)
  saveJobs(jobs)
}

/** 创建上传 job（自动入队，需调用 startJob 开始传输） */
export function createUploadJob(
  options: CreateJobOptions
): Promise<ResumableUploadJob> {
  return (async () => {
    const fileSize =
      options.fileSize && options.fileSize > 0
        ? options.fileSize
        : await getFileSize(options.filePath)

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
    persistJob(job)
    return job
  })()
}

/** 单分片上传（带重试） */
/** 单分片上传（带重试） */
async function uploadChunkWithRetry(
  job: ResumableUploadJob,
  buffer: ArrayBuffer,
  chunkIndex: number
): Promise<number> {
  let lastError: unknown = null
  for (let attempt = 0; attempt <= MAX_CHUNK_RETRY; attempt++) {
    try {
      await uploadChunk(buffer, {
        silent: true,
        dedupe: false,
        header: {
          'Content-Type': 'application/octet-stream',
          'x-upload-id': job.uploadId || '',
          'x-chunk-index': String(chunkIndex),
        },
      })
      return buffer.byteLength
    } catch (error) {
      lastError = error
      if (attempt < MAX_CHUNK_RETRY) {
        // 指数退避
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)))
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error('分片上传失败')
}

/** 确保 job 已完成 init（断点恢复的 job 跳过） */
async function ensureUploadId(job: ResumableUploadJob) {
  if (job.uploadId) return
  const initRes = await initResumableUpload(
    {
      fileName: job.fileName,
      fileSize: job.fileSize,
      chunkSize: job.chunkSize,
      mimeType: job.mimeType,
    },
    { silent: true }
  )
  job.uploadId = initRes?.uploadId
  if (!job.uploadId) throw new Error('初始化上传失败：缺少 uploadId')
  persistJob(job)
}

/** 启动/继续一个 job（从 uploadedBytes 断点继续） */
export async function startUploadJob(jobId: string): Promise<unknown> {
  const jobs = loadJobs()
  const job = jobs.find(j => j.id === jobId)
  if (!job) throw new Error(`上传任务不存在: ${jobId}`)
  if (job.status === 'completed') return job.result

  job.status = 'uploading'
  job.lastError = undefined
  persistJob(job)

  try {
    await ensureUploadId(job)

    // 2. 顺序上传分片
    while (job.uploadedBytes < job.fileSize && job.status === 'uploading') {
      const start = job.uploadedBytes
      const end = Math.min(job.fileSize, start + job.chunkSize)
      const chunkIndex = Math.floor(start / job.chunkSize)
      const buffer = await readFileChunk(job.localPath, start, end)
      const sent = await uploadChunkWithRetry(job, buffer, chunkIndex)
      job.uploadedBytes += sent
      persistJob(job)
      notifyProgress(job)
    }

    if (job.status !== 'uploading') return undefined // 已被暂停

    // 3. complete
    const result = await completeResumableUpload(
      { uploadId: job.uploadId, fileName: job.fileName },
      { silent: true }
    )

    job.status = 'completed'
    job.result = result
    persistJob(job)
    notifyProgress(job)
    return result
  } catch (error) {
    job.status = 'failed'
    job.lastError = error instanceof Error ? error.message : String(error)
    persistJob(job)
    logger.error('[resumable-upload] job failed:', job.lastError)
    throw error
  }
}

/** 暂停 job（当前分片完成后停止） */
export function pauseUploadJob(jobId: string) {
  const jobs = loadJobs()
  const job = jobs.find(j => j.id === jobId)
  if (job && job.status === 'uploading') {
    job.status = 'paused'
    persistJob(job)
  }
}

/** 删除 job（不删除已上传服务端分片，由后端过期清理） */
export function removeUploadJob(jobId: string) {
  saveJobs(loadJobs().filter(j => j.id !== jobId))
}

/** 恢复所有未完成任务（应用启动时调用） */
export function resumePendingJobs() {
  loadJobs()
    .filter(j => j.status === 'paused' || j.status === 'failed')
    .forEach(j => {
      startUploadJob(j.id).catch(() => {
        // 失败已记录在 job.lastError
      })
    })
}

/** 获取全部 job（供管理页面展示） */
export function getUploadJobs(): ResumableUploadJob[] {
  return loadJobs()
}
