import { describe, it, expect, beforeEach } from 'vitest'
import {
  createUploadJob,
  getUploadJobs,
  removeUploadJob,
  pauseUploadJob,
} from '@/services/resumable-upload'

/**
 * 存储层测试：job 创建/持久化/暂停/删除。
 * 传输层（分片读取/上传）依赖 App/MP 文件系统，属真机验证范围。
 */

describe('resumable-upload 存储层', () => {
  beforeEach(() => {
    uni.clearStorageSync()
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
})
