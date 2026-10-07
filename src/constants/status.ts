/**
 * 业务状态字典（crud / 审批等模板页共用）
 */

/** CRUD 数据项状态（与后端约定：0 待处理 / 1 已完成） */
export const CRUD_STATUS = {
  PENDING: 0,
  DONE: 1,
} as const

export const CRUD_STATUS_TEXT: Record<number, string> = {
  [CRUD_STATUS.PENDING]: '待处理',
  [CRUD_STATUS.DONE]: '已完成',
}

/** 审批状态 */
export const APPROVAL_STATUS_TEXT: Record<string, string> = {
  pending: '审批中',
  approved: '已通过',
  rejected: '已驳回',
}

/** 审批流节点状态 */
export const FLOW_NODE_STATUS_TEXT: Record<string, string> = {
  approved: '已通过',
  rejected: '已驳回',
  pending: '待审批',
  waiting: '等待中',
}
