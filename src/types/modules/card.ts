/** C_Card 卡片 - 类型定义 */

export interface CardProps {
  /** 标题 */
  title?: string
  /** 副标题 */
  subtitle?: string
  /** 底部文字 */
  footer?: string
  /** 是否显示边框 */
  border?: boolean
  /** 是否可悬浮 */
  hoverable?: boolean
  /** 圆角大小(rpx) */
  radius?: number | string
  /** 内边距(rpx) */
  padding?: string
  /** 背景色 */
  bgColor?: string
  /** 是否有阴影 */
  shadow?: boolean
}
