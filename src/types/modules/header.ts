/** C_Header 导航头部 - 类型定义 */

export interface HeaderProps {
  /** 标题文字 */
  title?: string
  /** 是否显示返回按钮 */
  showBack?: boolean
  /** 是否透明背景 */
  transparent?: boolean
  /** 背景色 */
  bgColor?: string
  /** 标题颜色 */
  titleColor?: string
  /** 是否固定顶部 */
  fixed?: boolean
  /** 是否显示底部边框 */
  border?: boolean
  /** 返回按钮图标 */
  backIcon?: string
  /** z-index 层级 */
  zIndex?: number
}
