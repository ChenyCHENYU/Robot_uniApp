<!--
 * @Description: 注册页面 - 玻璃拟态风格
-->
<template>
  <view class="register-page">
    <view class="register-container">
      <!-- 顶部返回 -->
      <view class="top-bar">
        <view
          class="back-btn"
          @click="goBack"
        >
          <wd-icon
            name="arrow-left"
            size="20px"
            color="var(--r-text-primary)"
          />
        </view>
      </view>

      <!-- Logo 区域 -->
      <view class="logo-section">
        <text class="app-name">创建账户</text>
        <text class="app-desc">填写账户信息，开始使用 Robot App</text>
      </view>

      <!-- 注册方式切换 -->
      <view class="mode-tabs">
        <view
          v-for="m in modes"
          :key="m.key"
          class="mode-tab"
          :class="{ active: mode === m.key }"
          @click="mode = m.key"
        >
          <text class="mode-text">{{ m.label }}</text>
        </view>
      </view>

      <!-- 玻璃风注册卡片 -->
      <view class="glass-card">
        <!-- 账号注册 -->
        <template v-if="mode === 'account'">
          <view class="input-group">
            <view class="input-wrapper">
              <wd-icon
                name="user"
                size="20px"
                color="var(--r-text-secondary)"
              />
              <input
                v-model="form.username"
                placeholder="用户名"
                class="glass-input"
                placeholder-style="color:var(--r-text-secondary)"
              />
            </view>
          </view>
          <view class="input-group">
            <view class="input-wrapper">
              <wd-icon
                name="chat"
                size="20px"
                color="var(--r-text-secondary)"
              />
              <input
                v-model="form.email"
                placeholder="邮箱地址"
                class="glass-input"
                placeholder-style="color:var(--r-text-secondary)"
              />
            </view>
          </view>
          <view class="input-group">
            <view class="input-wrapper">
              <wd-icon
                name="lock-on"
                size="20px"
                color="var(--r-text-secondary)"
              />
              <input
                v-model="form.password"
                type="password"
                placeholder="密码"
                class="glass-input"
                placeholder-style="color:var(--r-text-secondary)"
              />
            </view>
          </view>
          <view class="input-group">
            <view class="input-wrapper">
              <wd-icon
                name="lock-on"
                size="20px"
                color="var(--r-text-secondary)"
              />
              <input
                v-model="form.confirmPassword"
                type="password"
                placeholder="确认密码"
                class="glass-input"
                placeholder-style="color:var(--r-text-secondary)"
              />
            </view>
          </view>
        </template>

        <!-- 手机号注册 -->
        <template v-if="mode === 'phone'">
          <text class="register-note"
            >手机号注册需要短信服务，当前请使用账号注册。</text
          >
          <view class="input-group">
            <view class="input-wrapper">
              <wd-icon
                name="chat"
                size="20px"
                color="var(--r-text-secondary)"
              />
              <input
                v-model="form.phone"
                type="number"
                placeholder="手机号"
                class="glass-input"
                placeholder-style="color:var(--r-text-secondary)"
              />
            </view>
          </view>
          <view class="input-group">
            <view class="input-wrapper code-wrapper">
              <wd-icon
                name="lock-on"
                size="20px"
                color="var(--r-text-secondary)"
              />
              <input
                v-model="form.code"
                type="number"
                placeholder="验证码"
                class="glass-input"
                placeholder-style="color:var(--r-text-secondary)"
              />
              <view
                class="code-btn"
                :class="{ disabled: countdown > 0 }"
                @click="sendCode"
              >
                <text class="code-text">{{
                  countdown > 0 ? `${countdown}s` : '获取验证码'
                }}</text>
              </view>
            </view>
          </view>
          <view class="input-group">
            <view class="input-wrapper">
              <wd-icon
                name="lock-on"
                size="20px"
                color="var(--r-text-secondary)"
              />
              <input
                v-model="form.password"
                type="password"
                placeholder="设置密码"
                class="glass-input"
                placeholder-style="color:var(--r-text-secondary)"
              />
            </view>
          </view>
        </template>

        <!-- 协议 -->
        <view
          class="agreement"
          @click="agreed = !agreed"
        >
          <wd-icon
            :name="agreed ? 'check-circle' : 'circle'"
            size="16px"
            :color="
              agreed ? 'var(--r-color-primary)' : 'var(--r-text-secondary)'
            "
          />
          <text class="agreement-text">
            我已阅读并同意
            <text
              class="link"
              @click.stop="showAgreement('user')"
              >《用户协议》</text
            >
            和
            <text
              class="link"
              @click.stop="showAgreement('privacy')"
              >《隐私政策》</text
            >
          </text>
        </view>

        <!-- 注册按钮 -->
        <view
          class="register-btn"
          :class="{ 'is-loading': loading }"
          @click="handleRegister"
        >
          <C_LoadingIndicator
            v-if="loading"
            size="small"
            color="var(--r-on-primary, #fff)"
          />
          <text class="btn-text">{{ loading ? '注册中...' : '立即注册' }}</text>
        </view>
      </view>

      <!-- 已有账号 -->
      <view class="login-link">
        <text class="link-text">已有账号？</text>
        <text
          class="link-action"
          @click="goLogin"
          >立即登录</text
        >
      </view>
    </view>
    <!-- #ifndef H5 -->
    <C_NativeFeedbackHost />
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
  import { useRegisterData } from './data'
  import C_LoadingIndicator from '@/components/global/C_LoadingIndicator/index.vue'
  // #ifndef H5
  import C_NativeFeedbackHost from '@/components/global/C_NativeFeedbackHost/index.vue'
  // #endif
  const {
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
  } = useRegisterData()
</script>
<style lang="scss" scoped>
  @import './index.scss';
</style>
