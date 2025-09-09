<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-08 15:34:18
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-09-09
 * @FilePath: \Robot_uniApp\src\pages\login\index.vue
 * @Description: 登录页面 - 主模板文件
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
      </view>
    </view>

    <!-- 主体内容 -->
    <view class="login-container">
      <!-- Logo 区域 -->
      <view class="logo-section">
        <view class="logo-wrapper">
          <view class="logo-bg">
            <u-icon name="robot" size="80" color="#ffffff"></u-icon>
          </view>
        </view>
        <text class="app-name">Robot App</text>
        <text class="app-desc">智能机器人移动端平台</text>
        <text class="app-version">让你的体验更加丝滑</text>
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
            <view class="input-wrapper" :class="{'input-error': errors.username}">
              <u-icon
                name="account"
                size="20"
                color="rgba(255,255,255,0.7)"
              ></u-icon>
              <u-input
                v-model="form.username"
                placeholder="用户名或邮箱"
                border="none"
                :customStyle="glassInputStyle"
                placeholderStyle="color: rgba(255,255,255,0.6)"
                @blur="validateField('username')"
                @input="clearFieldError('username')"
              />
            </view>
            <view v-if="errors.username" class="error-text">{{ errors.username }}</view>
          </view>

          <!-- 密码输入框 -->
          <view class="input-group">
            <view class="input-wrapper" :class="{'input-error': errors.password}">
              <u-icon
                name="lock"
                size="20"
                color="rgba(255,255,255,0.7)"
              ></u-icon>
              <u-input
                v-model="form.password"
                type="password"
                placeholder="密码"
                border="none"
                :customStyle="glassInputStyle"
                placeholderStyle="color: rgba(255,255,255,0.6)"
                @blur="validateField('password')"
                @input="clearFieldError('password')"
              />
            </view>
            <view v-if="errors.password" class="error-text">{{ errors.password }}</view>
          </view>
        </view>

        <!-- 记住登录和忘记密码 -->
          <view class="form-options">
            <u-checkbox-group v-model="rememberLogin">
              <u-checkbox name="remember" activeColor="#00D4FF" size="16">
                <text class="option-text">记住登录</text>
              </u-checkbox>
            </u-checkbox-group>
            <text class="forgot-link" @click="handleForgotPassword"
              >忘记密码？</text
            >
          </view>

        <!-- 登录按钮 -->
        <view class="login-btn-wrapper">
          <u-button
            @click="handleLogin"
            :loading="loading"
            :customStyle="glassButtonStyle"
            shape="circle"
          >
            <text class="btn-text">{{
              loading ? "登录中..." : "立即登录"
            }}</text>
          </u-button>
        </view>

        <!-- 分割线 -->
        <view class="divider">
          <view class="divider-line"></view>
          <text class="divider-text">或者使用</text>
          <view class="divider-line"></view>
        </view>

        <!-- 第三方登录 -->
        <view class="social-login">
          <view class="social-btn" @click="handleQuickLogin">
            <u-icon name="zap" size="24" color="#00D4FF"></u-icon>
            <text>快速体验</text>
          </view>
          <view class="social-btn" @click="handleWechatLogin">
            <u-icon name="weixin-fill" size="24" color="#09bb07"></u-icon>
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

<script setup>
import { useLoginData } from "./data.js";

// 使用数据和逻辑
const {
  // 响应式数据
  loading,
  rememberLogin,
  form,
  errors,
  formRef,
  glassInputStyle,
  glassButtonStyle,

  // 方法
  handleLogin,
  handleForgotPassword,
  handleWechatLogin,
  handleQuickLogin,
  validateForm,
  validateField,
  clearFieldError,
  clearForm,
  resetFormValidation
} = useLoginData();
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
