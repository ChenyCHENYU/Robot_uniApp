<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Rate 评分</text>
        <text class="demo-subtitle">评分组件，支持半选、只读、自定义图标</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <C_Rate v-model="basicRate" />
          <text class="rate-text">当前: {{ basicRate }} 分</text>
          <view class="code-block"> &lt;C_Rate v-model="rate" /&gt; </view>
        </view>
      </view>

      <!-- 半选 -->
      <view class="demo-section">
        <text class="section-title">半选模式</text>
        <view class="demo-card">
          <C_Rate
            v-model="halfRate"
            allowHalf
          />
          <text class="rate-text">当前: {{ halfRate }} 分</text>
        </view>
      </view>

      <!-- 自定义颜色和数量 -->
      <view class="demo-section">
        <text class="section-title">自定义样式</text>
        <view class="demo-card">
          <C_Rate
            v-model="customRate"
            :count="6"
            color="#ee0a24"
            voidColor="#eee"
            size="48rpx"
          />
        </view>
      </view>

      <!-- 只读 -->
      <view class="demo-section">
        <text class="section-title">只读模式</text>
        <view class="demo-card">
          <C_Rate
            :modelValue="4.5"
            readonly
            allowHalf
          />
          <text class="rate-text">综合评分: 4.5</text>
        </view>
      </view>

      <!-- 禁用 -->
      <view class="demo-section">
        <text class="section-title">禁用状态</text>
        <view class="demo-card">
          <C_Rate
            :modelValue="3"
            disabled
          />
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const basicRate = ref(3)
  const halfRate = ref(2.5)
  const customRate = ref(4)
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
  .rate-text {
    display: block;
    font-size: 26rpx;
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
