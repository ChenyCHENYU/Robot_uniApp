/**
 * 单测全局 setup：提供 uni 全局桩
 *
 * 被测模块（router 等）在模块加载期调用 uni.addInterceptor；
 * 这里给出最小可用的同步桩，业务 API 按需在各测试内覆盖。
 */

const storage = new Map<string, unknown>()

const uniStub = {
  storage,
  addInterceptor: () => {},
  removeInterceptor: () => {},
  getStorageSync: (key: string) => storage.get(key) ?? '',
  setStorageSync: (key: string, value: unknown) => {
    storage.set(key, value)
  },
  removeStorageSync: (key: string) => {
    storage.delete(key)
  },
  clearStorageSync: () => {
    storage.clear()
  },
  getSystemInfoSync: () => ({
    theme: 'light',
    statusBarHeight: 44,
    windowWidth: 375,
  }),
  onThemeChange: () => {},
  showToast: () => {},
  reLaunch: () => {},
  navigateTo: () => {},
}

// @ts-expect-error 测试桩
globalThis.uni = uniStub
// @ts-expect-error 测试桩
globalThis.getCurrentPages = () => []
