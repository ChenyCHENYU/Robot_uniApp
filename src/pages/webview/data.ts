import { ref, computed, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useTheme } from '@/composables/useTheme'
import { isUrlAllowed } from '@/utils/url-policy'

/** 只加载符合项目白名单的链接。 */
export function useWebviewPage() {
  const { themeClass, wotTheme } = useTheme()
  const url = ref('')
  const pageTitle = ref('')
  const loading = ref(false)
  const errorText = ref('')
  const viewKey = ref(0)
  let fallbackTimer: ReturnType<typeof setTimeout> | undefined
  const host = computed(() => url.value.split('/')[2] || '')
  const onLoadComplete = () => {
    clearTimeout(fallbackTimer)
    fallbackTimer = undefined
    loading.value = false
  }
  const startLoading = () => {
    onLoadComplete()
    loading.value = true
    errorText.value = ''
    fallbackTimer = setTimeout(onLoadComplete, 10000)
  }
  const decodeQuery = (value: string) => {
    try {
      return decodeURIComponent(value)
    } catch {
      return value
    }
  }
  onLoad(query => {
    pageTitle.value = decodeQuery(String(query?.title || ''))
    const target = decodeQuery(String(query?.url || ''))
    if (!target) {
      errorText.value = '未提供网页地址'
      return
    }
    if (!isUrlAllowed(target)) {
      errorText.value = '该链接不在应用允许访问的范围内'
      return
    }
    url.value = target
    startLoading()
  })
  const onLoadError = () => {
    onLoadComplete()
    errorText.value = '网页加载失败，请重试或在浏览器中打开'
  }
  const onMessage = (event: { detail: { data: unknown[] } }) => {
    const messages = event.detail.data
    const message = messages?.[messages.length - 1]
    if (
      typeof message === 'object' &&
      message !== null &&
      'title' in message &&
      typeof message.title === 'string'
    )
      pageTitle.value = message.title
  }
  const goBack = () => {
    if (getCurrentPages().length > 1) uni.navigateBack()
    else uni.reLaunch({ url: '/pages/index/index' })
  }
  const handleRefresh = () => {
    if (!url.value) return
    viewKey.value++
    startLoading()
  }
  const handleMore = () => {
    if (!url.value) return
    uni.showActionSheet({
      itemList: ['复制链接', '在浏览器中打开'],
      success: ({ tapIndex }) => {
        if (tapIndex === 0) {
          uni.setClipboardData({ data: url.value })
          return
        }
        // #ifdef H5
        window.open(url.value, '_blank', 'noopener,noreferrer')
        // #endif
        // #ifndef H5
        uni.showToast({ title: '请复制链接后使用浏览器打开', icon: 'none' })
        // #endif
      },
    })
  }
  onUnmounted(onLoadComplete)
  return {
    themeClass,
    wotTheme,
    url,
    pageTitle,
    loading,
    errorText,
    viewKey,
    host,
    onLoadComplete,
    onLoadError,
    onMessage,
    goBack,
    handleRefresh,
    handleMore,
  }
}
