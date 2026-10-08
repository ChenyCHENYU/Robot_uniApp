<template>
  <C_Layout>
    <view class="demo-page demo-index-list">
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
        <!-- 通讯录 -->
        <view class="demo-section">
          <text class="section-title">通讯录列表</text>
          <text class="section-desc"
            >右侧字母快速定位 · 当前分组 {{ activeGroup }}</text
          >
          <view
            class="demo-preview overflow-hidden"
            style="height: 400px"
          >
            <C_IndexList
              :data="contactList"
              @select="selectGroup"
              indexKey="title"
            >
              <template #default="{ items }">
                <view
                  v-for="(item, i) in items"
                  :key="i"
                  class="px-4 py-3 demo-surface flex items-center gap-3 border-b border-gray-100"
                >
                  <view
                    class="w-8 h-8 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-sm"
                  >
                    {{ item.name.charAt(0) }}
                  </view>
                  <text class="text-sm">{{ item.name }}</text>
                </view>
              </template>
            </C_IndexList>
          </view>
        </view>

        <!-- 自定义高亮色 -->
        <view class="demo-section">
          <text class="section-title">自定义高亮色</text>
          <text class="section-desc">activeColor 属性</text>
          <view
            class="demo-preview overflow-hidden"
            style="height: 250px"
          >
            <C_IndexList
              :data="techList"
              activeColor="#ee0a24"
              indexKey="title"
            >
              <template #default="{ items }">
                <view
                  v-for="(item, i) in items"
                  :key="i"
                  class="px-4 py-3 demo-surface flex items-center gap-3 border-b border-gray-100"
                >
                  <text class="text-sm">{{ item.name }}</text>
                </view>
              </template>
            </C_IndexList>
          </view>
        </view>

        <!-- 特性说明 -->
        <view class="demo-section">
          <text class="section-title">组件特点</text>
          <view class="my-6 grid grid-cols-3 gap-4">
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-card-account-details-outline"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">字母索引</text>
              <text class="text-xs demo-muted">A-Z 快速定位</text>
            </view>
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-pin-outline"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">吸顶分组</text>
              <text class="text-xs demo-muted">sticky 标题</text>
            </view>
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-palette-outline"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">自定义色</text>
              <text class="text-xs demo-muted">自由配色</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const { contactList, techList, activeGroup, selectGroup } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
