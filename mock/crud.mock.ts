import { defineMock } from 'vite-plugin-mock-dev-server'

const mockItems = Array.from({ length: 45 }, (_, i) => ({
  id: `item_${String(i + 1).padStart(3, '0')}`,
  title: `数据条目 #${i + 1}`,
  description: `这是第 ${i + 1} 条数据的描述信息`,
  status: i % 3 === 0 ? 0 : 1,
  creator: `用户${(i % 10) + 1}`,
  createTime: `2025-01-${String((i % 28) + 1).padStart(2, '0')} 12:00:00`,
  updateTime: `2025-02-${String((i % 28) + 1).padStart(2, '0')} 12:00:00`,
}))

export default defineMock([
  {
    url: '/api/crud/list',
    body: ({ query }) => {
      const page = Number(query.page) || 1
      const pageSize = Number(query.pageSize) || 10
      const keyword = query.keyword || ''
      const status = query.status
      let filtered = mockItems
      if (keyword) filtered = filtered.filter(i => i.title.includes(keyword))
      if (status !== undefined && status !== '')
        filtered = filtered.filter(i => i.status === Number(status))
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
    url: '/api/crud/detail',
    body: ({ query }) => {
      const item = mockItems.find(i => i.id === query.id)
      return { code: 200, message: 'ok', data: item || null }
    },
  },
  {
    url: '/api/crud/item',
    method: 'POST',
    body: ({ body }) => {
      const newItem = {
        ...body,
        id: `item_${Date.now()}`,
        createTime: new Date().toISOString(),
      }
      mockItems.unshift(newItem)
      return { code: 200, message: '创建成功', data: newItem }
    },
  },
  {
    url: '/api/crud/item',
    method: 'PUT',
    body: ({ body }) => {
      const idx = mockItems.findIndex(i => i.id === body?.id)
      if (idx > -1) Object.assign(mockItems[idx], body)
      return { code: 200, message: '更新成功', data: mockItems[idx] || null }
    },
  },
  {
    url: '/api/crud/item',
    method: 'DELETE',
    body: ({ query }) => {
      const idx = mockItems.findIndex(i => i.id === query.id)
      if (idx > -1) mockItems.splice(idx, 1)
      return { code: 200, message: '删除成功', data: null }
    },
  },
])
