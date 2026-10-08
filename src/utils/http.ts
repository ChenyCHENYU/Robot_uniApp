/**
 * HTTP 请求封装 — 企业级增强版
 *
 * 核心能力：
 * - 请求取消（页面级自动取消，配合 C_Layout 的 onUnload）
 * - 请求去重（相同请求自动合并；key 挂身份代次，登出/切号自动隔离）
 * - 失败重试（仅网络层错误/5xx，可配置次数 + 指数退避）
 * - 登录回跳（401 时保存来源页，登录成功后由 router 消费）
 * - upload 统一拦截链
 *
 * 响应协议：code === 0（RESPONSE_CODE.SUCCESS）为成功，业务码在 body 中。
 * 协议判定/状态文案见 http-helpers.ts；类型见 http-types.ts。
 */
import config from '@/config/env'
import { RESPONSE_CODE } from '@/constants/business'
import { useUserStore } from '@/stores/modules/user'
import {
  getRequestContextEpoch,
  onRequestContextChange,
} from '@/services/request-context'
import {
  httpError,
  getStatusMessage,
  isBusinessSuccess,
  extractBusinessData,
  parseResponseBody,
  isCancelledError,
} from './http-helpers'
import type { HttpError, RequestOptions } from './http-types'
import { showRequestLoading, hideRequestLoading } from './feedback'

export type { HttpError, RequestOptions }

/** 请求执行上下文（拆分自 request 以收敛复杂度） */
interface ExecContext {
  contextEpoch: number
  pageRoute: string
  cancelled: boolean
  url: string
  method: string
  data: Record<string, any>
  silent: boolean
  retry: number
  retryDelay: number
  cancelable: boolean
  rest: Record<string, any>
}

/** 解析请求配置 */
function normalizeContext(
  url: string,
  options: RequestOptions,
  pageRoute: string
): ExecContext {
  const {
    method = 'GET',
    data = {},
    silent = false,
    dedupe: _dedupe = true,
    retry,
    retryDelay = 1000,
    cancelable = true,
    ...rest
  } = options

  return {
    contextEpoch: getRequestContextEpoch(),
    pageRoute,
    cancelled: false,
    url: url.startsWith('http') ? url : http.baseURL + url,
    method,
    data,
    silent,
    retry: retry ?? (method === 'GET' ? 2 : 0),
    retryDelay,
    cancelable,
    rest,
  }
}

/** 生成请求唯一标识（含身份代次：登出/切号后不复用旧请求） */
function genRequestKey(ctx: ExecContext): string {
  return `${ctx.contextEpoch}:${ctx.method}:${ctx.url}:${JSON.stringify(ctx.data || {})}`
}

/** 页面取消可关闭；账号切换仍必须隔离旧请求、重试和响应。 */
function assertRequestContext(contextEpoch: number) {
  if (contextEpoch !== getRequestContextEpoch()) {
    throw httpError(-1, '请求已取消')
  }
}

/** 页面卸载也取消退避中的请求，来源页在请求创建时固定。 */
function assertExecutionContext(ctx: ExecContext) {
  if (ctx.cancelled) throw httpError(-1, '请求已取消')
  assertRequestContext(ctx.contextEpoch)
}

