<template>
  <C_Layout>
    <view class="demo-page demo-badge">
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
          <text class="section-desc">数字徽标</text>
          <view class="flex justify-center items-center gap-8 demo-preview">
            <C_Badge :value="5">
              <view
                class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-email text-xl text-blue-500"></text>
              </view>
            </C_Badge>
            <C_Badge :value="12">
              <view
                class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-bell text-xl text-green-500"></text>
              </view>
            </C_Badge>
            <C_Badge :value="99">
              <view
                class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-chat text-xl text-orange-500"></text>
              </view>
            </C_Badge>
          </view>
        </view>

        <!-- 最大值 -->
        <view class="demo-section">
          <text class="section-title">最大值</text>
          <text class="section-desc">超出显示 max+</text>
          <view class="flex justify-center items-center gap-8 demo-preview">
            <C_Badge
              :value="120"
              :max="99"
            >
              <view
                class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-email text-xl text-red-500"></text>
              </view>
            </C_Badge>
            <C_Badge
              :value="25"
              :max="20"
            >
              <view
                class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-bell text-xl text-purple-500"></text>
              </view>
            </C_Badge>
            <C_Badge
              :value="999"
              :max="99"
            >
              <view
                class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-chat text-xl text-amber-600"></text>
              </view>
            </C_Badge>
          </view>
        </view>

        <!-- 圆点模式 -->
        <view class="demo-section">
          <text class="section-title">小圆点模式</text>
          <text class="section-desc">dot 属性</text>
          <view class="flex justify-center items-center gap-8 demo-preview">
            <C_Badge dot>
              <view
                class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-email text-xl text-blue-500"></text>
              </view>
            </C_Badge>
            <C_Badge
              dot
              color="#67c23a"
            >
              <view
                class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-bell text-xl text-green-500"></text>
              </view>
            </C_Badge>
            <C_Badge
              dot
              color="#e6a23c"
            >
              <view
                class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-chat text-xl text-orange-500"></text>
              </view>
            </C_Badge>
          </view>
        </view>

        <!-- 自定义颜色 -->
        <view class="demo-section">
          <text class="section-title">自定义颜色</text>
          <text class="section-desc">color 属性</text>
          <view class="flex justify-center items-center gap-8 demo-preview">
            <C_Badge
              :value="8"
              color="#409eff"
            >
              <view
                class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-heart text-xl demo-muted"></text>
              </view>
            </C_Badge>
            <C_Badge
              :value="8"
              color="#67c23a"
            >
              <view
                class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-heart text-xl demo-muted"></text>
              </view>
            </C_Badge>
            <C_Badge
              :value="8"
              color="#e6a23c"
            >
              <view
                class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-heart text-xl demo-muted"></text>
              </view>
            </C_Badge>
          </view>
        </view>

        <!-- 动态交互 -->
        <view class="demo-section">
          <text class="section-title">动态交互</text>
          <text class="section-desc">点击增减徽标数值</text>
          <view class="flex justify-center items-center gap-6 demo-preview">
            <button
              class="demo-button"
              @click="decreaseBadge"
              :disabled="badgeCount === 0"
            >
              <text class="text-lg font-bold">-</text>
            </button>
            <C_Badge
              :value="badgeCount"
              :max="99"
            >
              <view
                class="w-12 h-12 badge-preview-symbol rounded-xl flex items-center justify-center"
              >
                <text class="i-mdi-email text-2xl text-white"></text>
              </view>
            </C_Badge>
            <button
              class="demo-button"
              @click="increaseBadge"
            >
              <text class="text-lg font-bold">+</text>
            </button>
          </view>
          <view class="text-center">
            <text class="text-sm demo-muted">当前值：{{ badgeCount }}</text>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const { badgeCount, increaseBadge, decreaseBadge } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
