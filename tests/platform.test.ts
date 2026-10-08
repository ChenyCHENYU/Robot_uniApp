import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PlatformError, normalizeUniError } from '@/platform/types'
import { detectPlatformEnvironment } from '@/platform/environment'

const uniMock = {
  getSystemInfoSync: vi.fn(() => ({ uniPlatform: 'app', platform: 'android' })),
  scanCode: vi.fn(),
  getLocation: vi.fn(),
  chooseImage: vi.fn(),
}

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  vi.stubGlobal('uni', uniMock)
  uniMock.getSystemInfoSync.mockReturnValue({
    uniPlatform: 'app',
    platform: 'android',
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('运行端和宿主识别', () => {
  it('H5 钉钉/企业微信只识别宿主，不声称具有 SDK 能力', async () => {
    expect(
      detectPlatformEnvironment({ uniPlatform: 'web' }, 'DingTalk/7.0').host
    ).toBe('dingtalk')
    expect(
      detectPlatformEnvironment({ uniPlatform: 'web' }, 'MicroMessenger wxwork')
        .host
    ).toBe('wecom')
    uniMock.getSystemInfoSync.mockReturnValue({
      uniPlatform: 'web',
      platform: 'android',
    })
    vi.stubGlobal('navigator', { userAgent: 'DingTalk/7.0' })
    const { getPlatformCapabilityStatus, platform } = await import('@/platform')
    expect(getPlatformCapabilityStatus().scanCode).toBe(false)
    await expect(platform.scanCode()).rejects.toMatchObject({
      code: 'capability_unsupported',
    })
    expect(uniMock.scanCode).not.toHaveBeenCalled()
  })

  it('小程序/原生优先，不能凭 Android 系统把设备判断为 PDA', () => {
    expect(
      detectPlatformEnvironment({ uniPlatform: 'mp-weixin' }, 'DingTalk')
        .runtime
    ).toBe('mp-weixin')
    expect(
      detectPlatformEnvironment({ uniPlatform: 'app', platform: 'android' })
        .host
    ).toBe('native')
    expect(
      detectPlatformEnvironment({ uniPlatform: 'mp-alipay' }).runtime
    ).toBe('mini-program')
    expect(detectPlatformEnvironment({ platform: 'android' }).host).toBe(
      'unknown'
    )
  })
})

describe('宿主能力注册和就绪', () => {
  it('只覆盖扫描、同时保留定位；并发扫码只初始化一次', async () => {
    const { registerPlatformAdapter, platform, getPlatformCapabilityStatus } =
      await import('@/platform')
    let ready!: () => void
    const initialize = vi.fn(
      () =>
        new Promise<void>(resolve => {
          ready = resolve
        })
    )
    const scanner = vi.fn(async () => ({ result: 'PDA-001' }))
    registerPlatformAdapter({
      provider: 'pda-scanner',
      capabilities: { scanCode: scanner },
      ready: initialize,
    })
    const first = platform.scanCode()
    const second = platform.scanCode()
    await Promise.resolve()
    expect(initialize).toHaveBeenCalledTimes(1)
    expect(getPlatformCapabilityStatus().readiness).toBe('pending')
    expect(scanner).not.toHaveBeenCalled()
    ready()
    expect(await first).toEqual({ result: 'PDA-001' })
    expect(await second).toEqual({ result: 'PDA-001' })
    expect(getPlatformCapabilityStatus().readiness).toBe('ready')
    uniMock.getLocation.mockImplementation(options =>
      options.success({ latitude: 31, longitude: 121, accuracy: 10 })
    )
    expect((await platform.getLocation()).coordinateSystem).toBe('gcj02')
    expect(uniMock.getLocation).toHaveBeenCalledOnce()
  })

  it('宿主未声明相册扫描时不尝试调用，显式声明后允许相册', async () => {
    const { registerPlatformAdapter, platform, getPlatformCapabilityStatus } =
      await import('@/platform')
    const scanner = vi.fn(async () => ({ result: 'QR-001' }))
    const dispose = registerPlatformAdapter({
      provider: 'pda',
      capabilities: { scanCode: scanner },
    })
    expect(getPlatformCapabilityStatus().scanFromAlbum).toBe(false)
    await expect(platform.scanCode('album')).rejects.toMatchObject({
      code: 'capability_unsupported',
    })
    expect(scanner).not.toHaveBeenCalled()
    dispose()
    registerPlatformAdapter({
      provider: 'camera',
      capabilities: { scanCode: scanner },
      capabilitiesSupport: { scanFromAlbum: true },
    })
    await expect(platform.scanCode('album')).resolves.toEqual({
      result: 'QR-001',
    })
    expect(scanner).toHaveBeenCalledWith('album')
  })

  it('就绪失败保留统一错误，不继续调用或重复初始化', async () => {
    const { registerPlatformAdapter, platform, getPlatformCapabilityStatus } =
      await import('@/platform')
    const scanner = vi.fn(async () => ({ result: 'unexpected' }))
    const ready = vi.fn(async () => {
      throw { errorMessage: '宿主鉴权失败' }
    })
    registerPlatformAdapter({
      provider: 'host',
      capabilities: { scanCode: scanner },
      ready,
    })
    await expect(platform.scanCode()).rejects.toMatchObject({
      code: 'platform_error',
      message: '宿主鉴权失败',
    })
    await expect(platform.scanCode()).rejects.toMatchObject({
      code: 'platform_error',
    })
    expect(getPlatformCapabilityStatus().readiness).toBe('failed')
    expect(ready).toHaveBeenCalledOnce()
    expect(scanner).not.toHaveBeenCalled()
  })

  it('宿主没有回调时初始化会超时，迟到的完成不会改为就绪', async () => {
    vi.useFakeTimers()
    const { registerPlatformAdapter, platform, getPlatformCapabilityStatus } =
      await import('@/platform')
    let ready!: () => void
    const scanner = vi.fn(async () => ({ result: 'unexpected' }))
    registerPlatformAdapter({
      provider: 'host',
      capabilities: { scanCode: scanner },
      ready: () =>
        new Promise<void>(resolve => {
          ready = resolve
        }),
      readyTimeoutMs: 100,
    })
    const outcome = expect(platform.scanCode()).rejects.toMatchObject({
      code: 'bridge_timeout',
    })
    await vi.advanceTimersByTimeAsync(100)
    await outcome
    ready()
    await Promise.resolve()
    expect(getPlatformCapabilityStatus().readiness).toBe('failed')
    expect(scanner).not.toHaveBeenCalled()
  })

  it('旧实例撤销不影响新注入，重复撤销安全，移除新实例恢复内置', async () => {
    const { registerPlatformAdapter, platform, getPlatformCapabilityStatus } =
      await import('@/platform')
    const first = registerPlatformAdapter({
      provider: 'first',
      capabilities: { scanCode: async () => ({ result: 'first' }) },
    })
    const second = registerPlatformAdapter({
      provider: 'second',
      capabilities: { scanCode: async () => ({ result: 'second' }) },
    })
    first()
    first()
    expect(getPlatformCapabilityStatus().provider).toBe('second')
    await expect(platform.scanCode()).resolves.toEqual({ result: 'second' })
    second()
    expect(getPlatformCapabilityStatus().provider).toBe('uni')
  })

  it('撤销早期部分覆盖后，后来的其他能力不继续引用旧方法', async () => {
    const { registerPlatformAdapter, platform } = await import('@/platform')
    const scanner = vi.fn(async () => ({ result: 'old' }))
    const dispose = registerPlatformAdapter({
      provider: 'first',
      capabilities: { scanCode: scanner },
    })
    registerPlatformAdapter({
      provider: 'second',
      capabilities: { takePhoto: async () => ({ tempFilePath: '/new.jpg' }) },
    })
    dispose()
    uniMock.scanCode.mockImplementation(options =>
      options.success({ result: 'builtin' })
    )
    await expect(platform.scanCode()).resolves.toMatchObject({
      result: 'builtin',
    })
    expect(scanner).not.toHaveBeenCalled()
    await expect(platform.takePhoto()).resolves.toEqual({
      tempFilePath: '/new.jpg',
    })
  })

  it('等待中的调用固定其宿主，后续新调用使用新注册', async () => {
    const { registerPlatformAdapter, platform } = await import('@/platform')
    let ready!: () => void
    registerPlatformAdapter({
      provider: 'first',
      capabilities: { scanCode: async () => ({ result: 'first' }) },
      ready: () =>
        new Promise<void>(resolve => {
          ready = resolve
        }),
    })
    const pending = platform.scanCode()
    await Promise.resolve()
    registerPlatformAdapter({
      provider: 'second',
      capabilities: { scanCode: async () => ({ result: 'second' }) },
    })
    ready()
    await expect(pending).resolves.toEqual({ result: 'first' })
    await expect(platform.scanCode()).resolves.toEqual({ result: 'second' })
  })

  it('兼容旧 set 接口且统一入口保留错误归一化', async () => {
    const { setPlatformCapabilities, platform, getPlatformCapabilities } =
      await import('@/platform')
    setPlatformCapabilities({
      scanCode: async () => {
        throw { errorMessage: 'User cancelled' }
      },
      getLocation: async () => ({
        latitude: 31,
        longitude: 121,
        coordinateSystem: 'gcj02',
      }),
      takePhoto: async () => ({ tempFilePath: '/image.jpg' }),
    })
    expect(getPlatformCapabilities()).toBe(platform)
    await expect(platform.scanCode('album')).rejects.toMatchObject({
      code: 'user_cancel',
    })
  })
})

describe('内置能力结果与错误', () => {
  it('浏览器定位标记 WGS84，原生请求 GCJ02 且不执行坐标转换', async () => {
    const { platform } = await import('@/platform')
    uniMock.getLocation.mockImplementation(options =>
      options.success({ latitude: 31.123, longitude: 121.456, accuracy: 12 })
    )
    await expect(platform.getLocation()).resolves.toMatchObject({
      latitude: 31.123,
      longitude: 121.456,
      coordinateSystem: 'gcj02',
    })
    expect(uniMock.getLocation.mock.calls[0][0].type).toBe('gcj02')
    uniMock.getSystemInfoSync.mockReturnValue({
      uniPlatform: 'web',
      platform: 'ios',
    })
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: (success: (position: unknown) => void) =>
          success({
            coords: { latitude: 31.123, longitude: 121.456, accuracy: 8 },
          }),
      },
    })
    await expect(platform.getLocation()).resolves.toMatchObject({
      latitude: 31.123,
      longitude: 121.456,
      coordinateSystem: 'wgs84',
    })
  })

  it('返回空图片时拒绝，避免向上传流程传入 undefined 路径', async () => {
    const { platform } = await import('@/platform')
    uniMock.chooseImage.mockImplementation(options =>
      options.success({ tempFilePaths: [], tempFiles: [] })
    )
    await expect(platform.takePhoto()).rejects.toMatchObject({
      code: 'platform_error',
      message: '未获取到有效图片',
    })
  })

  it.each([
    [{ errMsg: 'scanCode:fail auth deny' }, 'permission_denied'],
    [{ errorMessage: 'User Cancelled permission dialog' }, 'user_cancel'],
    [{ message: 'not supported' }, 'capability_unsupported'],
    [new Error('相机权限被拒绝'), 'permission_denied'],
    ['用户取消', 'user_cancel'],
    [{ errorCode: 'unsupported_api' }, 'capability_unsupported'],
    [undefined, 'platform_error'],
  ])('统一识别错误 %#', (error, code) => {
    expect(normalizeUniError(error, '能力调用失败').code).toBe(code)
  })

  it('保留现有 PlatformError 实例和超时语义', () => {
    const error = new PlatformError('bridge_timeout', '初始化超时')
    expect(normalizeUniError(error, '能力调用失败')).toBe(error)
  })
})
