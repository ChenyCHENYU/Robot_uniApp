/**
 * useNetwork - 网络状态监听
 *
 * @example
 * const { networkType, isConnected, isWifi } = useNetwork()
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useNetwork() {
  const networkType = ref('unknown')
  const isConnected = computed(() => networkType.value !== 'none')
  const isWifi = computed(() => networkType.value === 'wifi')

  const onChange = res => {
    networkType.value = res.networkType || res.type || 'unknown'
  }

  onMounted(() => {
    uni.getNetworkType({
      success: res => {
        networkType.value = res.networkType
      },
    })
    uni.onNetworkStatusChange(onChange)
  })

  onUnmounted(() => {
    uni.offNetworkStatusChange(onChange)
  })

  return { networkType, isConnected, isWifi }
}
