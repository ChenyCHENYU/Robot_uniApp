/** C_Divider 分割线 - 类型定义 */

export type DividerContentPosition = 'left' | 'center' | 'right'
export type DividerBorderStyle = 'solid' | 'dashed' | 'dotted'

export interface DividerProps {
  /** 是否使用虚线 */
  dashed?: boolean
  /** 是否使用 hairline */
  hairline?: boolean
  /** 内容位置 */
  contentPosition?: DividerContentPosition
  /** 分割线颜色 */
  color?: string
  /** 边框样式 */
  borderStyle?: DividerBorderStyle
  /** 文本内容 */
  text?: string
  /** 上下外边距(rpx) */
  margin?: string
}
