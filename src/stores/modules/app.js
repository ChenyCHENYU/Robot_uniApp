// stores/modules/app.js
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    systemInfo: null,
    networkType: 'unknown',
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
        console.error('获取系统信息失败:', error)
      }
    },

    /**
     *
     */
    getNetworkType() {
      uni.getNetworkType({
        success: res => {
          this.networkType = res.networkType
        },
      })
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
