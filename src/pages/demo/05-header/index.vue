<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Header 页头</text>
        <text class="demo-subtitle"
          >页面顶部导航头组件，支持用户信息、返回按钮等模式</text
        >
      </view>

      <!-- 用户模式 -->
      <view class="demo-section">
        <text class="section-title">用户模式（默认）</text>
        <view class="demo-card">
          <text class="demo-desc"
            >展示头像、昵称、问候语和状态，适用于首页</text
          >
          <view class="code-block">
            &lt;C_Header :showStatus="true" /&gt;
          </view>
        </view>
      </view>

      <!-- 返回模式 -->
      <view class="demo-section">
        <text class="section-title">返回按钮模式</text>
        <view class="demo-card">
          <text class="demo-desc">设置 showBack 展示返回按钮和页面标题</text>
          <view class="code-block">
            &lt;C_Header showBack title="页面标题" /&gt;
          </view>
        </view>
      </view>

      <!-- 紧凑模式 -->
      <view class="demo-section">
        <text class="section-title">紧凑模式</text>
        <view class="demo-card">
          <text class="demo-desc"
            >使用 isCompactMode 减小头部高度，适用于内容页</text
          >
          <view class="code-block">
            &lt;C_Header showBack isCompactMode title="紧凑头部" /&gt;
          </view>
        </view>
      </view>

      <!-- 通知角标 -->
      <view class="demo-section">
        <text class="section-title">通知角标</text>
        <view class="demo-card">
          <text class="demo-desc">通过 notificationCount 显示未读消息数量</text>
          <view class="code-block">
            &lt;C_Header :notificationCount="5" /&gt;
          </view>
        </view>
      </view>

      <!-- 事件回调 -->
      <view class="demo-section">
        <text class="section-title">事件回调</text>
        <view class="demo-card">
          <text class="demo-desc"
            >支持 userClick / notificationClick / settingsClick / backClick
            等事件</text
          >
          <view class="code-block">
            &lt;C_Header @userClick="onUser" @settingsClick="onSettings" /&gt;
          </view>
        </view>
      </view>

      <!-- Props 一览 -->
      <view class="demo-section">
        <text class="section-title">Props 一览</text>
        <view class="demo-card">
          <view class="prop-list">
            <view
              class="prop-item"
              v-for="prop in propList"
              :key="prop.name"
            >
              <text class="prop-name">{{ prop.name }}</text>
              <text class="prop-desc">{{ prop.desc }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  const propList = [
    { name: 'showBack', desc: '是否显示返回按钮' },
    { name: 'title', desc: '标题文本' },
    { name: 'isCompactMode', desc: '是否紧凑模式' },
    { name: 'showStatus', desc: '是否显示在线状态' },
    { name: 'notificationCount', desc: '未读通知数' },
    { name: 'theme', desc: '主题：default' },
    { name: 'iconSize', desc: '图标尺寸，默认20' },
  ]
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
  .demo-desc {
    display: block;
    font-size: 26rpx;
    color: #666;
    margin-bottom: 20rpx;
  }
  .code-block {
    background: #f5f5f5;
    border-radius: 8rpx;
    padding: 16rpx 20rpx;
    font-size: 22rpx;
    color: #555;
    font-family: monospace;
  }
  .prop-list {
    .prop-item {
      display: flex;
      justify-content: space-between;
      padding: 12rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
    }
    .prop-name {
      font-size: 24rpx;
      color: #007aff;
      font-weight: 600;
      font-family: monospace;
    }
    .prop-desc {
      font-size: 24rpx;
      color: #666;
    }
  }
</style>
