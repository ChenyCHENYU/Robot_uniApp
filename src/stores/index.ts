import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// uni-app 存储适配器
const uniStorage = {
  getItem(key) {
    const value = uni.getStorageSync(key)
    return value === '' ? null : value
  },
  setItem(key, value) {
    uni.setStorageSync(key, value)
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
