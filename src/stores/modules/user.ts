import { defineStore } from 'pinia'
import { login, getUserInfo, logout } from '@/api'
import { advanceRequestContext } from '@/services/request-context'
import type { LoginCredentials, UserInfo } from '@/types/store'
import { logger } from '@/utils/logger'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '' as string,
    userInfo: null as UserInfo | null,
    permissions: [] as string[],
    roles: [] as string[],
    loginTime: null as string | null,
  }),

  getters: {
    avatar: state =>
      state.userInfo?.avatar || '/static/images/default-avatar.png',
    nickname: state => state.userInfo?.nickname || '未设置昵称',
    hasPermission: state => (permission: string) =>
      state.permissions.includes(permission),
    isLoggedIn: state => !!state.token,
    hasRole: state => (role: string) => state.roles.includes(role),
    isAdmin: state => state.roles.includes('admin'),
  },

  actions: {
    /**
     * 登录：获取 token 后立即拉取用户信息
     * （401 统一由 http 层处理：清登录态 + 跳登录页，此处不再重复处理）
     */
    async login(credentials: LoginCredentials) {
      try {
        const result = await login(credentials)
        advanceRequestContext()
        this.token = result.token
        this.loginTime = new Date().toISOString()
        // 登录成功后拉取用户信息（失败不阻断登录流程）
        try {
          await this.fetchUserInfo()
        } catch (error) {
          logger.warn('登录后获取用户信息失败:', error)
        }
        return result
      } catch (error) {
        this.clearUserInfo()
        throw error
      }
    },

    /** 拉取最新用户信息（权限/角色同步到 store） */
    async fetchUserInfo() {
      const userInfo = await getUserInfo()
      this.userInfo = userInfo
      this.permissions = userInfo.permissions || []
      this.roles = userInfo.roles || []
      return userInfo
    },

    /** 登出：调用后端接口（失败不阻断）并回到登录页 */
    async logout() {
      try {
        await logout()
      } catch (error) {
        logger.warn('登出接口调用失败:', error)
      } finally {
        this.clearUserInfo()
        uni.reLaunch({ url: '/pages/login/index' })
      }
    },

    /** 清空登录态（不发请求、不跳转，由调用方决定后续行为） */
    clearUserInfo() {
      advanceRequestContext()
      this.token = ''
      this.userInfo = null
      this.permissions = []
      this.roles = []
      this.loginTime = null
    },
  },

  persist: {
    key: 'user-store',
    paths: ['token', 'userInfo', 'permissions', 'roles', 'loginTime'],
  },
})
