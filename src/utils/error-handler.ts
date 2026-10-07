/**
 * 全局错误处理 — 收集 + 脱敏 + 上报钩子
 *
 * - 内存队列保留最近 50 条（含页面路径与时间戳）
 * - 敏感信息脱敏：token/openid/user_id 等查询参数一律打码
 * - 上报钩子：registerErrorReporter 注入远程日志服务（Sentry/自建）后生效
 */
import type { App } from 'vue'
import { logger } from '@/utils/logger'

interface ErrorInfo {
  type: 'vue' | 'promise' | 'runtime'
  message: string
  stack?: string
  timestamp: number
  page?: string
}

/** 错误日志队列（内存中最多保留 50 条） */
const errorQueue: ErrorInfo[] = []
const MAX_QUEUE = 50

/** 单条消息/堆栈最大长度，防止异常堆栈撑爆内存 */
const MESSAGE_MAX = 500
const STACK_MAX = 2000

/** 远程上报钩子（可注入） */
type ErrorReporter = (info: ErrorInfo) => void
let reporter: ErrorReporter | null = null

/** 敏感参数脱敏：token/openid/user_id 等查询参数一律打码 */
export function scrubSensitiveText(raw: string): string {
  return raw.replace(
    /((?:portal_token|access_token|refresh_token|token|openid|user_id|password)=)[^&\s'"<>]+/gi,
    '$1***'
  )
}

const scrubAndClamp = (raw: unknown, max: number): string => {
  const text = typeof raw === 'string' ? raw : ''
  return scrubSensitiveText(text).slice(0, max)
}

/** 获取当前页面路径 */
function getCurrentPage(): string {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  return current ? `/${current.route}` : 'unknown'
}

/** 注入远程上报实现（重复注入以最后一次为准；传 null 移除） */
export function registerErrorReporter(impl: ErrorReporter | null) {
  reporter = impl
}

/** 记录错误（入队 + 脱敏 + 控制台 + 上报钩子） */
function logError(info: ErrorInfo) {
  const safe: ErrorInfo = {
    ...info,
    message: scrubAndClamp(info.message, MESSAGE_MAX),
    stack: info.stack ? scrubAndClamp(info.stack, STACK_MAX) : undefined,
  }

  if (errorQueue.length >= MAX_QUEUE) errorQueue.shift()
  errorQueue.push(safe)

  logger.error(`[${safe.type}] ${safe.message}`)

  if (reporter) {
    try {
      reporter(safe)
    } catch {
      // 上报失败不影响业务
    }
  }
}

/** 安装全局错误处理 */
export function setupErrorHandler(app: App) {
  // Vue 组件内错误
  app.config.errorHandler = (err, _instance, info) => {
    const error = err instanceof Error ? err : new Error(String(err))
    logError({
      type: 'vue',
      message: `${error.message} (${info})`,
      stack: error.stack,
      timestamp: Date.now(),
      page: getCurrentPage(),
    })
  }

  // uni-app 全局错误
  uni.onError((msg: string) => {
    logError({
      type: 'runtime',
      message: msg,
      timestamp: Date.now(),
      page: getCurrentPage(),
    })
  })

  // 未处理的 Promise rejection（H5 端）
  // #ifdef H5
  window.addEventListener('unhandledrejection', event => {
    const { reason } = event
    const message = reason instanceof Error ? reason.message : String(reason)
    logError({
      type: 'promise',
      message,
      stack: reason instanceof Error ? reason.stack : undefined,
      timestamp: Date.now(),
      page: getCurrentPage(),
    })
  })
  // #endif
}

/** 获取错误日志（供调试面板使用，已脱敏） */
export function getErrorLogs(): readonly ErrorInfo[] {
  return errorQueue
}

/** 清空错误日志 */
export function clearErrorLogs() {
  errorQueue.length = 0
}
