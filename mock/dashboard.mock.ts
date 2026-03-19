import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock([
  {
    url: '/api/dashboard/stats',
    body: {
      code: 200,
      message: 'ok',
      data: {
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
      },
    },
  },
  {
    url: '/api/dashboard/chart',
    body: ({ query }) => {
      const days = query.range === 'month' ? 30 : 7
      const labels = Array.from({ length: days }, (_, i) => `${i + 1}日`)
      const data = Array.from({ length: days }, () =>
        Math.floor(Math.random() * 500 + 100)
      )
      return { code: 200, message: 'ok', data: { labels, values: data } }
    },
  },
  {
    url: '/api/dashboard/activities',
    body: ({ query }) => {
      const page = Number(query.page) || 1
      const pageSize = Number(query.pageSize) || 10
      const total = 30
      const list = Array.from(
        { length: Math.min(pageSize, total - (page - 1) * pageSize) },
        (_, i) => ({
          id: (page - 1) * pageSize + i + 1,
          text: `活动记录 #${(page - 1) * pageSize + i + 1}`,
          time: `${Math.floor(Math.random() * 24)}小时前`,
          color: ['#667eea', '#43e97b', '#4facfe', '#f093fb', '#fa709a'][i % 5],
        })
      )
      return { code: 200, message: 'ok', data: { list, total, page, pageSize } }
    },
  },
])
