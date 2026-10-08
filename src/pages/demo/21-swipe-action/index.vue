<template>
  <C_Layout>
    <view class="demo-page demo-swipe-action">
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
        <!-- 左滑删除 -->
        <view class="demo-section">
          <text class="section-title">左滑删除</text>
          <text class="section-desc">基础用法</text>
          <view class="demo-preview overflow-hidden">
            <C_SwipeAction
              :rightActions="[{ text: '删除', bgColor: '#ee0a24' }]"
              @action="onAction"
            >
              <view class="px-4 py-4 demo-surface">
                <text class="text-sm">← 向左滑动试试</text>
              </view>
            </C_SwipeAction>
          </view>
        </view>

        <!-- 左右都有 -->
        <view class="demo-section">
          <text class="section-title">左右操作按钮</text>
          <text class="section-desc">双向滑动</text>
          <view class="demo-preview overflow-hidden">
            <C_SwipeAction
              :leftActions="[{ text: '收藏', bgColor: '#07c160' }]"
              :rightActions="[
                { text: '标记', bgColor: '#ff976a' },
                { text: '删除', bgColor: '#ee0a24' },
              ]"
              @action="onAction"
            >
              <view class="px-4 py-4 demo-surface">
                <text class="text-sm">左右都可以滑动</text>
              </view>
            </C_SwipeAction>
          </view>
        </view>

        <!-- 列表场景 -->
        <view class="demo-section">
          <text class="section-title">列表场景</text>
          <text class="section-desc">实际业务示例</text>
          <view class="demo-preview overflow-hidden">
            <view
              v-for="item in listItems"
              :key="item.name"
            >
              <C_SwipeAction
                :rightActions="[
                  { text: '置顶', bgColor: '#1989fa' },
                  { text: '删除', bgColor: '#ee0a24' },
                ]"
                @action="onListAction($event, item.name)"
              >
                <view
                  class="px-4 py-3 demo-surface flex items-center gap-3 border-b border-gray-100"
                >
                  <view
                    class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
                    :class="item.color"
                  >
                    {{ item.avatar }}
                  </view>
                  <view>
                    <text class="text-sm font-bold block">{{ item.name }}</text>
                    <text class="text-xs demo-muted">{{ item.msg }}</text>
                  </view>
                </view>
              </C_SwipeAction>
            </view>
          </view>
        </view>

        <button
          class="demo-button demo-button--quiet"
          @click="resetItems"
          >恢复列表</button
        >
        <!-- 禁用状态 -->
        <view class="demo-section">
          <text class="section-title">禁用状态</text>
          <text class="section-desc">disabled 属性</text>
          <view class="demo-preview overflow-hidden">
            <C_SwipeAction
              disabled
              :rightActions="[{ text: '删除', bgColor: '#ee0a24' }]"
            >
              <view class="px-4 py-4 demo-surface">
                <text class="text-sm demo-muted">禁用状态，无法滑动</text>
              </view>
            </C_SwipeAction>
          </view>
        </view>
      </view>

      <!-- 操作结果 -->
      <view
        v-if="actionText"
        class="mt-6 demo-surface rounded-lg p-4 text-center"
      >
        <text class="text-sm text-blue-500">点击了：{{ actionText }}</text>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const { actionText, listItems, onAction, onListAction, resetItems } =
    useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
