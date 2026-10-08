/** Progress 进度条：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'

export const PAGE_META = {
  name: 'progress',
  title: '进度条',
  component: 'C_Progress',
  summary: '展示操作进度的组件',
  category: '反馈',
  instruction: '增加或减少进度，对比完成状态和不同显示方式。',
  number: '28',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const progress = ref(50)

  function increase() {
    progress.value = Math.min(100, progress.value + 10)
  }

  function decrease() {
    progress.value = Math.max(0, progress.value - 10)
  }
  return { progress, increase, decrease }
}
