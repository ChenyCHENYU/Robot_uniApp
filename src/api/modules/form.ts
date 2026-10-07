import { api } from '../factory'

export interface FormPayload {
  name: string
  phone: string
  email?: string
  gender: string
  department: string
  position?: string
  joinDate?: string
  skills?: string[]
  remark?: string
  [key: string]: any
}

export const submitForm = api.post<{ id: string }>('/form/submit')
