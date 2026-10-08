/** Form 表单：仅在当前页面维护演示状态，不调用业务接口。 */
import { computed, ref } from 'vue'

export const PAGE_META = {
  name: 'form',
  title: '表单',
  component: 'C_Form',
  summary: '数据收集与校验',
  category: '表单',
  instruction: '填写必填内容后提交；尝试留空提交，再重置表单。',
  number: '10',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const formRef = ref<{
    validate: () => boolean
    resetValidation: () => void
    errors: Record<string, string>
  } | null>(null)
  const formErrors = computed(() => formRef.value?.errors ?? {})

  const formData = ref({ username: '', password: '', remark: '' })

  const validateResult = ref('')

  const rules = {
    username: [{ required: true, message: '请输入用户名' }],
    password: [{ required: true, message: '请输入密码' }],
  }

  async function onSubmit() {
    const valid = await formRef.value?.validate()
    if (valid) {
      validateResult.value = '校验通过'
      uni.showToast({ title: '演示校验通过', icon: 'success' })
    } else {
      validateResult.value = '校验失败，请检查必填项'
    }
  }

  function onReset() {
    formData.value = { username: '', password: '', remark: '' }
    formRef.value?.resetValidation()
    validateResult.value = ''
  }
  return {
    formRef,
    formData,
    formErrors,
    validateResult,
    rules,
    onSubmit,
    onReset,
  }
}
