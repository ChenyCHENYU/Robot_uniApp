import { APP_VERSION, STORAGE_KEYS } from '@/constants'

/** 应用信息与本地缓存管理。 */
export function useAboutPage() {
  const version = APP_VERSION
  const features = [
    {
      icon: 'i-mdi-devices',
      title: '跨平台工作台',
      desc: '一套应用覆盖 H5、小程序与 App',
    },
    {
      icon: 'i-mdi-code-braces',
      title: 'Vue 3 + TypeScript',
      desc: '清晰的页面结构与可靠的类型支持',
    },
    {
      icon: 'i-mdi-view-grid-outline',
      title: '33 个通用组件',
      desc: '从表单、列表到完整业务场景',
    },
    {
      icon: 'i-mdi-lightning-bolt-outline',
      title: '轻量高效',
      desc: 'Vite 构建与 UnoCSS 按需样式',
    },
  ]
  const clearCache = () => {
    uni.showModal({
      title: '清除缓存',
      content: '清除搜索历史、字典与接口缓存，保留登录、偏好和本地资料。',
      success: ({ confirm }) => {
        if (!confirm) return
        const { keys } = uni.getStorageInfoSync()
        keys
          .filter(
            key =>
              key === STORAGE_KEYS.SEARCH_HISTORY ||
              key === STORAGE_KEYS.DICT_CACHE ||
              key.startsWith(STORAGE_KEYS.API_CACHE_PREFIX)
          )
          .forEach(key => uni.removeStorageSync(key))
        uni.showToast({ title: '缓存已清除', icon: 'success' })
      },
    })
  }
  const infoList = [
    { label: '应用版本', value: `v${APP_VERSION}` },
    { label: 'Vue', value: '3.5.30' },
    { label: 'TypeScript', value: '5.7.3' },
    { label: '构建工具', value: 'Vite 5' },
    { label: 'UI 组件库', value: 'wot-design-uni 1.14.0' },
    {
      label: '检查更新',
      value: '版本信息',
      action: () =>
        uni.showModal({
          title: '当前版本',
          content: `当前安装版本为 v${APP_VERSION}。在线更新服务尚未接入，请从项目发布渠道获取新版。`,
          showCancel: false,
        }),
    },
    { label: '清除缓存', value: '', action: clearCache },
  ]
  const techStack = [
    'Vue 3',
    'TypeScript',
    'UniApp',
    'Vite',
    'UnoCSS',
    'Pinia',
    'wot-design-uni',
    'Sass',
    'Iconify',
  ]
  const handleFeedback = () =>
    uni.showModal({
      title: '意见反馈',
      content: '请将使用场景、问题截图与应用版本发送给项目维护人员。',
      showCancel: false,
      confirmText: '知道了',
    })
  return { version, features, infoList, techStack, handleFeedback }
}
