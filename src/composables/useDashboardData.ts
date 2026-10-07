/**
 * 看板数据组合函数 — 首页与数据看板共用
 *
 * 封装 /dashboard/stats、/dashboard/chart、/dashboard/activities
 * 的加载、加载态与派生 KPI，消除两页重复实现。
 */
import { ref, computed } from 'vue'
import {
  getDashboardStats,
  getDashboardChart,
  getDashboardActivities,
  type DashboardStats,
  type DashboardChart,
  type DashboardActivity,
} from '@/api'
import { formatNumber } from '@/utils/format'

export interface KpiCard {
  label: string
  value: string
  icon: string
  trend: number
  progress?: number
  bg?: string
  barColor?: string
}

/** KPI 卡片派生（stats → 展示结构） */
function buildKpiCards(s: DashboardStats): KpiCard[] {
  return [
    {
      label: '活跃用户',
      value: formatNumber(s.activeUsers),
      icon: '👥',
      trend: s.trends.activeUsers,
      progress: Math.min(99, Math.round((s.activeUsers / 20000) * 100)),
      barColor: 'linear-gradient(90deg,#667eea,#764ba2)',
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      label: '今日访问',
      value: formatNumber(s.todayVisits),
      icon: '📊',
      trend: s.trends.todayVisits,
      progress: Math.min(99, Math.round((s.todayVisits / 6000) * 100)),
      barColor: 'linear-gradient(90deg,#f093fb,#f5576c)',
      bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      label: '待处理',
      value: String(s.pendingTasks),
      icon: '📋',
      trend: s.trends.pendingTasks,
      progress: Math.min(99, s.pendingTasks),
      barColor: 'linear-gradient(90deg,#4facfe,#00f2fe)',
      bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      label: '完成率',
      value: `${s.completionRate}%`,
      icon: '🎯',
      trend: s.trends.completionRate,
      progress: s.completionRate,
      barColor: 'linear-gradient(90deg,#43e97b,#38f9d7)',
      bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
  ]
}

export function useDashboardData() {
  const stats = ref<DashboardStats | null>(null)
  const chart = ref<DashboardChart | null>(null)
  const activities = ref<DashboardActivity[]>([])
  const statsLoading = ref(true)
  const activitiesLoading = ref(false)

  /** KPI 卡片（未加载时为空数组，配合页面 loading 态） */
  const kpiCards = computed(() => (stats.value ? buildKpiCards(stats.value) : []))

  /** 图表数据（归一化为 label/value/percent） */
  const chartData = computed(() => {
    if (!chart.value) return []
    const max = Math.max(...chart.value.visits, 1)
    return chart.value.labels.map((label, i) => ({
      label,
      value: chart.value!.visits[i],
      percent: Math.round((chart.value!.visits[i] / max) * 100),
    }))
  })

  /** 页面热度榜（访问量倒序前5） */
  const rankList = computed(() => {
    if (!chart.value) return []
    const max = Math.max(...chart.value.visits, 1)
    return chart.value.labels
      .map((label, i) => ({
        name: label,
        value: formatNumber(chart.value!.visits[i]),
        percent: Math.round((chart.value!.visits[i] / max) * 100),
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 5)
  })

  /** 拉取 stats（静默） */
  const loadStats = async () => {
    statsLoading.value = true
    try {
      stats.value = await getDashboardStats()
    } catch {
      // 静默接口失败保留空态
    } finally {
      statsLoading.value = false
    }
  }

  /** 拉取图表（period: day/week/month） */
  const loadChart = async (period = 'week') => {
    try {
      chart.value = await getDashboardChart({ range: period })
    } catch {
      // 保留现有数据
    }
  }

  /** 拉取动态（pageSize 默认 5） */
  const loadActivities = async (pageSize = 5) => {
    activitiesLoading.value = true
    try {
      const res = await getDashboardActivities({ page: 1, pageSize })
      activities.value = res.list || []
    } catch {
      // 保留现有数据
    } finally {
      activitiesLoading.value = false
    }
  }

  /** stats + chart 并行加载 */
  const loadOverview = async (period = 'week') => {
    await Promise.all([loadStats(), loadChart(period)])
  }

  return {
    stats,
    chart,
    activities,
    statsLoading,
    activitiesLoading,
    kpiCards,
    chartData,
    rankList,
    loadStats,
    loadChart,
    loadActivities,
    loadOverview,
  }
}
