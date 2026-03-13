// stores/modules/app.js
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    systemInfo: null,
    networkType: "unknown",
    statusBarHeight: 0,
    globalLoading: false,
    themeMode: "light", // light | dark | auto
    theme: {
      primary: "#007AFF",
      success: "#4CD964",
      warning: "#F0AD4E",
      error: "#DD524D",
    },
  }),

  getters: {
    isDev: () => process.env.NODE_ENV === "development",
    safeArea: (state) => {
      if (!state.systemInfo) return { top: 0, bottom: 0 };
      const { safeAreaInsets } = state.systemInfo;
      return {
        top: safeAreaInsets?.top || state.statusBarHeight,
        bottom: safeAreaInsets?.bottom || 0,
      };
    },
  },

  actions: {
    async initSystemInfo() {
      try {
        const systemInfo = uni.getSystemInfoSync();
        this.systemInfo = systemInfo;
        this.statusBarHeight = systemInfo.statusBarHeight || 0;
        this.getNetworkType();
      } catch (error) {
        console.error("获取系统信息失败:", error);
      }
    },

    getNetworkType() {
      uni.getNetworkType({
        success: (res) => {
          this.networkType = res.networkType;
        },
      });
    },

    setGlobalLoading(loading, text = "加载中...") {
      this.globalLoading = loading;
      if (loading) {
        uni.showLoading({ title: text });
      } else {
        uni.hideLoading();
      }
    },

    /**
     * 设置主题模式并应用到 DOM
     * @param {'light'|'dark'|'auto'} mode
     */
    setThemeMode(mode) {
      this.themeMode = mode;
      // #ifdef H5
      const html = document.documentElement;
      html.classList.remove("dark", "light");
      if (mode === "dark") {
        html.classList.add("dark");
      } else if (mode === "light") {
        html.classList.add("light");
      }
      // auto 模式不添加任何类，交由 @media (prefers-color-scheme) 处理
      // #endif

      // #ifdef MP-WEIXIN || APP-PLUS
      // 小程序和 App 端通过 page 类名控制（需在页面 onShow 中同步）
      // #endif
    },
  },

  persist: {
    key: "app-store",
    paths: ["theme", "themeMode"],
  },
});
