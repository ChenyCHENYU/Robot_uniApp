/** Calendar 日历：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'

export const PAGE_META = {
  name: 'calendar',
  title: '日历',
  component: 'C_Calendar',
  summary: '日期选择日历组件',
  category: '表单',
  instruction: '选择单个日期或起止区间，再确认结果；可重新打开修改。',
  number: '25',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const showSingle = ref(false)

  const showRange = ref(false)

  const showCustom = ref(false)

  const selectedDate = ref('')
  const customDate = ref('')

  const rangeText = ref('')
  const selectedRange = ref<string[]>([])

  function onSingleConfirm(date: string) {
    selectedDate.value = date
  }

  function onRangeConfirm(dates: string[]) {
    if (dates.length !== 2) {
      uni.showToast({ title: '请选择完整的起止日期', icon: 'none' })
      return
    }
    selectedRange.value = dates
    rangeText.value = `${dates[0]} 至 ${dates[1]}`
  }

  function onCustomConfirm(date: string) {
    customDate.value = date
    uni.showToast({ title: `选择: ${date}`, icon: 'none' })
  }
  return {
    showSingle,
    showRange,
    showCustom,
    selectedDate,
    customDate,
    rangeText,
    selectedRange,
    onSingleConfirm,
    onRangeConfirm,
    onCustomConfirm,
  }
}
