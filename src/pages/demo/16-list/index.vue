<template>
  <C_Layout>
    <view class="demo-page demo-list">
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
        <!-- 基础列表 -->
        <view class="demo-section">
          <text class="section-title">基础用法</text>
          <text class="section-desc">滚动触底加载更多 · 每页 10 条</text>
          <text class="demo-status"
            >{{
              loading ? '加载中' : finished ? '已加载全部' : '等待继续加载'
            }}
            · {{ list.length }} / 30 条</text
          >
          <view
            class="demo-preview overflow-hidden"
            style="height: 300px"
          >
            <C_List
              :loading="loading"
              :finished="finished"
              finishedText="没有更多了"
              :refresherEnabled="false"
              @load="onLoad"
            >
              <view
                v-for="item in list"
                :key="item"
                class="px-4 py-3 demo-surface border-b border-gray-100"
              >
                <text class="text-sm">列表项 {{ item }}</text>
              </view>
            </C_List>
          </view>
          <view class="flex justify-center gap-3 mt-4">
            <button
              class="demo-button"
              @click="resetList"
              >重置列表</button
            >
          </view>
        </view>

        <!-- 加载状态展示 -->
        <view class="demo-section">
          <text class="section-title">状态演示</text>
          <text class="section-desc">不同加载状态</text>
          <view class="my-6 space-y-4">
            <view class="p-4 demo-subtle rounded-lg">
              <view class="flex items-center gap-3">
                <view
                  class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                ></view>
                <text class="text-sm demo-regular"
                  >loading=true：显示加载中提示</text
                >
              </view>
            </view>
            <view class="p-4 demo-subtle rounded-lg">
              <view class="flex items-center gap-3">
                <view class="w-2 h-2 bg-green-500 rounded-full"></view>
                <text class="text-sm demo-regular"
                  >finished=true：显示"没有更多了"</text
                >
              </view>
            </view>
            <view class="p-4 demo-subtle rounded-lg">
              <view class="flex items-center gap-3">
                <view class="w-2 h-2 bg-red-500 rounded-full"></view>
                <text class="text-sm demo-regular"
                  >error=true：显示加载失败，点击重试</text
                >
              </view>
            </view>
            <view class="p-4 demo-subtle rounded-lg">
              <view class="flex items-center gap-3">
                <view class="w-2 h-2 bg-gray-400 rounded-full"></view>
                <text class="text-sm demo-regular"
                  >emptyType：列表为空时展示空状态</text
                >
              </view>
            </view>
          </view>
        </view>

        <!-- 空列表 -->
        <view class="demo-section">
          <text class="section-title">空列表</text>
          <text class="section-desc">配合 C_Empty</text>
          <view
            class="demo-preview overflow-hidden"
            style="height: 200px"
          >
            <C_List
              :loading="false"
              :finished="true"
              emptyType="search"
              showEmpty
              :refresherEnabled="false"
            >
            </C_List>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const { list, loading, finished, onLoad, resetList } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
