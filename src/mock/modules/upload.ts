import { success, randomId, type MockResponse } from '../helpers'

/** 断点续传上传 Mock（模拟 init/chunk/complete 三段协议） */
export const uploadMocks: Record<string, (options: any) => MockResponse> = {
  'POST /upload/init': () => success({ uploadId: `up_${randomId()}` }),

  'PUT /upload/chunk': () => success({ received: true }),

  'POST /upload/complete': options => {
    const { fileName } = options.data || {}
    return success(
      {
        url: `/static/uploads/${fileName || 'file'}?v=${randomId()}`,
      },
      '上传完成'
    )
  },
}
