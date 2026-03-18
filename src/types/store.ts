/** Store 模块 - 类型定义 */

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  email?: string
}

export interface UserStoreState {
  token: string
  userInfo: UserInfo | null
  permissions: string[]
  roles: string[]
  loginTime: string | null
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  userInfo: UserInfo
  permissions: string[]
  roles: string[]
}

export interface AppStoreState {
  systemInfo: UniApp.GetSystemInfoResult | null
  networkType: string
  statusBarHeight: number
  globalLoading: boolean
}

export interface EnvConfig {
  API_BASE_URL: string
  API_TIMEOUT: number
  API_VERSION: string
  WS_URL: string
  WS_RECONNECT_INTERVAL: number
  WS_MAX_RECONNECT_ATTEMPTS: number
  CDN_URL: string
  STATIC_URL: string
  APP_NAME: string
  APP_VERSION: string
  BUILD_TIME: string
  DEBUG: boolean
  LOG_LEVEL: string
  ENABLE_VCONSOLE: boolean
  ENABLE_PERFORMANCE_MONITOR: boolean
  FEATURES: {
    enablePush: boolean
    enableShare: boolean
    enablePayment: boolean
    enableAnalytics: boolean
  }
  SERVICES: {
    sentry: { dsn: string; enabled: boolean }
    analytics: { enabled: boolean; trackingId: string }
  }
}
