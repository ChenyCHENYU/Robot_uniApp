import { api } from '../factory'
import type { LoginResult, UserInfo, PageResult } from '@/types/store'

export const login = api.post<LoginResult>('/auth/login')
export const loginBySms = api.post<LoginResult>('/auth/sms-login')
export const register = api.post<null>('/auth/register')
export const changePassword = api.post<null>('/user/password')
export const logout = api.post<null>('/auth/logout')
export const getUserInfo = api.get<UserInfo>('/user/info', { silent: true })
export const updateUser = api.put<UserInfo>('/user/info')
export const getUserList = api.get<PageResult>('/user/list')
export const uploadAvatar = api.upload<{ url: string }>('/user/avatar')
