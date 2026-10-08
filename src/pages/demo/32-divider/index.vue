<template>
  <C_Layout>
    <view class="demo-page demo-divider">
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
        <!-- 基础分割线 -->
        <view class="demo-section">
          <text class="section-title">基础用法</text>
          <text class="section-desc">默认实线分割</text>
          <view class="demo-preview">
            <text class="text-sm demo-regular block">上方内容区域</text>
            <C_Divider />
            <text class="text-sm demo-regular block">下方内容区域</text>
          </view>
        </view>

        <!-- 带文字 -->
        <view class="demo-section">
          <text class="section-title">展示文字</text>
          <text class="section-desc">text & textPosition</text>
          <view class="demo-preview space-y-4">
            <C_Divider text="居中文字" />
            <C_Divider
              text="左侧文字"
              textPosition="left"
            />
            <C_Divider
              text="右侧文字"
              textPosition="right"
            />
          </view>
        </view>

        <!-- 虚线 -->
        <view class="demo-section">
          <text class="section-title">虚线样式</text>
          <text class="section-desc">dashed 属性</text>
          <view class="demo-preview space-y-4">
            <C_Divider dashed />
            <C_Divider
              dashed
              text="虚线分割"
            />
          </view>
        </view>

        <!-- 自定义颜色 -->
        <view class="demo-section">
          <text class="section-title">自定义颜色</text>
          <text class="section-desc">color 属性</text>
          <view class="demo-preview space-y-4">
            <C_Divider
              lineColor="#1989fa"
              text="蓝色分割线"
            />
            <C_Divider
              lineColor="#07c160"
              text="绿色分割线"
            />
            <C_Divider
              lineColor="#ee0a24"
              text="红色分割线"
            />
          </view>
        </view>

        <!-- 紧凑间距 -->
        <view class="demo-section">
          <text class="section-title">紧凑间距</text>
          <text class="section-desc">margin 属性</text>
          <view class="demo-preview">
            <C_Divider
              :margin="12"
              text="紧凑分割线"
            />
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META } from './data'
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
