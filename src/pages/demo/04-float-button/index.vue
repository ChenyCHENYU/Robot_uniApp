<template>
  <C_Layout>
    <view class="demo-page demo-float-button">
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
          <text class="section-title">基础用法</text>
          <text class="section-desc">右下角默认位置</text>
          <view
            class="float-preview demo-preview overflow-hidden"
            style="height: 300rpx"
          >
            <view class="flex items-center justify-center h-full">
              <text class="text-sm demo-muted">模拟页面区域</text>
            </view>
            <C_FloatButton
              :bottom="24"
              :right="24"
              @click="handleClick('基础按钮')"
            />
          </view>
        </view>

        <!-- 自定义图标 -->
        <view class="demo-section">
          <text class="section-title">自定义图标</text>
          <text class="section-desc">替换默认加号图标</text>
          <view
            class="float-preview demo-preview overflow-hidden"
            style="height: 300rpx"
          >
            <view class="flex items-center justify-center h-full">
              <text class="text-sm demo-muted">自定义图标样式</text>
            </view>
            <C_FloatButton
              icon="edit"
              :bottom="24"
              :right="24"
              @click="handleClick('编辑按钮')"
            />
          </view>
        </view>

        <!-- 位置控制 -->
        <view class="demo-section">
          <text class="section-title">使用说明</text>
          <text class="section-desc">悬浮按钮的配置能力</text>
          <view class="demo-preview space-y-4">
            <view class="flex items-center gap-3 p-3 demo-surface rounded-lg">
              <text class="i-mdi-map-marker text-xl text-blue-500"></text>
              <view>
                <text class="text-sm font-medium demo-regular block"
                  >位置控制</text
                >
                <text class="text-xs demo-muted"
                  >position: right-bottom / left-bottom</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 demo-surface rounded-lg">
              <text class="i-mdi-gesture-swipe text-xl text-green-500"></text>
              <view>
                <text class="text-sm font-medium demo-regular block"
                  >支持拖拽</text
                >
                <text class="text-xs demo-muted"
                  >draggable 属性启用拖拽交互</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 demo-surface rounded-lg">
              <text class="i-mdi-resize text-xl text-orange-500"></text>
              <view>
                <text class="text-sm font-medium demo-regular block"
                  >尺寸设置</text
                >
                <text class="text-xs demo-muted"
                  >size 属性控制按钮大小（rpx）</text
                >
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const { handleClick } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
