<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_CountDown 倒计时</text>
        <text class="demo-subtitle">用于实时展示倒计时数值，支持毫秒精度</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <C_CountDown :time="30 * 60 * 60 * 1000" />
          <view class="code-block">
            &lt;C_CountDown :time="30 * 60 * 60 * 1000" /&gt;
          </view>
        </view>
      </view>

      <!-- 自定义格式 -->
      <view class="demo-section">
        <text class="section-title">自定义格式</text>
        <view class="demo-card">
          <C_CountDown
            :time="24 * 60 * 60 * 1000"
            format="DD 天 HH 时 mm 分 ss 秒"
          />
          <view class="spacer" />
          <C_CountDown
            :time="60 * 1000"
            format="ss 秒"
          />
        </view>
      </view>

      <!-- 毫秒级 -->
      <view class="demo-section">
        <text class="section-title">毫秒级精度</text>
        <view class="demo-card">
          <C_CountDown
            :time="30 * 60 * 60 * 1000"
            millisecond
            format="HH:mm:ss:SSS"
          />
        </view>
      </view>

      <!-- 自定义颜色 -->
      <view class="demo-section">
        <text class="section-title">自定义样式</text>
        <view class="demo-card">
          <C_CountDown
            :time="24 * 60 * 60 * 1000"
            color="#ee0a24"
            fontSize="40rpx"
          />
          <view class="spacer" />
          <C_CountDown
            :time="24 * 60 * 60 * 1000"
            color="#07c160"
            fontSize="32rpx"
          />
        </view>
      </view>

      <!-- 手动控制 -->
      <view class="demo-section">
        <text class="section-title">手动控制</text>
        <view class="demo-card">
          <C_CountDown
            ref="countdownRef"
            :time="3000"
            :autoStart="false"
            format="ss:SSS"
            millisecond
          />
          <view class="countdown-actions">
            <view
              class="action-btn"
              @click="handleStart"
              >开始</view
            >
            <view
              class="action-btn"
              @click="handlePause"
              >暂停</view
            >
            <view
              class="action-btn"
              @click="handleReset"
              >重置</view
            >
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const countdownRef = ref()

  const handleStart = () => countdownRef.value?.start()
  const handlePause = () => countdownRef.value?.pause()
  const handleReset = () => countdownRef.value?.reset()
</script>

<style lang="scss" scoped>
  .demo-page {
    min-height: 100%;
    background: #f5f7fa;
    padding: 24rpx 32rpx;
  }
  .demo-header {
    margin-bottom: 40rpx;
    .demo-title {
      display: block;
      font-size: 44rpx;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8rpx;
    }
    .demo-subtitle {
      display: block;
      font-size: 26rpx;
      color: #666;
    }
  }
  .demo-section {
    margin-bottom: 40rpx;
    .section-title {
      display: block;
      font-size: 30rpx;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 20rpx;
      padding-left: 16rpx;
      border-left: 6rpx solid #667eea;
    }
  }
  .demo-card {
    background: #fff;
    border-radius: 20rpx;
    padding: 32rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    border: 1rpx solid rgba(0, 0, 0, 0.04);
  }
  .spacer {
    height: 24rpx;
  }
  .countdown-actions {
    display: flex;
    justify-content: center;
    gap: 20rpx;
    margin-top: 24rpx;
    .action-btn {
      padding: 14rpx 36rpx;
      border-radius: 8rpx;
      font-size: 26rpx;
      border: 1rpx solid #dcdfe6;
      color: #606266;
    }
  }
  .code-block {
    background: #f5f5f5;
    border-radius: 8rpx;
    padding: 16rpx 20rpx;
    font-size: 22rpx;
    color: #555;
    font-family: monospace;
    margin-top: 16rpx;
  }
</style>
