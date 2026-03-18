/** C_IndexList 索引列表 - 类型定义 */

export interface IndexListItem {
  /** 显示名称 */
  name: string
  /** 附加数据 */
  [key: string]: unknown
}

export interface IndexListGroup {
  /** 分组标题(索引字母) */
  title: string
  /** 分组数据 */
  items: IndexListItem[]
}

export interface IndexListProps {
  /** 分组数据 */
  list?: IndexListGroup[]
  /** 是否显示右侧索引栏 */
  showSidebar?: boolean
  /** 索引栏高亮颜色 */
  activeColor?: string
  /** 是否吸顶 */
  sticky?: boolean
  /** 吸顶偏移量(rpx) */
  stickyOffsetTop?: number
}
