<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Tabbar 标签栏</text>
        <text class="demo-subtitle">底部导航标签栏，支持图标、角标、自定义样式</text>
      </view>

      <!-- 基础说明 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <text class="demo-desc">C_Tabbar 通常由 C_Layout 自动集成，Tab页会自动展示底部导航栏。你也可以独立使用它。</text>
          <view class="code-block">
            &lt;C_Tabbar
              v-model="activeIndex"
              :tabList="tabs"
              @change="onChange"
            /&gt;
          </view>
        </view>
      </view>

      <!-- 默认 Tab 配置 -->
      <view class="demo-section">
        <text class="section-title">默认 Tab 配置</text>
        <view class="demo-card">
          <view class="tab-preview">
            <view
              v-for="(tab, index) in defaultTabs"
              :key="tab.id"
              :class="['tab-item', index === activeTab && 'tab-item--active']"
              @click="activeTab = index"
            >
              <C_Icon :name="index === activeTab ? 'i-mdi-' + tab.activeIcon : 'i-mdi-' + tab.icon" :size="22" :color="index === activeTab ? '#007AFF' : '#8E8E93'" />
              <text :class="['tab-text', index === activeTab && 'tab-text--active']">{{ tab.text }}</text>
            </view>
          </view>
          <view class="tab-config">
            <view class="config-item" v-for="tab in defaultTabs" :key="tab.id">
              <text class="config-label">{{ tab.text }}</text>
              <text class="config-value">{{ tab.path }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 角标 -->
      <view class="demo-section">
        <text class="section-title">角标提示</text>
        <view class="demo-card">
          <text class="demo-desc">通过 tabList 中每项的 badge 字段控制角标数量</text>
          <view class="code-block">
            tabList: [
              { id: 'message', text: '消息', badge: 5, ... }
            ]
          </view>
        </view>
      </view>

      <!-- 事件 -->
      <view class="demo-section">
        <text class="section-title">事件</text>
        <view class="demo-card">
          <view class="prop-list">
            <view class="prop-item">
              <text class="prop-name">change</text>
              <text class="prop-desc">Tab 切换时触发 { item, index }</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">tabClick</text>
              <text class="prop-desc">Tab 点击时触发 { item, index }</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref(0)

const defaultTabs = [
  { id: 'home', text: '首页', icon: 'home-outline', activeIcon: 'home', path: '/pages/index/index' },
  { id: 'message', text: '消息', icon: 'chat-outline', activeIcon: 'chat', path: '/pages/message/index' },
  { id: 'components', text: '组件库', icon: 'apps', activeIcon: 'apps', path: '/pages/robot/index' },
  { id: 'profile', text: '我的', icon: 'account-outline', activeIcon: 'account', path: '/pages/profile/index' },
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
  .demo-title { display: block; font-size: 44rpx; font-weight: 700; color: #1f2937; margin-bottom: 8rpx; }
  .demo-subtitle { display: block; font-size: 26rpx; color: #666; }
}
.demo-section {
  margin-bottom: 40rpx;
  .section-title { display: block; font-size: 30rpx; font-weight: 600; color: #1f2937; margin-bottom: 20rpx; padding-left: 16rpx; border-left: 6rpx solid #667eea; }
}
.demo-card {
  background: #fff; border-radius: 20rpx; padding: 32rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04); border: 1rpx solid rgba(0,0,0,0.04);
}
.demo-desc {
  display: block; font-size: 26rpx; color: #666; margin-bottom: 20rpx;
}
.code-block {
  background: #f5f5f5; border-radius: 8rpx; padding: 16rpx 20rpx; font-size: 22rpx; color: #555; font-family: monospace; white-space: pre-wrap;
}
.tab-preview {
  display: flex; justify-content: space-around; padding: 20rpx 0; border: 1rpx solid #f0f0f0; border-radius: 12rpx; margin-bottom: 20rpx; background: #fafafa;
  .tab-item { display: flex; flex-direction: column; align-items: center; gap: 6rpx; }
  .tab-text { font-size: 20rpx; color: #8E8E93; }
  .tab-item--active .tab-text, .tab-text--active { color: #007AFF; }
}
.tab-config {
  .config-item { display: flex; justify-content: space-between; padding: 10rpx 0; border-bottom: 1rpx solid #f0f0f0; }
  .config-label { font-size: 24rpx; color: #333; font-weight: 600; }
  .config-value { font-size: 22rpx; color: #999; font-family: monospace; }
}
.prop-list {
  .prop-item { display: flex; justify-content: space-between; padding: 12rpx 0; border-bottom: 1rpx solid #f0f0f0; }
  .prop-name { font-size: 24rpx; color: #007aff; font-weight: 600; font-family: monospace; }
  .prop-desc { font-size: 24rpx; color: #666; }
}
</style>
