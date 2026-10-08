/** Skeleton 骨架屏：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'

export const PAGE_META = {
  name: 'skeleton',
  title: '骨架屏',
  component: 'C_Skeleton',
  summary: '内容加载占位组件',
  category: '反馈',
  instruction: '切换加载状态，观察占位内容与实际内容之间的变化。',
  number: '15',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const isLoading = ref(true)

  function toggleLoading() {
    isLoading.value = !isLoading.value
  }
  return { isLoading, toggleLoading }
}
