<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Form 表单</text>
        <text class="demo-subtitle">表单容器组件，支持校验规则、必填、正则和自定义校验</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础表单</text>
        <view class="demo-card">
          <C_Form ref="formRef" :model="formData" :rules="rules">
            <view class="form-item">
              <text class="form-label">用户名</text>
              <input class="form-input" v-model="formData.username" placeholder="请输入用户名" />
            </view>
            <view class="form-item">
              <text class="form-label">手机号</text>
              <input class="form-input" v-model="formData.phone" placeholder="请输入手机号" type="number" />
            </view>
            <view class="form-item">
              <text class="form-label">邮箱</text>
              <input class="form-input" v-model="formData.email" placeholder="请输入邮箱" />
            </view>
          </C_Form>
          <view class="form-actions">
            <view class="step-btn step-btn--primary" @click="onSubmit">提交</view>
            <view class="step-btn" @click="onReset">重置</view>
          </view>
          <view class="code-block">
            &lt;C_Form :model="formData" :rules="rules"&gt;
              &lt;!-- 表单内容 --&gt;
            &lt;/C_Form&gt;
          </view>
        </view>
      </view>

      <!-- 校验规则 -->
      <view class="demo-section">
        <text class="section-title">校验规则示例</text>
        <view class="demo-card">
          <view class="rule-item">
            <text class="rule-title">必填校验</text>
            <view class="code-block">
              { required: true, message: '请输入用户名' }
            </view>
          </view>
          <view class="rule-item">
            <text class="rule-title">正则校验</text>
            <view class="code-block">
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
            </view>
          </view>
          <view class="rule-item">
            <text class="rule-title">自定义校验</text>
            <view class="code-block">
              { validator: (val) => !val.includes('@') ? '请输入邮箱' : '' }
            </view>
          </view>
        </view>
      </view>

      <!-- 标签位置 -->
      <view class="demo-section">
        <text class="section-title">标签位置</text>
        <view class="demo-card">
          <text class="demo-desc">labelPosition 支持 left（默认）和 top 两种模式</text>
          <view class="code-block">
            &lt;C_Form labelPosition="top" labelWidth="180rpx"&gt;
              ...
            &lt;/C_Form&gt;
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
import { ref, reactive } from 'vue'

const formRef = ref(null)

const formData = reactive({
  username: '',
  phone: '',
  email: '',
})

const rules = {
  username: [
    { required: true, message: '请输入用户名' },
  ],
  phone: [
    { required: true, message: '请输入手机号' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { validator: (val) => (!val || !val.includes('@')) ? '请输入有效邮箱' : '' },
  ],
}

const onSubmit = () => {
  const valid = formRef.value?.validate?.()
  if (valid) {
    uni.showToast({ title: '提交成功', icon: 'success' })
  } else {
    uni.showToast({ title: '请检查表单', icon: 'none' })
  }
}

const onReset = () => {
  formData.username = ''
  formData.phone = ''
  formData.email = ''
  formRef.value?.resetValidation?.()
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
  display: block; font-size: 26rpx; color: #666; margin-bottom: 16rpx;
}
.form-item {
  display: flex; align-items: center; padding: 16rpx 0; border-bottom: 1rpx solid #f0f0f0;
  .form-label { font-size: 28rpx; color: #333; min-width: 140rpx; }
  .form-input { flex: 1; font-size: 28rpx; padding: 8rpx 16rpx; }
}
.form-actions {
  display: flex; justify-content: center; gap: 20rpx; margin: 24rpx 0;
  .step-btn {
    padding: 12rpx 40rpx; border-radius: 8rpx; font-size: 28rpx; border: 1rpx solid #dcdfe6; color: #606266;
    &--primary { background: #007aff; color: #fff; border-color: #007aff; }
  }
}
.rule-item {
  margin-bottom: 20rpx;
  .rule-title { display: block; font-size: 26rpx; font-weight: 600; color: #333; margin-bottom: 8rpx; }
}
.code-block {
  background: #f5f5f5; border-radius: 8rpx; padding: 16rpx 20rpx; font-size: 22rpx; color: #555; font-family: monospace; white-space: pre-wrap;
}
</style>
