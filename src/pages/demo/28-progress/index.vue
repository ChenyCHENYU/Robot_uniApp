<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Progress 进度条</text>
        <text class="demo-subtitle">展示操作的当前进度，支持线性和圆形</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <C_Progress :percentage="30" />
          <view class="spacer" />
          <C_Progress :percentage="60" />
          <view class="spacer" />
          <C_Progress :percentage="100" />
          <view class="code-block">
            &lt;C_Progress :percentage="60" /&gt;
          </view>
        </view>
      </view>

      <!-- 显示文字 -->
      <view class="demo-section">
        <text class="section-title">显示百分比文字</text>
        <view class="demo-card">
          <C_Progress
            :percentage="progress"
            showText
          />
          <view class="progress-actions">
            <view
              class="action-btn"
              @click="decrease"
              >-10</view
            >
            <view
              class="action-btn action-btn--primary"
              @click="increase"
              >+10</view
            >
          </view>
        </view>
      </view>

      <!-- 自定义颜色 -->
      <view class="demo-section">
        <text class="section-title">自定义颜色</text>
        <view class="demo-card">
          <C_Progress
            :percentage="40"
            color="#07c160"
          />
          <view class="spacer" />
          <C_Progress
            :percentage="70"
            color="#ee0a24"
          />
          <view class="spacer" />
          <C_Progress
            :percentage="50"
            color="#ff976a"
          />
        </view>
      </view>

      <!-- 文字内显 -->
      <view class="demo-section">
        <text class="section-title">文字内显</text>
        <view class="demo-card">
          <C_Progress
            :percentage="60"
            showText
            textInside
            strokeHeight="36rpx"
          />
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const progress = ref(50)

  const increase = () => {
    progress.value = Math.min(100, progress.value + 10)
  }

  const decrease = () => {
    progress.value = Math.max(0, progress.value - 10)
  }
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

  .progress-actions {
    display: flex;
    justify-content: center;
    gap: 20rpx;
    margin-top: 24rpx;

    .action-btn {
      padding: 12rpx 32rpx;
      border-radius: 8rpx;
      font-size: 26rpx;
      border: 1rpx solid #dcdfe6;
      color: #606266;

      &--primary {
        background: #007aff;
        color: #fff;
        border-color: #007aff;
      }
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
