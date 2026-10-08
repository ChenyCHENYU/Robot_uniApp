<template>
  <C_Layout>
    <view class="demo-page demo-tab-nav">
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
          <text class="section-desc">点击切换标签</text>
          <view class="demo-preview overflow-hidden">
            <C_TabNav
              v-model="activeTab"
              :tabs="basicTabs"
            />
            <view class="p-4 text-center">
              <text class="text-sm demo-muted"
                >当前选中：{{ activeLabel }}</text
              >
            </view>
          </view>
        </view>

        <!-- 可滚动 -->
        <view class="demo-section">
          <text class="section-title">可滚动标签</text>
          <text class="section-desc">scrollable 属性</text>
          <view class="demo-preview overflow-hidden">
            <C_TabNav
              v-model="scrollTab"
              :tabs="scrollTabs"
              scrollable
            />
            <view class="p-4 text-center">
              <text class="text-sm demo-muted">选中：{{ scrollLabel }}</text>
            </view>
          </view>
        </view>

        <!-- 分段导航 -->
        <view class="demo-section">
          <text class="section-title">分段导航</text>
          <text class="section-desc">等宽排列 · 无下划线</text>
          <view class="demo-preview overflow-hidden">
            <C_TabNav
              v-model="cardTab"
              :tabs="basicTabs"
              class="tab-nav-segment"
              equalWidth
              :showLine="false"
            />
          </view>
        </view>

        <!-- 带徽标 -->
        <view class="demo-section">
          <text class="section-title">带徽标</text>
          <text class="section-desc">数字徽标 / 未读圆点</text>
          <view class="demo-preview overflow-hidden">
            <C_TabNav
              v-model="badgeTab"
              :tabs="badgeTabs"
            />
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const {
    activeTab,
    activeLabel,
    scrollLabel,
    scrollTab,
    cardTab,
    badgeTab,
    basicTabs,
    scrollTabs,
    badgeTabs,
  } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
