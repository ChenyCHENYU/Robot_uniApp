import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";

// 创建 pinia 实例
const pinia = createPinia();

// 配置持久化插件
pinia.use(
  createPersistedState({
    storage: {
      getItem(key) {
        return uni.getStorageSync(key);
      },
      setItem(key, value) {
        uni.setStorageSync(key, value);
      },
    },
  })
);

export default pinia;

// stores/modules/user.js - 用户状态管理
import { defineStore } from "pinia";
import { login, getUserInfo, logout } from "@/api";

export const useUserStore = defineStore("user", {
  state: () => ({
    // 用户基本信息
    token: "",
    userInfo: null,
    permissions: [],
    roles: [],

    // 登录状态
    isLoggedIn: false,
    loginTime: null,

    // 用户偏好设置
    preferences: {
      theme: "light",
      language: "zh-CN",
      fontSize: "medium",
    },
  }),

  getters: {
    // 用户头像
    avatar: (state) => state.userInfo?.avatar || "/static/default-avatar.png",

    // 用户昵称
    nickname: (state) => state.userInfo?.nickname || "未设置昵称",

    // 是否有特定权限
    hasPermission: (state) => (permission) => {
      return state.permissions.includes(permission);
    },

    // 是否有特定角色
    hasRole: (state) => (role) => {
      return state.roles.includes(role);
    },

    // 是否为管理员
    isAdmin: (state) => state.roles.includes("admin"),

    // 登录天数
    loginDays: (state) => {
      if (!state.loginTime) return 0;
      const now = new Date();
      const loginDate = new Date(state.loginTime);
      return Math.floor((now - loginDate) / (1000 * 60 * 60 * 24));
    },
  },

  actions: {
    // 登录
    async login(credentials) {
      try {
        const result = await login(credentials);

        this.token = result.token;
        this.userInfo = result.userInfo;
        this.permissions = result.permissions || [];
        this.roles = result.roles || [];
        this.isLoggedIn = true;
        this.loginTime = new Date().toISOString();

        return result;
      } catch (error) {
        this.clearUserInfo();
        throw error;
      }
    },

    // 获取用户信息
    async fetchUserInfo() {
      try {
        const userInfo = await getUserInfo();
        this.userInfo = userInfo;
        this.permissions = userInfo.permissions || [];
        this.roles = userInfo.roles || [];
        return userInfo;
      } catch (error) {
        // 如果获取用户信息失败，可能token已过期
        if (error.code === 401) {
          this.logout();
        }
        throw error;
      }
    },

    // 更新用户偏好
    updatePreferences(preferences) {
      this.preferences = { ...this.preferences, ...preferences };
    },

    // 登出
    async logout() {
      try {
        await logout();
      } catch (error) {
        console.warn("登出接口调用失败:", error);
      } finally {
        this.clearUserInfo();
        // 跳转到登录页
        uni.reLaunch({
          url: "/pages/login/index",
        });
      }
    },

    // 清除用户信息
    clearUserInfo() {
      this.token = "";
      this.userInfo = null;
      this.permissions = [];
      this.roles = [];
      this.isLoggedIn = false;
      this.loginTime = null;
    },
  },

  // 持久化配置
  persist: {
    key: "user-store",
    storage: {
      getItem: (key) => uni.getStorageSync(key),
      setItem: (key, value) => uni.setStorageSync(key, value),
    },
    paths: [
      "token",
      "userInfo",
      "permissions",
      "roles",
      "isLoggedIn",
      "loginTime",
      "preferences",
    ],
  },
});

