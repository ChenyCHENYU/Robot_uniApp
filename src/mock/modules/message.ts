import { success, type MockResponse } from '../helpers'

const messageTypes = ['system', 'notify', 'todo', 'interact']
const mockMessages = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  type: messageTypes[i % 4],
  title: ['系统更新', '组件库更新', '审批待办', '新评论'][i % 4],
  content: `这是第 ${i + 1} 条模拟消息内容，用于测试消息列表的展示效果。`,
  time: i < 3 ? '刚刚' : i < 10 ? `${i}小时前` : `${Math.floor(i / 7)}天前`,
  read: i > 6,
  icon: ['setting', 'notification', 'edit-outline', 'comment'][i % 4],
  iconBg: [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #ffecd2, #fcb69f)',
  ][i % 4],
}))

export const messageMocks: Record<string, (options: any) => MockResponse> = {
  'GET /message/list': options => {
    const { page = 1, pageSize = 10, type } = options.data || {}
    const filtered = type
      ? mockMessages.filter(m => m.type === type)
      : mockMessages
    const start = (Number(page) - 1) * Number(pageSize)
    const list = filtered.slice(start, start + Number(pageSize))
    return success({
      list,
      total: filtered.length,
      page: Number(page),
      pageSize: Number(pageSize),
    })
  },

  'GET /message/detail': options => {
    const msg = mockMessages.find(m => m.id === Number(options.data?.id))
    return success(msg || null)
  },

  'PUT /message/read': options => {
    const msg = mockMessages.find(m => m.id === Number(options.data?.id))
    if (msg) msg.read = true
    return success(null, '已读')
  },

  'PUT /message/read-all': () => {
    mockMessages.forEach(m => (m.read = true))
    return success(null, '全部已读')
  },

  'DELETE /message/item': options => {
    const idx = mockMessages.findIndex(m => m.id === Number(options.data?.id))
    if (idx > -1) mockMessages.splice(idx, 1)
    return success(null, '删除成功')
  },

  'GET /message/unread-count': () => {
    return success({ count: mockMessages.filter(m => !m.read).length })
  },
}
