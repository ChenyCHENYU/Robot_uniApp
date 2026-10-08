/** List 列表：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

export const PAGE_META = {
  name: 'list',
  title: '列表',
  component: 'C_List',
  summary: '滚动加载列表组件',
  category: '数据',
  instruction: '滚动列表加载下一页；重置后从第一页重新加载。',
  number: '16',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const list = ref<number[]>([])

  const loading = ref(false)

  const finished = ref(false)

  let page = 0
  let loadTimer: ReturnType<typeof setTimeout> | undefined

  function onLoad() {
    if (loading.value || finished.value) return
    loading.value = true
    loadTimer = setTimeout(() => {
      page++
      for (let i = 0; i < 10; i++) {
        list.value.push(list.value.length + 1)
      }
      loading.value = false
      if (page >= 3) {
        finished.value = true
      }
    }, 800)
  }

  function resetList() {
    clearTimeout(loadTimer)
    list.value = []
    page = 0
    loading.value = false
    finished.value = false
    onLoad()
  }
  onMounted(onLoad)
  onBeforeUnmount(() => clearTimeout(loadTimer))
  return { list, loading, finished, onLoad, resetList }
}
