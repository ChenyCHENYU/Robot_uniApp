<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-08 15:34:18
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-09-08 17:47:57
 * @FilePath: \Robot_uniApp\src\pages\index\login\index.vue
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
        
        <u-form :model="form" ref="formRef" :rules="rules">
          <!-- 用户名输入框 -->
          <view class="input-group">
            <view class="input-wrapper">
              <u-icon name="account" size="20" color="rgba(255,255,255,0.7)"></u-icon>
              <u-input 
                v-model="form.username" 
                placeholder="用户名或邮箱"
                border="none"
                :customStyle="glassInputStyle"
                placeholderStyle="color: rgba(255,255,255,0.6)"
              />
            </view>
          </view>
          
          <!-- 密码输入框 -->
          <view class="input-group">
            <view class="input-wrapper">
              <u-icon name="lock" size="20" color="rgba(255,255,255,0.7)"></u-icon>
              <u-input
                v-model="form.password"
                type="password"
                placeholder="密码"
                border="none"
                :customStyle="glassInputStyle"
                placeholderStyle="color: rgba(255,255,255,0.6)"
              />
            </view>
          </view>
          
          <!-- 记住登录和忘记密码 -->
          <view class="form-options">
            <u-checkbox-group v-model="rememberLogin">
              <u-checkbox name="remember" activeColor="#00D4FF" size="16">
                <text class="option-text">记住登录</text>
              </u-checkbox>
            </u-checkbox-group>
            <text class="forgot-link" @click="handleForgotPassword">忘记密码？</text>
          </view>
          
          <!-- 登录按钮 -->
          <view class="login-btn-wrapper">
            <u-button 
              @click="handleLogin" 
              :loading="loading"
              :customStyle="glassButtonStyle"
              shape="circle"
            >
              <text class="btn-text">{{ loading ? '登录中...' : '立即登录' }}</text>
            </u-button>
          </view>
        </u-form>
        
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
import { ref, reactive } from "vue";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
const loading = ref(false);
const rememberLogin = ref(['remember']);

// 表单数据
const form = reactive({
  username: "admin",
  password: "123456",
});

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
};

// 样式配置
const glassInputStyle = {
  backgroundColor: 'transparent',
  color: '#ffffff',
  fontSize: '32rpx'
};

const glassButtonStyle = {
  background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.8), rgba(11, 11, 254, 0.8))',
  border: '1rpx solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(20rpx)',
  height: '96rpx',
  fontSize: '32rpx',
  fontWeight: 'bold',
  color: '#ffffff',
  boxShadow: '0 8rpx 32rpx rgba(0, 212, 255, 0.3)'
};

// 登录处理
const handleLogin = async () => {
  loading.value = true;
  try {
    // 模拟登录API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟登录成功
    const mockUserData = {
      token: 'mock_token_' + Date.now(),
      userInfo: {
        id: 1,
        username: form.username,
        nickname: '智能用户',
        avatar: '/static/avatar.png',
        email: 'user@example.com'
      },
      permissions: ['user:read', 'user:write'],
      roles: ['user']
    };
    
    // 更新store
    userStore.token = mockUserData.token;
    userStore.userInfo = mockUserData.userInfo;
    userStore.permissions = mockUserData.permissions;
    userStore.roles = mockUserData.roles;
    userStore.isLoggedIn = true;
    userStore.loginTime = new Date().toISOString();
    
    uni.showToast({
      title: '登录成功！',
      icon: 'success'
    });
    
    // 延迟跳转到主页
    setTimeout(() => {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    }, 1500);
    
  } catch (error) {
    uni.showToast({
      title: '登录失败，请重试',
      icon: 'none'
    });
    console.error('登录失败:', error);
  } finally {
    loading.value = false;
  }
};

// 忘记密码
const handleForgotPassword = () => {
  uni.showToast({
    title: '请联系管理员重置密码',
    icon: 'none',
    duration: 2000
  });
};

// 微信登录
const handleWechatLogin = () => {
  uni.showToast({
    title: '微信登录功能开发中',
    icon: 'none'
  });
};

