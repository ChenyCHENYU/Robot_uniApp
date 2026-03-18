/** C_Timeline 时间轴 - 类型定义 */

export type TimelineNodeStatus = 'finished' | 'current' | 'pending'

export interface TimelineItem {
  /** 标题 */
  title: string
  /** 描述 */
  content?: string
  /** 时间 */
  time?: string
  /** 自定义图标 */
  icon?: string
  /** 节点颜色 */
  color?: string
  /** 节点状态 */
  status?: TimelineNodeStatus
}

export interface TimelineProps {
  /** 时间轴数据 */
  items?: TimelineItem[]
  /** 排列方向 */
  direction?: 'vertical' | 'horizontal'
  /** 是否倒序 */
  reverse?: boolean
  /** 当前激活索引 */
  current?: number
  /** 已完成步骤颜色 */
  finishedColor?: string
  /** 未完成步骤颜色 */
  pendingColor?: string
}
