<template>
  <C_Layout>
    <view class="demo-page demo-image-preview">
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
        <!-- 基础用法-点击缩略图 -->
        <view class="demo-section">
          <text class="section-title">点击预览</text>
          <text class="section-desc">点击图片全屏查看</text>
          <view class="demo-preview">
            <view class="flex gap-3 flex-wrap justify-center">
              <image
                v-for="(img, idx) in images"
                :key="idx"
                :src="img"
                class="w-20 h-20 rounded-lg"
                mode="aspectFill"
                @click="previewImage(idx)"
              />
            </view>
            <text class="text-xs demo-muted text-center block mt-3"
              >点击图片可预览</text
            >
          </view>
        </view>

        <!-- 组件方式 -->
        <view class="demo-section">
          <text class="section-title">组件弹出</text>
          <text class="section-desc">visible 控制显隐</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button"
              @click="showPreview = true"
              >打开图片预览</button
            >
          </view>
          <C_ImagePreview
            v-model:visible="showPreview"
            :images="images"
            v-model:current="previewIndex"
          />
        </view>

        <!-- 功能特性 -->
        <view class="demo-section">
          <text class="section-title">功能特性</text>
          <text class="section-desc">丰富的预览能力</text>
          <view class="my-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-magnify"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">手势缩放</text>
              <text class="text-xs demo-muted">双指缩放查看</text>
            </view>
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-gesture-swipe-horizontal"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">滑动翻页</text>
              <text class="text-xs demo-muted">左右滑动切换</text>
            </view>
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-content-save-outline"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">保存图片</text>
              <text class="text-xs demo-muted">长按打开保存菜单</text>
            </view>
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-map-marker-outline"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">指示器</text>
              <text class="text-xs demo-muted">显示当前位置</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const { images, showPreview, previewIndex, previewImage } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
