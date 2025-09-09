import { defineStore } from "pinia";
import { login, getUserInfo, logout } from "@/api";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "",
    userInfo: null,
    permissions: [],
    roles: [],
    isLoggedIn: false,
    loginTime: null,
  }),

  getters: {
    // 简化头像逻辑
    avatar: (state) => {
      const userAvatar = state.userInfo?.avatar;
      return userAvatar && userAvatar !== "/static/default-avatar.png"
        ? userAvatar
        : "/static/robot-avatar.png";
    },
    nickname: (state) => state.userInfo?.nickname || "未设置昵称",
    hasPermission: (state) => (permission) =>
      state.permissions.includes(permission),
    hasRole: (state) => (role) => state.roles.includes(role),
    isAdmin: (state) => state.roles.includes("admin"),
  },

  actions: {
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

    async fetchUserInfo() {
      try {
        const userInfo = await getUserInfo();
        this.userInfo = userInfo;
        this.permissions = userInfo.permissions || [];
        this.roles = userInfo.roles || [];
        return userInfo;
      } catch (error) {
        if (error.code === 401) {
          this.logout();
        }
        throw error;
      }
    },

    async logout() {
      try {
        await logout();
      } catch (error) {
        console.warn("登出接口调用失败:", error);
      } finally {
        this.clearUserInfo();
        uni.reLaunch({ url: "/pages/login/index" });
      }
    },

    clearUserInfo() {
      this.token = "";
      this.userInfo = null;
      this.permissions = [];
      this.roles = [];
      this.isLoggedIn = false;
      this.loginTime = null;
    },
  },

  persist: {
    key: "user-store",
    paths: [
      "token",
      "userInfo",
      "permissions",
      "roles",
      "isLoggedIn",
      "loginTime",
    ],
  },
});
