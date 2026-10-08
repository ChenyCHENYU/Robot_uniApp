/** Badge 徽标：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'

export const PAGE_META = {
  name: 'badge',
  title: '徽标',
  component: 'C_Badge',
  summary: '消息提示与数字标记',
  category: '基础',
  instruction: '增加或减少未读数量，观察上限、圆点与角标的位置。',
  number: '03',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const badgeCount = ref(5)
  const increaseBadge = () => {
    badgeCount.value++
  }
  const decreaseBadge = () => {
    badgeCount.value = Math.max(0, badgeCount.value - 1)
  }
  return { badgeCount, increaseBadge, decreaseBadge }
}
