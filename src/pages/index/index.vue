<template>
  <view class="container">
    <view class="test-section">
      <text class="title">uview-plus 组件测试</text>
      
      <!-- 测试基础组件 -->
      <view class="test-item">
        <text class="label">按钮组件:</text>
        <u-button type="primary" text="主要按钮" @click="handleClick"></u-button>
        <u-button type="success" text="成功按钮" size="small"></u-button>
      </view>
      
      <!-- 测试图标组件 -->
      <view class="test-item">
        <text class="label">图标组件:</text>
        <u-icon name="heart-fill" color="#ff0000" size="40"></u-icon>
        <u-icon name="star-fill" color="#ffa500" size="40"></u-icon>
        <u-icon name="thumb-up-fill" color="#007aff" size="40"></u-icon>
      </view>
      
      <!-- 测试加载组件 -->
      <view class="test-item">
        <text class="label">加载组件:</text>
        <u-loading-icon mode="spinner" size="30" color="#007aff"></u-loading-icon>
        <u-loading-icon mode="circle" size="30" color="#19be6b"></u-loading-icon>
      </view>
      
      <!-- 测试标签组件 -->
      <view class="test-item">
        <text class="label">标签组件:</text>
        <u-tag text="默认标签" mode="light"></u-tag>
        <u-tag text="主色标签" type="primary"></u-tag>
        <u-tag text="成功标签" type="success"></u-tag>
      </view>
      
      <!-- 测试通知栏 -->
      <view class="test-item">
        <text class="label">通知栏:</text>
        <u-notice-bar 
          :text="noticeText" 
          mode="closable"
          color="#007aff"
        ></u-notice-bar>
      </view>
      
      <!-- 调试信息 -->
      <view class="debug-info">
        <text class="debug-title">调试信息:</text>
        <text class="debug-text">uview-plus 状态: {{ uviewStatus }}</text>
        <text class="debug-text">版本信息: {{ versionInfo }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 响应式数据
const noticeText = ref('这是一个测试通知栏，用于验证 uview-plus 组件是否正常工作')
const uviewStatus = ref('检测中...')
const versionInfo = ref('未知')

// 方法
const handleClick = () => {
  uni.showToast({
    title: '按钮点击成功!',
    icon: 'success'
  })
}

// 检测函数
const checkUviewStatus = () => {
  if (typeof uni !== 'undefined' && uni.$u) {
    uviewStatus.value = '✅ 加载成功'
    versionInfo.value = uni.$u.config?.version || '3.5.39'
    console.log('✅ uview-plus 检测成功:', uni.$u)
  } else {
    uviewStatus.value = '❌ 加载失败'
    versionInfo.value = '无法获取'
    console.error('❌ uview-plus 未正确加载')
  }
}

// 生命周期
onMounted(() => {
  // 延迟检测，确保所有初始化完成
  setTimeout(checkUviewStatus, 200)
})
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.test-section {
  background: white;
  border-radius: 10rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: $uni-color-title;
  margin-bottom: 30rpx;
  display: block;
}

.test-item {
  margin-bottom: 40rpx;
  
  .label {
    display: block;
    font-size: 28rpx;
    color: $uni-text-color;
    margin-bottom: 20rpx;
    font-weight: 500;
  }
}

.debug-info {
  margin-top: 40rpx;
  padding: 20rpx;
  background-color: #f8f9fa;
  border-radius: 8rpx;
  border-left: 4rpx solid $uni-color-primary;
  
  .debug-title {
    display: block;
    font-size: 28rpx;
    font-weight: bold;
    color: $uni-color-title;
    margin-bottom: 15rpx;
  }
  
  .debug-text {
    display: block;
    font-size: 24rpx;
    color: $uni-text-color-grey;
    margin-bottom: 8rpx;
    font-family: 'Courier New', monospace;
  }
}
</style>