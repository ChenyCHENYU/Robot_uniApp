/** NumberKeyboard 数字键盘：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'

export const PAGE_META = {
  name: 'number-keyboard',
  title: '数字键盘',
  component: 'C_NumberKeyboard',
  summary: '安全数字输入组件',
  category: '表单',
  instruction: '点击输入区唤起键盘，对比金额、密码和随机键盘。',
  number: '13',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const inputValue = ref('')

  const dotValue = ref('')

  const pinValue = ref('')

  const randomValue = ref('')

  const showKeyboard = ref(false)

  const showDotKeyboard = ref(false)

  const showPinKeyboard = ref(false)

  const showRandomKeyboard = ref(false)
  return {
    inputValue,
    dotValue,
    pinValue,
    randomValue,
    showKeyboard,
    showDotKeyboard,
    showPinKeyboard,
    showRandomKeyboard,
  }
}
