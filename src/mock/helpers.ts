/**
 * Mock 数据工具层
 * 仅在开发环境 (import.meta.env.DEV) 下启用
 * 通过拦截 uni.request / uni.uploadFile 返回模拟数据
 */

export interface MockResponse<T = any> {
  code: number
  message: string
  data: T
}

/** 构造模拟成功响应 */
export function success<T>(data: T, message = 'ok'): MockResponse<T> {
  return { code: 200, message, data }
}

/** 构造模拟失败响应 */
export function fail(message = '操作失败', code = 400): MockResponse<null> {
  return { code, message, data: null }
}

/** 模拟网络延迟（ms） */
export function delay(ms = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** 生成随机 ID */
export function randomId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
