<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Tag 标签</text>
        <text class="demo-subtitle">用于标记和分类的小型标签组件</text>
      </view>

      <!-- 基础类型 -->
      <view class="demo-section">
        <text class="section-title">基础类型</text>
        <view class="demo-card">
          <view class="tag-row">
            <C_Tag text="Primary" type="primary" />
            <C_Tag text="Success" type="success" />
            <C_Tag text="Warning" type="warning" />
            <C_Tag text="Error" type="error" />
            <C_Tag text="Info" type="info" />
          </view>
          <view class="code-block">
            &lt;C_Tag text="Primary" type="primary" /&gt;
          </view>
        </view>
      </view>

      <!-- 实心模式 -->
      <view class="demo-section">
        <text class="section-title">实心模式</text>
        <view class="demo-card">
          <view class="tag-row">
            <C_Tag text="Primary" type="primary" :plain="false" />
            <C_Tag text="Success" type="success" :plain="false" />
            <C_Tag text="Warning" type="warning" :plain="false" />
            <C_Tag text="Error" type="error" :plain="false" />
            <C_Tag text="Info" type="info" :plain="false" />
          </view>
          <view class="code-block">
            &lt;C_Tag text="Primary" type="primary" :plain="false" /&gt;
          </view>
        </view>
      </view>

      <!-- 圆角标签 -->
      <view class="demo-section">
        <text class="section-title">圆角标签</text>
        <view class="demo-card">
          <view class="tag-row">
            <C_Tag text="圆角" type="primary" round />
            <C_Tag text="圆角" type="success" round />
            <C_Tag text="圆角" type="warning" round />
          </view>
          <view class="code-block">
            &lt;C_Tag text="圆角" type="primary" round /&gt;
          </view>
        </view>
      </view>

      <!-- 尺寸 -->
      <view class="demo-section">
        <text class="section-title">不同尺寸</text>
        <view class="demo-card">
          <view class="tag-row">
            <C_Tag text="Small" type="primary" size="small" />
            <C_Tag text="Default" type="primary" size="default" />
            <C_Tag text="Large" type="primary" size="large" />
          </view>
          <view class="code-block">
            &lt;C_Tag text="Small" size="small" /&gt;
          </view>
        </view>
      </view>

      <!-- 可关闭 -->
      <view class="demo-section">
        <text class="section-title">可关闭标签</text>
        <view class="demo-card">
          <view class="tag-row">
            <C_Tag text="可关闭" type="primary" closeable @close="onClose('primary')" />
            <C_Tag text="可关闭" type="error" closeable @close="onClose('error')" />
            <C_Tag text="可关闭" type="success" closeable @close="onClose('success')" />
          </view>
          <view class="code-block">
            &lt;C_Tag text="可关闭" closeable @close="onClose" /&gt;
          </view>
        </view>
      </view>

      <!-- 自定义颜色 -->
      <view class="demo-section">
        <text class="section-title">自定义颜色</text>
        <view class="demo-card">
          <view class="tag-row">
            <C_Tag text="自定义" color="#8B5CF6" />
            <C_Tag text="自定义" color="#EC4899" />
            <C_Tag text="自定义" color="#14B8A6" />
          </view>
          <view class="code-block">
            &lt;C_Tag text="自定义" color="#8B5CF6" /&gt;
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
const onClose = (type) => {
  console.log(`关闭了 ${type} 标签`)
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
.tag-row {
  display: flex; flex-wrap: wrap; gap: 16rpx; align-items: center; margin-bottom: 20rpx;
}
.code-block {
  background: #f5f5f5; border-radius: 8rpx; padding: 16rpx 20rpx; font-size: 22rpx; color: #555; font-family: monospace;
}
</style>
