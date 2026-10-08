import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/api', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  getUserInfo: vi.fn(),
}))

import { login, logout, getUserInfo } from '@/api'
import { useUserStore } from '@/stores/modules/user'

const mockedLogin = vi.mocked(login)
const mockedLogout = vi.mocked(logout)
const mockedGetUserInfo = vi.mocked(getUserInfo)

const userInfoFixture = {
  id: 1,
  username: 'admin',
  nickname: '管理员',
  avatar: '',
  permissions: ['user:read'],
  roles: ['admin'],
}

describe('user store 行为', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    uni.clearStorageSync()
    mockedLogin.mockResolvedValue({ token: 'tok_123' })
    mockedLogout.mockResolvedValue(null)
    mockedGetUserInfo.mockResolvedValue(userInfoFixture)
  })

  it('登录成功：token 落地并拉取用户信息/权限', async () => {
    const store = useUserStore()
    await store.login({ username: 'admin', password: 'admin123' })

    expect(store.token).toBe('tok_123')
    expect(store.isLoggedIn).toBe(true)
    expect(store.loginTime).toBeTruthy()
    expect(mockedGetUserInfo).toHaveBeenCalledTimes(1)
    expect(store.permissions).toEqual(['user:read'])
    expect(store.roles).toEqual(['admin'])
    expect(store.isAdmin).toBe(true)
    expect(store.hasPermission('user:read')).toBe(true)
    expect(store.hasPermission('user:write')).toBe(false)
  })

  it('登录成功但用户信息拉取失败：登录态保留（不阻断）', async () => {
    mockedGetUserInfo.mockRejectedValueOnce(new Error('net'))
    const store = useUserStore()

    await expect(
      store.login({ username: 'admin', password: 'admin123' })
    ).resolves.toBeDefined()
    expect(store.token).toBe('tok_123')
  })

  it('登录失败：登录态清空且异常上抛', async () => {
    mockedLogin.mockRejectedValueOnce({
      code: 400,
      message: '用户名或密码错误',
    })
    const store = useUserStore()

    await expect(
      store.login({ username: 'x', password: 'y' })
    ).rejects.toMatchObject({ message: '用户名或密码错误' })
    expect(store.token).toBe('')
    expect(store.isLoggedIn).toBe(false)
  })

  it('logout：先调接口再清态并跳登录页（接口失败不阻断）', async () => {
    const reLaunch = vi.spyOn(uni, 'reLaunch')
    mockedLogout.mockRejectedValueOnce(new Error('net'))
    const store = useUserStore()
    await store.login({ username: 'admin', password: 'admin123' })

    await store.logout()

    expect(mockedLogout).toHaveBeenCalledTimes(1)
    expect(store.token).toBe('')
    expect(reLaunch).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/pages/login/index' })
    )
  })

  it('fetchUserInfo：同步权限与角色到 store', async () => {
    const store = useUserStore()
    await store.fetchUserInfo()

    expect(store.userInfo?.username).toBe('admin')
    expect(store.nickname).toBe('管理员')
  })

  it('avatar getter：空头像兜底默认图', () => {
    const store = useUserStore()
    expect(store.avatar).toContain('default-avatar')
  })
})
