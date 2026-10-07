/**
 * HTTP 请求封装 — 企业级增强版
 *
 * 核心能力：
 * - 请求取消（页面级自动取消，配合 C_Layout 的 onUnload）
 * - 请求去重（相同请求自动合并）
 * - 失败重试（仅网络层错误/5xx，可配置次数 + 指数退避）
 * - 登录回跳（401 时保存来源页，登录成功后由 router 消费）
 * - upload 统一拦截链
 *
 * 响应协议：code === 0（RESPONSE_CODE.SUCCESS）为成功，业务码在 body 中。
 */
import config from '@/config/env'
import { RESPONSE_CODE } from '@/constants/business'
import { useUserStore } from '@/stores'

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

/** 构造请求错误 */
function httpError(code: number, message: string, retryable = false): HttpError {
  return { code, message, retryable }
}

/** 生成请求唯一标识 */
function genRequestKey(method: string, url: string, data: any): string {
  return `${method}:${url}:${JSON.stringify(data || {})}`
}

class Http {
  baseURL: string
  timeout: number
  loadingCount: number
  pendingMap: Map<string, Promise<any>>
  pageTasksMap: Map<string, Set<UniApp.RequestTask>>
  /** 401 处理中标志（防止并发 401 触发多次清登录 + 多次跳转） */
  private handling401 = false

  constructor() {
    this.baseURL = config.API_BASE_URL
    this.timeout = config.API_TIMEOUT
    this.loadingCount = 0
    // 正在进行中的请求映射（用于去重）
    this.pendingMap = new Map()
    // 页面级请求任务（用于取消）
    this.pageTasksMap = new Map()
  }

  // ==================== Loading ====================

  /** 显示loading（引用计数） */
  showLoading() {
    if (this.loadingCount === 0) {
      uni.showLoading({ title: '加载中...', mask: true })
    }
    this.loadingCount++
  }

  /** 隐藏loading */
  hideLoading() {
    this.loadingCount--
    if (this.loadingCount <= 0) {
      this.loadingCount = 0
      uni.hideLoading()
    }
  }

  // ==================== 去重 ====================

  /** 若存在相同请求，返回其 Promise；否则返回 null */
  getPending(key: string) {
    return this.pendingMap.get(key) || null
  }

  /** 注册请求 */
  setPending(key: string, promise: Promise<any>) {
    this.pendingMap.set(key, promise)
  }

  /** 移除已完成请求 */
  removePending(key: string) {
    this.pendingMap.delete(key)
  }

  // ==================== 页面级取消 ====================

  /** 注册请求任务到指定页面 */
  addPageTask(pageRoute: string, requestTask: UniApp.RequestTask) {
    if (!pageRoute || !requestTask) return
    if (!this.pageTasksMap.has(pageRoute)) {
      this.pageTasksMap.set(pageRoute, new Set())
    }
    this.pageTasksMap.get(pageRoute)!.add(requestTask)
  }

  /** 取消指定页面的所有请求（应在页面 onUnload 时调用） */
  cancelPageRequests(pageRoute: string) {
    const tasks = this.pageTasksMap.get(pageRoute)
    if (tasks) {
      tasks.forEach(task => {
        if (task && typeof task.abort === 'function') {
          task.abort()
        }
      })
      this.pageTasksMap.delete(pageRoute)
    }
  }

  /** 移除单个已完成的任务 */
  removePageTask(pageRoute: string, requestTask: UniApp.RequestTask) {
    const tasks = this.pageTasksMap.get(pageRoute)
    if (tasks) {
      tasks.delete(requestTask)
      if (tasks.size === 0) this.pageTasksMap.delete(pageRoute)
    }
  }

  // ==================== 核心请求 ====================

