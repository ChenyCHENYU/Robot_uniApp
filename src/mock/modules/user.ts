import { success, fail, randomId, type MockResponse } from '../helpers'

/** 模拟用户数据 */
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

const mockToken = `mock_token_${randomId()}`

/** 模拟用户列表 */
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

/** 用户模块 Mock 路由 */
export const userMocks: Record<string, (options: any) => MockResponse> = {
  'POST /auth/login': options => {
    const { username, password } = options.data || {}
    if (username === 'admin' && password === 'admin123') {
      return success({ token: mockToken })
    }
    return fail('用户名或密码错误')
  },

  // 注册（演示：用户名不重复即可通过）
  'POST /auth/register': options => {
    const { username, password } = options.data || {}
    if (!username || String(username).length < 3) {
      return fail('用户名至少 3 位')
    }
    if (!password || String(password).length < 6) {
      return fail('密码至少 6 位')
    }
    return success(null, '注册成功')
  },

  // 短信验证码登录（演示：任意合法手机号 + 4-6 位验证码通过）
  'POST /auth/sms-login': options => {
    const { phone, code } = options.data || {}
    if (/^1\d{10}$/.test(phone || '') && /^\d{4,6}$/.test(code || '')) {
      return success({ token: mockToken })
    }
    return fail('验证码错误或已过期')
  },

  'POST /auth/logout': () => success(null, '退出成功'),

  // 修改密码（演示：旧密码非空 + 新密码 >= 6 位即通过）
  'POST /user/password': options => {
    const { oldPassword, newPassword } = options.data || {}
    if (!oldPassword) return fail('请输入原密码')
    if (!newPassword || String(newPassword).length < 6) {
      return fail('新密码长度不能少于 6 位')
    }
    return success(null, '密码修改成功')
  },

  'GET /user/info': () => success(mockUser),

  'PUT /user/info': options => {
    Object.assign(mockUser, options.data)
    return success(mockUser, '更新成功')
  },

  'GET /user/list': options => {
    const { page = 1, pageSize = 10 } = options.data || {}
    return success(generateUserList(Number(page), Number(pageSize)))
  },

  'POST /user/avatar': () =>
    success({ url: `/static/images/avatar_${randomId()}.png` }, '上传成功'),
}
