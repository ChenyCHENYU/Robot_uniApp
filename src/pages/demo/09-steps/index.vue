<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Steps 步骤条</text>
        <text class="demo-subtitle">引导用户按照流程完成任务的步骤导航条</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <C_Steps :steps="basicSteps" :current="currentStep" />
          <view class="step-actions">
            <view class="step-btn" @click="prevStep">上一步</view>
            <view class="step-btn step-btn--primary" @click="nextStep">下一步</view>
          </view>
          <view class="code-block">
            &lt;C_Steps :steps="steps" :current="1" /&gt;
          </view>
        </view>
      </view>

      <!-- 竖向步骤条 -->
      <view class="demo-section">
        <text class="section-title">竖向步骤条</text>
        <view class="demo-card">
          <C_Steps :steps="verticalSteps" :current="2" direction="vertical" />
          <view class="code-block">
            &lt;C_Steps :steps="steps" :current="2" direction="vertical" /&gt;
          </view>
        </view>
      </view>

      <!-- 自定义颜色 -->
      <view class="demo-section">
        <text class="section-title">自定义颜色</text>
        <view class="demo-card">
          <C_Steps :steps="basicSteps" :current="1" activeColor="#67c23a" inactiveColor="#dcdfe6" />
          <view class="code-block">
            &lt;C_Steps activeColor="#67c23a" inactiveColor="#dcdfe6" /&gt;
          </view>
        </view>
      </view>

      <!-- 全部完成 -->
      <view class="demo-section">
        <text class="section-title">全部完成</text>
        <view class="demo-card">
          <C_Steps :steps="basicSteps" :current="3" />
          <text class="demo-desc">当 current 等于步骤数时，所有步骤标记为已完成</text>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)

const basicSteps = [
  { title: '提交订单' },
  { title: '支付' },
  { title: '完成' },
]

const verticalSteps = [
  { title: '提交申请', description: '2024-01-01 10:00' },
  { title: '审批中', description: '2024-01-02 14:30' },
  { title: '审批通过', description: '2024-01-03 09:15' },
  { title: '完成', description: '等待处理' },
]

const nextStep = () => {
  if (currentStep.value < basicSteps.length) currentStep.value++
}
const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--
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
.demo-desc {
  display: block; font-size: 26rpx; color: #666; margin-top: 16rpx;
}
.step-actions {
  display: flex; justify-content: center; gap: 20rpx; margin: 24rpx 0;
  .step-btn {
    padding: 12rpx 32rpx; border-radius: 8rpx; font-size: 26rpx; border: 1rpx solid #dcdfe6; color: #606266;
    &--primary { background: #007aff; color: #fff; border-color: #007aff; }
  }
}
.code-block {
  background: #f5f5f5; border-radius: 8rpx; padding: 16rpx 20rpx; font-size: 22rpx; color: #555; font-family: monospace;
}
</style>
