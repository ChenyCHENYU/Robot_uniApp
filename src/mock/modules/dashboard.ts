import { success, type MockResponse } from '../helpers'

export const dashboardMocks: Record<string, (options: any) => MockResponse> = {
  'GET /dashboard/stats': () => {
    return success({
      activeUsers: 12486,
      todayVisits: 3829,
      pendingTasks: 26,
      completionRate: 94.6,
      trends: {
        activeUsers: 12.5,
        todayVisits: 8.3,
        pendingTasks: -4.2,
        completionRate: 2.1,
      },
    })
  },

  'GET /dashboard/chart': options => {
    const range = options.data?.range || 'week'
    const days = range === 'month' ? 30 : 7
    const labels = Array.from({ length: days }, (_, i) => `${i + 1}日`)
    const visits = Array.from({ length: days }, () =>
      Math.floor(Math.random() * 5000 + 1000)
    )
    const users = Array.from({ length: days }, () =>
      Math.floor(Math.random() * 2000 + 500)
    )
    return success({ labels, visits, users })
  },

  'GET /dashboard/activities': options => {
    const { page = 1, pageSize = 10 } = options.data || {}
    const total = 30
    const start = (Number(page) - 1) * Number(pageSize)
    const list = Array.from(
      { length: Math.min(Number(pageSize), total - start) },
      (_, i) => ({
        id: start + i + 1,
        text: [
          '系统升级完成',
          '新增业务模板',
          '性能优化上线',
          '安全补丁已应用',
          '新功能发布',
        ][i % 5],
        time: `${start + i + 1}小时前`,
        color: ['#667eea', '#43e97b', '#4facfe', '#f093fb', '#fa709a'][i % 5],
      })
    )
    return success({
      list,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    })
  },
}
