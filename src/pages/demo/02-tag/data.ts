/** Tag 标签：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'

export const PAGE_META = {
  name: 'tag',
  title: '标签',
  component: 'C_Tag',
  summary: '语义化标记与状态展示',
  category: '基础',
  instruction: '对比标签的语义与尺寸；关闭标签后可重新恢复。',
  number: '02',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const allTags = ['前端', '后端', 'UI设计', '产品']

  const closableTags = ref([...allTags])

  const removeTag = (tag: string) => {
    closableTags.value = closableTags.value.filter(t => t !== tag)
  }

  const resetTags = () => {
    closableTags.value = [...allTags]
  }
  return { closableTags, removeTag, resetTags }
}
