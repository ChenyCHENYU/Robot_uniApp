/** Timeline 时间轴：仅在当前页面维护演示状态，不调用业务接口。 */

export const PAGE_META = {
  name: 'timeline',
  title: '时间轴',
  component: 'C_Timeline',
  summary: '按时间展示流程记录',
  category: '数据',
  instruction: '对比订单和审批的进度，查看时间、状态和顺序关系。',
  number: '29',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const orderItems = [
    {
      title: '提交订单',
      content: '订单号: 2024010100001',
      time: '2024-01-01 10:00',
    },
    {
      title: '商家接单',
      content: '商家已确认并开始备货',
      time: '2024-01-01 10:15',
    },
    {
      title: '配送中',
      content: '骑手已取货，正在配送',
      time: '2024-01-01 10:45',
    },
    { title: '已送达', content: '请确认收货', time: '2024-01-01 11:20' },
  ]

  const approvalItems = [
    { title: '审批发起', time: '09:00', color: '#07c160' },
    { title: '部门经理审批', time: '10:30', color: '#07c160' },
    { title: 'HR审批中', time: '14:00', color: '#ff976a' },
    { title: '总经理审批', time: '待处理', color: '#dcdfe6' },
  ]
  return { orderItems, approvalItems }
}
