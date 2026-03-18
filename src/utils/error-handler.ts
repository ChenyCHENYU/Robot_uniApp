import type { App } from 'vue'

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

/** 获取当前页面路径 */
function getCurrentPage(): string {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  return current ? `/${current.route}` : 'unknown'
}

/** 记录错误 */
function logError(info: ErrorInfo) {
  if (errorQueue.length >= MAX_QUEUE) errorQueue.shift()
  errorQueue.push(info)

  // 开发环境打印到控制台
  if (import.meta.env.DEV) {
    console.error(`[${info.type}] ${info.message}`, info.stack || '')
  }

  // TODO: 生产环境上报到日志服务
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

/** 获取错误日志（供调试面板使用） */
export function getErrorLogs(): readonly ErrorInfo[] {
  return errorQueue
}

/** 清空错误日志 */
export function clearErrorLogs() {
  errorQueue.length = 0
}
