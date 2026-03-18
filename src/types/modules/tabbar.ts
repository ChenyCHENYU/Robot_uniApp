/** C_Tabbar 底部导航栏 - 类型定义 */

export interface TabbarItem {
  /** 标签名称 */
  text: string
  /** 图标名称（选中状态） */
  icon: string
  /** 图标名称（未选中状态） */
  inactiveIcon?: string
  /** 跳转路径 */
  path: string
  /** 徽标数 */
  badge?: number | string
  /** 是否显示红点 */
  dot?: boolean
}

export interface TabbarProps {
  /** 当前选中索引 */
  modelValue?: number
  /** 标签项 */
  items?: TabbarItem[]
  /** 选中颜色 */
  activeColor?: string
  /** 未选中颜色 */
  inactiveColor?: string
  /** 是否固定底部 */
  fixed?: boolean
  /** 是否显示上边框 */
  border?: boolean
  /** z-index */
  zIndex?: number
  /** 是否安全区域适配 */
  safeAreaInsetBottom?: boolean
}
