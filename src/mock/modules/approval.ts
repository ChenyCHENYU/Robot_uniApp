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
}))

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
    return success(item || null)
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
