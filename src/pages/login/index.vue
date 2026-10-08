<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-08 15:34:18
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-09-09 14:09:35
 * @FilePath: \Robot_uniApp\src\pages\login\index.vue
 * @Description: 登录页面
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
-->
<template>
  <view class="login-page">
    <!-- 动态背景 -->
    <view class="bg-container">
      <view class="bg-gradient"></view>
      <view class="floating-shapes">
        <view class="shape shape-1"></view>
        <view class="shape shape-2"></view>
        <view class="shape shape-3"></view>
        <view class="shape shape-4"></view>
        <view class="shape shape-5"></view>
        <view class="shape shape-6"></view>
      </view>
    </view>

    <!-- 主体内容 -->
    <view class="login-container">
      <!-- 品牌区 -->
      <view class="brand">
        <view class="brand__icon">
          <view class="brand__antenna"></view>
          <text class="brand__letter">R</text>
          <view class="brand__gloss"></view>
        </view>
        <text class="brand__name">Robot App</text>
        <text class="brand__tagline">企业级跨端移动应用框架</text>
      </view>

      <!-- 玻璃风登录卡片 -->
      <view class="glass-card">
        <view class="card-header">
          <text class="card-title">欢迎回来</text>
          <text class="card-subtitle">请使用您的账户登录</text>
        </view>

        <!-- 登录方式切换（滑动指示条） -->
        <view class="seg">
          <view
            class="seg__indicator"
            :class="{ 'is-phone': loginMode === 'phone' }"
          ></view>
          <view
            class="seg__item"
            :class="{ 'is-active': loginMode === 'account' }"
            @click="loginMode = 'account'"
          >
            <text class="seg__text">账号登录</text>
          </view>
          <view
            class="seg__item"
            :class="{ 'is-active': loginMode === 'phone' }"
            @click="loginMode = 'phone'"
          >
            <text class="seg__text">手机登录</text>
          </view>
        </view>

        <view class="form-wrapper">
          <!-- 账号登录模式 -->
          <template v-if="loginMode === 'account'">
            <!-- 用户名输入框 -->
            <view class="input-group">
              <view class="input-wrapper">
                <wd-icon
                  name="user"
                  size="16px"
                  color="rgba(255,255,255,0.7)"
                ></wd-icon>
                <input
                  v-model="form.username"
                  placeholder="用户名或邮箱"
                  class="glass-input"
                  placeholder-style="color: rgba(255,255,255,0.6)"
                  @blur="handleFieldBlur('username')"
                />
                <view
                  v-if="form.username"
                  class="input-action"
                  @click="form.username = ''"
                >
                  <wd-icon
                    name="close-circle-filled"
                    size="14px"
                    color="rgba(255,255,255,0.55)"
                  />
                </view>
              </view>
            </view>

            <!-- 密码输入框（图标 + 清除 + 显示/隐藏） -->
            <view class="input-group">
              <view class="input-wrapper">
                <wd-icon
                  name="lock-on"
                  size="16px"
                  color="rgba(255,255,255,0.7)"
                ></wd-icon>
                <input
                  v-model="form.password"
                  :type="passwordVisible ? 'text' : 'password'"
                  :password="!passwordVisible"
                  placeholder="密码"
                  class="glass-input"
                  placeholder-style="color: rgba(255,255,255,0.6)"
                  @blur="handleFieldBlur('password')"
                />
                <view
                  v-if="form.password"
                  class="input-action"
                  @click="form.password = ''"
                >
                  <wd-icon
                    name="close-circle-filled"
                    size="14px"
                    color="rgba(255,255,255,0.55)"
                  />
                </view>
                <view
                  class="input-action"
                  @click="passwordVisible = !passwordVisible"
                >
                  <wd-icon
                    :name="passwordVisible ? 'view' : 'eye-close'"
                    size="15px"
                    color="rgba(255,255,255,0.55)"
                  />
                </view>
              </view>
            </view>
          </template>

          <!-- 手机登录模式 -->
          <template v-else>
            <view class="input-group">
              <view class="input-wrapper">
                <wd-icon
                  name="phone"
                  size="20px"
                  color="rgba(255,255,255,0.7)"
                ></wd-icon>
                <input
                  v-model="phoneForm.phone"
                  type="number"
                  maxlength="11"
                  placeholder="手机号码"
                  class="glass-input"
                  placeholder-style="color: rgba(255,255,255,0.6)"
                />
              </view>
            </view>

            <view class="input-group">
              <view class="input-wrapper sms-wrapper">
                <wd-icon
                  name="secured"
                  size="16px"
                  color="rgba(255,255,255,0.7)"
                ></wd-icon>
                <input
                  v-model="phoneForm.code"
                  type="number"
                  maxlength="6"
                  placeholder="验证码"
                  class="glass-input sms-input"
                  placeholder-style="color: rgba(255,255,255,0.6)"
                />
                <view
                  class="sms-btn"
                  :class="{ disabled: smsCountdown > 0 }"
                  @click="handleSendSms"
                >
                  <text class="sms-text">{{
                    smsCountdown > 0 ? `${smsCountdown}s` : '获取验证码'
                  }}</text>
                </view>
              </view>
            </view>
          </template>
        </view>

        <!-- 记住登录和忘记密码 -->
        <view class="form-options">
          <view
            class="flex items-center"
            @click="toggleRemember"
          >
            <wd-icon
              :name="
                rememberLogin.includes('remember') ? 'check-circle' : 'circle'
              "
              size="16px"
              :color="
                rememberLogin.includes('remember')
                  ? '#00D4FF'
                  : 'rgba(255,255,255,0.5)'
              "
            />
            <text class="option-text ml-1">记住登录</text>
          </view>
          <text
            class="forgot-link"
            @click="handleForgotPassword"
            >忘记密码？</text
          >
        </view>

        <!-- 登录按钮 -->
        <view class="login-btn-wrapper">
          <view
            class="login-btn"
            :class="{ 'is-loading': loading }"
            @click="loginMode === 'account' ? handleLogin() : handleSmsLogin()"
          >
            <C_LoadingIndicator
              v-if="loading"
              size="small"
              color="var(--r-on-primary, #ffffff)"
            />
            <text class="btn-text">{{
              loading ? '登录中...' : '立即登录'
            }}</text>
          </view>
        </view>

        <!-- 仅实际开启演示拦截时显示账号提示 -->
        <view
          v-if="mockEnabled"
          class="demo-hint"
        >
          <text class="demo-hint-text"
            >演示账号：CHENY / 123456（本地演示模式）</text
          >
        </view>

        <!-- #ifdef MP-WEIXIN -->
        <!-- 分割线 -->
        <view class="divider">
          <view class="divider-line"></view>
          <text class="divider-text">或者使用</text>
          <view class="divider-line"></view>
        </view>

        <!-- 第三方登录（仅小程序） -->
        <view class="social-login">
          <view
            class="social-btn"
            @click="handleWechatLogin"
          >
            <view
              class="i-mdi-wechat"
              style="font-size: 24px; color: #09bb07"
            ></view>
            <text>微信登录</text>
          </view>
        </view>
        <!-- #endif -->
      </view>
    </view>

    <!-- 底部信息 -->
    <view class="footer">
      <text class="copyright">© 2025 CHENY.智启未来 · v{{ appVersion }}</text>
    </view>
    <!-- #ifndef H5 -->
    <C_NativeFeedbackHost />
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
  import { ref, onUnmounted } from 'vue'
  import { useLoginData, useSmsLogin } from './data'
  import config from '@/config/env'
  import C_LoadingIndicator from '@/components/global/C_LoadingIndicator/index.vue'
  // #ifndef H5
  import C_NativeFeedbackHost from '@/components/global/C_NativeFeedbackHost/index.vue'
  // #endif

  const mockEnabled = config.MOCK_ENABLED
  const appVersion = config.APP_VERSION

  // 登录方式切换
  const loginMode = ref<'account' | 'phone'>('account')

  // 密码可见性切换（眼睛图标）
  const passwordVisible = ref(false)

  // 手机登录（短信验证码走 /auth/sms-login）
  const { phoneForm, smsCountdown, sendSmsCode, handleSmsLogin } = useSmsLogin()

  let smsTimer: ReturnType<typeof setInterval> | null = null

  const handleSendSms = () => {
    const before = smsCountdown.value
    sendSmsCode()
    if (smsCountdown.value > 0 && before === 0) startCountdown()
  }

  // 倒计时驱动
  const startCountdown = () => {
    smsTimer = setInterval(() => {
      smsCountdown.value--
      if (smsCountdown.value <= 0 && smsTimer) {
        clearInterval(smsTimer)
        smsTimer = null
      }
    }, 1000)
  }

  // 页面卸载清理定时器
  onUnmounted(() => {
    if (smsTimer) {
      clearInterval(smsTimer)
      smsTimer = null
    }
  })

  // 使用数据和逻辑
  const {
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
  } = useLoginData()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
