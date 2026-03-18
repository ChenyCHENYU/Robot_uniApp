<!--
 * @Description: 注册页面 - 玻璃拟态风格
-->
<template>
  <view class="register-page">
    <!-- 动态背景 -->
    <view class="bg-container">
      <view class="bg-gradient"></view>
      <view class="floating-shapes">
        <view class="shape shape-1"></view>
        <view class="shape shape-2"></view>
        <view class="shape shape-3"></view>
      </view>
    </view>

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
            color="rgba(255,255,255,0.9)"
          />
        </view>
      </view>

      <!-- Logo 区域 -->
      <view class="logo-section">
        <text class="app-name">创建账户</text>
        <text class="app-desc">加入 Robot App，开启智能生活</text>
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
                color="rgba(255,255,255,0.7)"
              />
              <input
                v-model="form.username"
                placeholder="用户名"
                class="glass-input"
                placeholder-style="color: rgba(255,255,255,0.5)"
              />
            </view>
          </view>
          <view class="input-group">
            <view class="input-wrapper">
              <wd-icon
                name="chat"
                size="20px"
                color="rgba(255,255,255,0.7)"
              />
              <input
                v-model="form.email"
                placeholder="邮箱地址"
                class="glass-input"
                placeholder-style="color: rgba(255,255,255,0.5)"
              />
            </view>
          </view>
          <view class="input-group">
            <view class="input-wrapper">
              <wd-icon
                name="lock"
                size="20px"
                color="rgba(255,255,255,0.7)"
              />
              <input
                v-model="form.password"
                type="password"
                placeholder="密码"
                class="glass-input"
                placeholder-style="color: rgba(255,255,255,0.5)"
              />
            </view>
          </view>
          <view class="input-group">
            <view class="input-wrapper">
              <wd-icon
                name="lock"
                size="20px"
                color="rgba(255,255,255,0.7)"
              />
              <input
                v-model="form.confirmPassword"
                type="password"
                placeholder="确认密码"
                class="glass-input"
                placeholder-style="color: rgba(255,255,255,0.5)"
              />
            </view>
          </view>
        </template>

        <!-- 手机号注册 -->
        <template v-if="mode === 'phone'">
          <view class="input-group">
            <view class="input-wrapper">
              <wd-icon
                name="chat"
                size="20px"
                color="rgba(255,255,255,0.7)"
              />
              <input
                v-model="form.phone"
                type="number"
                placeholder="手机号"
                class="glass-input"
                placeholder-style="color: rgba(255,255,255,0.5)"
              />
            </view>
          </view>
          <view class="input-group">
            <view class="input-wrapper code-wrapper">
              <wd-icon
                name="lock"
                size="20px"
                color="rgba(255,255,255,0.7)"
              />
              <input
                v-model="form.code"
                type="number"
                placeholder="验证码"
                class="glass-input"
                placeholder-style="color: rgba(255,255,255,0.5)"
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
                name="lock"
                size="20px"
                color="rgba(255,255,255,0.7)"
              />
              <input
                v-model="form.password"
                type="password"
                placeholder="设置密码"
                class="glass-input"
                placeholder-style="color: rgba(255,255,255,0.5)"
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
            :color="agreed ? '#00D4FF' : 'rgba(255,255,255,0.5)'"
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
          <wd-loading
            v-if="loading"
            :size="20"
            color="#ffffff"
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
  </view>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'

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

  let timer: ReturnType<typeof setInterval> | null = null

  const sendCode = () => {
    if (countdown.value > 0 || !form.phone) return
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0 && timer) {
        clearInterval(timer)
        timer = null
      }
    }, 1000)
    uni.showToast({ title: '验证码已发送', icon: 'none' })
  }

  const handleRegister = () => {
    if (!agreed.value) {
      uni.showToast({ title: '请先同意用户协议', icon: 'none' })
      return
    }
    loading.value = true
    setTimeout(() => {
      loading.value = false
      uni.showToast({ title: '注册成功', icon: 'success' })
      setTimeout(() => goLogin(), 1500)
    }, 2000)
  }

  const goBack = () => uni.navigateBack()
  const goLogin = () => uni.navigateBack()
  const showAgreement = (type: string) => {
    uni.showToast({
      title: `查看${type === 'user' ? '用户协议' : '隐私政策'}`,
      icon: 'none',
    })
  }
