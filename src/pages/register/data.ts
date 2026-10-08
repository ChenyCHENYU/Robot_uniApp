import { ref, reactive } from 'vue'
import { register } from '@/api'

export function useRegisterData() {
  const mode = ref<'account' | 'phone'>('account')
  const loading = ref(false)
  const agreed = ref(false)
  const countdown = ref(0)

  const modes = [
    { key: 'account' as const, label: '账号注册' },
    { key: 'phone' as const, label: '手机注册' },
  ]

  const form = reactive({
    username: '',
    email: '',
    phone: '',
    code: '',
    password: '',
    confirmPassword: '',
  })

  /** 表单校验（注册前全量校验） */
  const validateForm = (): boolean => {
    if (mode.value === 'account') {
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) {
        uni.showToast({
          title: '用户名需 3-20 位字母/数字/下划线',
          icon: 'none',
        })
        return false
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        uni.showToast({ title: '请输入正确的邮箱地址', icon: 'none' })
        return false
      }
    } else {
      if (!/^1\d{10}$/.test(form.phone)) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
        return false
      }
      if (!/^\d{4,6}$/.test(form.code)) {
        uni.showToast({ title: '请输入正确的验证码', icon: 'none' })
        return false
      }
    }
    if (form.password.length < 6 || form.password.length > 20) {
      uni.showToast({ title: '密码长度需 6-20 位', icon: 'none' })
      return false
    }
    if (mode.value === 'account' && form.password !== form.confirmPassword) {
      uni.showToast({ title: '两次输入的密码不一致', icon: 'none' })
      return false
    }
    return true
  }

  const sendCode = () => {
    uni.showToast({ title: '短信服务尚未接入，请使用账号注册', icon: 'none' })
  }

  const handleRegister = async () => {
    if (loading.value) return
    if (mode.value === 'phone') {
      uni.showToast({ title: '短信服务尚未接入，请使用账号注册', icon: 'none' })
      return
    }
    if (!agreed.value) {
      uni.showToast({ title: '请先同意用户协议', icon: 'none' })
      return
    }
    if (!validateForm()) return
    loading.value = true
    try {
      await register({
        username: form.username.trim(),
        password: form.password,
        email: form.email.trim(),
      })
      uni.showToast({ title: '注册成功', icon: 'success' })
      setTimeout(() => goLogin(), 1500)
    } catch (error) {
      const err = error as { message?: string }
      uni.showToast({ title: err?.message || '注册失败，请重试', icon: 'none' })
    } finally {
      loading.value = false
    }
  }

  /** 返回登录：有页面栈走返回，否则直达登录页 */
  const goBack = () => {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      uni.navigateBack()
    } else {
      uni.reLaunch({ url: '/pages/login/index' })
    }
  }
  const goLogin = () => goBack()
  const showAgreement = (type: string) => {
    uni.showModal({
      title: type === 'user' ? '用户协议' : '隐私政策',
      content: '协议正文尚未配置，请联系应用管理员获取。',
      showCancel: false,
    })
  }

  return {
    mode,
    loading,
    agreed,
    countdown,
    modes,
    form,
    sendCode,
    handleRegister,
    goBack,
    goLogin,
    showAgreement,
  }
}
