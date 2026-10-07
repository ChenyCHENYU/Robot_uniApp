import { success, type MockResponse } from '../helpers'

const statusList = ['pending', 'approved', 'rejected']
const mockApprovals = Array.from({ length: 25 }, (_, i) => ({
  id: `ap_${String(i + 1).padStart(3, '0')}`,
  title: ['请假申请', '采购审批', '出差申请', '报销审批', '加班申请'][i % 5],
  applicant: `用户${i + 1}`,
  status: statusList[i % 3],
  amount:
    i % 5 === 1 || i % 5 === 3 ? (Math.random() * 10000).toFixed(2) : undefined,
  createTime: `2025-01-${String(15 + (i % 15)).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:00`,
  remark: i % 3 === 0 ? '请尽快审批' : '',
  content: '申请详情说明：本申请由业务系统自动生成，请及时处理。',
  department: ['技术部', '产品部', '运营部', '财务部'][i % 4],
  type: ['请假', '采购', '出差', '报销', '加班'][i % 5],
}))

/** 按当前状态派生审批流节点 */
function buildFlowNodes(item: (typeof mockApprovals)[number]) {
  const base = [
    {
      title: '提交申请',
      user: item.applicant,
      status: 'approved',
      time: item.createTime,
      remark: '提交审批申请',
    },
    {
      title: '部门主管审批',
      user: '李经理',
      status: 'approved',
      time: item.createTime,
      remark: '同意提交下一步',
    },
    { title: '总监审批', user: '王总监', status: 'pending' },
    { title: '归档', user: '系统', status: 'waiting' },
  ]
  if (item.status === 'approved') {
    base[2] = { title: '总监审批', user: '王总监', status: 'approved', time: item.createTime, remark: '同意' }
    base[3] = { title: '归档', user: '系统', status: 'approved', time: item.createTime, remark: '已归档' }
  } else if (item.status === 'rejected') {
    base[2] = { title: '总监审批', user: '王总监', status: 'rejected', time: item.createTime, remark: '驳回：材料不完整' }
    base[3] = { title: '归档', user: '系统', status: 'waiting' }
  }
  return base
}

export const approvalMocks: Record<string, (options: any) => MockResponse> = {
  'GET /approval/list': options => {
    const { page = 1, pageSize = 10, status } = options.data || {}
    const filtered = status
      ? mockApprovals.filter(a => a.status === status)
      : mockApprovals
    const start = (Number(page) - 1) * Number(pageSize)
    const list = filtered.slice(start, start + Number(pageSize))
    return success({
      list,
      total: filtered.length,
      page: Number(page),
      pageSize: Number(pageSize),
    })
  },

  'GET /approval/detail': options => {
    const item = mockApprovals.find(a => a.id === options.data?.id)
    if (!item) return success(null)
    return success({ ...item, flowNodes: buildFlowNodes(item) })
  },

  'POST /approval/action': options => {
    const { id, action } = options.data || {}
    const item = mockApprovals.find(a => a.id === id)
    if (item) item.status = action === 'approve' ? 'approved' : 'rejected'
    return success(null, action === 'approve' ? '审批通过' : '已驳回')
  },

  'GET /approval/count': () => {
    return success({
      pending: mockApprovals.filter(a => a.status === 'pending').length,
    })
  },
}
