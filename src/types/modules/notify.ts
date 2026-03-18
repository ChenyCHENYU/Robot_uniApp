/** C_Notify 消息通知 - 类型定义 */

export type NotifyType = 'primary' | 'success' | 'warning' | 'danger'
export type NotifyPosition = 'top' | 'bottom'

export interface NotifyProps {
  /** 是否显示 */
  visible?: boolean
  /** 通知类型 */
  type?: NotifyType
  /** 通知内容 */
  message?: string
  /** 展示时长(ms)，0 为不自动关闭 */
  duration?: number
  /** 弹出位置 */
  position?: NotifyPosition
  /** 背景色 */
  background?: string
  /** 文字颜色 */
  color?: string
  /** z-index */
  zIndex?: number
  /** 是否留出安全区域 */
  safeAreaInsetTop?: boolean
}
