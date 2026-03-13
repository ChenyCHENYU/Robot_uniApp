<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Modal 弹窗</text>
        <text class="demo-subtitle">模态对话框，用于确认操作或展示重要信息</text>
      </view>

      <!-- 确认弹窗 -->
      <view class="demo-section">
        <text class="section-title">确认弹窗</text>
        <view class="demo-card">
          <view class="btn-row">
            <view class="demo-btn" @click="showConfirm = true">打开确认弹窗</view>
          </view>
          <C_Modal
            v-model:visible="showConfirm"
            title="确认操作"
            content="确定要删除这条记录吗？此操作不可撤销。"
            @confirm="onConfirm"
            @cancel="onCancel"
          />
          <view class="code-block mt-3">
            &lt;C_Modal
              v-model:visible="show"
              title="确认操作"
              content="确定要删除吗？"
              @confirm="onConfirm"
            /&gt;
          </view>
        </view>
      </view>

      <!-- 提示弹窗（无取消按钮） -->
      <view class="demo-section">
        <text class="section-title">提示弹窗（Alert）</text>
        <view class="demo-card">
          <view class="btn-row">
            <view class="demo-btn" @click="showAlert = true">打开提示弹窗</view>
          </view>
          <C_Modal
            v-model:visible="showAlert"
            title="提示"
            content="操作已完成，数据已保存成功！"
            :showCancel="false"
          />
          <view class="code-block mt-3">
            &lt;C_Modal title="提示" content="操作完成" :showCancel="false" /&gt;
          </view>
        </view>
      </view>

      <!-- 自定义内容 -->
      <view class="demo-section">
        <text class="section-title">自定义内容</text>
        <view class="demo-card">
          <view class="btn-row">
            <view class="demo-btn" @click="showCustom = true">自定义内容弹窗</view>
          </view>
          <C_Modal
            v-model:visible="showCustom"
            title="用户协议"
            @confirm="showCustom = false"
          >
            <view class="custom-modal-content">
              <text class="agreement-text">
                请仔细阅读以下协议内容：\n\n
                1. 您同意遵守平台使用规范\n
                2. 您的数据将被安全存储\n
                3. 我们尊重您的隐私权利
              </text>
            </view>
          </C_Modal>
          <view class="code-block mt-3">
            &lt;C_Modal title="用户协议"&gt;
              &lt;view&gt;自定义内容&lt;/view&gt;
            &lt;/C_Modal&gt;
          </view>
        </view>
      </view>

      <!-- 不可点击遮罩关闭 -->
      <view class="demo-section">
        <text class="section-title">禁止遮罩关闭</text>
        <view class="demo-card">
          <view class="btn-row">
            <view class="demo-btn" @click="showNoOverlay = true">不可遮罩关闭</view>
          </view>
          <C_Modal
            v-model:visible="showNoOverlay"
            title="重要提示"
            content="此弹窗不能点击遮罩关闭，必须点击按钮。"
            :closeOnClickOverlay="false"
            :showClose="false"
          />
          <view class="code-block mt-3">
            &lt;C_Modal :closeOnClickOverlay="false" :showClose="false" /&gt;
          </view>
        </view>
      </view>

      <!-- 自定义按钮文案 -->
      <view class="demo-section">
        <text class="section-title">自定义按钮文案</text>
        <view class="demo-card">
          <view class="btn-row">
            <view class="demo-btn" @click="showCustomBtn = true">自定义按钮</view>
          </view>
          <C_Modal
            v-model:visible="showCustomBtn"
            title="退出登录"
            content="确认退出当前账号？"
            confirmText="退出"
            cancelText="再想想"
          />
          <view class="code-block mt-3">
            &lt;C_Modal confirmText="退出" cancelText="再想想" /&gt;
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
import { ref } from 'vue'

const showConfirm = ref(false)
const showAlert = ref(false)
const showCustom = ref(false)
const showNoOverlay = ref(false)
const showCustomBtn = ref(false)

const onConfirm = () => {
  showConfirm.value = false
  uni.showToast({ title: '已确认', icon: 'success' })
}

const onCancel = () => {
  uni.showToast({ title: '已取消', icon: 'none' })
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
.btn-row {
  display: flex; gap: 16rpx; margin-bottom: 16rpx;
}
.demo-btn {
  padding: 16rpx 32rpx; background: #007aff; color: #fff; border-radius: 12rpx; font-size: 28rpx; text-align: center;
}
.custom-modal-content {
  padding: 16rpx 0;
  .agreement-text { font-size: 26rpx; color: #666; line-height: 1.8; white-space: pre-wrap; }
}
.mt-3 { margin-top: 20rpx; }
.code-block {
  background: #f5f5f5; border-radius: 8rpx; padding: 16rpx 20rpx; font-size: 22rpx; color: #555; font-family: monospace; white-space: pre-wrap;
}
</style>
