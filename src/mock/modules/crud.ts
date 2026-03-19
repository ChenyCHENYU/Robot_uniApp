import { success, type MockResponse } from '../helpers'

const mockItems = Array.from({ length: 42 }, (_, i) => ({
  id: `item_${String(i + 1).padStart(3, '0')}`,
  title: `数据项 ${i + 1}`,
  description: `这是第 ${i + 1} 条数据的描述信息`,
  status: i % 3 === 0 ? 0 : 1,
  createTime: `2025-01-${String(1 + (i % 28)).padStart(2, '0')} 10:00:00`,
  updatedTime: `2025-01-${String(1 + (i % 28)).padStart(2, '0')} 18:00:00`,
}))

export const crudMocks: Record<string, (options: any) => MockResponse> = {
  'GET /crud/list': options => {
    const { page = 1, pageSize = 10, keyword, status } = options.data || {}
    let filtered = [...mockItems]
    if (keyword)
      filtered = filtered.filter(item => item.title.includes(keyword))
    if (status !== undefined)
      filtered = filtered.filter(item => item.status === Number(status))
    const start = (Number(page) - 1) * Number(pageSize)
    const list = filtered.slice(start, start + Number(pageSize))
    return success({
      list,
      total: filtered.length,
      page: Number(page),
      pageSize: Number(pageSize),
    })
  },

  'GET /crud/detail': options => {
    const item = mockItems.find(i => i.id === options.data?.id)
    return success(item || null)
  },

  'POST /crud/item': options => {
    const newItem = {
      id: `item_${randomId()}`,
      ...options.data,
      createTime: new Date().toISOString(),
    }
    mockItems.unshift(newItem)
    return success(newItem, '创建成功')
  },

  'PUT /crud/item': options => {
    const item = mockItems.find(i => i.id === options.data?.id)
    if (item) Object.assign(item, options.data)
    return success(item, '更新成功')
  },

  'DELETE /crud/item': options => {
    const idx = mockItems.findIndex(i => i.id === options.data?.id)
    if (idx > -1) mockItems.splice(idx, 1)
    return success(null, '删除成功')
  },
}
