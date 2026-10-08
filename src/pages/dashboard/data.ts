import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useDashboardData } from '@/composables/useDashboardData'

/** 指标、趋势与周期切换。 */
export function useDashboardPage() {
  const today = new Date().toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
  const period = ref('week')
  const periods = [
    { label: '日', value: 'day' },
    { label: '周', value: 'week' },
    { label: '月', value: 'month' },
  ]
  const { kpiCards, chartData, rankList, statsLoading, loadOverview } =
    useDashboardData()
  const loading = ref(false)
  const chartSubtitle = computed(
    () =>
      ({ day: '按日统计', week: '按周统计', month: '按月统计' })[period.value]
  )
  const kpiIcons: Record<string, string> = {
    活跃用户: 'i-mdi-account-group-outline',
    今日访问: 'i-mdi-chart-line',
    待处理: 'i-mdi-clipboard-text-outline',
    完成率: 'i-mdi-check-circle-outline',
  }
  const loadData = async () => {
    if (loading.value) return
    loading.value = true
    try {
      await loadOverview(period.value)
    } finally {
      loading.value = false
    }
  }
  const handlePeriodChange = async (item: { value: string }) => {
    if (loading.value || period.value === item.value) return
    period.value = item.value
    await loadData()
  }
  const quickActions = [
    { label: '导出报告', icon: 'i-mdi-file-export-outline', path: '' },
    { label: '用户分析', icon: 'i-mdi-account-search-outline', path: '' },
    { label: '系统日志', icon: 'i-mdi-text-box-search-outline', path: '' },
    { label: '性能监控', icon: 'i-mdi-speedometer', path: '' },
  ]
  const handleAction = (action: { label: string }) => {
    if (action.label !== '导出报告') {
      uni.showModal({
        title: action.label,
        content: '该分析服务尚未接入，当前可查看概览指标与访问趋势。',
        showCancel: false,
      })
      return
    }
    if (!kpiCards.value.length) {
      uni.showToast({ title: '暂无可导出的指标', icon: 'none' })
      return
    }
    const report = [
      `数据概览 · ${today}`,
      ...kpiCards.value.map(
        item => `${item.label}：${item.value}（变化 ${item.trend}%）`
      ),
      '',
      '访问趋势',
      ...chartData.value.map(item => `${item.label}：${item.value}`),
    ].join('\n')
    uni.setClipboardData({
      data: report,
      success: () =>
        uni.showToast({ title: '报告已复制，可粘贴保存', icon: 'none' }),
    })
  }
  onLoad(() => {
    void loadData()
  })
  const refreshing = ref(false)
  const handleRefresh = async () => {
    if (refreshing.value) return
    refreshing.value = true
    try {
      await loadData()
    } finally {
      refreshing.value = false
    }
  }

  return {
    today,
    period,
    periods,
    kpiCards,
    chartData,
    rankList,
    statsLoading,
    loading,
    chartSubtitle,
    kpiIcons,
    loadData,
    handlePeriodChange,
    quickActions,
    handleAction,
    refreshing,
    handleRefresh,
  }
}
