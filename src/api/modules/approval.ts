import { api } from '../factory'
import type { PageResult } from '@/types/store'

export interface ApprovalItem {
  id: string
  title: string
  applicant: string
  status: 'pending' | 'approved' | 'rejected'
  amount?: string
  createTime: string
  remark?: string
  [key: string]: any
}

export const getApprovalList =
  api.get<PageResult<ApprovalItem>>('/approval/list')
export const getApprovalDetail = api.get<ApprovalItem>('/approval/detail')
export const approveItem = api.post<null>('/approval/action')
export const getApprovalCount = api.get<{ pending: number }>(
  '/approval/count',
  { silent: true }
)
