<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Skeleton 骨架屏</text>
        <text class="demo-subtitle">数据加载时的占位效果，减少等待感</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <C_Skeleton
            :loading="loading1"
            :rows="3"
          >
            <view class="loaded-content">
              <text>这是加载完成后的真实内容</text>
            </view>
          </C_Skeleton>
          <view class="toggle-row">
            <view
              class="step-btn step-btn--primary"
              @click="loading1 = !loading1"
            >
              {{ loading1 ? '显示内容' : '显示骨架屏' }}
            </view>
          </view>
          <view class="code-block">
            &lt;C_Skeleton :loading="loading" :rows="3"&gt;
            &lt;view&gt;真实内容&lt;/view&gt; &lt;/C_Skeleton&gt;
          </view>
        </view>
      </view>

      <!-- 显示头像 -->
      <view class="demo-section">
        <text class="section-title">带头像</text>
        <view class="demo-card">
          <C_Skeleton
            :loading="loading2"
            :rows="3"
            avatar
          >
            <view class="loaded-content">
              <text>带头像的内容区域</text>
            </view>
          </C_Skeleton>
          <view class="toggle-row">
            <view
              class="step-btn step-btn--primary"
              @click="loading2 = !loading2"
            >
              {{ loading2 ? '显示内容' : '显示骨架屏' }}
            </view>
          </view>
          <view class="code-block">
            &lt;C_Skeleton :loading="true" :rows="3" avatar /&gt;
          </view>
        </view>
      </view>

      <!-- 不显示标题 -->
      <view class="demo-section">
        <text class="section-title">无标题骨架</text>
        <view class="demo-card">
          <C_Skeleton
            :loading="true"
            :rows="4"
            :title="false"
          />
          <view class="code-block mt-3">
            &lt;C_Skeleton :rows="4" :title="false" /&gt;
          </view>
        </view>
      </view>

      <!-- 自定义行数 -->
      <view class="demo-section">
        <text class="section-title">自定义行数</text>
        <view class="demo-card">
          <view class="skeleton-list">
            <view class="skeleton-item">
              <text class="skeleton-label">2 行</text>
              <C_Skeleton
                :loading="true"
                :rows="2"
              />
            </view>
            <view class="skeleton-item">
              <text class="skeleton-label">5 行</text>
              <C_Skeleton
                :loading="true"
                :rows="5"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 关闭动画 -->
      <view class="demo-section">
        <text class="section-title">关闭动画</text>
        <view class="demo-card">
          <C_Skeleton
            :loading="true"
            :rows="3"
            :animate="false"
          />
          <view class="code-block mt-3">
            &lt;C_Skeleton :animate="false" /&gt;
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const loading1 = ref(true)
  const loading2 = ref(true)
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
  .loaded-content {
    padding: 20rpx;
    background: #f0f9ff;
    border-radius: 8rpx;
    font-size: 28rpx;
    color: #007aff;
  }
  .toggle-row {
    display: flex;
    justify-content: center;
    margin: 20rpx 0;
    .step-btn {
      padding: 12rpx 32rpx;
      border-radius: 8rpx;
      font-size: 26rpx;
      border: 1rpx solid #dcdfe6;
      color: #606266;
      &--primary {
        background: #007aff;
        color: #fff;
        border-color: #007aff;
      }
    }
  }
  .skeleton-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    .skeleton-item {
      .skeleton-label {
        display: block;
        font-size: 24rpx;
        color: #999;
        margin-bottom: 8rpx;
      }
    }
  }
  .mt-3 {
    margin-top: 20rpx;
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
