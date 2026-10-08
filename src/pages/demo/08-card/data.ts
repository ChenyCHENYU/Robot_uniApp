/** Card 卡片：仅在当前页面维护演示状态，不调用业务接口。 */

export const PAGE_META = {
  name: 'card',
  title: '卡片',
  component: 'C_Card',
  summary: '通用内容容器组件',
  category: '布局',
  instruction: '对比卡片的容器层级；点击交互卡片查看操作反馈。',
  number: '08',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const handleClick = () => {
    uni.showToast({ title: '卡片被点击了', icon: 'none' })
  }
  return { handleClick }
}
