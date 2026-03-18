<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Divider 分割线</text>
        <text class="demo-subtitle">分割内容区域，支持文字和虚线样式</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <text class="demo-text">上方内容</text>
          <C_Divider />
          <text class="demo-text">下方内容</text>
          <view class="code-block"> &lt;C_Divider /&gt; </view>
        </view>
      </view>

      <!-- 带文字 -->
      <view class="demo-section">
        <text class="section-title">展示文字</text>
        <view class="demo-card">
          <C_Divider text="分割文字" />
          <C_Divider
            text="左侧文字"
            contentPosition="left"
          />
          <C_Divider
            text="右侧文字"
            contentPosition="right"
          />
        </view>
      </view>

      <!-- 虚线 -->
      <view class="demo-section">
        <text class="section-title">虚线样式</text>
        <view class="demo-card">
          <C_Divider dashed />
          <C_Divider
            dashed
            text="虚线分割"
          />
        </view>
      </view>

      <!-- 自定义颜色 -->
      <view class="demo-section">
        <text class="section-title">自定义颜色</text>
        <view class="demo-card">
          <C_Divider
            color="#1989fa"
            text="蓝色分割线"
          />
          <C_Divider
            color="#07c160"
            text="绿色分割线"
          />
          <C_Divider
            color="#ee0a24"
            text="红色分割线"
          />
        </view>
      </view>

      <!-- hairline -->
      <view class="demo-section">
        <text class="section-title">细线模式</text>
        <view class="demo-card">
          <C_Divider
            hairline
            text="hairline"
          />
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts"></script>

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
  .demo-text {
    display: block;
    font-size: 28rpx;
    color: #333;
    padding: 12rpx 0;
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
