import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAppStore } from '@/stores/modules/app'

let online = true
let browserEvents: EventTarget
let sdkListener: (status: UniApp.OnNetworkStatusChangeSuccess) => void

beforeEach(() => {
  setActivePinia(createPinia())
  online = true
  browserEvents = new EventTarget()
  vi.stubGlobal('window', browserEvents)
  vi.stubGlobal('navigator', {
    /** 模拟事件到达时浏览器真实的联网标记。 */
    get onLine() {
      return online
    },
  })
  vi.stubGlobal('uni', {
    ...uni,
    getNetworkType: vi.fn((options: UniApp.GetNetworkTypeOptions) => {
      options.success?.({ networkType: '4g' })
    }),
    onNetworkStatusChange: vi.fn((listener: typeof sdkListener) => {
      sdkListener = listener
    }),
    offNetworkStatusChange: vi.fn(),
    showToast: vi.fn(),
  })
})

afterEach(() => {
  useAppStore().stopNetworkMonitoring()
  vi.unstubAllGlobals()
})

describe('应用网络状态与跨平台监听', () => {
  it('H5 初次离线时不采信 SDK 的 4G 制式，也不伪造恢复提示', async () => {
    online = false
    const store = useAppStore()
    await store.initSystemInfo()
    store.startNetworkMonitoring()
    expect(store.networkType).toBe('none')
    expect(uni.showToast).not.toHaveBeenCalled()
  })

  it('H5真实断开与恢复各提示一次，SDK重复报告4G不会把离线状态改回在线', async () => {
    const store = useAppStore()
    await store.initSystemInfo()
    store.startNetworkMonitoring()
    online = false
    browserEvents.dispatchEvent(new Event('offline'))
    sdkListener({ isConnected: true, networkType: '4g' })
    browserEvents.dispatchEvent(new Event('offline'))
    expect(store.networkType).toBe('none')
    expect(uni.showToast).toHaveBeenCalledTimes(1)

    online = true
    browserEvents.dispatchEvent(new Event('online'))
    sdkListener({ isConnected: true, networkType: '4g' })
    browserEvents.dispatchEvent(new Event('online'))
    expect(store.networkType).toBe('4g')
    expect(
      vi.mocked(uni.showToast).mock.calls.map(([options]) => options?.title)
    ).toEqual(['网络已断开，请检查网络连接', '网络已恢复'])
  })

  it('保持联网时3G与4G切换只更新制式，不提示网络恢复', async () => {
    const store = useAppStore()
    await store.initSystemInfo()
    store.startNetworkMonitoring()
    sdkListener({ isConnected: true, networkType: '3g' })
    expect(store.networkType).toBe('3g')
    sdkListener({ isConnected: true, networkType: '4g' })
    expect(store.networkType).toBe('4g')
    expect(uni.showToast).not.toHaveBeenCalled()
  })

  it('初次异步网络读取迟到时不覆盖较新的制式监听状态', async () => {
    let initialRead!: NonNullable<UniApp.GetNetworkTypeOptions['success']>
    vi.mocked(uni.getNetworkType).mockImplementationOnce(options => {
      initialRead = options!.success!
    })
    const store = useAppStore()
    await store.initSystemInfo()
    store.startNetworkMonitoring()
    sdkListener({ isConnected: true, networkType: '4g' })
    initialRead({ networkType: '3g' })
    expect(store.networkType).toBe('4g')
    expect(uni.showToast).not.toHaveBeenCalled()
  })

  it('没有新网络事件时，启动静默校正不会阻止有效的初次异步制式读取', async () => {
    let initialRead!: NonNullable<UniApp.GetNetworkTypeOptions['success']>
    vi.mocked(uni.getNetworkType).mockImplementationOnce(options => {
      initialRead = options!.success!
    })
    const store = useAppStore()
    await store.initSystemInfo()
    store.startNetworkMonitoring()
    expect(store.networkType).toBe('unknown')
    initialRead({ networkType: '4g' })
    expect(store.networkType).toBe('4g')
    expect(uni.showToast).not.toHaveBeenCalled()
  })

  it('原生环境继续遵循Uni连接标记，重复事件不重复提示', async () => {
    vi.stubGlobal('window', undefined)
    vi.stubGlobal('navigator', undefined)
    const store = useAppStore()
    await store.initSystemInfo()
    store.startNetworkMonitoring()
    sdkListener({ isConnected: false, networkType: 'wifi' })
    sdkListener({ isConnected: false, networkType: 'none' })
    expect(store.networkType).toBe('none')
    sdkListener({ isConnected: true, networkType: 'wifi' })
    sdkListener({ isConnected: true, networkType: 'wifi' })
    expect(store.networkType).toBe('wifi')
    expect(uni.showToast).toHaveBeenCalledTimes(2)
  })

  it('重复启动只有一组监听，停止后浏览器事件不再修改状态', async () => {
    const store = useAppStore()
    await store.initSystemInfo()
    store.startNetworkMonitoring()
    store.startNetworkMonitoring()
    expect(uni.onNetworkStatusChange).toHaveBeenCalledTimes(1)
    store.stopNetworkMonitoring()
    store.stopNetworkMonitoring()
    expect(uni.offNetworkStatusChange).toHaveBeenCalledTimes(1)
    expect(uni.offNetworkStatusChange).toHaveBeenCalledWith(sdkListener)
    online = false
    browserEvents.dispatchEvent(new Event('offline'))
    expect(store.networkType).toBe('4g')
    expect(uni.showToast).not.toHaveBeenCalled()
  })
})
