<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_FloatButton 悬浮按钮</text>
        <text class="demo-subtitle">页面右下角的浮动操作按钮，支持拖拽</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <text class="demo-desc">默认展示在页面右下角，点击触发事件</text>
          <view class="code-block">
            &lt;C_FloatButton @click="onClick" /&gt;
          </view>
        </view>
      </view>

      <!-- 自定义图标 -->
      <view class="demo-section">
        <text class="section-title">自定义图标</text>
        <view class="demo-card">
          <text class="demo-desc">通过 icon 属性设置按钮图标</text>
          <view class="code-block">
            &lt;C_FloatButton icon="edit" @click="onClick" /&gt;
          </view>
        </view>
      </view>

      <!-- 可拖拽 -->
      <view class="demo-section">
        <text class="section-title">可拖拽</text>
        <view class="demo-card">
          <text class="demo-desc"
            >设置 draggable 使按钮可拖动，试试拖动右下角的按钮</text
          >
          <view class="code-block">
            &lt;C_FloatButton draggable @click="onClick" /&gt;
          </view>
        </view>
      </view>

      <!-- 自定义位置 -->
      <view class="demo-section">
        <text class="section-title">位置与尺寸</text>
        <view class="demo-card">
          <text class="demo-desc"
            >通过 position / bottom / right / size 控制位置与大小</text
          >
          <view class="code-block">
            &lt;C_FloatButton position="left-bottom" :bottom="200" :size="100"
            /&gt;
          </view>
        </view>
      </view>

      <!-- 自定义内容 -->
      <view class="demo-section">
        <text class="section-title">自定义内容</text>
        <view class="demo-card">
          <text class="demo-desc">通过默认插槽自定义按钮内容</text>
          <view class="code-block">
            &lt;C_FloatButton&gt;🚀&lt;/C_FloatButton&gt;
          </view>
        </view>
      </view>

      <!-- 实际效果 -->
      <C_FloatButton
        icon="chat"
        draggable
        @click="onFloatClick"
      />
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  const onFloatClick = () => {
    uni.showToast({ title: '悬浮按钮被点击', icon: 'none' })
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
</style>
