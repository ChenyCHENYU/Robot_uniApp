import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// uni-app 存储适配器（补齐 removeItem，对齐 Storage 接口）
const uniStorage = {
  getItem(key: string): string | null {
    const value = uni.getStorageSync(key)
    return value === '' || value === undefined ? null : String(value)
  },
  setItem(key: string, value: string) {
    uni.setStorageSync(key, value)
  },
  removeItem(key: string) {
    uni.removeStorageSync(key)
  },
}

pinia.use(
  createPersistedState({
    storage: uniStorage,
  })
)

export default pinia

// 统一导出所有 store
export { useUserStore } from './modules/user'
export { useAppStore } from './modules/app'
export { useMessageStore } from './modules/message'
export { useNotificationStore } from './modules/notification'
export { useSettingsStore } from './modules/settings'
