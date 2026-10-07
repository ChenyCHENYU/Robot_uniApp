import { api } from '../factory'
import type { PageResult } from '@/types/store'

export interface CrudItem {
  id: string
  title: string
  description: string
  status: number
  createTime: string
  updatedTime?: string
  [key: string]: any
}

export interface CrudListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: number
}

/** 列表查询（支持分页/关键词/状态筛选） */
export const getCrudList = api.get<PageResult<CrudItem>>('/crud/list')
export const getCrudDetail = api.get<CrudItem>('/crud/detail')
export const createCrudItem = api.post<CrudItem>('/crud/item')
export const updateCrudItem = api.put<CrudItem>('/crud/item')
export const deleteCrudItem = api.del<null>('/crud/item')