  /** 统一请求 */
  async request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      data = {},
      silent = false,
      dedupe = true,
      retry = method === 'GET' ? 2 : 0,
      retryDelay = 1000,
      cancelable = true,
      ...rest
    } = options

    const fullURL = url.startsWith('http') ? url : this.baseURL + url
    const requestKey = genRequestKey(method, fullURL, data)

    // 1. 去重：若有相同请求在飞行中，直接复用
    if (dedupe) {
      const existing = this.getPending(requestKey)
      if (existing) return existing
    }

    // 2. 构建请求 Promise
    const requestPromise = this._executeWithRetry(
      { url: fullURL, method, data, silent, cancelable, ...rest },
      retry,
      retryDelay
    )

    // 3. 注册去重；catch 兜底避免共享 Promise 的 unhandledrejection
    if (dedupe) {
      this.setPending(requestKey, requestPromise)
      requestPromise
        .catch(() => {})
        .finally(() => this.removePending(requestKey))
    }

    return requestPromise
  }

  /** 带重试的请求执行 */
  private async _executeWithRetry(
    reqConfig: RequestOptions,
    retryCount: number,
    retryDelay: number
  ) {
    const { silent = false } = reqConfig

    if (!silent) this.showLoading()

    try {
      return await this._doRequest(reqConfig, retryCount, retryDelay)
    } catch (error: any) {
      return this._handleError(error, silent)
    } finally {
      if (!silent) this.hideLoading()
    }
  }

  /** 递归重试请求（仅 retryable 错误：网络失败/5xx） */
  private async _doRequest(
    reqConfig: RequestOptions,
    retriesLeft: number,
    retryDelay: number
  ): Promise<any> {
    try {
      const response = await this._send(reqConfig)
      return this._handleResponse(response)
    } catch (error: any) {
      if (!error?.retryable || retriesLeft <= 0) throw error

      // 指数退避
      const delay = retryDelay * Math.pow(2, reqConfig._retryAttempt || 0)
      await new Promise(r => setTimeout(r, delay))

      reqConfig._retryAttempt = (reqConfig._retryAttempt || 0) + 1
      return this._doRequest(reqConfig, retriesLeft - 1, retryDelay)
    }
  }

  /** 发送底层请求 */
  private _send(reqConfig: RequestOptions): Promise<UniApp.RequestSuccessCallbackResult> {
    const { url, method, data, cancelable, header: customHeader } = reqConfig

    // Token 注入
    const userStore = useUserStore()
    const header: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeader,
    }
    if (userStore.token) {
      header.Authorization = `Bearer ${userStore.token}`
    }

    return new Promise((resolve, reject) => {
      const requestTask = uni.request({
        url,
        method,
        data,
        timeout: this.timeout,
        header,
        success: resolve,
        fail: err => {
          if (err.errMsg && err.errMsg.includes('abort')) {
            reject(httpError(-1, '请求已取消'))
          } else {
            // 网络层失败（断网/DNS/超时）：可重试
            reject(httpError(-1, err.errMsg || '网络连接失败', true))
          }
        },
      })

      // 注册到页面任务
      if (cancelable && requestTask) {
        const pageRoute = this._getCurrentPageRoute()
        if (pageRoute) {
          this.addPageTask(pageRoute, requestTask)
        }
      }
    })
  }

  /** 处理响应 */
  private _handleResponse(response: UniApp.RequestSuccessCallbackResult) {
    const { statusCode, data: rawData } = response

    // 解析响应体（服务端可能返回 HTML 错误页等非 JSON 内容）
    let data: Record<string, any>
    if (typeof rawData === 'string') {
      try {
        data = JSON.parse(rawData)
      } catch {
        throw httpError(-2, '响应格式错误')
      }
    } else {
      data = rawData as Record<string, any>
    }

    if (statusCode === 200) {
      if (data.code === RESPONSE_CODE.SUCCESS || data.success === true) {
        return data.data !== undefined ? data.data : data
      }
      // 业务错误：不重试
      throw httpError(data.code ?? -3, data.message || '请求失败')
    }

    // 5xx 网关/服务端故障：可重试；4xx 客户端错误：不重试
    throw httpError(statusCode, this._getStatusMessage(statusCode), statusCode >= 500)
  }

  /** 统一错误处理 */
  private async _handleError(error: HttpError, silent: boolean): Promise<never> {
    // 401 → 清登录态 → 保存来源页 → 跳转登录（并发去重）
    if (error.code === RESPONSE_CODE.UNAUTHORIZED) {
      if (!this.handling401) {
        this.handling401 = true
        const userStore = useUserStore()
        userStore.clearUserInfo()

        // 保存来源页用于登录后回跳
        const redirectUrl = this._getCurrentPageRoute(true)
        if (redirectUrl) {
          uni.setStorageSync('REDIRECT_URL', redirectUrl)
        }

        uni.reLaunch({
          url: '/pages/login/index',
          complete: () => {
            this.handling401 = false
          },
        })
      }
      return Promise.reject(error)
    }

    // 请求取消不提示
    if (error.code === -1 && error.message === '请求已取消') {
      return Promise.reject(error)
    }

    if (!silent) {
      uni.showToast({ title: error.message || '网络错误', icon: 'none' })
    }

    return Promise.reject(error)
  }

  /** 获取当前页面路由 */
  private _getCurrentPageRoute(withQuery = false): string {
    const pages = getCurrentPages()
    if (!pages.length) return ''
    const page = pages[pages.length - 1]
    const route = `/${page.route}`
    if (!withQuery || !(page as any).options) return route
    const query = Object.entries((page as any).options as Record<string, string>)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&')
    return query ? `${route}?${query}` : route
  }

  /** HTTP 状态码映射 */
  private _getStatusMessage(code: number): string {
    const messages: Record<number, string> = {
      400: '请求参数错误',
      401: '未授权，请重新登录',
      403: '权限不足',
      404: '请求的资源不存在',
      408: '请求超时',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时',
    }
    return messages[code] || `网络错误(${code})`
  }

  // ==================== 便捷方法 ====================

  /** GET 请求 */
  get<T = any>(url: string, params?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { method: 'GET', data: params, ...options })
  }

  /** POST 请求 */
  post<T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { method: 'POST', data, dedupe: false, ...options })
  }

  /** PUT 请求 */
  put<T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { method: 'PUT', data, dedupe: false, ...options })
  }

  /** DELETE 请求 */
  delete<T = any>(url: string, params?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { method: 'DELETE', data: params, dedupe: false, ...options })
  }

  /**
   * 文件上传（复用统一拦截链：token 注入 + 业务码判定 + 401 处理）
   */
  upload<T = any>(
    url: string,
    filePath: string,
    formData: Record<string, any> = {},
    options: RequestOptions & { onProgress?: (progress: number) => void } = {}
  ): Promise<T> {
    const { onProgress, silent = false } = options
    const fullURL = url.startsWith('http') ? url : this.baseURL + url

    const userStore = useUserStore()
    const header: Record<string, string> = {}
    if (userStore.token) {
      header.Authorization = `Bearer ${userStore.token}`
    }

    if (!silent) this.showLoading()

    return new Promise<T>((resolve, reject) => {
      const uploadTask = uni.uploadFile({
        url: fullURL,
        filePath,
        name: 'file',
        formData,
        header,
        success: async res => {
          // HTTP 状态码校验
          if (res.statusCode !== 200) {
            const error = httpError(
              res.statusCode,
              this._getStatusMessage(res.statusCode)
            )
            await this._handleError(error, silent).catch(() => {})
            reject(error)
            return
          }
          try {
            const data = JSON.parse(res.data)
            if (data.code === RESPONSE_CODE.SUCCESS || data.success === true) {
              resolve((data.data !== undefined ? data.data : data) as T)
            } else {
              reject(httpError(data.code ?? -3, data.message || '上传失败'))
            }
          } catch {
            reject(httpError(-2, '响应格式错误'))
          }
        },
        fail: err => reject(httpError(-1, err.errMsg || '上传失败', true)),
        complete: () => {
          if (!silent) this.hideLoading()
        },
      })

      // 上传进度
      if (onProgress && uploadTask) {
        uploadTask.onProgressUpdate(res => {
          onProgress(res.progress)
        })
      }
    })
  }
}

export default new Http()
