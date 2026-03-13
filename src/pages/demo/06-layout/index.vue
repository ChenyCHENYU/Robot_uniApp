<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Layout 布局</text>
        <text class="demo-subtitle">统一的页面布局容器，自动管理 Header 和 Tabbar</text>
      </view>

      <!-- 自动布局 -->
      <view class="demo-section">
        <text class="section-title">自动布局（默认）</text>
        <view class="demo-card">
          <text class="demo-desc">C_Layout 会根据当前页面路由自动决定布局类型：Tab 页显示 Header + Tabbar，普通页面只显示 Header</text>
          <view class="code-block">
            &lt;C_Layout&gt;
              &lt;!-- 页面内容 --&gt;
            &lt;/C_Layout&gt;
          </view>
        </view>
      </view>

      <!-- 布局类型 -->
      <view class="demo-section">
        <text class="section-title">布局类型</text>
        <view class="demo-card">
          <view class="type-list">
            <view class="type-item">
              <text class="type-name">full</text>
              <text class="type-desc">Header + 内容 + Tabbar（Tab 页面）</text>
            </view>
            <view class="type-item">
              <text class="type-name">header-only</text>
              <text class="type-desc">Header + 内容（普通子页面）</text>
            </view>
            <view class="type-item">
              <text class="type-name">none</text>
              <text class="type-desc">无布局（登录等特殊页面）</text>
            </view>
          </view>
          <view class="code-block">
            &lt;C_Layout forceLayoutType="header-only"&gt;...&lt;/C_Layout&gt;
          </view>
        </view>
      </view>

      <!-- 强制布局 -->
      <view class="demo-section">
        <text class="section-title">强制指定布局</text>
        <view class="demo-card">
          <text class="demo-desc">可以通过 forceLayoutType 手动指定布局类型，覆盖自动判断</text>
          <view class="code-block">
            &lt;C_Layout forceLayoutType="none"&gt;
              &lt;!-- 无 Header 和 Tabbar --&gt;
            &lt;/C_Layout&gt;
          </view>
        </view>
      </view>

      <!-- 返回按钮控制 -->
      <view class="demo-section">
        <text class="section-title">返回按钮</text>
        <view class="demo-card">
          <text class="demo-desc">通过 showBack 和 backBehavior 控制返回按钮的显示与行为</text>
          <view class="code-block">
            &lt;C_Layout showBack title="子页面" backBehavior="auto" /&gt;
          </view>
        </view>
      </view>

      <!-- Props 一览 -->
      <view class="demo-section">
        <text class="section-title">Props 一览</text>
        <view class="demo-card">
          <view class="prop-list">
            <view class="prop-item" v-for="prop in propList" :key="prop.name">
              <text class="prop-name">{{ prop.name }}</text>
              <text class="prop-desc">{{ prop.desc }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
const propList = [
  { name: 'forceLayoutType', desc: '强制布局: none / header-only / full' },
  { name: 'showBack', desc: '是否显示返回按钮' },
  { name: 'title', desc: '页面标题' },
  { name: 'globalLoading', desc: '全局加载状态' },
  { name: 'notificationCount', desc: '通知数量' },
  { name: 'backBehavior', desc: '返回行为: auto / custom / none' },
  { name: 'theme', desc: '主题设置' },
]
</script>

<style lang="scss" scoped>
.demo-page {
  min-height: 100vh;
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
.type-list {
  margin-bottom: 20rpx;
  .type-item { display: flex; align-items: center; padding: 16rpx 0; border-bottom: 1rpx solid #f0f0f0; gap: 16rpx; }
  .type-name { font-size: 24rpx; color: #007aff; font-weight: 600; font-family: monospace; min-width: 180rpx; }
  .type-desc { font-size: 24rpx; color: #666; }
}
.prop-list {
  .prop-item { display: flex; justify-content: space-between; padding: 12rpx 0; border-bottom: 1rpx solid #f0f0f0; }
  .prop-name { font-size: 24rpx; color: #007aff; font-weight: 600; font-family: monospace; }
  .prop-desc { font-size: 24rpx; color: #666; }
}
</style>
