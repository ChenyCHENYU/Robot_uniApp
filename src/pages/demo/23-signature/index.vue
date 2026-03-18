<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Signature 签名板</text>
        <text class="demo-subtitle">手写签名组件，支持画笔颜色和粗细调整</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <C_Signature
            ref="signatureRef"
            height="400rpx"
          />
          <view class="sig-actions">
            <view
              class="action-btn"
              @click="handleClear"
              >清除</view
            >
            <view
              class="action-btn action-btn--primary"
              @click="handleConfirm"
              >确认</view
            >
          </view>
          <view class="code-block">
            &lt;C_Signature ref="signatureRef" height="400rpx" /&gt;
          </view>
        </view>
      </view>

      <!-- 自定义画笔 -->
      <view class="demo-section">
        <text class="section-title">自定义画笔</text>
        <view class="demo-card">
          <C_Signature
            penColor="#ee0a24"
            :lineWidth="4"
            height="300rpx"
          />
          <view class="code-block">
            &lt;C_Signature penColor="#ee0a24" :lineWidth="4" /&gt;
          </view>
        </view>
      </view>

      <!-- 签名结果 -->
      <view
        v-if="signResult"
        class="demo-section"
      >
        <text class="section-title">签名结果</text>
        <view class="demo-card">
          <image
            :src="signResult"
            mode="widthFix"
            class="result-image"
          />
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const signatureRef = ref()
  const signResult = ref('')

  const handleClear = () => {
    signatureRef.value?.clear()
    signResult.value = ''
  }

  const handleConfirm = async () => {
    const result = await signatureRef.value?.confirm()
    if (result && !result.isEmpty) {
      signResult.value = result.tempFilePath
      uni.showToast({ title: '签名已保存', icon: 'success' })
    } else {
      uni.showToast({ title: '请先签名', icon: 'none' })
    }
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
  .sig-actions {
    display: flex;
    justify-content: center;
    gap: 20rpx;
    margin-top: 20rpx;
    .action-btn {
      padding: 16rpx 40rpx;
      border-radius: 8rpx;
      font-size: 28rpx;
      border: 1rpx solid #dcdfe6;
      color: #606266;
      &--primary {
        background: #007aff;
        color: #fff;
        border-color: #007aff;
      }
    }
  }
  .result-image {
    width: 100%;
    border-radius: 8rpx;
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
