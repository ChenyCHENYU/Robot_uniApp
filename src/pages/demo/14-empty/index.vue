<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Empty 空状态</text>
        <text class="demo-subtitle">当列表或页面没有数据时展示的占位组件</text>
      </view>

      <!-- 默认空状态 -->
      <view class="demo-section">
        <text class="section-title">默认</text>
        <view class="demo-card">
          <C_Empty />
          <view class="code-block mt-3">
            &lt;C_Empty /&gt;
          </view>
        </view>
      </view>

      <!-- 各类型预设 -->
      <view class="demo-section">
        <text class="section-title">预设类型</text>
        <view class="demo-card">
          <view class="empty-grid">
            <view class="empty-item" v-for="t in types" :key="t.type">
              <C_Empty :type="t.type" :iconSize="80" />
              <text class="type-label">type="{{ t.type }}"</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 带操作按钮 -->
      <view class="demo-section">
        <text class="section-title">带操作按钮</text>
        <view class="demo-card">
          <C_Empty type="network" showAction actionText="重新加载" @action="onRetry" />
          <view class="code-block mt-3">
            &lt;C_Empty type="network" showAction @action="onRetry" /&gt;
          </view>
        </view>
      </view>

      <!-- 自定义文案 -->
      <view class="demo-section">
        <text class="section-title">自定义图标和文案</text>
        <view class="demo-card">
          <C_Empty icon="star" text="还没有收藏任何内容" />
          <view class="code-block mt-3">
            &lt;C_Empty icon="star" text="还没有收藏任何内容" /&gt;
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
const types = [
  { type: 'default' },
  { type: 'network' },
  { type: 'search' },
  { type: 'error' },
  { type: 'message' },
  { type: 'collect' },
]

const onRetry = () => {
  uni.showToast({ title: '重新加载...', icon: 'none' })
}
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
.empty-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 24rpx;
  .empty-item { display: flex; flex-direction: column; align-items: center; padding: 16rpx; border: 1rpx solid #f0f0f0; border-radius: 12rpx; }
  .type-label { font-size: 20rpx; color: #999; margin-top: 8rpx; font-family: monospace; }
}
.mt-3 { margin-top: 20rpx; }
.code-block {
  background: #f5f5f5; border-radius: 8rpx; padding: 16rpx 20rpx; font-size: 22rpx; color: #555; font-family: monospace;
}
</style>
