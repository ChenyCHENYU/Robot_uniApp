import { api } from '../factory'

/** 断点续传上传协议（services/resumable-upload 消费） */
export const initResumableUpload = api.post<{ uploadId: string }>(
  '/upload/init'
)
export const uploadChunk = api.put<{ received: boolean }>('/upload/chunk')
export const completeResumableUpload = api.post<{ url: string }>(
  '/upload/complete'
)
