<template>
  <C_Layout>
    <view class="demo-page demo-rate">
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
        <!-- 基础评分 -->
        <view class="demo-section">
          <text class="section-title">基础评分</text>
          <text class="section-desc">点击选择分数</text>
          <view class="demo-preview text-center">
            <C_Rate v-model="basicRate" />
            <text class="text-sm demo-muted block mt-3"
              >当前：{{ basicRate }} 分</text
            >
          </view>
        </view>

        <!-- 半选模式 -->
        <view class="demo-section">
          <text class="section-title">半选模式</text>
          <text class="section-desc">allowHalf 属性</text>
          <view class="demo-preview text-center">
            <C_Rate
              v-model="halfRate"
              allowHalf
            />
            <text class="text-sm demo-muted block mt-3"
              >当前：{{ halfRate }} 分</text
            >
          </view>
        </view>

        <!-- 自定义样式 -->
        <view class="demo-section">
          <text class="section-title">自定义样式</text>
          <text class="section-desc">颜色 / 数量 / 大小</text>
          <view class="demo-preview text-center">
            <C_Rate
              v-model="customRate"
              :count="6"
              activeColor="var(--r-color-error)"
              inactiveColor="var(--r-text-placeholder)"
              :size="48"
            />
            <text class="text-xs demo-muted block mt-3"
              >6颗星 · 红色 · 大尺寸</text
            >
          </view>
        </view>

        <!-- 只读模式 -->
        <view class="demo-section">
          <text class="section-title">只读模式</text>
          <text class="section-desc">readonly 属性</text>
          <view class="demo-preview text-center">
            <C_Rate
              :modelValue="4.5"
              readonly
              allowHalf
            />
            <text class="text-sm demo-muted block mt-3">综合评分：4.5</text>
          </view>
        </view>

        <!-- 业务场景 -->
        <view class="demo-section">
          <text class="section-title">业务场景</text>
          <text class="section-desc">评价卡片示例</text>
          <view class="demo-preview">
            <view class="demo-surface rounded-lg p-4">
              <view class="flex items-center gap-3 mb-3">
                <view
                  class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <C_Icon
                    name="i-mdi-account-outline"
                    :size="24"
                    class="demo-feature-icon"
                  />
                </view>
                <view>
                  <text class="text-sm font-bold block">用户评价</text>
                  <text class="text-xs demo-muted">2024-01-15</text>
                </view>
              </view>
              <C_Rate
                :modelValue="5"
                readonly
                :size="32"
              />
              <text class="text-sm demo-regular block mt-2"
                >非常好用的组件库，开发效率提升很多！</text
              >
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const { basicRate, halfRate, customRate } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
