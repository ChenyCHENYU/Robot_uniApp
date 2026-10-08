import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userMocks } from '@/mock/modules/user'
import { setupMock } from '@/mock'
import type { UserInfo } from '@/types/store'
import config from '@/config/env'

const initialMockEnabled = config.MOCK_ENABLED

/** 通过真实开发 Mock 登录，获得携带明确账号的演示令牌。 */
function signIn(username: string, password: string): string {
  const result = userMocks['POST /auth/login']({ data: { username, password } })
  expect(result.code).toBe(0)
  return result.data.token
}

/** 保留请求头上的身份，模拟刷新或多个在途请求。 */
function fetchProfile(token: string): UserInfo {
  const result = userMocks['GET /user/info']({
    header: { Authorization: `Bearer ${token}` },
  })
  expect(result.code).toBe(0)
  return result.data
}

beforeEach(() => {
  uni.clearStorageSync()
})

afterEach(() => {
  config.MOCK_ENABLED = initialMockEnabled
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('开发 Mock 账号隔离', () => {
  it('admin 与 CHENY 登录各自返回自己的资料，在途请求不会借用当前账号', () => {
    const admin = signIn('admin', 'admin123')
    const cheny = signIn('CHENY', '123456')
    expect(admin).not.toBe(cheny)
    expect(fetchProfile(cheny)).toMatchObject({
      username: 'CHENY',
      nickname: 'CHENY',
    })
    expect(fetchProfile(admin)).toMatchObject({
      username: 'admin',
      nickname: '管理员',
    })
    expect(fetchProfile(cheny).id).not.toBe(fetchProfile(admin).id)
  })

  it('页面重载后原演示令牌仍还原 CHENY，不重新生成默认 admin', async () => {
    const token = signIn('CHENY', '123456')
    vi.resetModules()
    const freshModule = await import('@/mock/modules/user')
    const response = freshModule.userMocks['GET /user/info']({
      header: { Authorization: `Bearer ${token}` },
    })
    expect(response.code).toBe(0)
    expect(response.data.username).toBe('CHENY')
    expect(response.data.nickname).toBe('CHENY')
  })

  it('昵称和头像修改只持久化到当前账号，刷新后保留，admin 不受影响', async () => {
    const token = signIn('CHENY', '123456')
    const admin = signIn('admin', 'admin123')
    const updated = userMocks['PUT /user/info']({
      header: { Authorization: `Bearer ${token}` },
      data: { nickname: '陈宇', avatar: '/static/images/custom.png' },
    })
    expect(updated.code).toBe(0)
    expect(fetchProfile(admin).nickname).toBe('管理员')

    vi.resetModules()
    const { userMocks: reloaded } = await import('@/mock/modules/user')
    const restored = reloaded['GET /user/info']({
      header: { Authorization: `Bearer ${token}` },
    })
    expect(restored.data).toMatchObject({
      username: 'CHENY',
      nickname: '陈宇',
      avatar: '/static/images/custom.png',
    })
  })

  it('个人资料输入及损坏缓存不能篡改账号、ID 或角色', () => {
    const token = signIn('CHENY', '123456')
    uni.setStorageSync('robot_mock_user_profiles', {
      CHENY: {
        username: 'admin',
        id: 'other',
        roles: ['other'],
        nickname: '陈宇',
      },
    })
    const result = userMocks['PUT /user/info']({
      header: { Authorization: `Bearer ${token}` },
      data: { username: 'admin', id: 'other', roles: [], nickname: '本人昵称' },
    })
    expect(result.data).toMatchObject({
      username: 'CHENY',
      id: 'u_002',
      roles: ['admin'],
      nickname: '本人昵称',
    })
    expect(fetchProfile(token).username).toBe('CHENY')
  })

  it('明确的旧演示令牌兼容 CHENY，未知令牌要求重新登录', () => {
    expect(fetchProfile('mock_token_previous').username).toBe('CHENY')
    expect(
      userMocks['GET /user/info']({
        header: { Authorization: 'Bearer unknown_token' },
      }).code
    ).toBe(401)
    expect(userMocks['GET /user/info']({}).code).toBe(401)
  })

  it('开发拦截器把请求自身的 Authorization 传到用户 Mock', async () => {
    vi.stubEnv('DEV', true)
    config.MOCK_ENABLED = true
    vi.useFakeTimers()
    const addInterceptor = vi.spyOn(uni, 'addInterceptor')
    const success = vi.fn()
    const token = signIn('CHENY', '123456')
    setupMock()
    const interceptor = addInterceptor.mock.calls[0][1] as {
      invoke: (options: UniApp.RequestOptions) => Promise<unknown>
    }
    const request = interceptor.invoke({
      url: '/api/user/info',
      method: 'GET',
      header: { Authorization: `Bearer ${token}` },
      success,
    })
    await vi.runAllTimersAsync()
    await request
    expect(success).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          code: 0,
          data: expect.objectContaining({ username: 'CHENY' }),
        }),
      })
    )
  })
})
