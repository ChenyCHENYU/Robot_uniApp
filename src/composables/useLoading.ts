/**
 * useLoading - 加载态管理
 *
 * @example
 * const { loading, startLoading, stopLoading, withLoading } = useLoading()
 * await withLoading(() => fetchData())
 */
import { ref } from 'vue'

export function useLoading(initialValue = false) {
  const loading = ref(initialValue)

  const startLoading = () => {
    loading.value = true
  }
  const stopLoading = () => {
    loading.value = false
  }

  /**
   * 包裹异步函数，自动管理 loading 状态
   * @param {Function} fn 异步函数
   * @returns {Promise<any>}
   */
  const withLoading = async fn => {
    startLoading()
    try {
      return await fn()
    } finally {
      stopLoading()
    }
  }

  return { loading, startLoading, stopLoading, withLoading }
}
