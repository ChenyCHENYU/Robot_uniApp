/** C_SwipeAction 滑动操作 - 类型定义 */

export interface SwipeActionButton {
  /** 按钮文字 */
  text: string
  /** 背景色 */
  bgColor?: string
  /** 文字颜色 */
  color?: string
  /** 图标 */
  icon?: string
  /** 按钮宽度(rpx) */
  width?: number
  /** 是否禁用 */
  disabled?: boolean
}

export interface SwipeActionProps {
  /** 左侧按钮 */
  leftActions?: SwipeActionButton[]
  /** 右侧按钮 */
  rightActions?: SwipeActionButton[]
  /** 是否禁用 */
  disabled?: boolean
  /** 是否自动关闭 */
  autoClose?: boolean
  /** 滑动阈值(rpx) */
  threshold?: number
}
