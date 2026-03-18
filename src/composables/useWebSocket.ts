/**
 * useWebSocket - WebSocket 连接管理
 *
 * 核心能力：
 * - 自动重连（指数退避）
 * - 心跳检测（保活机制）
 * - 消息队列（断线缓存）
 * - 事件分发（按类型订阅）
 *
 * @example
 * const { connect, send, close, status, lastMessage } = useWebSocket({
 *   url: 'wss://api.example.com/ws',
 *   onMessage: (data) => console.log(data),
 * })
 */
import { ref, onUnmounted } from 'vue'

/** 连接状态枚举 */
export const WS_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting',
}

/**
 * WebSocket 连接管理组合函数
 * @param {object} options
 * @param {string} options.url - WebSocket 地址
 * @param {function} [options.onMessage] - 消息回调
 * @param {function} [options.onConnect] - 连接成功回调
 * @param {function} [options.onClose] - 连接关闭回调
 * @param {function} [options.onError] - 错误回调
 * @param {boolean} [options.autoConnect=false] - 是否自动连接
 * @param {boolean} [options.autoReconnect=true] - 是否自动重连
 * @param {number} [options.maxReconnect=5] - 最大重连次数
 * @param {number} [options.reconnectDelay=3000] - 重连基础延迟(ms)
 * @param {number} [options.heartbeatInterval=30000] - 心跳间隔(ms)
 * @param {string} [options.heartbeatMessage='ping'] - 心跳消息
 */
interface WebSocketOptions {
  url?: string
  onMessage?: (data: any) => void
  onConnect?: () => void
  onClose?: (res: any) => void
  onError?: (err: any) => void
  autoConnect?: boolean
  autoReconnect?: boolean
  maxReconnect?: number
  reconnectDelay?: number
  heartbeatInterval?: number
  heartbeatMessage?: string
}

export function useWebSocket(options: WebSocketOptions = {}) {
  const {
    url,
    onMessage,
    onConnect,
    onClose,
    onError,
    autoConnect = false,
    autoReconnect = true,
    maxReconnect = 5,
    reconnectDelay = 3000,
    heartbeatInterval = 30000,
    heartbeatMessage = 'ping',
  } = options

  /** 连接状态 */
  const status = ref(WS_STATUS.DISCONNECTED)
  /** 最近一条消息 */
  const lastMessage = ref(null)

  let socketTask: UniApp.SocketTask | null = null
  let reconnectCount = 0
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null
  // 断线期间缓存的消息队列
  const messageQueue: string[] = []

  /**
   * 建立连接
   * @param {string} [customUrl] - 覆盖默认 URL
   */
  function connect(customUrl?: string) {
    const wsUrl = customUrl || url
    if (!wsUrl) {
      console.warn('[WebSocket] 未提供连接地址')
      return
    }

    // 关闭已有连接
    if (socketTask) {
      _cleanup()
    }

    status.value = WS_STATUS.CONNECTING

    socketTask = uni.connectSocket({
      url: wsUrl,
      complete: () => {},
    })

    socketTask.onOpen(() => {
      status.value = WS_STATUS.CONNECTED
      reconnectCount = 0
      _startHeartbeat()
      _flushQueue()
      if (onConnect) onConnect()
    })

    socketTask.onMessage(res => {
      // 过滤心跳响应
      if (res.data === 'pong') return

      let { data } = res
      try {
        data = JSON.parse(res.data)
      } catch {
        // 非 JSON 消息保持原值
      }
      lastMessage.value = data
      if (onMessage) onMessage(data)
    })

    socketTask.onClose(res => {
      _stopHeartbeat()
      status.value = WS_STATUS.DISCONNECTED
      socketTask = null
      if (onClose) onClose(res)

      // 非主动关闭 → 尝试重连
      if (autoReconnect && reconnectCount < maxReconnect) {
        _scheduleReconnect(wsUrl)
      }
    })

    socketTask.onError(err => {
      if (onError) onError(err)
    })
  }

  /**
   * 发送消息
   * @param {string|object} data - 字符串或可序列化对象
   * @param {boolean} [queue=true] - 断线时是否加入队列
   */
  function send(data: string | object, queue = true) {
    const message = typeof data === 'string' ? data : JSON.stringify(data)

    if (status.value === WS_STATUS.CONNECTED && socketTask) {
      socketTask.send({ data: message })
    } else if (queue) {
      messageQueue.push(message)
    }
  }

  /**
   * 主动关闭连接
   * @param {number} [code=1000]
   * @param {string} [reason='']
   */
  function close(code = 1000, reason = '') {
    // 标记主动关闭，阻止重连
    reconnectCount = maxReconnect
    _cleanup()
    if (socketTask) {
      socketTask.close({ code, reason })
      socketTask = null
    }
    status.value = WS_STATUS.DISCONNECTED
  }

  // ==================== 内部方法 ====================

  /** 清理定时器 */
  function _cleanup() {
    _stopHeartbeat()
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  /** 开启心跳 */
  function _startHeartbeat() {
    _stopHeartbeat()
    heartbeatTimer = setInterval(() => {
      if (status.value === WS_STATUS.CONNECTED && socketTask) {
        socketTask.send({ data: heartbeatMessage })
      }
    }, heartbeatInterval)
  }

  /** 停止心跳 */
  function _stopHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
  }

  /** 指数退避重连 */
  function _scheduleReconnect(wsUrl: string) {
    status.value = WS_STATUS.RECONNECTING
    const delay = reconnectDelay * Math.pow(2, reconnectCount)
    reconnectCount++

    reconnectTimer = setTimeout(() => {
      connect(wsUrl)
    }, delay)
  }

  /** 发送队列中缓存的消息 */
  function _flushQueue() {
    while (messageQueue.length > 0) {
      const msg = messageQueue.shift()
      if (socketTask) socketTask.send({ data: msg! })
    }
  }

  // 组件卸载时自动关闭
  onUnmounted(() => {
    close()
  })

  // 自动连接
  if (autoConnect && url) {
    connect()
  }

  return {
    status,
    lastMessage,
    connect,
    send,
    close,
  }
}
