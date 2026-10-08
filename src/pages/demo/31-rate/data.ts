/** Rate 评分：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'

export const PAGE_META = {
  name: 'rate',
  title: '评分',
  component: 'C_Rate',
  summary: '星级评分交互组件',
  category: '表单',
  instruction: '点击星星评分，体验半星选择；只读评分用于结果展示。',
  number: '31',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const basicRate = ref(3)

  const halfRate = ref(2.5)

  const customRate = ref(4)
  return { basicRate, halfRate, customRate }
}
