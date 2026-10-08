<template>
  <C_Layout>
    <view class="demo-page demo-card">
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
          <text class="section-title">基础卡片</text>
          <text class="section-desc">标题与内容</text>
          <view class="demo-preview">
            <C_Card
              title="卡片标题"
              subtitle="这是副标题描述"
            >
              <view class="text-sm demo-regular"
                >这里是卡片主体内容区域，可以放置任意内容。</view
              >
            </C_Card>
          </view>
        </view>

        <!-- 阴影等级 -->
        <view class="demo-section">
          <text class="section-title">阴影等级</text>
          <text class="section-desc">sm / md / lg / none</text>
          <view class="demo-preview space-y-4">
            <C_Card
              title="小阴影"
              shadow="sm"
            >
              <text class="text-xs demo-muted">shadow="sm"</text>
            </C_Card>
            <C_Card
              title="中阴影"
              shadow="md"
            >
              <text class="text-xs demo-muted">shadow="md"</text>
            </C_Card>
            <C_Card
              title="大阴影"
              shadow="lg"
            >
              <text class="text-xs demo-muted">shadow="lg"</text>
            </C_Card>
          </view>
        </view>

        <!-- 可点击 -->
        <view class="demo-section">
          <text class="section-title">可点击卡片</text>
          <text class="section-desc">clickable 属性</text>
          <view class="demo-preview">
            <C_Card
              title="点击我试试"
              subtitle="可点击卡片有悬浮反馈"
              clickable
              @click="handleClick"
            >
              <view class="flex items-center gap-2">
                <text class="i-mdi-gesture-tap text-lg text-blue-500"></text>
                <text class="text-sm demo-regular">点击后触发 click 事件</text>
              </view>
            </C_Card>
          </view>
        </view>

        <!-- 自定义头部/底部 -->
        <view class="demo-section">
          <text class="section-title">自定义插槽</text>
          <text class="section-desc">header / footer 插槽</text>
          <view class="demo-preview">
            <C_Card>
              <template #header>
                <view class="flex items-center justify-between">
                  <view class="flex items-center gap-2">
                    <view
                      class="w-8 h-8 card-avatar-symbol rounded-full flex items-center justify-center"
                    >
                      <text class="text-white text-xs font-bold">U</text>
                    </view>
                    <text class="text-sm font-medium demo-regular">用户名</text>
                  </view>
                  <text class="text-xs demo-muted">3分钟前</text>
                </view>
              </template>
              <view class="text-sm demo-regular"
                >自定义头部和底部插槽，打造个性化卡片布局。</view
              >
              <template #footer>
                <view class="flex justify-end gap-4 text-xs demo-muted">
                  <text>赞 128</text>
                  <text>评论 32</text>
                  <text>收藏 56</text>
                </view>
              </template>
            </C_Card>
          </view>
        </view>

        <!-- 无内边距 -->
        <view class="demo-section">
          <text class="section-title">无内边距</text>
          <text class="section-desc">padding 属性</text>
          <view class="demo-preview">
            <C_Card
              title="图片卡片"
              :padding="false"
            >
              <view class="demo-subtle py-12 text-center">
                <text class="demo-regular text-lg font-medium"
                  >全宽内容区域</text
                >
                <text class="demo-muted text-xs block mt-2"
                  >:padding="false" 取消内边距</text
                >
              </view>
            </C_Card>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const { handleClick } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
