<template>
  <C_Layout>
    <view class="demo-page demo-watermark">
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
        <!-- 基础水印 -->
        <view class="demo-section">
          <text class="section-title">基础水印</text>
          <text class="section-desc">默认文字水印</text>
          <view class="demo-preview watermark-sample">
            <C_Watermark
              text="机器人助手"
              color="var(--r-text-secondary)"
            >
              <view
                class="flex items-center justify-center"
                style="height: 160px"
              >
                <text class="watermark-caption">内容区域</text>
              </view>
            </C_Watermark>
          </view>
        </view>

        <!-- 自定义颜色 -->
        <view class="demo-section">
          <text class="section-title">自定义颜色</text>
          <text class="section-desc">color 属性</text>
          <view class="demo-preview watermark-sample">
            <C_Watermark
              text="Robot App"
              color="var(--r-color-primary)"
            >
              <view
                class="flex items-center justify-center"
                style="height: 160px"
              >
                <text class="watermark-caption">蓝色水印</text>
              </view>
            </C_Watermark>
          </view>
        </view>

        <!-- 旋转角度 -->
        <view class="demo-section">
          <text class="section-title">旋转角度</text>
          <text class="section-desc">rotate 属性</text>
          <view class="demo-preview watermark-sample">
            <C_Watermark
              text="自定义角度"
              color="var(--r-text-secondary)"
              :rotate="-15"
            >
              <view
                class="flex items-center justify-center"
                style="height: 160px"
              >
                <text class="watermark-caption">rotate = -15°</text>
              </view>
            </C_Watermark>
          </view>
        </view>

        <!-- 自定义间距 -->
        <view class="demo-section">
          <text class="section-title">密集水印</text>
          <text class="section-desc">gap 属性</text>
          <view class="demo-preview watermark-sample">
            <C_Watermark
              text="CONFIDENTIAL"
              color="var(--r-text-secondary)"
              :gap="[60, 60]"
              :fontSize="12"
            >
              <view
                class="flex items-center justify-center"
                style="height: 160px"
              >
                <text class="watermark-caption">密集排列效果</text>
              </view>
            </C_Watermark>
          </view>
        </view>

        <!-- 全页水印 -->
        <view class="demo-section">
          <text class="section-title">功能特性</text>
          <text class="section-desc">安全、灵活、可配置</text>
          <view class="my-6 grid grid-cols-2 gap-4">
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-lock-outline"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">来源标记</text>
              <text class="text-xs demo-muted">截图中标记内容来源</text>
            </view>
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-palette-outline"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">自定义样式</text>
              <text class="text-xs demo-muted">颜色、大小、间距</text>
            </view>
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-rotate-left"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">旋转角度</text>
              <text class="text-xs demo-muted">自由设置倾斜度</text>
            </view>
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-file-document-outline"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">全页覆盖</text>
              <text class="text-xs demo-muted">fullPage 模式</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META } from './data'
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