// 快速体验
const handleQuickLogin = async () => {
  // 直接使用游客账户登录
  form.username = 'guest';
  form.password = '123456';
  await handleLogin();
};
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    #667eea 0%, 
    #764ba2 25%, 
    #f093fb 50%, 
    #f5576c 75%, 
    #4facfe 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  .shape {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: float 20s ease-in-out infinite;
    
    &.shape-1 {
      width: 200rpx;
      height: 200rpx;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }
    
    &.shape-2 {
      width: 150rpx;
      height: 150rpx;
      top: 20%;
      right: 15%;
      animation-delay: -5s;
    }
    
    &.shape-3 {
      width: 300rpx;
      height: 300rpx;
      bottom: 30%;
      left: -50rpx;
      animation-delay: -10s;
    }
    
    &.shape-4 {
      width: 100rpx;
      height: 100rpx;
      bottom: 10%;
      right: 20%;
      animation-delay: -15s;
    }
    
    &.shape-5 {
      width: 250rpx;
      height: 250rpx;
      top: 60%;
      right: -80rpx;
      animation-delay: -7s;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-30rpx) rotate(120deg);
  }
  66% {
    transform: translateY(20rpx) rotate(240deg);
  }
}

.login-container {
  position: relative;
  z-index: 2;
  padding: 100rpx 60rpx 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.logo-section {
  text-align: center;
  margin-bottom: 80rpx;
  
  .logo-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: 40rpx;
    
    .logo-bg {
      width: 140rpx;
      height: 140rpx;
      background: rgba(255, 255, 255, 0.15);
      border: 2rpx solid rgba(255, 255, 255, 0.2);
      border-radius: 35rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(20rpx);
      box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg, 
          transparent, 
          rgba(255, 255, 255, 0.1), 
          transparent);
        animation: shine 3s ease-in-out infinite;
      }
    }
  }
  
  .app-name {
    display: block;
    font-size: 56rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 16rpx;
    text-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
  }
  
  .app-desc {
    display: block;
    font-size: 30rpx;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 8rpx;
  }
  
  .app-version {
    display: block;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.7);
  }
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 32rpx;
  padding: 60rpx 50rpx;
  backdrop-filter: blur(20rpx);
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1rpx;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.6), 
      transparent);
  }
  
  .card-header {
    text-align: center;
    margin-bottom: 60rpx;
    
    .card-title {
      display: block;
      font-size: 40rpx;
      font-weight: bold;
      color: #fff;
      margin-bottom: 16rpx;
    }
    
    .card-subtitle {
      display: block;
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }
  
  .input-group {
    margin-bottom: 40rpx;
    
    .input-wrapper {
      background: rgba(255, 255, 255, 0.1);
      border: 1rpx solid rgba(255, 255, 255, 0.2);
      border-radius: 50rpx;
      padding: 24rpx 32rpx;
      display: flex;
      align-items: center;
      gap: 24rpx;
      backdrop-filter: blur(10rpx);
      transition: all 0.3s ease;
      
      &:focus-within {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(0, 212, 255, 0.5);
        box-shadow: 0 0 0 4rpx rgba(0, 212, 255, 0.1);
      }
    }
  }
  
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 40rpx 0;
    
    .option-text {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.9);
      margin-left: 16rpx;
    }
    
    .forgot-link {
      font-size: 28rpx;
      color: #00D4FF;
      text-decoration: none;
    }
  }
  
  .login-btn-wrapper {
    margin: 50rpx 0 40rpx;
    
    .btn-text {
      font-size: 32rpx;
      font-weight: bold;
      color: #ffffff;
    }
  }
  
  .divider {
    display: flex;
    align-items: center;
    margin: 50rpx 0;
    
    .divider-line {
      flex: 1;
      height: 1rpx;
      background: rgba(255, 255, 255, 0.2);
    }
    
    .divider-text {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.6);
      margin: 0 30rpx;
    }
  }
  
  .social-login {
    display: flex;
    gap: 30rpx;
    
    .social-btn {
      flex: 1;
      background: rgba(255, 255, 255, 0.1);
      border: 1rpx solid rgba(255, 255, 255, 0.2);
      border-radius: 50rpx;
      padding: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16rpx;
      backdrop-filter: blur(10rpx);
      transition: all 0.3s ease;
      
      &:active {
        background: rgba(255, 255, 255, 0.15);
        transform: scale(0.98);
      }
      
      text {
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 40rpx;
  z-index: 2;
  
  .copyright {
    display: block;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 8rpx;
  }
  
  .version {
    display: block;
    font-size: 20rpx;
    color: rgba(255, 255, 255, 0.5);
  }
}

// 深色模式兼容
:deep(.u-form-item) {
  margin-bottom: 0;
}

:deep(.u-input__content__field-wrapper__field) {
  color: #ffffff !important;
}

:deep(.u-checkbox__icon-wrap) {
  border-color: rgba(255, 255, 255, 0.3) !important;
}
</style>
