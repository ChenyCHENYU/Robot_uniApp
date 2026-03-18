/** C_TabNav 标签导航 - 类型定义 */

export interface TabNavItem {
  /** 标签标题 */
  title: string
  /** 标签唯一标识 */
  name?: string | number
  /** 是否禁用 */
  disabled?: boolean
  /** 徽标内容 */
  badge?: string | number
  /** 是否显示小红点 */
  dot?: boolean
}

export interface TabNavProps {
  /** 当前选中标签 */
  modelValue?: string | number
  /** 标签列表 */
  tabs?: TabNavItem[]
  /** 类型: line / card */
  type?: 'line' | 'card'
  /** 是否可滚动 */
  scrollable?: boolean
  /** 底部条颜色 */
  lineColor?: string
  /** 底部条宽度(rpx) */
  lineWidth?: number | string
  /** 是否开启切换动画 */
  animated?: boolean
  /** 是否可滑动切换 */
  swipeable?: boolean
  /** 标签栏吸顶 */
  sticky?: boolean
}
