import { ref, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useTheme } from '@/composables/useTheme'
import {
  platform,
  PlatformError,
  getPlatformCapabilityStatus,
} from '@/platform'

/** 依据实际注册能力启用扫码，H5 宿主可接入钉钉或设备扫描器。 */
export function useScanPage() {
  const { themeClass, wotTheme } = useTheme()
  const scanResult = ref('')
  const scanning = ref(false)
  const capabilityStatus = ref(getPlatformCapabilityStatus())
  const supported = computed(() => capabilityStatus.value.scanCode)
  const albumSupported = computed(() => capabilityStatus.value.scanFromAlbum)
  const refreshCapabilities = () => {
    capabilityStatus.value = getPlatformCapabilityStatus()
  }
  const scanTip = computed(() =>
    supported.value
      ? '支持二维码与条形码，点击下方按钮开始识别'
      : '当前环境尚未接入扫码，可在小程序、App 或已配置的设备中使用'
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
      title = '当前环境暂不支持此扫码方式'
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
    refreshCapabilities()
    if (supported.value) void startScan()
  })
  onShow(refreshCapabilities)
  return {
    themeClass,
    wotTheme,
    scanResult,
    scanning,
    supported,
    albumSupported,
    scanTip,
    goBack,
    startScan,
    handleAlbum,
    handleCopy,
    isLink,
    handleOpen,
  }
}
