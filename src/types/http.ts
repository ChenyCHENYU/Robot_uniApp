/** HTTP 模块 - 类型定义 */

export interface HttpRequestOptions {
  /** 请求方法 */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  /** 请求数据 */
  data?: Record<string, unknown>
  /** 是否静默(不显示loading) */
  silent?: boolean
  /** 是否去重 */
  dedupe?: boolean
  /** 重试次数 */
  retry?: number
  /** 重试基础延迟(ms) */
  retryDelay?: number
  /** 是否跟随页面销毁取消 */
  cancelable?: boolean
  /** 自定义请求头 */
  header?: Record<string, string>
}

export interface HttpError {
  code: number
  message: string
}

export interface HttpResponse<T = unknown> {
  code: number
  data: T
  message: string
  success?: boolean
}

export interface UploadOptions {
  /** 进度回调 */
  onProgress?: (progress: number) => void
  /** 是否静默 */
  silent?: boolean
}
