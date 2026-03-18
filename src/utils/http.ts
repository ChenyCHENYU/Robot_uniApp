/**
 * HTTP 请求封装 — 企业级增强版
 *
 * 核心能力：
 * - 请求取消（页面级自动取消）
 * - 请求去重（相同请求自动合并）
 * - 失败重试（可配置次数 + 指数退避）
 * - 登录回跳（401 时保存来源页）
 * - upload 统一拦截链
 */
import config from '@/config/env'
import { useUserStore } from '@/stores'

/**
 * 生成请求唯一标识
 * @param {string} method
 * @param {string} url
 * @param {object} data
 * @returns {string}
 */
function genRequestKey(method: string, url: string, data: any): string {
  return `${method}:${url}:${JSON.stringify(data || {})}`
}

/**
 *
 */
class Http {
  baseURL: string
  timeout: number
  loadingCount: number
  pendingMap: Map<string, Promise<any>>
  pageTasksMap: Map<string, Set<UniApp.RequestTask>>

  /** 初始化 HTTP 实例 */
  constructor() {
    this.baseURL = config.API_BASE_URL || 'http://localhost:3000/api'
    this.timeout = 15000
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

  /**
   * 若存在相同请求，返回其 Promise；否则返回 null
   * @param {string} key
   * @returns {Promise|null}
   */
  getPending(key: string) {
    return this.pendingMap.get(key) || null
  }

  /**
   * 注册请求
   * @param {string} key
   * @param {Promise} promise
   */
  setPending(key: string, promise: Promise<any>) {
    this.pendingMap.set(key, promise)
  }

  /**
   * 移除已完成请求
   * @param {string} key
   */
  removePending(key: string) {
    this.pendingMap.delete(key)
  }

  // ==================== 页面级取消 ====================

  /**
   * 注册请求任务到指定页面
   * @param {string} pageRoute - 当前页面路由
   * @param {object} requestTask - uni.request 返回的 task
   */
  addPageTask(pageRoute: string, requestTask: UniApp.RequestTask) {
    if (!pageRoute || !requestTask) return
    if (!this.pageTasksMap.has(pageRoute)) {
      this.pageTasksMap.set(pageRoute, new Set())
    }
    this.pageTasksMap.get(pageRoute)!.add(requestTask)
  }

  /**
   * 取消指定页面的所有请求
   * @param {string} pageRoute
   */
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

  /**
   * 移除单个已完成的任务
   * @param {string} pageRoute
   * @param {object} requestTask
   */
  removePageTask(pageRoute: string, requestTask: UniApp.RequestTask) {
    const tasks = this.pageTasksMap.get(pageRoute)
    if (tasks) {
      tasks.delete(requestTask)
      if (tasks.size === 0) this.pageTasksMap.delete(pageRoute)
    }
  }

  // ==================== 核心请求 ====================

  /**
   * 统一请求
   * @param {string} url - 请求地址
   * @param {object} options - 请求配置
   * @param {string} [options.method='GET']
   * @param {object} [options.data={}]
   * @param {boolean} [options.silent=false] - 静默模式
   * @param {boolean} [options.dedupe=true] - 是否去重
   * @param {number} [options.retry=0] - 重试次数（仅 GET）
   * @param {number} [options.retryDelay=1000] - 重试基础延迟(ms)
   * @param {boolean} [options.cancelable=true] - 是否跟随页面销毁取消
   * @param {object} [options.header] - 自定义请求头
   */
  async request(url: string, options: Record<string, any> = {}) {
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

    // 3. 注册去重
    if (dedupe) {
      this.setPending(requestKey, requestPromise)
      requestPromise.finally(() => this.removePending(requestKey))
    }

    return requestPromise
  }

  /**
   * 带重试的请求执行
   * @private
   */
  async _executeWithRetry(
    reqConfig: Record<string, any>,
    retryCount: number,
    retryDelay: number
  ) {
    const { silent } = reqConfig

    if (!silent) this.showLoading()

    try {
      return await this._doRequest(reqConfig, retryCount, retryDelay)
    } catch (error: any) {
      return this._handleError(error, silent)
    } finally {
      if (!silent) this.hideLoading()
    }
  }

  /**
   * 递归重试请求
   * @private
   */
  async _doRequest(
    reqConfig: Record<string, any>,
    retriesLeft: number,
    retryDelay: number
  ) {
    try {
      const response = await this._send(reqConfig)
      return this._handleResponse(response)
    } catch (error: any) {
      // 401 不重试
      if (error.code === 401 || retriesLeft <= 0) throw error

      // 指数退避
      const delay = retryDelay * Math.pow(2, reqConfig._retryAttempt || 0)
      await new Promise(r => setTimeout(r, delay))

      reqConfig._retryAttempt = (reqConfig._retryAttempt || 0) + 1
      return this._doRequest(reqConfig, retriesLeft - 1, retryDelay)
    }
  }

  /**
   * 发送底层请求
   * @private
   */
  _send(
    reqConfig: Record<string, any>
  ): Promise<UniApp.RequestSuccessCallbackResult> {
    const { url, method, data, cancelable, header: customHeader } = reqConfig

    // Token 注入
    const userStore = useUserStore()
    const header = {
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
            reject({ code: -1, message: '请求已取消' })
          } else {
            reject({ code: -1, message: err.errMsg || '网络连接失败' })
          }
        },
      })

      // 注册到页面任务
      if (cancelable) {
        const pageRoute = this._getCurrentPageRoute()
        if (pageRoute) {
          this.addPageTask(pageRoute, requestTask)
        }
      }
    })
  }

  /**
   * 处理响应
   * @private
   */
  _handleResponse(response: UniApp.RequestSuccessCallbackResult) {
    const { statusCode, data: rawData } = response
    const data = (
      typeof rawData === 'string' ? JSON.parse(rawData) : rawData
    ) as Record<string, any>

    if (statusCode === 200) {
      if (data.code === 0 || data.success === true) {
        return data.data !== undefined ? data.data : data
      }
      throw { code: data.code, message: data.message || '请求失败' }
    }

    throw { code: statusCode, message: this._getStatusMessage(statusCode) }
  }

  /**
   * 统一错误处理
   * @private
   */
  async _handleError(error: Record<string, any>, silent: boolean) {
    // 401 → 保存当前路由 → 跳转登录
    if (error.code === 401) {
      const userStore = useUserStore()
      userStore.clearUserInfo()

      // 保存来源页用于登录后回跳
      const redirectUrl = this._getCurrentPageRoute(true)
      if (redirectUrl) {
        uni.setStorageSync('REDIRECT_URL', redirectUrl)
      }

      uni.reLaunch({ url: '/pages/login/index' })
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

  /**
   * 获取当前页面路由
   * @private
   * @param {boolean} withQuery - 是否包含查询参数
   */
  _getCurrentPageRoute(withQuery = false) {
    const pages = getCurrentPages()
    if (!pages.length) return ''
    const page = pages[pages.length - 1]
    const route = `/${page.route}`
    if (!withQuery || !(page as any).options) return route
    const query = Object.entries((page as any).options)
      .map(([k, v]) => `${k}=${v}`)
      .join('&')
    return query ? `${route}?${query}` : route
  }

  /**
   * HTTP 状态码映射
   * @private
   */
  _getStatusMessage(code: number) {
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
  get(url: string, params?: any, options: Record<string, any> = {}) {
    return this.request(url, { method: 'GET', data: params, ...options })
  }

  /** POST 请求 */
  post(url: string, data?: any, options: Record<string, any> = {}) {
    return this.request(url, {
      method: 'POST',
      data,
      dedupe: false,
      ...options,
    })
  }

  /** PUT 请求 */
  put(url: string, data?: any, options: Record<string, any> = {}) {
    return this.request(url, { method: 'PUT', data, dedupe: false, ...options })
  }

  /** DELETE 请求 */
  delete(url: string, params?: any, options: Record<string, any> = {}) {
    return this.request(url, {
      method: 'DELETE',
      data: params,
      dedupe: false,
      ...options,
    })
  }

  /**
   * 文件上传（复用统一拦截链）
   * @param {string} url
   * @param {string} filePath
   * @param {object} formData
   * @param {object} options
   * @param {function} [options.onProgress] - 进度回调
   * @param {boolean} [options.silent=false]
   */
  upload(
    url: string,
    filePath: string,
    formData: Record<string, any> = {},
    options: Record<string, any> = {}
  ) {
    const { onProgress, silent = false } = options
    const fullURL = url.startsWith('http') ? url : this.baseURL + url

    const userStore = useUserStore()
    const header: Record<string, string> = {}
    if (userStore.token) {
      header.Authorization = `Bearer ${userStore.token}`
    }

    if (!silent) this.showLoading()

    return new Promise((resolve, reject) => {
      const uploadTask = uni.uploadFile({
        url: fullURL,
        filePath,
        name: 'file',
        formData,
        header,
        success: res => {
          try {
            const data = JSON.parse(res.data)
            if (data.code === 0 || data.success === true) {
              resolve(data.data !== undefined ? data.data : data)
            } else {
              reject({ code: data.code, message: data.message || '上传失败' })
            }
          } catch {
            reject({ code: -1, message: '响应解析失败' })
          }
        },
        fail: err => reject({ code: -1, message: err.errMsg || '上传失败' }),
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
