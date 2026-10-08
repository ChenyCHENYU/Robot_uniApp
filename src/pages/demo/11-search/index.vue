<template>
  <C_Layout>
    <view class="demo-page demo-search">
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
        <!-- 基础搜索 -->
        <view class="demo-section">
          <text class="section-title">基础用法</text>
          <text class="section-desc"
            >输入并搜索 · 当前输入：{{ keyword || '未输入' }}</text
          >
          <view class="demo-preview">
            <C_Search
              @input="keyword = $event"
              placeholder="搜索组件..."
              @search="handleSearch"
              @clear="handleClear"
            />
          </view>
          <view
            v-if="searchResult"
            class="text-center"
          >
            <text class="text-sm demo-muted"
              >搜索了：「{{ searchResult }}」</text
            >
          </view>
        </view>

        <!-- 搜索历史 -->
        <view class="demo-section">
          <text class="section-title">搜索历史</text>
          <text class="section-desc"
            >最近搜索会保存在本机 · 当前输入：{{ keyword2 || '未输入' }}</text
          >
          <view class="demo-preview">
            <C_Search
              @input="keyword2 = $event"
              :showHistory="true"
              placeholder="搜索并查看历史..."
              @search="handleSearch2"
              @clear="handleClear2"
            />
            <text
              v-if="historyResult"
              class="demo-status block mt-3"
              >已搜索：{{ historyResult }}</text
            >
          </view>
        </view>

        <!-- 功能特性 -->
        <view class="demo-section">
          <text class="section-title">核心能力</text>
          <text class="section-desc">搜索组件特性</text>
          <view class="demo-preview grid grid-cols-1 gap-3">
            <view class="flex items-center gap-3 p-3 demo-surface rounded-lg">
              <text class="i-mdi-timer-sand text-xl text-blue-500"></text>
              <view>
                <text class="text-sm font-medium demo-regular block"
                  >防抖搜索</text
                >
                <text class="text-xs demo-muted">debounceTime 默认 300ms</text>
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 demo-surface rounded-lg">
              <text class="i-mdi-database-clock text-xl text-green-500"></text>
              <view>
                <text class="text-sm font-medium demo-regular block"
                  >本地历史</text
                >
                <text class="text-xs demo-muted">基于 Storage 自动持久化</text>
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 demo-surface rounded-lg">
              <text
                class="i-mdi-text-box-remove text-xl text-orange-500"
              ></text>
              <view>
                <text class="text-sm font-medium demo-regular block"
                  >一键清除</text
                >
                <text class="text-xs demo-muted">输入框清空 + 历史清空</text>
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
    keyword,
    keyword2,
    searchResult,
    historyResult,
    handleSearch,
    handleClear,
    handleSearch2,
    handleClear2,
  } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
