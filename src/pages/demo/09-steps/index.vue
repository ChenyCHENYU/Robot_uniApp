<template>
  <C_Layout>
    <view class="demo-page demo-steps">
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
          <text class="section-title">基础步骤条</text>
          <text class="section-desc">水平方向三步骤</text>
          <view class="demo-preview">
            <C_Steps
              :current="currentStep"
              activeColor="var(--r-color-primary)"
              inactiveColor="var(--r-text-placeholder)"
              :steps="steps"
            />
          </view>
          <view class="flex justify-center gap-4 mt-4">
            <button
              class="demo-button demo-button--quiet"
              @click="previousStep"
              :disabled="currentStep === 0"
            >
              <text>上一步</text>
            </button>
            <button
              class="demo-button"
              @click="nextStep"
              :disabled="currentStep === steps.length - 1"
            >
              <text>下一步</text>
            </button>
          </view>
          <view class="text-center mt-3">
            <text class="text-xs demo-muted"
              >当前步骤：{{ currentStep + 1 }} / {{ steps.length }}</text
            >
          </view>
        </view>

        <!-- 竖向步骤条 -->
        <view class="demo-section">
          <text class="section-title">竖向步骤条</text>
          <text class="section-desc">direction=vertical</text>
          <view class="demo-preview">
            <C_Steps
              :current="1"
              direction="vertical"
              activeColor="var(--r-color-primary)"
              inactiveColor="var(--r-text-placeholder)"
              :steps="verticalSteps"
            />
          </view>
        </view>

        <!-- 自定义颜色 -->
        <view class="demo-section">
          <text class="section-title">自定义颜色</text>
          <text class="section-desc">activeColor 属性</text>
          <view class="demo-preview space-y-6">
            <C_Steps
              :current="1"
              :steps="steps"
              activeColor="#67c23a"
            />
            <C_Steps
              :current="2"
              :steps="steps"
              activeColor="#e6a23c"
            />
            <C_Steps
              :current="2"
              :steps="steps"
              activeColor="#f56c6c"
            />
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const { currentStep, steps, verticalSteps, previousStep, nextStep } =
    useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
