/**
 * HTTP 类型定义
 */

/** 统一的请求错误对象 */
export interface HttpError {
  code: number
  message: string
  /** 是否可重试（仅网络层失败/5xx） */
  retryable?: boolean
}

/** 请求配置 */
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS'
  data?: Record<string, any>
  /** 静默模式：不弹 loading、不弹错误 toast */
  silent?: boolean
  /** 是否去重（相同 method+url+data 的在飞请求自动合并） */
  dedupe?: boolean
  /** 重试次数（仅 GET 默认 2；仅网络错误/5xx 会重试） */
  retry?: number
  /** 重试基础延迟(ms)，指数退避 */
  retryDelay?: number
  /** 是否注册到页面任务（页面卸载时自动取消） */
  cancelable?: boolean
  /** 自定义请求头 */
  header?: Record<string, string>
  [key: string]: any
}
