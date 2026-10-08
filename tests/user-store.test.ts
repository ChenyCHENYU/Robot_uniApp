import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createApp } from 'vue'
import { createPersistedState } from 'pinia-plugin-persistedstate'

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

const chenyInfo = {
  ...userInfoFixture,
  id: 2,
  username: 'CHENY',
  nickname: 'CHENY',
}

/** 控制旧请求完成时机，复现切换账号期间的身份覆盖。 */
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

/** 安装与应用一致的持久化插件，覆盖真实 afterRestore 生命周期。 */
function restorePersistedStore() {
  const pinia = createPinia()
  pinia.use(
    createPersistedState({
      storage: {
        getItem: key => uni.getStorageSync(key) || null,
        setItem: (key, value) => uni.setStorageSync(key, value),
      },
    })
  )
  createApp({}).use(pinia)
  setActivePinia(pinia)
  return useUserStore()
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

  afterEach(() => {
    vi.unstubAllEnvs()
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

  it('切换到 CHENY 时立即清除旧管理员身份，资料失败仍显示当前登录账号', async () => {
    const store = useUserStore()
    store.$patch({
      token: 'old_admin_token',
      userInfo: userInfoFixture,
      roles: ['admin'],
      permissions: ['user:read'],
    })
    mockedGetUserInfo.mockRejectedValueOnce(new Error('offline'))

    await store.login({ username: 'CHENY', password: '123456' })

    expect(store.nickname).toBe('CHENY')
    expect(store.loginAccount).toBe('CHENY')
    expect(store.userInfo).toBeNull()
    expect(store.roles).toEqual([])
    expect(store.permissions).toEqual([])
    expect(store.token).toBe('tok_123')
  })

  it('真实昵称优先，空昵称回退账号，不用角色名称替代身份', () => {
    const store = useUserStore()
    store.$patch({ userInfo: { ...chenyInfo, nickname: ' 陈宇 ' } })
    expect(store.nickname).toBe('陈宇')
    store.$patch({ userInfo: { ...chenyInfo, nickname: '   ' } })
    expect(store.nickname).toBe('CHENY')
    store.$patch({ userInfo: null, loginAccount: 'CHENY' })
    expect(store.nickname).toBe('CHENY')
  })

  it('旧用户信息请求晚于 CHENY 登录返回时不覆盖当前身份与权限', async () => {
    const oldInfo = deferred<typeof userInfoFixture>()
    mockedGetUserInfo
      .mockReturnValueOnce(oldInfo.promise)
      .mockResolvedValueOnce(chenyInfo)
    const store = useUserStore()
    store.token = 'old_admin_token'
    const oldRequest = store.fetchUserInfo()
    const outdated = expect(oldRequest).rejects.toThrow('用户会话已更新')
    await store.login({ username: 'CHENY', password: '123456' })

    oldInfo.resolve({ ...userInfoFixture, permissions: ['old:write'] })
    await outdated

    expect(store.userInfo?.username).toBe('CHENY')
    expect(store.nickname).toBe('CHENY')
    expect(store.permissions).not.toContain('old:write')
  })

  it('旧登录失败不会清掉后发请求已建立的 CHENY 会话', async () => {
    const oldLogin = deferred<{ token: string }>()
    mockedLogin
      .mockReturnValueOnce(oldLogin.promise)
      .mockResolvedValueOnce({ token: 'cheny_token' })
    mockedGetUserInfo.mockResolvedValueOnce(chenyInfo)
    const store = useUserStore()
    const pending = store.login({ username: 'admin', password: 'admin123' })
    const rejected = expect(pending).rejects.toThrow('old login failed')
    await store.login({ username: 'CHENY', password: '123456' })
    oldLogin.reject(new Error('old login failed'))
    await rejected

    expect(store.token).toBe('cheny_token')
    expect(store.nickname).toBe('CHENY')
    expect(store.isLoggedIn).toBe(true)
  })

  it.each(['success', 'failure'])(
    '旧退出请求 %s 晚于新登录完成时不清除 CHENY 会话或跳登录页',
    async outcome => {
      const oldLogout = deferred<null>()
      const reLaunch = vi.spyOn(uni, 'reLaunch')
      mockedLogout.mockReturnValueOnce(oldLogout.promise)
      const store = useUserStore()
      await store.login({ username: 'admin', password: 'admin123' })
      const pending = store.logout()
      mockedLogin.mockResolvedValueOnce({ token: 'cheny_token' })
      mockedGetUserInfo.mockResolvedValueOnce(chenyInfo)
      await store.login({ username: 'CHENY', password: '123456' })

      if (outcome === 'success') oldLogout.resolve(null)
      else oldLogout.reject(new Error('old logout cancelled'))
      await pending

      expect(store.token).toBe('cheny_token')
      expect(store.nickname).toBe('CHENY')
      expect(store.isLoggedIn).toBe(true)
      expect(reLaunch).not.toHaveBeenCalled()
    }
  )

  it('开发环境恢复旧共享 mock_token 时立即迁移到明确的 CHENY 演示账号', async () => {
    vi.stubEnv('DEV', true)
    uni.setStorageSync(
      'user-store',
      JSON.stringify({
        token: 'mock_token_previous',
        userInfo: userInfoFixture,
        permissions: ['old:write'],
        roles: ['admin'],
      })
    )
    const store = restorePersistedStore()

    expect(store.token).toBe('mock_user.CHENY.legacy')
    expect(store.nickname).toBe('CHENY')
    expect(store.userInfo).toBeNull()
    expect(store.permissions).toEqual([])
    expect(store.roles).toEqual([])
    mockedGetUserInfo.mockResolvedValueOnce(chenyInfo)
    await store.fetchUserInfo()
    expect(store.userInfo?.username).toBe('CHENY')
  })

  it('生产环境不迁移令牌，也不覆盖后端真实昵称', () => {
    vi.stubEnv('DEV', false)
    uni.setStorageSync(
      'user-store',
      JSON.stringify({
        token: 'mock_token_backend_owned',
        userInfo: { ...chenyInfo, nickname: '真实昵称' },
      })
    )
    const store = restorePersistedStore()
    expect(store.token).toBe('mock_token_backend_owned')
    expect(store.nickname).toBe('真实昵称')
    expect(store.userInfo?.username).toBe('CHENY')
  })

  it('资料暂缺时已登录账号仍能经持久化恢复，临时身份版本不落盘', () => {
    const store = restorePersistedStore()
    store.$patch({ token: 'cheny_token', loginAccount: 'CHENY' })
    store.$persist()
    const saved = JSON.parse(uni.getStorageSync('user-store'))
    expect(saved.loginAccount).toBe('CHENY')
    expect(saved).not.toHaveProperty('identityVersion')

    const restored = restorePersistedStore()
    expect(restored.nickname).toBe('CHENY')
    expect(restored.isLoggedIn).toBe(true)
  })
})
