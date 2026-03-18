/**
 * @description C_Timeline 时间轴 - 数据配置
 */

/** 默认属性 */
export const defaultProps = {
  /** 时间轴数据 [{ title, content, time, icon?, color?, status? }] */
  items: [],
  /** 排列方向 */
  direction: 'vertical',
  /** 是否倒序 */
  reverse: false,
  /** 当前激活索引 */
  current: -1,
  /** 已完成步骤颜色 */
  finishedColor: 'var(--r-color-primary, #2b6bff)',
  /** 未完成步骤颜色 */
  pendingColor: 'var(--r-text-color-placeholder, #ccc)',
}

/** 节点状态 */
export const NODE_STATUS = {
  FINISHED: 'finished',
  CURRENT: 'current',
  PENDING: 'pending',
}
