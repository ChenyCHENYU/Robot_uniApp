/** Modal 模态框：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'

export const PAGE_META = {
  name: 'modal',
  title: '模态框',
  component: 'C_Modal',
  summary: '信息确认与交互弹窗',
  category: '反馈',
  instruction: '打开弹窗并选择确认或取消，结果会保留在页面中。',
  number: '18',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const showConfirm = ref(false)

  const showAlert = ref(false)

  const showCustom = ref(false)

  const showClose = ref(false)

  const actionResult = ref('')

  function onConfirm() {
    showConfirm.value = false
    actionResult.value = '您点击了确认按钮'
  }
  function onCancel() {
    showConfirm.value = false
    actionResult.value = '已取消演示操作'
  }
  return {
    showConfirm,
    showAlert,
    showCustom,
    showClose,
    actionResult,
    onConfirm,
    onCancel,
  }
}
