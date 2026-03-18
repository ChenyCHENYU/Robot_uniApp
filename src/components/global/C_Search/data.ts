/**
 * C_Search - 搜索栏组件数据逻辑
 */
import { STORAGE_KEYS } from '@/constants'

export const defaultProps = {
  placeholder: '搜索',
  maxHistory: 10,
  showHistory: true,
  debounceTime: 300,
}

/**
 * 获取搜索历史
 */
export const getSearchHistory = () => {
  try {
    return JSON.parse(uni.getStorageSync(STORAGE_KEYS.SEARCH_HISTORY) || '[]')
  } catch {
    return []
  }
}

/**
 * 保存搜索关键词到历史
 */
export const saveSearchHistory = (keyword, max = 10) => {
  if (!keyword.trim()) return
  let history = getSearchHistory()
  history = history.filter(item => item !== keyword)
  history.unshift(keyword)
  if (history.length > max) history = history.slice(0, max)
  uni.setStorageSync(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history))
  return history
}

/**
 * 清空搜索历史
 */
export const clearSearchHistory = () => {
  uni.removeStorageSync(STORAGE_KEYS.SEARCH_HISTORY)
}
