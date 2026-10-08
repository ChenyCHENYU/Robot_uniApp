<template>
  <C_Layout>
    <view class="demo-page demo-tabbar">
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
          <text class="section-title">基础展示</text>
          <text class="section-desc">点击切换 · 选中态反馈</text>
          <view class="demo-preview overflow-hidden">
            <view class="text-center py-8 text-sm demo-muted"
              >当前页面：{{ selectedTab }}</view
            >
            <C_Tabbar
              v-model="selectedIndex"
              :tabList="tabItems"
              :fixed="false"
              mode="flat"
              @change="onActualTabChange"
            />
          </view>
        </view>

        <!-- 角标提示 -->
        <view class="demo-section">
          <text class="section-title">角标提示</text>
          <text class="section-desc">搭配 Badge 徽标</text>
          <view class="demo-preview overflow-hidden">
            <view class="text-center py-8 text-sm demo-muted"
              >当前页面：{{ selectedBadgeTab }}</view
            >
            <view class="border-t border-gray-200 demo-surface py-4">
              <view class="flex justify-around">
                <view
                  v-for="tab in badgeTabs"
                  :key="tab.name"
                  class="tabbar-sample__item"
                  role="button"
                  tabindex="0"
                  @keydown.enter="selectBadgeTab(tab.name)"
                  @click="selectBadgeTab(tab.name)"
                >
                  <C_Badge
                    v-if="tab.badge || tab.dot"
                    :value="tab.badge"
                    :dot="tab.dot"
                  >
                    <text
                      :class="[
                        tab.icon,
                        tab.name === selectedBadgeTab
                          ? 'tabbar-sample__item--active'
                          : '',
                      ]"
                      class="text-xl"
                    ></text>
                  </C_Badge>
                  <text
                    v-else
                    :class="[
                      tab.icon,
                      tab.name === selectedBadgeTab
                        ? 'tabbar-sample__item--active'
                        : '',
                    ]"
                    class="text-xl"
                  ></text>
                  <text
                    class="text-xs"
                    :class="
                      tab.name === selectedBadgeTab
                        ? 'tabbar-sample__item--active'
                        : ''
                    "
                    >{{ tab.name }}</text
                  >
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 功能特性 -->
        <view class="demo-section">
          <text class="section-title">核心能力</text>
          <text class="section-desc">Tabbar 组件特性</text>
          <view class="demo-preview grid grid-cols-1 gap-3">
            <view class="flex items-center gap-3 p-3 demo-surface rounded-lg">
              <text class="i-mdi-shield-check text-xl text-blue-500"></text>
              <view>
                <text class="text-sm font-medium demo-regular block"
                  >安全区适配</text
                >
                <text class="text-xs demo-muted"
                  >自动适配 iPhone 底部安全距离</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 demo-surface rounded-lg">
              <text class="i-mdi-badge-account text-xl text-green-500"></text>
              <view>
                <text class="text-sm font-medium demo-regular block"
                  >Badge 集成</text
                >
                <text class="text-xs demo-muted"
                  >通过 setBadge(index, value) 动态设置角标</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 demo-surface rounded-lg">
              <text
                class="i-mdi-swap-horizontal text-xl text-orange-500"
              ></text>
              <view>
                <text class="text-sm font-medium demo-regular block"
                  >路由联动</text
                >
                <text class="text-xs demo-muted"
                  >切换标签自动跳转路由，与 uni-app 深度集成</text
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
  const {
    tabItems,
    selectedIndex,
    onActualTabChange,
    badgeTabs,
    selectedTab,
    selectedBadgeTab,
    selectBadgeTab,
  } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
