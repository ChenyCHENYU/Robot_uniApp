<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_TabNav 标签导航</text>
        <text class="demo-subtitle">顶部标签页切换导航，支持滑动和吸顶</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <C_TabNav
            v-model="activeTab"
            :tabs="basicTabs"
          />
          <view class="tab-content">当前选中: {{ activeTab }}</view>
          <view class="code-block">
            &lt;C_TabNav v-model="active" :tabs="tabs" /&gt;
          </view>
        </view>
      </view>

      <!-- 可滚动 -->
      <view class="demo-section">
        <text class="section-title">可滚动标签</text>
        <view class="demo-card">
          <C_TabNav
            v-model="scrollTab"
            :tabs="scrollTabs"
            scrollable
          />
        </view>
      </view>

      <!-- 卡片类型 -->
      <view class="demo-section">
        <text class="section-title">卡片类型</text>
        <view class="demo-card">
          <C_TabNav
            v-model="cardTab"
            :tabs="basicTabs"
            type="card"
          />
        </view>
      </view>

      <!-- 带徽标 -->
      <view class="demo-section">
        <text class="section-title">带徽标</text>
        <view class="demo-card">
          <C_TabNav
            v-model="badgeTab"
            :tabs="badgeTabs"
          />
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const activeTab = ref(0)
  const scrollTab = ref(0)
  const cardTab = ref(0)
  const badgeTab = ref(0)

  const basicTabs = [
    { title: '全部' },
    { title: '进行中' },
    { title: '已完成' },
  ]

  const scrollTabs = [
    { title: '推荐' },
    { title: '热榜' },
    { title: '科技' },
    { title: '财经' },
    { title: '体育' },
    { title: '娱乐' },
    { title: '游戏' },
    { title: '教育' },
  ]

  const badgeTabs = [
    { title: '消息', badge: 5 },
    { title: '通知', dot: true },
    { title: '设置' },
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
  .tab-content {
    padding: 24rpx;
    text-align: center;
    font-size: 28rpx;
    color: #666;
    margin-top: 12rpx;
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
