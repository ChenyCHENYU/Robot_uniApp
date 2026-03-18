<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_SwipeAction 滑动操作</text>
        <text class="demo-subtitle"
          >列表项左右滑动操作，常用于删除、收藏等</text
        >
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法（右滑删除）</text>
        <view class="demo-card">
          <C_SwipeAction
            :rightActions="[{ text: '删除', bgColor: '#ee0a24' }]"
            @action="handleAction"
          >
            <view class="swipe-content">向左滑动试试</view>
          </C_SwipeAction>
          <view class="code-block">
            &lt;C_SwipeAction :rightActions="[{ text: '删除', bgColor: '#ee0a24'
            }]"&gt;
          </view>
        </view>
      </view>

      <!-- 左右都有操作 -->
      <view class="demo-section">
        <text class="section-title">左右操作按钮</text>
        <view class="demo-card">
          <C_SwipeAction
            :leftActions="[{ text: '收藏', bgColor: '#07c160' }]"
            :rightActions="[
              { text: '标记', bgColor: '#ff976a' },
              { text: '删除', bgColor: '#ee0a24' },
            ]"
          >
            <view class="swipe-content">左右都可以滑动</view>
          </C_SwipeAction>
        </view>
      </view>

      <!-- 禁用状态 -->
      <view class="demo-section">
        <text class="section-title">禁用状态</text>
        <view class="demo-card">
          <C_SwipeAction
            disabled
            :rightActions="[{ text: '删除', bgColor: '#ee0a24' }]"
          >
            <view class="swipe-content">禁用状态，无法滑动</view>
          </C_SwipeAction>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  const handleAction = (action: { text: string }, _index: number) => {
    uni.showToast({ title: `点击了: ${action.text}`, icon: 'none' })
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
  .swipe-content {
    padding: 24rpx;
    font-size: 28rpx;
    color: #333;
    background: #f8f8f8;
    border-radius: 8rpx;
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