</script>

<style lang="scss" scoped>
  .register-page {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }

  .bg-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;

    .bg-gradient {
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        #0a0a2e 0%,
        #1a1a4e 30%,
        #2d1b69 60%,
        #0d0d3d 100%
      );
    }

    .floating-shapes {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      .shape {
        position: absolute;
        border-radius: 50%;
        opacity: 0.15;
        background: linear-gradient(135deg, #00d4ff, #7b2ff7);

        &-1 {
          width: 300rpx;
          height: 300rpx;
          top: -50rpx;
          right: -80rpx;
        }
        &-2 {
          width: 200rpx;
          height: 200rpx;
          bottom: 200rpx;
          left: -60rpx;
        }
        &-3 {
          width: 150rpx;
          height: 150rpx;
          top: 40%;
          right: 20rpx;
        }
      }
    }
  }

  .register-container {
    position: relative;
    z-index: 1;
    padding: 0 48rpx;
    padding-top: calc(var(--status-bar-height, 44px) + 20rpx);
  }

  .top-bar {
    .back-btn {
      width: 72rpx;
      height: 72rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      backdrop-filter: blur(10px);
    }
  }

  .logo-section {
    margin: 40rpx 0 32rpx;

    .app-name {
      display: block;
      font-size: 48rpx;
      font-weight: 700;
      color: #fff;
    }

    .app-desc {
      display: block;
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.6);
      margin-top: 12rpx;
    }
  }

  .mode-tabs {
    display: flex;
    gap: 24rpx;
    margin-bottom: 32rpx;

    .mode-tab {
      padding: 12rpx 32rpx;
      border-radius: 40rpx;
      background: rgba(255, 255, 255, 0.08);
      transition: all 0.3s;

      &.active {
        background: rgba(0, 212, 255, 0.2);
        border: 1px solid rgba(0, 212, 255, 0.4);
      }

      .mode-text {
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  .glass-card {
    padding: 40rpx 32rpx;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    border-radius: 32rpx;
    border: 1rpx solid rgba(255, 255, 255, 0.12);
  }

  .input-group {
    margin-bottom: 24rpx;

    .input-wrapper {
      display: flex;
      align-items: center;
      gap: 16rpx;
      padding: 0 24rpx;
      height: 96rpx;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 20rpx;
      border: 1rpx solid rgba(255, 255, 255, 0.1);

      &.code-wrapper {
        padding-right: 12rpx;
      }
    }

    .glass-input {
      flex: 1;
      height: 96rpx;
      font-size: 28rpx;
      color: #fff;
      background: transparent;
    }
  }

  .code-btn {
    padding: 12rpx 24rpx;
    background: rgba(0, 212, 255, 0.2);
    border-radius: 12rpx;
    white-space: nowrap;

    &.disabled {
      opacity: 0.5;
    }

    .code-text {
      font-size: 24rpx;
      color: #00d4ff;
    }
  }

  .agreement {
    display: flex;
    align-items: flex-start;
    gap: 10rpx;
    margin: 24rpx 0 32rpx;

    .agreement-text {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.5;

      .link {
        color: #00d4ff;
      }
    }
  }

  .register-btn {
    height: 96rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    background: linear-gradient(135deg, #00d4ff, #7b2ff7);
    border-radius: 20rpx;

    &.is-loading {
      opacity: 0.7;
    }

    .btn-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #fff;
    }
  }

  .login-link {
    display: flex;
    justify-content: center;
    gap: 8rpx;
    margin-top: 40rpx;
    padding-bottom: 60rpx;

    .link-text {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.5);
    }

    .link-action {
      font-size: 26rpx;
      color: #00d4ff;
    }
  }
</style>
