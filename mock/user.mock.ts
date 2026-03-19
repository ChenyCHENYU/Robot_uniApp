import { defineMock } from 'vite-plugin-mock-dev-server'

const mockUser = {
  id: 'u_001',
  username: 'admin',
  nickname: '管理员',
  avatar: '/static/images/default-avatar.png',
  phone: '138****8888',
  email: 'admin@robot.com',
  roles: ['admin'],
  permissions: ['user:view', 'user:edit', 'user:delete', 'robot:control'],
}

function generateUserList(page: number, pageSize: number) {
  const total = 56
  const start = (page - 1) * pageSize
  const end = Math.min(start + pageSize, total)
  const list = Array.from({ length: end - start }, (_, i) => ({
    id: `u_${String(start + i + 1).padStart(3, '0')}`,
    username: `user_${start + i + 1}`,
    nickname: `用户${start + i + 1}`,
    avatar: '/static/images/default-avatar.png',
    phone: `138****${String(1000 + start + i).slice(-4)}`,
    status: i % 5 === 0 ? 0 : 1,
    createTime: '2024-01-01 12:00:00',
  }))
  return { list, total, page, pageSize }
}

export default defineMock([
  {
    url: '/api/auth/login',
    method: 'POST',
    body: ({ body }) => {
      const { username, password } = body || {}
      if (username === 'admin' && password === 'admin123') {
        return {
          code: 200,
          message: 'ok',
          data: { token: `mock_token_${Date.now()}` },
        }
      }
      return { code: 401, message: '用户名或密码错误', data: null }
    },
  },
  {
    url: '/api/auth/logout',
    method: 'POST',
    body: { code: 200, message: '退出成功', data: null },
  },
  {
    url: '/api/user/info',
    body: { code: 200, message: 'ok', data: mockUser },
  },
  {
    url: '/api/user/info',
    method: 'PUT',
    body: ({ body }) => {
      Object.assign(mockUser, body)
      return { code: 200, message: '更新成功', data: mockUser }
    },
  },
  {
    url: '/api/user/list',
    body: ({ query }) => {
      const page = Number(query.page) || 1
      const pageSize = Number(query.pageSize) || 10
      return {
        code: 200,
        message: 'ok',
        data: generateUserList(page, pageSize),
      }
    },
  },
  {
    url: '/api/user/avatar',
    method: 'POST',
    body: {
      code: 200,
      message: '上传成功',
      data: { url: '/static/images/avatar.png' },
    },
  },
])
