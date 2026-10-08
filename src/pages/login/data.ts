/**
 * @Description: 登录页面数据和逻辑
 */

import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { loginBySms } from '@/api'
import { consumeRedirectUrl } from '@/utils/router'
import type { HttpError } from '@/utils/http'
import {
  required,
  length,
  quickValidate,
  validateWithToast,
} from '@/utils/v_verify'

/** 记住用户名的本地存储 key（仅存用户名，不存密码） */
const REMEMBERED_USERNAME_KEY = 'remembered_username'

export function useLoginData() {
  const userStore = useUserStore()
  const loading = ref(false)
  const rememberLogin = ref<string[]>([])

  // 表单数据（模板演示预填，生产接入时移除）
  const form = reactive({
    username: 'CHENY',
    password: '123456',
  })

  // 表单验证规则
  const rules = {
    username: [
      required('用户名'),
      length('用户名', 3, 20),
      {
        validator: (rule, value, callback) => {
          if (!value) {
            callback()
            return
          }
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/

          if (emailPattern.test(value) || usernamePattern.test(value)) {
            callback()
          } else {
            callback(new Error('请输入正确的用户名或邮箱格式'))
          }
        },
        trigger: 'blur',
      },
    ],
    password: [required('密码'), length('密码', 6, 20)],
  }

  // 回填记住的用户名
  onMounted(() => {
    const saved = uni.getStorageSync(REMEMBERED_USERNAME_KEY)
    if (saved) {
      form.username = String(saved)
      rememberLogin.value = ['remember']
    }
  })

  // 切换记住登录
  const toggleRemember = () => {
    if (rememberLogin.value.includes('remember')) {
      rememberLogin.value = []
    } else {
      rememberLogin.value = ['remember']
    }
  }

  // 字段失焦验证
  const handleFieldBlur = (field: 'username' | 'password') => {
    const value = form[field]
    const fieldRules = rules[field]
    const result = quickValidate(value, fieldRules, field)

    if (!result.valid) {
      uni.showToast({
        title: result.message,
        icon: 'none',
        duration: 2000,
      })
    }
  }

  // 登录成功后的统一跳转（优先回跳 401 前的来源页）
  const redirectAfterLogin = () => {
    const target = consumeRedirectUrl()
    uni.reLaunch({ url: target })
  }

  // 登录处理（走 userStore.login → API → mock 拦截）
  const handleLogin = async () => {
    if (!validateWithToast(form, rules)) {
      return
    }

    loading.value = true
    try {
      await userStore.login({
        username: form.username.trim(),
        password: form.password,
      })

      // 记住登录：仅持久化用户名
      if (rememberLogin.value.includes('remember')) {
        uni.setStorageSync(REMEMBERED_USERNAME_KEY, form.username.trim())
      } else {
        uni.removeStorageSync(REMEMBERED_USERNAME_KEY)
      }

      uni.showToast({ title: '登录成功！', icon: 'success' })

      setTimeout(() => {
        redirectAfterLogin()
      }, 800)
    } catch (error) {
      const err = error as HttpError
      uni.showToast({
        title: err?.message || '登录失败，请重试',
        icon: 'none',
      })
    } finally {
      loading.value = false
    }
  }

  // 忘记密码
  const handleForgotPassword = () => {
    uni.showToast({
      title: '请联系管理员重置密码',
      icon: 'none',
      duration: 2000,
    })
  }

  // 微信登录（小程序端）
  const handleWechatLogin = () => {
    // #ifdef MP-WEIXIN
    uni.login({
      provider: 'weixin',
      success: res => {
        // TODO: 将 res.code 发送到后端换取 token（code2Session）
        uni.showToast({
          title: `已获取微信凭证 ${res.code ? '成功' : '失败'}`,
          icon: 'none',
        })
      },
      fail: () => {
        uni.showToast({ title: '微信登录已取消', icon: 'none' })
      },
    })
    // #endif
    // #ifndef MP-WEIXIN
    uni.showToast({
      title: '微信登录仅在小程序中可用',
      icon: 'none',
    })
    // #endif
  }

  return {
    // 响应式数据
    loading,
    rememberLogin,
    form,

    // 方法
    handleLogin,
    handleForgotPassword,
    handleWechatLogin,
    handleFieldBlur,
    toggleRemember,
    redirectAfterLogin,
  }
}

/** 短信验证码登录（供手机号登录 Tab 使用） */
export function useSmsLogin() {
  const userStore = useUserStore()
  const phoneForm = reactive({
    phone: '',
    code: '',
  })

  const smsCountdown = ref(0)

  const sendSmsCode = () => {
    if (!/^1\d{10}$/.test(phoneForm.phone)) {
      uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    if (smsCountdown.value > 0) return
    // TODO: 对接真实短信发送接口
    smsCountdown.value = 60
    uni.showToast({ title: '验证码已发送（演示）', icon: 'none' })
  }

  const handleSmsLogin = async () => {
    if (!/^1\d{10}$/.test(phoneForm.phone)) {
      uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    if (!/^\d{4,6}$/.test(phoneForm.code)) {
      uni.showToast({ title: '请输入正确的验证码', icon: 'none' })
      return
    }
    try {
      const result = await loginBySms({
        phone: phoneForm.phone,
        code: phoneForm.code,
      })
      userStore.token = result.token
      userStore.loginTime = new Date().toISOString()
      await userStore.fetchUserInfo().catch(() => {})
      uni.showToast({ title: '登录成功！', icon: 'success' })
      setTimeout(() => {
        uni.reLaunch({ url: consumeRedirectUrl() })
      }, 800)
    } catch (error) {
      const err = error as HttpError
      uni.showToast({ title: err?.message || '登录失败', icon: 'none' })
    }
  }

  return { phoneForm, smsCountdown, sendSmsCode, handleSmsLogin }
}
