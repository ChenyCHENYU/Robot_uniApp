/**
 * C_Search - 搜索栏组件数据逻辑
 */
import { STORAGE_KEYS } from '@/constants'

export const defaultProps = {
  placeholder: '搜索',
  maxHistory: 10,
  showHistory: false,
  debounceTime: 300,
}

/**
 * 获取搜索历史
 */
export const getSearchHistory = () => {
  try {
    const parsed = JSON.parse(
      uni.getStorageSync(STORAGE_KEYS.SEARCH_HISTORY) || '[]'
    )
    return Array.isArray(parsed)
      ? parsed.filter(item => typeof item === 'string' && item.trim())
      : []
  } catch {
    return []
  }
}

/**
 * 保存搜索关键词到历史
 */
export const saveSearchHistory = (keyword, max = 10) => {
  keyword = keyword.trim()
  if (!keyword) return getSearchHistory()
  let history = getSearchHistory()
  history = history.filter(item => item !== keyword)
  history.unshift(keyword)
  history = history.slice(0, Math.max(0, max))
  uni.setStorageSync(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history))
  return history
}

/**
 * 清空搜索历史
 */
export const clearSearchHistory = () => {
  uni.removeStorageSync(STORAGE_KEYS.SEARCH_HISTORY)
}
