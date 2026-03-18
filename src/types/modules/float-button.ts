/** C_FloatButton 悬浮按钮 - 类型定义 */

export type FloatButtonPosition =
  | 'right-bottom'
  | 'left-bottom'
  | 'right-top'
  | 'left-top'

export interface FloatButtonProps {
  /** 图标名称 */
  icon?: string
  /** 按钮位置 */
  position?: FloatButtonPosition
  /** 距离底部(rpx) */
  bottom?: number | string
  /** 距离侧边(rpx) */
  side?: number | string
  /** 按钮大小(rpx) */
  size?: number | string
  /** 背景色 */
  bgColor?: string
  /** 图标颜色 */
  iconColor?: string
  /** 是否可拖动 */
  draggable?: boolean
  /** 是否显示 */
  visible?: boolean
}
