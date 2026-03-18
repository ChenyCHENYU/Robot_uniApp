<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Notify 消息通知</text>
        <text class="demo-subtitle">顶部弹出消息通知，支持多种类型</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <view
            class="action-btn"
            @click="showPrimary"
            >主要通知</view
          >
          <view class="code-block">
            &lt;C_Notify :visible="show" type="primary" message="通知内容" /&gt;
          </view>
        </view>
      </view>

      <!-- 不同类型 -->
      <view class="demo-section">
        <text class="section-title">通知类型</text>
        <view class="demo-card">
          <view class="btn-group">
            <view
              class="action-btn action-btn--primary"
              @click="showNotify('primary')"
              >主要</view
            >
            <view
              class="action-btn action-btn--success"
              @click="showNotify('success')"
              >成功</view
            >
            <view
              class="action-btn action-btn--warning"
              @click="showNotify('warning')"
              >警告</view
            >
            <view
              class="action-btn action-btn--danger"
              @click="showNotify('danger')"
              >危险</view
            >
          </view>
        </view>
      </view>

      <!-- 自定义时长 -->
      <view class="demo-section">
        <text class="section-title">自定义时长</text>
        <view class="demo-card">
          <view
            class="action-btn"
            @click="showLong"
            >展示5秒</view
          >
        </view>
      </view>

      <C_Notify
        :visible="notifyVisible"
        :type="notifyType"
        :message="notifyMessage"
        :duration="notifyDuration"
        @close="notifyVisible = false"
      />
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { NotifyType } from '@/types/modules/notify'

  const notifyVisible = ref(false)
  const notifyType = ref<NotifyType>('primary')
  const notifyMessage = ref('')
  const notifyDuration = ref(3000)

  const showPrimary = () => {
    notifyType.value = 'primary'
    notifyMessage.value = '这是一条主要通知'
    notifyDuration.value = 3000
    notifyVisible.value = true
  }

  const showNotify = (type: NotifyType) => {
    notifyType.value = type
    const messages: Record<string, string> = {
      primary: '主要通知消息',
      success: '操作成功',
      warning: '请注意操作安全',
      danger: '操作失败，请重试',
    }
    notifyMessage.value = messages[type]
    notifyDuration.value = 3000
    notifyVisible.value = true
  }

  const showLong = () => {
    notifyType.value = 'primary'
    notifyMessage.value = '这条通知将展示5秒钟'
    notifyDuration.value = 5000
    notifyVisible.value = true
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
  .btn-group {
    display: flex;
    gap: 16rpx;
    flex-wrap: wrap;
  }
  .action-btn {
    text-align: center;
    padding: 20rpx;
    background: #667eea;
    color: #fff;
    border-radius: 12rpx;
    font-size: 28rpx;
    flex: 1;
    min-width: 140rpx;
    &--primary {
      background: #1989fa;
    }
    &--success {
      background: #07c160;
    }
    &--warning {
      background: #ff976a;
    }
    &--danger {
      background: #ee0a24;
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
