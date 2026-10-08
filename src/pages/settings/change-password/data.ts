import { ref, reactive, computed } from 'vue'
import { changePassword } from '@/api'

/** 页面状态、加载与交互。 */
export function useSettingsChangePasswordPage() {
  const formData = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const showOldPwd = ref(false)
  const showNewPwd = ref(false)
  const showConfirmPwd = ref(false)
  const submitting = ref(false)

  const hasNumber = computed(() => /\d/.test(formData.newPassword))
  const hasLetter = computed(() => /[a-zA-Z]/.test(formData.newPassword))

  const passwordStrength = computed(() => {
    const pwd = formData.newPassword
    if (!pwd) return 0
    let score = 0
    if (pwd.length >= 6) score++
    if (/\d/.test(pwd) && /[a-zA-Z]/.test(pwd)) score++
    if (pwd.length >= 10 && /[^a-zA-Z0-9]/.test(pwd)) score++
    return score
  })

  const strengthColor = computed(() => {
    const colors = ['#f56c6c', '#e6a23c', '#67c23a']
    return colors[passwordStrength.value - 1] || '#c0c4cc'
  })

  const strengthLabel = computed(() => {
    const labels = ['弱', '中', '强']
    return labels[passwordStrength.value - 1] || ''
  })

  const confirmError = computed(() => {
    if (!formData.confirmPassword) return ''
    if (formData.confirmPassword !== formData.newPassword)
      return '两次密码不一致'
    return ''
  })

  const canSubmit = computed(() => {
    return (
      formData.oldPassword.length > 0 &&
      formData.newPassword.length >= 6 &&
      hasNumber.value &&
      hasLetter.value &&
      formData.confirmPassword === formData.newPassword &&
      !submitting.value
    )
  })

  const handleSubmit = async () => {
    if (!canSubmit.value) return

    submitting.value = true
    try {
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      })
      formData.oldPassword = ''
      formData.newPassword = ''
      formData.confirmPassword = ''
      uni.showToast({ title: '密码修改成功', icon: 'success' })
      setTimeout(() => {
        // 修改密码后回到设置页（真实场景建议强制重新登录）
        uni.navigateBack({
          fail: () => uni.reLaunch({ url: '/pages/settings/index' }),
        })
      }, 1500)
    } catch {
      // 请求层显示业务错误，保留输入供重试。
    } finally {
      submitting.value = false
    }
  }

  return {
    formData,
    showOldPwd,
    showNewPwd,
    showConfirmPwd,
    submitting,
    hasNumber,
    hasLetter,
    passwordStrength,
    strengthColor,
    strengthLabel,
    confirmError,
    canSubmit,
    handleSubmit,
  }
}
