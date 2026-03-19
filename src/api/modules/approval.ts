import { api } from '../factory'

export const getApprovalList = api.get('/approval/list')
export const getApprovalDetail = (id: string) =>
  api.get('/approval/detail')({ id })
export const approveItem = api.post('/approval/action')
export const getApprovalCount = api.get('/approval/count', { silent: true })
