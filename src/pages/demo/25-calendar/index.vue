<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Calendar 日历</text>
        <text class="demo-subtitle">日历组件，支持单选、多选、区间选择</text>
      </view>

      <!-- 单选模式 -->
      <view class="demo-section">
        <text class="section-title">单选模式</text>
        <view class="demo-card">
          <view
            class="action-btn"
            @click="showSingle = true"
            >选择日期: {{ selectedDate || '未选择' }}</view
          >
          <C_Calendar
            :visible="showSingle"
            mode="single"
            @confirm="onSingleConfirm"
            @close="showSingle = false"
          />
          <view class="code-block">
            &lt;C_Calendar :visible="show" mode="single" @confirm="onConfirm"
            /&gt;
          </view>
        </view>
      </view>

      <!-- 区间选择 -->
      <view class="demo-section">
        <text class="section-title">区间选择</text>
        <view class="demo-card">
          <view
            class="action-btn"
            @click="showRange = true"
            >选择日期范围</view
          >
          <C_Calendar
            :visible="showRange"
            mode="range"
            @confirm="onRangeConfirm"
            @close="showRange = false"
          />
          <text
            v-if="rangeText"
            class="demo-desc"
            >{{ rangeText }}</text
          >
        </view>
      </view>

      <!-- 自定义颜色 -->
      <view class="demo-section">
        <text class="section-title">自定义颜色</text>
        <view class="demo-card">
          <view
            class="action-btn action-btn--green"
            @click="showCustom = true"
            >自定义主题色</view
          >
          <C_Calendar
            :visible="showCustom"
            mode="single"
            color="#07c160"
            @confirm="onCustomConfirm"
            @close="showCustom = false"
          />
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const showSingle = ref(false)
  const showRange = ref(false)
  const showCustom = ref(false)
  const selectedDate = ref('')
  const rangeText = ref('')

  const onSingleConfirm = (date: string) => {
    selectedDate.value = date
    showSingle.value = false
  }

  const onRangeConfirm = (dates: string[]) => {
    rangeText.value = `${dates[0]} 至 ${dates[1]}`
    showRange.value = false
  }

  const onCustomConfirm = (date: string) => {
    uni.showToast({ title: `选择: ${date}`, icon: 'none' })
    showCustom.value = false
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
  .action-btn {
    text-align: center;
    padding: 20rpx;
    background: #667eea;
    color: #fff;
    border-radius: 12rpx;
    font-size: 28rpx;
    &--green {
      background: #07c160;
    }
  }
  .demo-desc {
    display: block;
    font-size: 26rpx;
    color: #666;
    margin-top: 16rpx;
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
