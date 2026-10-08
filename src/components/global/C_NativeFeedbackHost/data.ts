import { computed, getCurrentInstance, onMounted, onUnmounted } from 'vue'
import { onShow, onHide, onBackPress } from '@dcloudio/uni-app'
import {
  activeNativeFeedbackHost,
  claimNativeFeedbackHost,
  releaseNativeFeedbackHost,
} from '@/utils/feedback'
import { useFeedbackHost } from '../C_FeedbackHost/data'

/** 页面生命周期控制展示权，缓存页面不重复展示反馈。 */
export function useNativeFeedbackHost() {
  const host = useFeedbackHost()
  const id = getCurrentInstance()!.uid
  const claim = () => claimNativeFeedbackHost(id)
  const release = () => releaseNativeFeedbackHost(id)
  // Android/PDA 实体返回键先关闭当前交互，保持与遮罩取消相同的结果契约。
  onBackPress(() => {
    if (activeNativeFeedbackHost.value !== id) return false
    if (host.state.sheet) {
      host.cancel()
      return true
    }
    if (host.state.modal) {
      host.cancel()
      return true
    }
    return false
  })
  onMounted(claim)
  onShow(claim)
  onHide(release)
  onUnmounted(release)
  const visible = computed(() => activeNativeFeedbackHost.value === id)
  const hasFeedback = computed(
    () =>
      !!(
        host.state.loading ||
        host.state.modal ||
        host.state.sheet ||
        host.state.toast
      )
  )
  return { ...host, visible, hasFeedback }
}
