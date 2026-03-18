/** WebSocket 模块 - 类型定义 */

export type WsStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'reconnecting'

export interface WebSocketOptions {
  /** WebSocket 地址 */
  url?: string
  /** 消息回调 */
  onMessage?: (data: unknown) => void
  /** 连接成功回调 */
  onConnect?: () => void
  /** 连接关闭回调 */
  onClose?: (res: unknown) => void
  /** 错误回调 */
  onError?: (err: unknown) => void
  /** 是否自动连接 */
  autoConnect?: boolean
  /** 是否自动重连 */
  autoReconnect?: boolean
  /** 最大重连次数 */
  maxReconnect?: number
  /** 重连基础延迟(ms) */
  reconnectDelay?: number
  /** 心跳间隔(ms) */
  heartbeatInterval?: number
  /** 心跳消息 */
  heartbeatMessage?: string
}
