<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_ActionSheet 操作面板</text>
        <text class="demo-subtitle">从底部弹出的操作菜单，支持图标、危险项、禁用项</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <view class="btn-row">
            <view class="demo-btn" @click="showBasic = true">打开操作面板</view>
          </view>
          <C_ActionSheet
            v-model:visible="showBasic"
            :actions="basicActions"
            @select="onSelect"
          />
          <view class="code-block mt-3">
            &lt;C_ActionSheet
              v-model:visible="show"
              :actions="actions"
              @select="onSelect"
            /&gt;
          </view>
        </view>
      </view>

      <!-- 带标题 -->
      <view class="demo-section">
        <text class="section-title">带标题</text>
        <view class="demo-card">
          <view class="btn-row">
            <view class="demo-btn" @click="showTitle = true">带标题面板</view>
          </view>
          <C_ActionSheet
            v-model:visible="showTitle"
            title="请选择操作"
            :actions="basicActions"
            @select="onSelect"
          />
          <view class="code-block mt-3">
            &lt;C_ActionSheet title="请选择操作" :actions="actions" /&gt;
          </view>
        </view>
      </view>

      <!-- 带图标 -->
      <view class="demo-section">
        <text class="section-title">带图标</text>
        <view class="demo-card">
          <view class="btn-row">
            <view class="demo-btn" @click="showIcons = true">带图标面板</view>
          </view>
          <C_ActionSheet
            v-model:visible="showIcons"
            :actions="iconActions"
            @select="onSelect"
          />
          <view class="code-block mt-3">
            actions: [
              { name: '分享', icon: 'share' },
              { name: '收藏', icon: 'star' },
            ]
          </view>
        </view>
      </view>

      <!-- 危险项和禁用项 -->
      <view class="demo-section">
        <text class="section-title">危险项 & 禁用项</text>
        <view class="demo-card">
          <view class="btn-row">
            <view class="demo-btn" @click="showDanger = true">危险操作</view>
          </view>
          <C_ActionSheet
            v-model:visible="showDanger"
            title="文件操作"
            :actions="dangerActions"
            @select="onSelect"
          />
          <view class="code-block mt-3">
            { name: '删除', danger: true }
            { name: '不可用', disabled: true }
          </view>
        </view>
      </view>

      <!-- 带描述 -->
      <view class="demo-section">
        <text class="section-title">带描述文字</text>
        <view class="demo-card">
          <view class="btn-row">
            <view class="demo-btn" @click="showDesc = true">带描述面板</view>
          </view>
          <C_ActionSheet
            v-model:visible="showDesc"
            :actions="descActions"
            @select="onSelect"
          />
          <view class="code-block mt-3">
            { name: '微信', description: '分享到微信好友' }
          </view>
        </view>
      </view>

      <!-- 选中结果 -->
      <view v-if="selectedAction" class="demo-section">
        <text class="section-title">选中结果</text>
        <view class="demo-card">
          <text class="result-text">你选择了：{{ selectedAction }}</text>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
import { ref } from 'vue'

const showBasic = ref(false)
const showTitle = ref(false)
const showIcons = ref(false)
const showDanger = ref(false)
const showDesc = ref(false)
const selectedAction = ref('')

const basicActions = [
  { name: '选项一' },
  { name: '选项二' },
  { name: '选项三' },
]

const iconActions = [
  { name: '分享', icon: 'share' },
  { name: '收藏', icon: 'star' },
  { name: '下载', icon: 'download' },
]

const dangerActions = [
  { name: '编辑', icon: 'edit' },
  { name: '复制', icon: 'copy' },
  { name: '禁用项', disabled: true },
  { name: '删除', icon: 'delete', danger: true },
]

const descActions = [
  { name: '微信', description: '分享到微信好友', icon: 'chat' },
  { name: '朋友圈', description: '分享到朋友圈', icon: 'picture' },
  { name: '链接', description: '复制链接到剪贴板', icon: 'link' },
]

const onSelect = (item) => {
  selectedAction.value = item.name
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
.btn-row {
  display: flex; gap: 16rpx; margin-bottom: 16rpx;
}
.demo-btn {
  padding: 16rpx 32rpx; background: #007aff; color: #fff; border-radius: 12rpx; font-size: 28rpx; text-align: center;
}
.result-text {
  font-size: 28rpx; color: #007aff; font-weight: 600;
}
.mt-3 { margin-top: 20rpx; }
.code-block {
  background: #f5f5f5; border-radius: 8rpx; padding: 16rpx 20rpx; font-size: 22rpx; color: #555; font-family: monospace; white-space: pre-wrap;
}
</style>
