<template>
  <C_Layout>
    <view class="demo-page demo-signature">
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
        <!-- 基础签名 -->
        <view class="demo-section">
          <text class="section-title">基础签名</text>
          <text class="section-desc">在画布上手写签名</text>
          <view class="demo-preview overflow-hidden">
            <C_Signature
              ref="signatureRef"
              :height="400"
              :showFooter="false"
              @confirm="onSignatureConfirm"
            />
          </view>
          <view class="flex justify-center gap-3">
            <button
              class="demo-button demo-button--quiet"
              @click="handleClear"
              >清除</button
            >
            <button
              class="demo-button"
              @click="handleConfirm"
              >确认签名</button
            >
          </view>
        </view>

        <!-- 自定义画笔 -->
        <view class="demo-section">
          <text class="section-title">自定义画笔</text>
          <text class="section-desc">红色画笔 · 粗细调整</text>
          <view class="demo-preview overflow-hidden">
            <C_Signature
              penColor="#ee0a24"
              :lineWidth="4"
              :height="300"
              @confirm="onSignatureConfirm"
            />
          </view>
        </view>

        <!-- 签名结果 -->
        <view
          v-if="signResult"
          class="demo-section"
        >
          <text class="section-title">签名结果</text>
          <text class="section-desc">签名已保存</text>
          <view class="demo-preview">
            <image
              :src="signResult"
              mode="widthFix"
              class="w-full rounded-lg"
            />
          </view>
        </view>

        <!-- 特性 -->
        <view class="demo-section">
          <text class="section-title">组件特性</text>
          <view class="my-6 grid grid-cols-2 gap-4">
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-pencil-outline"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">自定义画笔</text>
              <text class="text-xs demo-muted">颜色 · 粗细</text>
            </view>
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-camera-outline"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">导出图片</text>
              <text class="text-xs demo-muted">PNG / JPEG</text>
            </view>
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-undo-variant"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">撤销上一笔</text>
              <text class="text-xs demo-muted">灵活操作</text>
            </view>
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-gesture-tap"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">触控优化</text>
              <text class="text-xs demo-muted">流畅书写</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const {
    signatureRef,
    signResult,
    handleClear,
    handleConfirm,
    onSignatureConfirm,
  } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
