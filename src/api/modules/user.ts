import { api } from '../factory'

export const login = api.post<{ token: string }>('/auth/login')
export const logout = api.post('/auth/logout')
export const getUserInfo = api.get('/user/info', { silent: true })
export const updateUser = api.put('/user/info')
export const getUserList = api.get('/user/list')
export const uploadAvatar = api.upload('/user/avatar')
