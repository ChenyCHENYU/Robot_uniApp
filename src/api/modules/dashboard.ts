import { api } from '../factory'
import type { PageResult } from '@/types/store'

export interface DashboardStats {
  activeUsers: number
  todayVisits: number
  pendingTasks: number
  completionRate: number
  trends: {
    activeUsers: number
    todayVisits: number
    pendingTasks: number
    completionRate: number
  }
}

export interface DashboardChart {
  labels: string[]
  visits: number[]
  users: number[]
}

export interface DashboardActivity {
  id: number
  text: string
  time: string
  color: string
}

export const getDashboardStats = api.get<DashboardStats>('/dashboard/stats', {
  silent: true,
})
export const getDashboardChart = api.get<DashboardChart>('/dashboard/chart')
export const getDashboardActivities = api.get<PageResult<DashboardActivity>>(
  '/dashboard/activities'
)
