// stores/modules/app.js
import { defineStore } from 'pinia'
import { logger } from '@/utils/logger'

const networkMonitorCleanups = new WeakMap<object, () => void>()

/** H5 使用浏览器连接标记校正 SDK；原生保留 Uni 事件的连接语义。 */
function resolveNetworkConnection(isConnected: boolean): boolean {
  // #ifdef H5
  if (
    typeof navigator !== 'undefined' &&
    typeof navigator.onLine === 'boolean'
  ) {
    return navigator.onLine
  }
  // #endif
  return isConnected
}

export const useAppStore = defineStore('app', {
  state: () => ({
    systemInfo: null as UniApp.GetSystemInfoResult | null,
    networkType: 'unknown' as string,
    networkConnected: null as boolean | null,
    networkVersion: 0,
    statusBarHeight: 0,
    globalLoading: false,
  }),

  getters: {
    isDev: () => process.env.NODE_ENV === 'development',
    safeArea: state => {
      if (!state.systemInfo) return { top: 0, bottom: 0 }
      const { safeAreaInsets } = state.systemInfo
      return {
        top: safeAreaInsets?.top || state.statusBarHeight,
        bottom: safeAreaInsets?.bottom || 0,
      }
    },
  },

  actions: {
    /**
     *
     */
    async initSystemInfo() {
      try {
        const systemInfo = uni.getSystemInfoSync()
        this.systemInfo = systemInfo
        this.statusBarHeight = systemInfo.statusBarHeight || 0
        this.getNetworkType()
      } catch (error) {
        logger.error('获取系统信息失败:', error)
      }
    },

    /** 初次读取不弹提示；H5 SDK 可能在断网时仍报告 4G。 */
    getNetworkType() {
      const version = ++this.networkVersion
      uni.getNetworkType({
        success: res => {
          if (version !== this.networkVersion) return
          this.applyNetworkStatus(
            res.networkType,
            res.networkType !== 'none',
            false
          )
        },
      })
    },

    /** 统一设备连接状态，只在已知的连接/断开状态切换时提示。 */
    applyNetworkStatus(
      networkType: string,
      isConnected: boolean,
      notify = true
    ) {
      const connected = resolveNetworkConnection(isConnected)
      const previousConnected = this.networkConnected
      this.networkConnected = connected
      this.networkType = connected
        ? networkType === 'none'
          ? 'unknown'
          : networkType
        : 'none'
      if (
        !notify ||
        previousConnected === null ||
        previousConnected === connected
      )
        return
      uni.showToast({
        title: connected ? '网络已恢复' : '网络已断开，请检查网络连接',
        icon: connected ? 'success' : 'none',
      })
    },

    /** 应用级监听：Uni 制式事件与 H5 联网事件共同进入同一去重入口。 */
    startNetworkMonitoring() {
      if (networkMonitorCleanups.has(this)) return
      const listener = ({
        isConnected,
        networkType,
      }: UniApp.OnNetworkStatusChangeSuccess) => {
        this.networkVersion += 1
        this.applyNetworkStatus(networkType, isConnected)
      }
      uni.onNetworkStatusChange(listener)
      const cleanups = [() => uni.offNetworkStatusChange(listener)]
      // #ifdef H5
      if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
        const handleOffline = () => {
          this.networkVersion += 1
          this.applyNetworkStatus('none', false)
        }
        const handleOnline = () => {
          this.networkVersion += 1
          this.applyNetworkStatus(this.networkType, true)
          this.getNetworkType()
        }
        window.addEventListener('offline', handleOffline)
        window.addEventListener('online', handleOnline)
        this.applyNetworkStatus(this.networkType, navigator.onLine, false)
        cleanups.push(() => {
          window.removeEventListener('offline', handleOffline)
          window.removeEventListener('online', handleOnline)
        })
      }
      // #endif
      networkMonitorCleanups.set(this, () =>
        cleanups.forEach(cleanup => cleanup())
      )
    },

    /** 应用卸载或热更新时取消监听，重复调用不遗留回调。 */
    stopNetworkMonitoring() {
      this.networkVersion += 1
      networkMonitorCleanups.get(this)?.()
      networkMonitorCleanups.delete(this)
    },

    /**
     *
     */
    setGlobalLoading(loading, text = '加载中...') {
      this.globalLoading = loading
      if (loading) {
        uni.showLoading({ title: text })
      } else {
        uni.hideLoading()
      }
    },
  },
})
