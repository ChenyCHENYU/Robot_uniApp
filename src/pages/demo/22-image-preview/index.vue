<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_ImagePreview 图片预览</text>
        <text class="demo-subtitle">全屏图片预览，支持缩放和翻页</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <view class="image-grid">
            <image
              v-for="(img, idx) in images"
              :key="idx"
              :src="img"
              class="grid-image"
              mode="aspectFill"
              @click="previewImage(idx)"
            />
          </view>
          <view class="code-block">
            &lt;C_ImagePreview :visible="show" :images="images"
            :startPosition="0" /&gt;
          </view>
        </view>
      </view>

      <!-- 组件方式 -->
      <view class="demo-section">
        <text class="section-title">组件弹出方式</text>
        <view class="demo-card">
          <view
            class="action-btn"
            @click="showPreview = true"
            >打开图片预览</view
          >
          <C_ImagePreview
            :visible="showPreview"
            :images="images"
            :startPosition="0"
            @close="showPreview = false"
          />
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const images = [
    'https://picsum.photos/400/300?random=1',
    'https://picsum.photos/400/300?random=2',
    'https://picsum.photos/400/300?random=3',
  ]
  const showPreview = ref(false)

  const previewImage = (index: number) => {
    uni.previewImage({
      urls: images,
      current: index,
    })
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
  .image-grid {
    display: flex;
    gap: 16rpx;
    flex-wrap: wrap;
    .grid-image {
      width: 180rpx;
      height: 180rpx;
      border-radius: 12rpx;
    }
  }
  .action-btn {
    text-align: center;
    padding: 20rpx;
    background: #667eea;
    color: #fff;
    border-radius: 12rpx;
    font-size: 28rpx;
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
