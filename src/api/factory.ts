/**
 * API 工厂 — 最佳实践
 *
 * 设计目标：
 * 1. 使用侧一行定义一个接口，零重复代码
 * 2. 完整 TypeScript 类型推导（入参 + 返回值）
 * 3. 统一走 http 实例，自动继承拦截 / 去重 / 重试 / 取消
 *
 * 用法示例：
 *   const getUser = api.get<UserInfo>('/user/info')
 *   const login  = api.post<{ token: string }>('/auth/login')
 *
 *   // 使用侧
 *   const user = await getUser()
 *   const { token } = await login({ username: 'admin', password: '123' })
 */
import http from '@/utils/http'

type RequestOptions = Record<string, any>

/** GET 工厂 — 返回一个 (params?, options?) => Promise<T> 的函数 */
function get<T = any>(url: string, defaultOpts?: RequestOptions) {
  return (params?: Record<string, any>, options?: RequestOptions): Promise<T> =>
    http.get(url, params, { ...defaultOpts, ...options })
}

/** POST 工厂 */
function post<T = any>(url: string, defaultOpts?: RequestOptions) {
  return (data?: Record<string, any>, options?: RequestOptions): Promise<T> =>
    http.post(url, data, { ...defaultOpts, ...options })
}

/** PUT 工厂 */
function put<T = any>(url: string, defaultOpts?: RequestOptions) {
  return (data?: Record<string, any>, options?: RequestOptions): Promise<T> =>
    http.put(url, data, { ...defaultOpts, ...options })
}

/** DELETE 工厂 */
function del<T = any>(url: string, defaultOpts?: RequestOptions) {
  return (params?: Record<string, any>, options?: RequestOptions): Promise<T> =>
    http.delete(url, params, { ...defaultOpts, ...options })
}

/** UPLOAD 工厂 */
function upload<T = any>(url: string) {
  return (
    filePath: string,
    formData?: Record<string, any>,
    options?: RequestOptions
  ): Promise<T> => http.upload(url, filePath, formData, options)
}

export const api = { get, post, put, del, upload } as const
