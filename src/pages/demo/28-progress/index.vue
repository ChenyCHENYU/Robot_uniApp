<template>
  <C_Layout>
    <view class="demo-page demo-progress">
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
        <!-- 基础用法 -->
        <view class="demo-section">
          <text class="section-title">基础进度条</text>
          <text class="section-desc">不同百分比</text>
          <view class="demo-preview space-y-5">
            <C_Progress :percent="30" />
            <C_Progress :percent="60" />
            <C_Progress :percent="100" />
          </view>
        </view>

        <!-- 交互控制 -->
        <view class="demo-section">
          <text class="section-title">动态控制</text>
          <text class="section-desc">点击按钮调整进度</text>
          <view class="demo-preview">
            <C_Progress
              :percent="progress"
              showText
            />
            <view class="flex justify-center gap-3 mt-4">
              <button
                class="demo-button demo-button--quiet"
                @click="decrease"
                :disabled="progress === 0"
                >- 10</button
              >
              <button
                class="demo-button"
                @click="increase"
                :disabled="progress === 100"
                >+ 10</button
              >
            </view>
          </view>
        </view>

        <!-- 自定义颜色 -->
        <view class="demo-section">
          <text class="section-title">自定义颜色</text>
          <text class="section-desc">color 属性</text>
          <view class="demo-preview space-y-5">
            <view>
              <text class="text-xs demo-muted mb-1 block">绿色</text>
              <C_Progress
                :percent="40"
                color="#07c160"
              />
            </view>
            <view>
              <text class="text-xs demo-muted mb-1 block">红色</text>
              <C_Progress
                :percent="70"
                color="#ee0a24"
              />
            </view>
            <view>
              <text class="text-xs demo-muted mb-1 block">橙色</text>
              <C_Progress
                :percent="50"
                color="#ff976a"
              />
            </view>
          </view>
        </view>

        <!-- 自定义高度 -->
        <view class="demo-section">
          <text class="section-title">自定义高度</text>
          <text class="section-desc">strokeHeight 属性</text>
          <view class="demo-preview">
            <C_Progress
              :percent="60"
              showText
              :strokeHeight="36"
            />
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const { progress, increase, decrease } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
