import { defineMock } from 'vite-plugin-mock-dev-server'

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

export default defineMock([
  {
    url: '/api/message/list',
    body: ({ query }) => {
      const page = Number(query.page) || 1
      const pageSize = Number(query.pageSize) || 10
      const type = query.type
      const filtered = type
        ? mockMessages.filter(m => m.type === type)
        : mockMessages
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
    url: '/api/message/detail',
    body: ({ query }) => {
      const msg = mockMessages.find(m => m.id === Number(query.id))
      return { code: 200, message: 'ok', data: msg || null }
    },
  },
  {
    url: '/api/message/read',
    method: 'PUT',
    body: ({ body }) => {
      const msg = mockMessages.find(m => m.id === Number(body?.id))
      if (msg) msg.read = true
      return { code: 200, message: '已读', data: null }
    },
  },
  {
    url: '/api/message/read-all',
    method: 'PUT',
    body: () => {
      mockMessages.forEach(m => (m.read = true))
      return { code: 200, message: '全部已读', data: null }
    },
  },
  {
    url: '/api/message/item',
    method: 'DELETE',
    body: ({ query }) => {
      const idx = mockMessages.findIndex(m => m.id === Number(query.id))
      if (idx > -1) mockMessages.splice(idx, 1)
      return { code: 200, message: '删除成功', data: null }
    },
  },
  {
    url: '/api/message/unread-count',
    body: () => ({
      code: 200,
      message: 'ok',
      data: { count: mockMessages.filter(m => !m.read).length },
    }),
  },
])
