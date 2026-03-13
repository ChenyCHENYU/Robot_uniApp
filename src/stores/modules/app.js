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
      this._applyThemeToDOM(mode);
    },

    /**
     * 将主题类名同步到 DOM 元素（html + page）
     * @private
     */
    _applyThemeToDOM(mode) {
      // #ifdef H5
      const html = document.documentElement;
      html.classList.remove("dark", "light");
      if (mode === "dark") {
        html.classList.add("dark");
      } else if (mode === "light") {
        html.classList.add("light");
      }
      // 同步到所有 uni-page-body 元素（uni-app H5 的 page 对应元素）
      document.querySelectorAll("uni-page-body").forEach((el) => {
        el.classList.remove("dark", "light");
        if (mode === "dark") el.classList.add("dark");
        else if (mode === "light") el.classList.add("light");
      });
      // #endif
    },
  },

  persist: {
    key: "app-store",
    paths: ["theme", "themeMode"],
  },
});
