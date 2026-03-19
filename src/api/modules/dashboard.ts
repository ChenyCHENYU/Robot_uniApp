import { api } from '../factory'

export const getDashboardStats = api.get('/dashboard/stats', { silent: true })
export const getDashboardChart = api.get('/dashboard/chart')
export const getDashboardActivities = api.get('/dashboard/activities')
