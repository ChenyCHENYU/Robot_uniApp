<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_NumberKeyboard 数字键盘</text>
        <text class="demo-subtitle">虚拟数字键盘，支持小数点、随机排列</text>
      </view>

      <!-- 基础键盘 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <view
            class="input-display"
            @click="showBasic = true"
          >
            <text v-if="value1">{{ value1 }}</text>
            <text
              v-else
              class="input-placeholder"
              >点击输入</text
            >
          </view>
          <C_NumberKeyboard
            v-model:visible="showBasic"
            v-model="value1"
            title="输入金额"
          />
          <view class="code-block mt-3">
            &lt;C_NumberKeyboard v-model:visible="show" v-model="value"
            title="输入金额" /&gt;
          </view>
        </view>
      </view>

      <!-- 带小数点 -->
      <view class="demo-section">
        <text class="section-title">带小数点</text>
        <view class="demo-card">
          <view
            class="input-display"
            @click="showDot = true"
          >
            <text v-if="value2">{{ value2 }}</text>
            <text
              v-else
              class="input-placeholder"
              >点击输入小数</text
            >
          </view>
          <C_NumberKeyboard
            v-model:visible="showDot"
            v-model="value2"
            showDot
            title="输入金额"
          />
          <view class="code-block mt-3">
            &lt;C_NumberKeyboard showDot /&gt;
          </view>
        </view>
      </view>

      <!-- 随机排列 -->
      <view class="demo-section">
        <text class="section-title">随机排列</text>
        <view class="demo-card">
          <view
            class="input-display"
            @click="showRandom = true"
          >
            <text v-if="value3">{{ value3 }}</text>
            <text
              v-else
              class="input-placeholder"
              >点击输入（随机键位）</text
            >
          </view>
          <C_NumberKeyboard
            v-model:visible="showRandom"
            v-model="value3"
            randomOrder
            title="安全输入"
          />
          <text class="demo-desc"
            >设置 randomOrder
            后每次弹出键盘，数字顺序都不同，适用于密码输入</text
          >
          <view class="code-block">
            &lt;C_NumberKeyboard randomOrder /&gt;
          </view>
        </view>
      </view>

      <!-- 最大长度 -->
      <view class="demo-section">
        <text class="section-title">限制长度</text>
        <view class="demo-card">
          <view
            class="input-display"
            @click="showMax = true"
          >
            <text v-if="value4">{{ value4 }}</text>
            <text
              v-else
              class="input-placeholder"
              >最多6位</text
            >
          </view>
          <C_NumberKeyboard
            v-model:visible="showMax"
            v-model="value4"
            :maxLength="6"
            title="验证码"
          />
          <view class="code-block mt-3">
            &lt;C_NumberKeyboard :maxLength="6" /&gt;
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const showBasic = ref(false)
  const showDot = ref(false)
  const showRandom = ref(false)
  const showMax = ref(false)

  const value1 = ref('')
  const value2 = ref('')
  const value3 = ref('')
  const value4 = ref('')
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
    margin-top: 12rpx;
    margin-bottom: 12rpx;
  }
  .input-display {
    padding: 20rpx 24rpx;
    border: 2rpx solid #e4e7ed;
    border-radius: 12rpx;
    font-size: 32rpx;
    color: #333;
    min-height: 80rpx;
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
    .input-placeholder {
      color: #c0c4cc;
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