// stores/modules/app.js - 应用状态管理
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    // 应用基本信息
    appInfo: {
      name: "企业应用框架",
      version: "1.0.0",
      buildTime: "",
    },

    // 系统状态
    systemInfo: null,
    networkType: "unknown",

    // UI状态
    tabBarHeight: 50,
    statusBarHeight: 0,
    navigationBarHeight: 44,

    // 全局Loading
    globalLoading: false,
    loadingText: "加载中...",

    // 主题配置
    theme: {
      primary: "#007AFF",
      success: "#4CD964",
      warning: "#F0AD4E",
      error: "#DD524D",
    },

    // 页面配置
    pageConfig: {
      enablePullRefresh: true,
      enableBackTop: true,
      backgroundColor: "#f5f7fa",
    },
  }),

  getters: {
    // 是否为开发环境
    isDev: () => process.env.NODE_ENV === "development",

    // 获取安全区域
    safeArea: (state) => {
      if (!state.systemInfo) return { top: 0, bottom: 0 };
      const { safeAreaInsets } = state.systemInfo;
      return {
        top: safeAreaInsets?.top || state.statusBarHeight,
        bottom: safeAreaInsets?.bottom || 0,
      };
    },

    // 获取可用窗口高度
    windowHeight: (state) => {
      if (!state.systemInfo) return 0;
      return state.systemInfo.windowHeight - state.tabBarHeight;
    },
  },

  actions: {
    // 初始化系统信息
    async initSystemInfo() {
      try {
        const systemInfo = uni.getSystemInfoSync();
        this.systemInfo = systemInfo;
        this.statusBarHeight = systemInfo.statusBarHeight || 0;

        // 监听网络状态
        this.getNetworkType();
        uni.onNetworkStatusChange((res) => {
          this.networkType = res.networkType;
        });
      } catch (error) {
        console.error("获取系统信息失败:", error);
      }
    },

    // 获取网络类型
    getNetworkType() {
      uni.getNetworkType({
        success: (res) => {
          this.networkType = res.networkType;
        },
      });
    },

    // 设置全局Loading
    setGlobalLoading(loading, text = "加载中...") {
      this.globalLoading = loading;
      this.loadingText = text;

      if (loading) {
        uni.showLoading({ title: text });
      } else {
        uni.hideLoading();
      }
    },

    // 更新主题配置
    updateTheme(themeConfig) {
      this.theme = { ...this.theme, ...themeConfig };
    },

    // 更新页面配置
    updatePageConfig(config) {
      this.pageConfig = { ...this.pageConfig, ...config };
    },
  },

  persist: {
    key: "app-store",
    paths: ["theme", "pageConfig"],
  },
});

// stores/modules/permission.js - 权限管理
import { defineStore } from "pinia";
import { useUserStore } from "./user";

export const usePermissionStore = defineStore("permission", {
  state: () => ({
    // 路由权限
    accessRoutes: [],

    // 菜单权限
    menuList: [],

    // 按钮权限
    buttonPermissions: new Set(),
  }),

  getters: {
    // 获取有权限的路由
    routes: (state) => state.accessRoutes,

    // 获取菜单
    menus: (state) => state.menuList,

    // 检查按钮权限
    hasButtonPermission: (state) => (permission) => {
      return state.buttonPermissions.has(permission);
    },
  },

  actions: {
    // 生成路由
    async generateRoutes() {
      const userStore = useUserStore();
      const { roles, permissions } = userStore;

      // 根据角色和权限生成路由
      this.accessRoutes = this.filterRoutes(roles, permissions);
      this.generateMenus();
      this.generateButtonPermissions(permissions);
    },

    // 过滤路由
    filterRoutes(roles, permissions) {
      // 这里实现根据权限过滤路由的逻辑
      // 返回用户有权限访问的路由列表
      return [];
    },

    // 生成菜单
    generateMenus() {
      // 根据路由生成菜单结构
      this.menuList = this.routesToMenus(this.accessRoutes);
    },

    // 生成按钮权限
    generateButtonPermissions(permissions) {
      this.buttonPermissions = new Set(permissions);
    },

    // 路由转菜单
    routesToMenus(routes) {
      // 实现路由转菜单的逻辑
      return [];
    },
  },
});
