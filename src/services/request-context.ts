/**
 * HTTP 请求上下文代次
 *
 * 账号登出、重新登录时推进代次。HTTP 层据此：
 * 1. 清空去重缓存（不复用上一身份的在途请求）；
 * 2. 中止可取消任务，避免旧响应回写新上下文。
 *
 * 本模块不依赖 Pinia/API，避免 store → api → http 的循环依赖。
 */

let requestContextEpoch = 0

type RequestContextListener = (epoch: number) => void

const listeners = new Set<RequestContextListener>()

/** 返回当前请求上下文代次；仅进程内隔离，不持久化 */
export const getRequestContextEpoch = (): number => requestContextEpoch

/**
 * 推进请求上下文，并通知 HTTP 单例清理旧任务。
 * 监听器异常不得阻断登出/切换账号。
 */
export const advanceRequestContext = (): number => {
  requestContextEpoch += 1
  listeners.forEach(listener => {
    try {
      listener(requestContextEpoch)
    } catch {
      // 请求清理属于防御性增强，失败不阻断主流程
    }
  })
  return requestContextEpoch
}

/** 注册上下文变化监听（HTTP 单例注册一次） */
export const onRequestContextChange = (listener: RequestContextListener) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
