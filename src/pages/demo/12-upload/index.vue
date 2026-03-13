<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Upload 上传</text>
        <text class="demo-subtitle">图片上传组件，支持预览、删除、数量限制</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <C_Upload v-model="fileList1" @delete="onDelete" @oversize="onOversize" />
          <view class="code-block mt-3">
            &lt;C_Upload v-model="fileList" /&gt;
          </view>
        </view>
      </view>

      <!-- 限制数量 -->
      <view class="demo-section">
        <text class="section-title">限制上传数量</text>
        <view class="demo-card">
          <C_Upload v-model="fileList2" :maxCount="3" />
          <text class="demo-desc">设置 maxCount 限制最多上传 3 张图片</text>
          <view class="code-block">
            &lt;C_Upload v-model="fileList" :maxCount="3" /&gt;
          </view>
        </view>
      </view>

      <!-- 自定义预览尺寸 -->
      <view class="demo-section">
        <text class="section-title">预览尺寸</text>
        <view class="demo-card">
          <C_Upload v-model="fileList3" previewSize="200rpx" />
          <view class="code-block mt-3">
            &lt;C_Upload previewSize="200rpx" /&gt;
          </view>
        </view>
      </view>

      <!-- 禁用状态 -->
      <view class="demo-section">
        <text class="section-title">禁用状态</text>
        <view class="demo-card">
          <C_Upload v-model="disabledList" disabled />
          <view class="code-block mt-3">
            &lt;C_Upload v-model="fileList" disabled /&gt;
          </view>
        </view>
      </view>

      <!-- Props -->
      <view class="demo-section">
        <text class="section-title">Props 一览</text>
        <view class="demo-card">
          <view class="prop-list">
            <view class="prop-item">
              <text class="prop-name">v-model</text>
              <text class="prop-desc">文件列表数组</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">maxCount</text>
              <text class="prop-desc">最大上传数，默认 9</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">maxSize</text>
              <text class="prop-desc">最大文件大小(bytes)，默认 10MB</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">previewSize</text>
              <text class="prop-desc">预览尺寸，默认 160rpx</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">deletable</text>
              <text class="prop-desc">是否可删除，默认 true</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">disabled</text>
              <text class="prop-desc">是否禁用</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
import { ref } from 'vue'

const fileList1 = ref([])
const fileList2 = ref([])
const fileList3 = ref([])
const disabledList = ref([
  { url: 'https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/robot_admin/login.png' },
])

const onDelete = (index) => {
  console.log('删除文件：', index)
}

const onOversize = (file) => {
  uni.showToast({ title: '文件过大', icon: 'none' })
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
  display: block; font-size: 26rpx; color: #666; margin-top: 12rpx;
}
.mt-3 { margin-top: 20rpx; }
.code-block {
  background: #f5f5f5; border-radius: 8rpx; padding: 16rpx 20rpx; font-size: 22rpx; color: #555; font-family: monospace;
}
.prop-list {
  .prop-item { display: flex; justify-content: space-between; padding: 12rpx 0; border-bottom: 1rpx solid #f0f0f0; }
  .prop-name { font-size: 24rpx; color: #007aff; font-weight: 600; font-family: monospace; }
  .prop-desc { font-size: 24rpx; color: #666; }
}
</style>
