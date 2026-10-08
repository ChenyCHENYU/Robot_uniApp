/** Signature 签名板：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'

export const PAGE_META = {
  name: 'signature',
  title: '签名板',
  component: 'C_Signature',
  summary: '手写电子签名组件',
  category: '表单',
  instruction: '在画布上书写，确认后预览导出结果；支持清除与撤销上一笔。',
  number: '23',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const signatureRef = ref<{ clear: () => void; confirm: () => void } | null>(
    null
  )

  const signResult = ref('')

  function handleClear() {
    signatureRef.value?.clear()
    signResult.value = ''
  }

  function handleConfirm() {
    signatureRef.value?.confirm()
  }
  function onSignatureConfirm(path: string) {
    signResult.value = path
    uni.showToast({ title: '签名已生成', icon: 'success' })
  }
  return {
    signatureRef,
    signResult,
    handleClear,
    handleConfirm,
    onSignatureConfirm,
  }
}
