import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const loginStubs = vi.hoisted(() => ({
  store: { login: vi.fn(), fetchUserInfo: vi.fn(), token: '', loginTime: '' },
  loginBySms: vi.fn(),
}))
vi.mock('@/stores/modules/user', () => ({
  useUserStore: () => loginStubs.store,
}))
vi.mock('@/api', () => ({ loginBySms: loginStubs.loginBySms }))
vi.mock('@/utils/router', () => ({
  consumeRedirectUrl: () => '/pages/index/index',
}))
vi.mock('vue', async importOriginal => ({
  ...(await importOriginal<typeof import('vue')>()),
  // 直接运行挂载回填，保持偏好读取行为而无需浏览器 DOM。
  onMounted: (callback: () => void) => callback(),
}))

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  uni.clearStorageSync()
  vi.stubEnv('VITE_DEBUG', 'false')
  vi.stubEnv('VITE_MOCK_ENABLED', undefined)
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

/** 用真实配置解析和 Mock 安装入口验证环境策略，不发外部网络请求。 */
async function configure(environment: string, dev: boolean, flag?: string) {
  vi.stubEnv('VITE_ENV', environment)
  vi.stubEnv('DEV', dev)
  vi.stubEnv('VITE_MOCK_ENABLED', flag)
  const { default: config } = await import('@/config/env')
  return config
}

describe('演示与真实后端联调隔离', () => {
  it.each([
    { environment: 'development', dev: true, flag: undefined, enabled: true },
    { environment: 'development', dev: true, flag: 'false', enabled: false },
    { environment: 'test', dev: true, flag: undefined, enabled: false },
    { environment: 'staging', dev: true, flag: undefined, enabled: false },
    { environment: 'test', dev: true, flag: 'false', enabled: false },
    { environment: 'staging', dev: true, flag: 'false', enabled: false },
    { environment: 'test', dev: true, flag: 'true', enabled: true },
    { environment: 'production', dev: true, flag: 'true', enabled: false },
    { environment: 'development', dev: false, flag: 'true', enabled: false },
    { environment: 'test', dev: false, flag: 'true', enabled: false },
    { environment: 'staging', dev: false, flag: 'true', enabled: false },
    { environment: 'production', dev: false, flag: 'true', enabled: false },
  ])('$environment / DEV=$dev / flag=$flag → Mock=$enabled', async scenario => {
    const config = await configure(
      scenario.environment,
      scenario.dev,
      scenario.flag
    )
    const interceptor = vi.spyOn(uni, 'addInterceptor')
    const { request } = uni
    const { setupMock } = await import('@/mock')
    setupMock()
    expect(config.MOCK_ENABLED).toBe(scenario.enabled)
    expect(interceptor).toHaveBeenCalledTimes(scenario.enabled ? 1 : 0)
    expect(uni.request).toBe(request)
    if (scenario.enabled) expect(interceptor.mock.calls[0][0]).toBe('request')
  })

  it.each([true, false])(
    '演示开关=%s 时登录预填和短信发送反馈与真实能力一致',
    async enabled => {
      await configure('development', true, String(enabled))
      const toast = vi.spyOn(uni, 'showToast')
      const { useLoginData, useSmsLogin } = await import('@/pages/login/data')
      const account = useLoginData()
      expect(account.form).toMatchObject({
        username: enabled ? 'CHENY' : '',
        password: enabled ? '123456' : '',
      })
      const sms = useSmsLogin()
      sms.phoneForm.phone = '13800138000'
      sms.sendSmsCode()
      expect(sms.smsCountdown.value).toBe(enabled ? 60 : 0)
      expect(toast).toHaveBeenLastCalledWith(
        expect.objectContaining({
          title: enabled
            ? '验证码已发送（演示）'
            : '短信服务尚未接入，请使用账号登录',
        })
      )
      expect(loginStubs.loginBySms).not.toHaveBeenCalled()
    }
  )

  it('真实联调仍回填本机记住的用户名，但不填演示密码', async () => {
    await configure('test', true, 'false')
    uni.setStorageSync('remembered_username', 'real_operator')
    const { useLoginData } = await import('@/pages/login/data')
    const page = useLoginData()
    expect(page.form).toMatchObject({ username: 'real_operator', password: '' })
    expect(page.rememberLogin.value).toEqual(['remember'])
  })
})
