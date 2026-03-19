import { defineMock } from 'vite-plugin-mock-dev-server'

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

export default defineMock([
  {
    url: '/api/approval/list',
    body: ({ query }) => {
      const page = Number(query.page) || 1
      const pageSize = Number(query.pageSize) || 10
      const status = query.status
      const filtered = status
        ? mockApprovals.filter(a => a.status === status)
        : mockApprovals
      const start = (page - 1) * pageSize
      const list = filtered.slice(start, start + pageSize)
      return {
        code: 200,
        message: 'ok',
        data: { list, total: filtered.length, page, pageSize },
      }
    },
  },
  {
    url: '/api/approval/detail',
    body: ({ query }) => {
      const item = mockApprovals.find(a => a.id === query.id)
      return { code: 200, message: 'ok', data: item || null }
    },
  },
  {
    url: '/api/approval/action',
    method: 'POST',
    body: ({ body }) => {
      const item = mockApprovals.find(a => a.id === body?.id)
      if (item)
        item.status = body?.action === 'approve' ? 'approved' : 'rejected'
      return {
        code: 200,
        message: body?.action === 'approve' ? '审批通过' : '已驳回',
        data: null,
      }
    },
  },
  {
    url: '/api/approval/count',
    body: () => ({
      code: 200,
      message: 'ok',
      data: {
        pending: mockApprovals.filter(a => a.status === 'pending').length,
      },
    }),
  },
])
