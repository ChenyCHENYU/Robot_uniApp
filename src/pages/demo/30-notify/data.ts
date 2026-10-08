/** Notify 消息通知：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'

export const PAGE_META = {
  name: 'notify',
  title: '消息通知',
  component: 'C_Notify',
  summary: '顶部弹出消息提示',
  category: '反馈',
  instruction: '触发不同通知并观察持续时间；连续触发会重新计时。',
  number: '30',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const notifyVisible = ref(false)
  const notifyKey = ref(0)

  const notifyType = ref<string>('primary')

  const notifyMessage = ref('')

  const notifyDuration = ref(3000)

  const messages: Record<string, string> = {
    primary: '这是一条主要通知',
    success: '操作成功',
    warning: '请注意操作安全',
    danger: '操作失败，请重试',
  }

  function showNotify(type: string) {
    notifyType.value = type
    notifyMessage.value = messages[type]
    notifyDuration.value = 3000
    notifyKey.value++
    notifyVisible.value = true
  }

  function showLong() {
    notifyType.value = 'primary'
    notifyMessage.value = '这条通知将展示 5 秒钟'
    notifyDuration.value = 5000
    notifyKey.value++
    notifyVisible.value = true
  }

  function showShort() {
    notifyType.value = 'primary'
    notifyMessage.value = '这条通知只展示 1 秒'
    notifyDuration.value = 1000
    notifyKey.value++
    notifyVisible.value = true
  }
  return {
    notifyVisible,
    notifyKey,
    notifyType,
    notifyMessage,
    notifyDuration,
    showNotify,
    showLong,
    showShort,
  }
}
