<template>
  <C_Layout>
    <view class="demo-page demo-modal">
      <view class="demo-hero">
        <view class="demo-hero__eyebrow"
          ><text>{{ PAGE_META.category }}</text
          ><text>{{ PAGE_META.component }}</text></view
        >
        <text class="demo-hero__title">{{ PAGE_META.title }}</text>
        <text class="demo-hero__desc">{{ PAGE_META.summary }}</text>
      </view>
      <view class="demo-tip"
        ><C_Icon
          name="i-mdi-gesture-tap"
          :size="16"
        /><text>{{ PAGE_META.instruction }}</text></view
      >

      <view class="demo-grid">
        <!-- 确认弹窗 -->
        <view class="demo-section">
          <text class="section-title">确认弹窗</text>
          <text class="section-desc">双按钮模式</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button"
              @click="showConfirm = true"
              >打开确认弹窗</button
            >
          </view>
          <C_Modal
            v-model:visible="showConfirm"
            title="确认操作"
            confirmText="确定"
            cancelText="取消"
            :showCancel="true"
            @confirm="onConfirm"
            @cancel="onCancel"
          >
            <text class="text-sm demo-regular"
              >确认后会在当前页面显示操作结果。</text
            >
          </C_Modal>
        </view>

        <!-- 提示弹窗 -->
        <view class="demo-section">
          <text class="section-title">提示弹窗</text>
          <text class="section-desc">单按钮模式</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button"
              @click="showAlert = true"
              >打开提示弹窗</button
            >
          </view>
          <C_Modal
            v-model:visible="showAlert"
            title="操作成功"
            confirmText="我知道了"
            :showCancel="false"
            @confirm="showAlert = false"
          >
            <text class="text-sm demo-regular">这是一条演示成功提示。</text>
          </C_Modal>
        </view>

        <!-- 自定义内容 -->
        <view class="demo-section">
          <text class="section-title">自定义内容</text>
          <text class="section-desc">丰富的弹窗内容</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button demo-button--quiet"
              @click="showCustom = true"
              >自定义内容弹窗</button
            >
          </view>
          <C_Modal
            v-model:visible="showCustom"
            title="系统更新"
            :showCancel="true"
            confirmText="立即更新"
            cancelText="稍后再说"
          >
            <view class="space-y-3">
              <view class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <C_Icon
                  name="i-mdi-rocket-launch-outline"
                  :size="24"
                  class="demo-feature-icon"
                />
                <view>
                  <text class="text-sm font-bold block">v2.0.0 新版本</text>
                  <text class="text-xs demo-muted">包含多项功能改进</text>
                </view>
              </view>
              <view class="text-sm demo-regular space-y-1">
                <text class="block">• 全新界面设计</text>
                <text class="block">• 更流畅的操作反馈</text>
                <text class="block">• 修复已知问题</text>
              </view>
            </view>
          </C_Modal>
        </view>

        <!-- 关闭按钮 -->
        <view class="demo-section">
          <text class="section-title">关闭按钮</text>
          <text class="section-desc">showClose 属性</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button demo-button--danger"
              @click="showClose = true"
              >带关闭按钮</button
            >
          </view>
          <C_Modal
            v-model:visible="showClose"
            title="通知"
            :showClose="true"
            :showCancel="false"
            confirmText="好的"
            @confirm="showClose = false"
          >
            <text class="text-sm demo-regular"
              >您有一条新的系统通知，请查看并处理。</text
            >
          </C_Modal>
        </view>
      </view>

      <!-- 交互结果 -->
      <view
        v-if="actionResult"
        class="mt-6 demo-surface rounded-lg p-4"
      >
        <view class="flex items-center gap-2 justify-center">
          <text class="text-green-500">✓</text>
          <text class="text-sm demo-regular">{{ actionResult }}</text>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const {
    showConfirm,
    showAlert,
    showCustom,
    showClose,
    actionResult,
    onConfirm,
    onCancel,
  } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