class Http {
  baseURL: string
  timeout: number
  loadingCount: number
  pendingMap: Map<string, Promise<any>>
  pageTasksMap: Map<string, Set<UniApp.RequestTask>>
  private pageContextsMap = new Map<string, Set<ExecContext>>()
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
    // 身份代次变化：清空去重缓存并中止全部在途任务，防止旧响应回写新上下文
    onRequestContextChange(() => {
      this.pendingMap.clear()
      const routes = new Set([
        ...this.pageTasksMap.keys(),
        ...this.pageContextsMap.keys(),
      ])
      routes.forEach(route => this.cancelPageRequests(route))
    })
  }

  // ==================== Loading ====================

  /** 显示loading（引用计数） */
  showLoading() {
    if (this.loadingCount === 0) {
      showRequestLoading()
    }
    this.loadingCount++
  }

  /** 隐藏loading */
  hideLoading() {
    this.loadingCount--
    if (this.loadingCount <= 0) {
      this.loadingCount = 0
      hideRequestLoading()
    }
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
    this.pageContextsMap.get(pageRoute)?.forEach(ctx => {
      ctx.cancelled = true
    })
    this.pageContextsMap.delete(pageRoute)
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

  /** 统一请求（去重 + 重试 + 错误处理） */
  async request<T = any>(
    url: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const ctx = normalizeContext(url, options, this._getCurrentPageRoute())
    const requestKey = genRequestKey(ctx)

    // 去重：相同在飞请求直接复用
    if (options.dedupe !== false) {
      const existing = this.pendingMap.get(requestKey)
      if (existing) return existing as Promise<T>
    }

    const requestPromise = this._execute(ctx)

    // 注册去重；catch 兜底避免共享 Promise 的 unhandledrejection
    if (options.dedupe !== false) {
      this.pendingMap.set(requestKey, requestPromise)
      requestPromise
        .catch(() => {})
        .finally(() => this.pendingMap.delete(requestKey))
    }

    return requestPromise
  }

  /** 执行（loading + 重试 + 统一错误处理） */
  private async _execute(ctx: ExecContext): Promise<any> {
    if (ctx.cancelable && ctx.pageRoute) {
      if (!this.pageContextsMap.has(ctx.pageRoute)) {
        this.pageContextsMap.set(ctx.pageRoute, new Set())
      }
      this.pageContextsMap.get(ctx.pageRoute)!.add(ctx)
    }
    if (!ctx.silent) this.showLoading()
    try {
      return await this._doRequest(ctx, ctx.retry, ctx.retryDelay)
    } catch (error: any) {
      assertExecutionContext(ctx)
      return this._handleError(error as HttpError, ctx.silent)
    } finally {
      if (!ctx.silent) this.hideLoading()
      const contexts = this.pageContextsMap.get(ctx.pageRoute)
      contexts?.delete(ctx)
      if (contexts?.size === 0) this.pageContextsMap.delete(ctx.pageRoute)
    }
  }

  /** 递归重试请求（仅 retryable 错误：网络失败/5xx） */
  private async _doRequest(
    ctx: ExecContext,
    retriesLeft: number,
    retryDelay: number
  ): Promise<any> {
    try {
      const response = await this._send(ctx)
      assertExecutionContext(ctx)
      return this._handleResponse(response)
    } catch (error: any) {
      assertExecutionContext(ctx)
      if (!error?.retryable || retriesLeft <= 0) throw error

      // 指数退避
      const delay = retryDelay * Math.pow(2, ctx.rest._retryAttempt || 0)
      await new Promise(r => setTimeout(r, delay))
      assertExecutionContext(ctx)

      ctx.rest._retryAttempt = (ctx.rest._retryAttempt || 0) + 1
      return this._doRequest(ctx, retriesLeft - 1, retryDelay)
    }
  }

  /** 发送底层请求 */
  private _send(
    ctx: ExecContext
  ): Promise<UniApp.RequestSuccessCallbackResult> {
    assertExecutionContext(ctx)
    const userStore = useUserStore()
    const header: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(ctx.rest.header as Record<string, string> | undefined),
    }
    if (userStore.token) {
      header.Authorization = `Bearer ${userStore.token}`
    }

    return new Promise((resolve, reject) => {
      let requestTask: UniApp.RequestTask | undefined = undefined
      let settled = false
      const releaseTask = () => {
        settled = true
        if (requestTask) this.removePageTask(ctx.pageRoute, requestTask)
      }
      requestTask = uni.request({
        url: ctx.url,
        method: ctx.method as any,
        data: ctx.data,
        timeout: this.timeout,
        header,
        success: response => {
          releaseTask()
          resolve(response)
        },
        fail: err => {
          releaseTask()
          if (err.errMsg && err.errMsg.includes('abort')) {
            reject(httpError(-1, '请求已取消'))
          } else {
            // 网络层失败（断网/DNS/超时）：可重试
            reject(httpError(-1, err.errMsg || '网络连接失败', true))
          }
        },
        complete: releaseTask,
      })

      // 注册到页面任务
      if (ctx.cancelable && ctx.pageRoute && requestTask && !settled) {
        this.addPageTask(ctx.pageRoute, requestTask)
      }
    })
  }

  /** 处理响应（协议判定） */
  private _handleResponse(
    response: Pick<UniApp.RequestSuccessCallbackResult, 'statusCode' | 'data'>
  ) {
    const { statusCode } = response
    const data = parseResponseBody(response.data)

    if (statusCode === 200) {
      if (isBusinessSuccess(data)) {
        return extractBusinessData(data)
      }
      // 业务错误：不重试
      throw httpError(data.code ?? -3, data.message || '请求失败')
    }

    // 5xx 网关/服务端故障：可重试；4xx 客户端错误：不重试
    throw httpError(statusCode, getStatusMessage(statusCode), statusCode >= 500)
  }

  /** 统一错误处理 */
  private async _handleError(
    error: HttpError,
    silent: boolean
  ): Promise<never> {
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
    if (isCancelledError(error)) {
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
    const page = pages[pages.length - 1] as any
    const route = `/${page.route}`
    if (!withQuery || !page.options) return route
    const query = Object.entries(page.options as Record<string, string>)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&')
    return query ? `${route}?${query}` : route
  }

  // ==================== 便捷方法 ====================

  /** GET 请求 */
  get<T = any>(
    url: string,
    params?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(url, { method: 'GET', data: params, ...options })
  }

  /** POST 请求 */
  post<T = any>(
    url: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      data,
      dedupe: false,
      ...options,
    })
  }

  /** PUT 请求 */
  put<T = any>(
    url: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      data,
      dedupe: false,
      ...options,
    })
  }

  /** DELETE 请求 */
  delete<T = any>(
    url: string,
    params?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(url, {
      method: 'DELETE',
      data: params,
      dedupe: false,
      ...options,
    })
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
    const contextEpoch = getRequestContextEpoch()
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
          try {
            assertRequestContext(contextEpoch)
          } catch (error) {
            reject(error)
            return
          }
          try {
            resolve(this._handleResponse(res) as T)
          } catch (error) {
            await this._handleError(error as HttpError, silent).catch(() => {})
            reject(error)
          }
        },
        fail: err => {
          try {
            assertRequestContext(contextEpoch)
            reject(httpError(-1, err.errMsg || '上传失败', true))
          } catch (error) {
            reject(error)
          }
        },
        complete: () => {
          if (!silent) this.hideLoading()
        },
      })

      // 上传进度
      if (onProgress && uploadTask) {
        uploadTask.onProgressUpdate(res => {
          if (contextEpoch === getRequestContextEpoch())
            onProgress(res.progress)
        })
      }
    })
  }
}

const http = new Http()
export default http
