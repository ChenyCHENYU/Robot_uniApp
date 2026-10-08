<template>
  <C_Layout>
    <view class="demo-page demo-timeline">
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
          <text class="section-title">物流跟踪</text>
          <text class="section-desc">基础时间轴</text>
          <view class="demo-preview">
            <C_Timeline
              :items="orderItems"
              :current="2"
            />
          </view>
        </view>

        <!-- 自定义颜色 -->
        <view class="demo-section">
          <text class="section-title">审批流程</text>
          <text class="section-desc">自定义节点颜色</text>
          <view class="demo-preview">
            <C_Timeline
              :items="approvalItems"
              finishedColor="#07c160"
              pendingColor="#dcdfe6"
            />
          </view>
        </view>

        <!-- 倒序显示 -->
        <view class="demo-section">
          <text class="section-title">倒序显示</text>
          <text class="section-desc">reverse 属性</text>
          <view class="demo-preview">
            <C_Timeline
              :items="orderItems"
              :current="2"
              reverse
            />
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const { orderItems, approvalItems } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
