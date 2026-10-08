/** CountDown 倒计时：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'

export const PAGE_META = {
  name: 'count-down',
  title: '倒计时',
  component: 'C_CountDown',
  summary: '实时倒计时展示组件',
  category: '反馈',
  instruction: '使用开始、暂停和重置控制计时，并查看当前计时状态。',
  number: '33',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const countdownRef = ref<{
    start: () => void
    pause: () => void
    reset: () => void
  } | null>(null)
  const countdownState = ref('待开始')

  function handleStart() {
    countdownRef.value?.start()
    countdownState.value = '运行中'
  }

  function handlePause() {
    countdownRef.value?.pause()
    countdownState.value = '已暂停'
  }

  function handleReset() {
    countdownRef.value?.reset()
    countdownState.value = '待开始'
  }
  function handleFinish() {
    countdownState.value = '已结束'
  }
  return {
    countdownRef,
    countdownState,
    handleStart,
    handlePause,
    handleReset,
    handleFinish,
  }
}
