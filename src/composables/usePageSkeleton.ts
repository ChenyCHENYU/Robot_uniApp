/**
 * 页面级骨架屏管理
 *
 * 在页面 onLoad 时自动显示骨架屏，数据加载完成后隐藏
 * 减少首屏白屏时间，提升用户感知性能
 *
 * @example
 * const { loading, show, hide } = usePageSkeleton()
 * onLoad(async () => {
 *   show()
 *   await fetchData()
 *   hide()
 * })
 */
import { ref } from 'vue'

export function usePageSkeleton(initialLoading = true) {
  const loading = ref(initialLoading)

  const show = () => {
    loading.value = true
  }

  const hide = () => {
    loading.value = false
  }

  /** 包装异步操作，自动管理骨架屏状态 */
  const wrap = async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
    loading.value = true
    try {
      const result = await fn()
      return result
    } catch (e) {
      console.warn('[usePageSkeleton] 数据加载失败:', e)
      return undefined
    } finally {
      loading.value = false
    }
  }

  return { loading, show, hide, wrap }
}
