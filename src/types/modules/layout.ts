/** C_Layout 页面布局 - 类型定义 */

export interface LayoutProps {
  /** 是否显示底部导航 */
  showTabbar?: boolean
  /** 是否显示头部 */
  showHeader?: boolean
  /** 背景色 */
  bgColor?: string
  /** 是否安全区域适配 */
  safeArea?: boolean
  /** 内边距(rpx) */
  padding?: string
  /** 是否可滚动 */
  scrollable?: boolean
}
