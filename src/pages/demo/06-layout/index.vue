<template>
  <C_Layout>
    <view class="demo-page demo-layout">
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
        <view class="demo-section">
          <text class="section-title">页面结构预览</text>
          <text class="section-desc">切换模式，查看每个区域的职责</text>
          <view class="demo-row layout-options">
            <button
              v-for="mode in layoutModes"
              :key="mode.value"
              class="demo-button demo-button--quiet"
              :class="
                selectedMode === mode.value ? 'layout-option--active' : ''
              "
              @click="selectMode(mode.value)"
              >{{ mode.label }}</button
            >
          </view>
          <view class="layout-sample">
            <view
              v-if="showSampleHeader"
              class="layout-sample__header"
              ><C_Icon
                name="i-mdi-arrow-left"
                :size="18" /><text>页面导航</text
              ><C_Icon
                name="i-mdi-bell-outline"
                :size="18"
            /></view>
            <view class="layout-sample__content"
              ><C_Icon
                name="i-mdi-view-dashboard-outline"
                :size="30"
              /><text>内容区域</text
              ><text class="layout-sample__hint"
                >独立滚动 · 底部保留空间</text
              ></view
            >
            <view
              v-if="showSampleTabbar"
              class="layout-sample__tabbar"
              ><C_Icon
                name="i-mdi-home-outline"
                :size="20" /><C_Icon
                name="i-mdi-chat-outline"
                :size="20" /><C_Icon
                name="i-mdi-view-grid-outline"
                :size="20" /><C_Icon
                name="i-mdi-account-outline"
                :size="20"
            /></view>
          </view>
          <text class="demo-status">{{ modeDescription }}</text>
        </view>
        <view class="demo-section">
          <text class="section-title">滚动与安全区</text>
          <text class="section-desc"
            >主页面包含页头和底部导航；详情页面使用返回页头。内容在两者之间滚动，导航不覆盖列表或操作区。</text
          >
          <view class="demo-preview"
            ><text class="demo-regular"
              >当前演示页面本身由 C_Layout
              管理。结构预览不会额外创建全局导航实例。</text
            ></view
          >
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const {
    layoutModes,
    selectedMode,
    selectMode,
    showSampleHeader,
    showSampleTabbar,
    modeDescription,
  } = useDemo()
</script>
<style lang="scss" scoped>
  @import './index.scss';
</style>
