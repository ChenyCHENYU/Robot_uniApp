import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useTheme } from '@/composables/useTheme'
import { platform, PlatformError } from '@/platform'

/** 扫码使用平台能力层，H5 明确降级。 */
export function useScanPage() {
  const { themeClass, wotTheme } = useTheme()
  const scanResult = ref('')
  const scanning = ref(false)
  const supported = ref(true)
  // #ifdef H5
  supported.value = false
  // #endif
  const scanTip = computed(() =>
    supported.value
      ? '支持二维码与条形码，点击下方按钮开始识别'
      : '网页环境暂不支持扫码，请使用小程序或 App'
  )
  const goBack = () => {
    if (getCurrentPages().length > 1) uni.navigateBack()
    else uni.reLaunch({ url: '/pages/index/index' })
  }
  const showScanError = (error: unknown) => {
    if (error instanceof PlatformError && error.code === 'user_cancel') return
    let title = '识别失败，请重试'
    if (error instanceof PlatformError && error.code === 'permission_denied')
      title = '请在系统设置中开启相机权限'
    if (
      error instanceof PlatformError &&
      error.code === 'capability_unsupported'
    )
      title = '当前环境不支持扫码，请使用小程序或 App'
    uni.showToast({ title, icon: 'none' })
  }
  const runScan = async (source: 'camera' | 'album') => {
    if (scanning.value) return
    scanning.value = true
    try {
      const result = await platform.scanCode(source)
      scanResult.value = result.result
    } catch (error) {
      showScanError(error)
    } finally {
      scanning.value = false
    }
  }
  const startScan = () => runScan('camera')
  const handleAlbum = () => runScan('album')
  const handleCopy = () => uni.setClipboardData({ data: scanResult.value })
  const isLink = computed(() => /^https?:\/\//i.test(scanResult.value))
  const handleOpen = () => {
    if (!isLink.value) {
      handleCopy()
      return
    }
    const host = scanResult.value.split('/')[2] || ''
    uni.showModal({
      title: '打开外部链接',
      content: `即将访问：${host}，请确认链接来源可信。`,
      confirmText: '继续',
      success: ({ confirm }) => {
        if (confirm)
          uni.navigateTo({
            url: `/pages/webview/index?url=${encodeURIComponent(scanResult.value)}`,
          })
      },
    })
  }
  onLoad(() => {
    // #ifndef H5
    void startScan()
    // #endif
  })
  return {
    themeClass,
    wotTheme,
    scanResult,
    scanning,
    supported,
    scanTip,
    goBack,
    startScan,
    handleAlbum,
    handleCopy,
    isLink,
    handleOpen,
  }
}
