import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '@/stores/modules/user'
import config from '@/config/env'

const uploadApi = vi.hoisted(() => ({
  initResumableUpload: vi.fn(),
  uploadChunk: vi.fn(),
  completeResumableUpload: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  getUserInfo: vi.fn(),
}))
vi.mock('@/api', () => uploadApi)
import {
  createUploadJob,
  getUploadJobs,
  removeUploadJob,
  pauseUploadJob,
  startUploadJob,
  resumePendingJobs,
} from '@/services/resumable-upload'

/**
 * 行为测试使用文件系统/接口桩，覆盖真实顺序执行、暂停、删除与账号隔离。
 * 平台文件访问、临时文件存活和服务端分片幂等仍需真机/后端验收。
 */

const originalApiBase = config.API_BASE_URL

/** 可控的异步边界，用于在请求发出后暂停、删除或切换身份。 */
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

/** 不依赖设备读取真实文件，保留原服务 App 文件切片的执行路径。 */
function installFileSystemStub() {
  vi.stubGlobal('plus', {
    io: {
      resolveLocalFileSystemURL: (
        _path: string,
        success: (entry: unknown) => void
      ) =>
        success({
          file: (callback: (file: unknown) => void) =>
            callback({
              slice: (start: number, end: number) => ({ size: end - start }),
            }),
        }),
      FileReader: class {
        onloadend?: (event: unknown) => void
        /** 按原服务请求的字节区间返回相同长度的二进制内容。 */
        readAsDataURL(slice: { size: number }) {
          this.onloadend?.({
            target: {
              result:
                'data:application/octet-stream;base64,' +
                Buffer.alloc(slice.size).toString('base64'),
            },
          })
        }
      },
    },
  })
  uni.base64ToArrayBuffer = (base64: string) =>
    Uint8Array.from(Buffer.from(base64, 'base64')).buffer
}

/** 创建需要两个分片的任务，让停止动作发生在网络操作中间。 */
function createTwoChunkJob() {
  return createUploadJob({
    endpoint: '/upload/video',
    filePath: '/tmp/persisted.mp4',
    fileSize: 512 * 1024,
    chunkSize: 256 * 1024,
  })
}

