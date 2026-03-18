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
      <!-- Logo 区域 -->
      <view class="logo-section">
        <view class="logo-wrapper">
          <view class="logo-bg">
            <video
              src="/static/videos/logo.webm"
              style="width: 140rpx; height: 140rpx"
              autoplay
              loop
              muted
              :show-play-btn="false"
              :show-center-play-btn="false"
              :show-progress="false"
              :show-fullscreen-btn="false"
              :enable-progress-gesture="false"
              object-fit="cover"
            ></video>
          </view>
        </view>
        <text class="app-name">Robot App</text>
        <text class="app-desc">机器人移动跨端应用框架</text>
        <text class="app-version">让您的开发和体验更加丝滑</text>
      </view>

      <!-- 玻璃风登录卡片 -->
      <view class="glass-card">
        <view class="card-header">
          <text class="card-title">欢迎回来</text>
          <text class="card-subtitle">请使用您的账户登录</text>
        </view>

        <view class="form-wrapper">
          <!-- 用户名输入框 -->
          <view class="input-group">
            <view class="input-wrapper">
              <wd-icon
                name="user"
                size="20px"
                color="rgba(255,255,255,0.7)"
              ></wd-icon>
              <input
                v-model="form.username"
                placeholder="用户名或邮箱"
                class="glass-input"
                placeholder-style="color: rgba(255,255,255,0.6)"
                @blur="handleFieldBlur('username')"
              />
            </view>
          </view>

          <!-- 密码输入框 -->
          <view class="input-group">
            <view class="input-wrapper">
              <wd-icon
                name="lock"
                size="20px"
                color="rgba(255,255,255,0.7)"
              ></wd-icon>
              <input
                v-model="form.password"
                type="password"
                placeholder="密码"
                class="glass-input"
                placeholder-style="color: rgba(255,255,255,0.6)"
                @blur="handleFieldBlur('password')"
              />
            </view>
          </view>
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
            @click="handleLogin"
          >
            <wd-loading
              v-if="loading"
              :size="20"
              color="#ffffff"
            />
            <text class="btn-text">{{
              loading ? '登录中...' : '立即登录'
            }}</text>
          </view>
        </view>

        <!-- 分割线 -->
        <view class="divider">
          <view class="divider-line"></view>
          <text class="divider-text">或者使用</text>
          <view class="divider-line"></view>
        </view>

        <!-- 第三方登录 -->
        <view class="social-login">
          <view
            class="social-btn"
            @click="handleQuickLogin"
          >
            <wd-icon
              name="fill-camera"
              size="24px"
              color="#00D4FF"
            ></wd-icon>
            <text>快速体验</text>
          </view>
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
      </view>
    </view>

    <!-- 底部信息 -->
    <view class="footer">
      <text class="copyright">© 2025 CHENY.智启未来</text>
      <text class="version">Version 1.0.0</text>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { useLoginData } from './data'

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
    handleQuickLogin,
    handleFieldBlur,
    toggleRemember,
  } = useLoginData()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
