import { computed, getCurrentInstance, onMounted, onUnmounted } from 'vue'
import { onShow, onHide } from '@dcloudio/uni-app'
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
  onMounted(claim)
  onShow(claim)
  onHide(release)
  onUnmounted(release)
  const visible = computed(() => activeNativeFeedbackHost.value === id)
  const hasFeedback = computed(
    () => !!(host.state.loading || host.state.modal || host.state.toast)
  )
  return { ...host, visible, hasFeedback }
}