describe('resumable-upload 状态机', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const user = useUserStore()
    user.token = 'account_a_token'
    user.loginAccount = 'account_a'
    uni.clearStorageSync()
    vi.clearAllMocks()
    uploadApi.initResumableUpload.mockResolvedValue({ uploadId: 'server_job' })
    uploadApi.uploadChunk.mockResolvedValue({ received: true })
    uploadApi.completeResumableUpload.mockResolvedValue({
      url: '/finished.mp4',
    })
    installFileSystemStub()
  })

  afterEach(() => {
    config.API_BASE_URL = originalApiBase
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('createUploadJob：显式 fileSize 时跳过文件系统读取并持久化', async () => {
    const job = await createUploadJob({
      endpoint: '/upload/video',
      filePath: '/tmp/a.mp4',
      fileName: 'a.mp4',
      fileSize: 1024 * 1024 * 5,
      mimeType: 'video/mp4',
    })

    expect(job.fileSize).toBe(1024 * 1024 * 5)
    expect(job.status).toBe('queued')
    expect(job.uploadedBytes).toBe(0)
    expect(job.uploadId).toBeUndefined()

    // 持久化可恢复
    const jobs = getUploadJobs()
    expect(jobs).toHaveLength(1)
    expect(jobs[0].id).toBe(job.id)
  })

  it('chunkSize 边界约束：过小/过大回退到区间内', async () => {
    const tooSmall = await createUploadJob({
      endpoint: '/x',
      filePath: '/tmp/a',
      fileSize: 1000,
      chunkSize: 10 * 1024,
    })
    expect(tooSmall.chunkSize).toBe(256 * 1024) // 最小值

    const tooBig = await createUploadJob({
      endpoint: '/x',
      filePath: '/tmp/a',
      fileSize: 1000,
      chunkSize: 99 * 1024 * 1024,
    })
    expect(tooBig.chunkSize).toBe(8 * 1024 * 1024) // 最大值
  })

  it('pause/remove：状态流转与列表清理', async () => {
    const job = await createUploadJob({
      endpoint: '/x',
      filePath: '/tmp/a',
      fileSize: 1000,
    })

    // queued 状态暂停不生效（仅 uploading 可暂停）
    pauseUploadJob(job.id)
    expect(getUploadJobs()[0].status).toBe('queued')

    removeUploadJob(job.id)
    expect(getUploadJobs()).toHaveLength(0)
  })

  it('多个 job 隔离持久化', async () => {
    await createUploadJob({ endpoint: '/x', filePath: '/a', fileSize: 1 })
    await createUploadJob({ endpoint: '/y', filePath: '/b', fileSize: 2 })
    const jobs = getUploadJobs()
    expect(jobs).toHaveLength(2)
    expect(jobs.map(j => j.endpoint).sort()).toEqual(['/x', '/y'])
  })

  it('暂停正在发送的分片：保留已发送字节，跳过下一分片和完成请求；继续从断点开始', async () => {
    const gate = deferred<{ received: boolean }>()
    uploadApi.uploadChunk.mockReturnValueOnce(gate.promise)
    const job = await createTwoChunkJob()
    const pending = startUploadJob(job.id)
    await vi.waitFor(() =>
      expect(uploadApi.uploadChunk).toHaveBeenCalledTimes(1)
    )
    pauseUploadJob(job.id)
    gate.resolve({ received: true })
    await expect(pending).resolves.toBeUndefined()
    expect(getUploadJobs()[0]).toMatchObject({
      status: 'paused',
      uploadedBytes: 256 * 1024,
    })
    expect(uploadApi.completeResumableUpload).not.toHaveBeenCalled()

    await expect(startUploadJob(job.id)).resolves.toEqual({
      url: '/finished.mp4',
    })
    expect(uploadApi.initResumableUpload).toHaveBeenCalledTimes(1)
    expect(uploadApi.uploadChunk).toHaveBeenCalledTimes(2)
    expect(uploadApi.uploadChunk.mock.calls[1][1].header['x-chunk-index']).toBe(
      '1'
    )
    expect(getUploadJobs()[0].status).toBe('completed')
  })

  it('删除在途任务：迟到 init 响应不重建列表，也不再发送分片', async () => {
    const gate = deferred<{ uploadId: string }>()
    uploadApi.initResumableUpload.mockReturnValueOnce(gate.promise)
    const job = await createTwoChunkJob()
    const pending = startUploadJob(job.id)
    await vi.waitFor(() =>
      expect(uploadApi.initResumableUpload).toHaveBeenCalledTimes(1)
    )
    removeUploadJob(job.id)
    gate.resolve({ uploadId: 'late_job' })
    await expect(pending).resolves.toBeUndefined()
    expect(getUploadJobs()).toEqual([])
    expect(uploadApi.uploadChunk).not.toHaveBeenCalled()
    expect(uploadApi.completeResumableUpload).not.toHaveBeenCalled()
  })

  it('重复点击开始只创建一个 init、两次顺序分片和一个 complete', async () => {
    const job = await createTwoChunkJob()
    await Promise.all([startUploadJob(job.id), startUploadJob(job.id)])
    expect(uploadApi.initResumableUpload).toHaveBeenCalledTimes(1)
    expect(uploadApi.uploadChunk).toHaveBeenCalledTimes(2)
    expect(uploadApi.completeResumableUpload).toHaveBeenCalledTimes(1)
  })

  it('切号立即隔离任务，旧分片响应不推进进度或发 complete，原账号可重新恢复', async () => {
    const gate = deferred<{ received: boolean }>()
    uploadApi.uploadChunk.mockReturnValueOnce(gate.promise)
    const job = await createTwoChunkJob()
    const pending = startUploadJob(job.id)
    await vi.waitFor(() =>
      expect(uploadApi.uploadChunk).toHaveBeenCalledTimes(1)
    )
    const user = useUserStore()
    user.clearUserInfo()
    user.token = 'account_b_token'
    user.loginAccount = 'account_b'
    expect(getUploadJobs()).toEqual([])
    await expect(startUploadJob(job.id)).rejects.toThrow('当前账号或环境')
    gate.resolve({ received: true })
    await expect(pending).resolves.toBeUndefined()
    expect(uploadApi.completeResumableUpload).not.toHaveBeenCalled()

    user.clearUserInfo()
    user.token = 'account_a_renewed_token'
    user.loginAccount = 'account_a'
    expect(getUploadJobs()[0]).toMatchObject({
      status: 'paused',
      uploadedBytes: 0,
    })
  })

  it('退避等待中切号，不以新令牌重试旧任务', async () => {
    vi.useFakeTimers()
    uploadApi.uploadChunk.mockRejectedValueOnce({
      retryable: true,
      message: '网络连接失败',
    })
    const job = await createTwoChunkJob()
    const pending = startUploadJob(job.id)
    await vi.advanceTimersByTimeAsync(0)
    expect(uploadApi.uploadChunk).toHaveBeenCalledTimes(1)
    const user = useUserStore()
    user.clearUserInfo()
    user.token = 'account_b_token'
    user.loginAccount = 'account_b'
    await vi.advanceTimersByTimeAsync(1000)
    await expect(pending).resolves.toBeUndefined()
    expect(uploadApi.uploadChunk).toHaveBeenCalledTimes(1)
    expect(uploadApi.completeResumableUpload).not.toHaveBeenCalled()
  })

  it('业务失败不重试，并保留可读错误供恢复', async () => {
    uploadApi.uploadChunk.mockRejectedValue({
      code: 400,
      retryable: false,
      message: '分片参数错误',
    })
    const job = await createTwoChunkJob()
    await expect(startUploadJob(job.id)).rejects.toMatchObject({ code: 400 })
    expect(uploadApi.uploadChunk).toHaveBeenCalledTimes(1)
    expect(getUploadJobs()[0]).toMatchObject({
      status: 'failed',
      lastError: '分片参数错误',
    })
  })

  it('相同账号在不同 API 环境无法读取或恢复旧任务', async () => {
    const job = await createTwoChunkJob()
    config.API_BASE_URL = 'https://other-env.invalid/api'
    expect(getUploadJobs()).toEqual([])
    await expect(startUploadJob(job.id)).rejects.toThrow('上传任务不存在')
    config.API_BASE_URL = originalApiBase
    expect(getUploadJobs()[0].id).toBe(job.id)
  })

  it('重启遗留的 uploading 状态由显式恢复入口继续，queued 也会执行', async () => {
    const job = await createTwoChunkJob()
    const { storage } = uni as unknown as { storage: Map<string, string> }
    const key = [...storage.keys()].find(item =>
      item.startsWith('resumable_upload_jobs_v2:')
    )!
    const saved = JSON.parse(storage.get(key)!)
    saved[0].status = 'uploading'
    storage.set(key, JSON.stringify(saved))
    await createTwoChunkJob()
    resumePendingJobs()
    await vi.waitFor(() =>
      expect(getUploadJobs().every(item => item.status === 'completed')).toBe(
        true
      )
    )
    expect(
      getUploadJobs().find(item => item.id === job.id)?.uploadedBytes
    ).toBe(512 * 1024)
    expect(uploadApi.completeResumableUpload).toHaveBeenCalledTimes(2)
  })

  it('旧无归属任务不会自动认领，未登录不能新建任务或读取上一账号列表', async () => {
    uni.setStorageSync(
      'resumable_upload_jobs_v1',
      JSON.stringify([{ id: 'old_job', status: 'paused' }])
    )
    expect(getUploadJobs()).toEqual([])
    await createTwoChunkJob()
    useUserStore().clearUserInfo()
    expect(getUploadJobs()).toEqual([])
    await expect(createTwoChunkJob()).rejects.toThrow('请先登录')
  })
})
