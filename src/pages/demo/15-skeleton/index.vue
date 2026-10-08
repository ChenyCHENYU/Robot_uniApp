<template>
  <C_Layout>
    <view class="demo-page demo-skeleton">
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
        <!-- 基础骨架屏 -->
        <view class="demo-section">
          <text class="section-title">基础骨架屏</text>
          <text class="section-desc">默认行数</text>
          <view class="demo-preview">
            <C_Skeleton
              :loading="true"
              :rows="3"
            />
          </view>
        </view>

        <!-- 带头像 -->
        <view class="demo-section">
          <text class="section-title">头像骨架屏</text>
          <text class="section-desc">avatar 属性</text>
          <view class="demo-preview">
            <C_Skeleton
              :loading="true"
              :rows="3"
              :avatar="true"
            />
          </view>
        </view>

        <!-- 内容组合 -->
        <view class="demo-section">
          <text class="section-title">内容组合</text>
          <text class="section-desc">组合 rows / avatar / title</text>
          <view class="my-6 space-y-6">
            <view class="p-4 demo-subtle rounded-lg">
              <text class="text-xs demo-muted mb-2 block"
                >简洁列表：仅展示两行内容</text
              >
              <C_Skeleton
                :loading="true"
                :rows="2"
                :title="false"
              />
            </view>
            <view class="p-4 demo-subtle rounded-lg">
              <text class="text-xs demo-muted mb-2 block"
                >内容卡片：标题与四行正文</text
              >
              <C_Skeleton
                :loading="true"
                :rows="4"
              />
            </view>
            <view class="p-4 demo-subtle rounded-lg">
              <text class="text-xs demo-muted mb-2 block"
                >用户资料：头像与两行文字</text
              >
              <C_Skeleton
                :loading="true"
                :rows="2"
                avatar
              />
            </view>
          </view>
        </view>

        <!-- 动画切换 -->
        <view class="demo-section">
          <text class="section-title">动画效果</text>
          <text class="section-desc">点击切换 loading 状态</text>
          <view class="demo-preview">
            <C_Skeleton
              :loading="isLoading"
              :rows="3"
              :avatar="true"
              :animate="true"
            >
              <view class="flex items-center gap-4">
                <view
                  class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <C_Icon
                    name="i-mdi-robot-outline"
                    :size="24"
                    class="demo-feature-icon"
                  />
                </view>
                <view>
                  <text class="font-bold block">机器人助手</text>
                  <text class="text-sm demo-muted">已加载完成的真实内容</text>
                </view>
              </view>
            </C_Skeleton>
            <view class="mt-4 text-center">
              <button
                class="demo-button"
                @click="toggleLoading"
              >
                {{ isLoading ? '显示内容' : '切换为骨架屏' }}
              </button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const { isLoading, toggleLoading } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
