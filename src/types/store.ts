/** Store 模块 - 类型定义 */

export interface UserInfo {
  id: number | string
  username: string
  nickname: string
  avatar: string
  name?: string
  email?: string
  phone?: string
  roles?: string[]
  permissions?: string[]
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
}

export interface PageResult<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface AppStoreState {
  systemInfo: UniApp.GetSystemInfoResult | null
  networkType: string
  statusBarHeight: number
  globalLoading: boolean
}
