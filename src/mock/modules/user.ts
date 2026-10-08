import { success, fail, randomId, type MockResponse } from '../helpers'

import type { UserInfo } from '@/types/store'

interface MockUserRequest {
  data?: Record<string, unknown>
  header?: Record<string, unknown>
}

type ProfilePatch = Pick<UserInfo, 'nickname' | 'avatar' | 'phone' | 'email'>
const PROFILE_STORAGE_KEY = 'robot_mock_user_profiles'

/** 演示身份按真实输入的账号区分，角色与昵称各自独立。 */
const demoAccounts: Record<string, UserInfo> = {
  admin: {
    id: 'u_001',
    username: 'admin',
    nickname: '管理员',
    avatar: '/static/images/default-avatar.png',
    phone: '138****8888',
    email: 'admin@robot.com',
    roles: ['admin'],
    permissions: ['user:view', 'user:edit', 'user:delete', 'robot:control'],
  },
  CHENY: {
    id: 'u_002',
    username: 'CHENY',
    nickname: 'CHENY',
    avatar: '/static/images/default-avatar.png',
    roles: ['admin'],
    permissions: ['user:view', 'user:edit', 'user:delete', 'robot:control'],
  },
}

/** 从本地演示存储读取账号资料，不把一个账号的修改共享给另一个账号。 */
function readProfiles(): Record<string, Partial<ProfilePatch>> {
  const stored = uni.getStorageSync(PROFILE_STORAGE_KEY)
  return stored && typeof stored === 'object' && !Array.isArray(stored)
    ? stored
    : {}
}

/** 模拟令牌携带账号键，页面重载后仍可解析；仅用于开发 Mock。 */
function createToken(account: string): string {
  return `mock_user.${encodeURIComponent(account)}.${randomId()}`
}

/** 使用请求实际携带的令牌，不从当前全局账号反推已在途请求的身份。 */
function readAccount(options: MockUserRequest): string {
  const authorization =
    options.header?.Authorization || options.header?.authorization || ''
  const token = String(authorization).replace(/^Bearer\s+/i, '')
  if (token.startsWith('mock_token_')) return 'CHENY'
  const match = token.match(/^mock_user\.([^.]*)\./)
  if (!match) return ''
  try {
    return decodeURIComponent(match[1])
  } catch {
    return ''
  }
}

/** 还原明确的演示账户或短信手机号，资料修改不能覆盖账户与权限。 */
function getAccountProfile(account: string): UserInfo | null {
  const base = demoAccounts[account]
  const savedPatch = readProfilePatch(readProfiles()[account])
  if (base) return { ...base, ...savedPatch }
  if (!/^phone:1\d{10}$/.test(account)) return null
  const phone = account.slice(6)
  return {
    id: account,
    username: phone,
    nickname: phone,
    avatar: '/static/images/default-avatar.png',
    phone,
    roles: ['user'],
    permissions: [],
    ...savedPatch,
  }
}

/** 只接受可编辑资料，账号、ID 与权限不随个人设置修改。 */
function readProfilePatch(
  data: Record<string, unknown> = {}
): Partial<ProfilePatch> {
  const patch: Partial<ProfilePatch> = {}
  const keys: (keyof ProfilePatch)[] = ['nickname', 'avatar', 'phone', 'email']
  keys.forEach(key => {
    if (typeof data[key] === 'string') patch[key] = data[key]
  })
  return patch
}

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
export const userMocks: Record<
  string,
  (options: MockUserRequest) => MockResponse
> = {
  'POST /auth/login': options => {
    const { username, password } = options.data || {}
    const ok =
      (username === 'admin' && password === 'admin123') ||
      (username === 'CHENY' && password === '123456')
    if (ok) {
      return success({ token: createToken(String(username)) })
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
    if (
      /^1\d{10}$/.test(String(phone || '')) &&
      /^\d{4,6}$/.test(String(code || ''))
    ) {
      return success({ token: createToken(`phone:${phone}`) })
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

  'GET /user/info': options => {
    const user = getAccountProfile(readAccount(options))
    return user ? success(user) : fail('登录身份已更新，请重新登录', 401)
  },

  'PUT /user/info': options => {
    const account = readAccount(options)
    const user = getAccountProfile(account)
    if (!user) return fail('请重新登录后修改资料', 401)
    const profiles = readProfiles()
    const patch = readProfilePatch(options.data)
    uni.setStorageSync(PROFILE_STORAGE_KEY, {
      ...profiles,
      [account]: { ...profiles[account], ...patch },
    })
    return success({ ...user, ...patch }, '更新成功')
  },

  'GET /user/list': options => {
    const { page = 1, pageSize = 10 } = options.data || {}
    return success(generateUserList(Number(page), Number(pageSize)))
  },

  'POST /user/avatar': () =>
    success({ url: `/static/images/avatar_${randomId()}.png` }, '上传成功'),
}
