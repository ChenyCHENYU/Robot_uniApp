/** Search 搜索：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'

export const PAGE_META = {
  name: 'search',
  title: '搜索',
  component: 'C_Search',
  summary: '搜索栏与历史记录',
  category: '表单',
  instruction: '输入关键词并搜索，清除输入后可查看和复用搜索历史。',
  number: '11',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const keyword = ref('')

  const keyword2 = ref('')

  const searchResult = ref('')
  const historyResult = ref('')

  const handleSearch = (val: string) => {
    searchResult.value = val.trim()
  }

  const handleClear = () => {
    searchResult.value = ''
    keyword.value = ''
  }

  const handleClear2 = () => {
    keyword2.value = ''
    historyResult.value = ''
  }
  const handleSearch2 = (val: string) => {
    historyResult.value = val.trim()
  }
  return {
    keyword,
    keyword2,
    searchResult,
    historyResult,
    handleSearch,
    handleClear,
    handleSearch2,
    handleClear2,
  }
}
