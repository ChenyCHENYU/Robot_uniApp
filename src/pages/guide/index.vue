<!--
 * @Description: 引导页 - 新手引导流程
-->
<template>
  <view class="guide-page">
    <swiper
      class="guide-swiper"
      :current="current"
      :indicator-dots="false"
      :circular="false"
      @change="onSwiperChange"
    >
      <swiper-item
        v-for="(item, index) in steps"
        :key="item.title"
      >
        <view class="guide-slide">
          <view class="slide-illustration">
            <view
              class="illust-circle"
              :style="{ background: item.gradient }"
            >
              <C_Icon
                :name="item.icon"
                :size="64"
                color="var(--r-color-primary)"
              />
            </view>
            <view class="illust-decoration">
              <view
                class="deco-ring ring-1"
                :style="{ borderColor: item.ringColor }"
              ></view>
              <view
                class="deco-ring ring-2"
                :style="{ borderColor: item.ringColor }"
              ></view>
            </view>
          </view>
          <view class="slide-content">
            <text class="slide-kicker"
              >ROBOT APP · {{ index + 1 }} / {{ steps.length }}</text
            >
            <text class="slide-title">{{ item.title }}</text>
            <text class="slide-desc">{{ item.desc }}</text>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <!-- 指示器 -->
    <view class="indicator-bar">
      <view
        v-for="(_, index) in steps"
        :key="index"
        class="indicator-dot"
        :class="{ active: current === index }"
      ></view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-actions">
      <view
        v-if="current < steps.length - 1"
        class="actions-row"
      >
        <text
          class="skip-btn"
          @click="handleSkip"
          >跳过</text
        >
        <view
          class="next-btn"
          @click="handleNext"
        >
          <text class="next-text">下一步</text>
          <wd-icon
            name="arrow-right"
            size="16px"
            color="#fff"
          />
        </view>
      </view>
      <view
        v-else
        class="actions-row center"
      >
        <view
          class="start-btn"
          @click="handleStart"
        >
          <text class="start-text">开始使用</text>
        </view>
      </view>
    </view>
    <!-- #ifndef H5 -->
    <C_NativeFeedbackHost />
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
  import { useGuideData } from './data'
  // #ifndef H5
  import C_NativeFeedbackHost from '@/components/global/C_NativeFeedbackHost/index.vue'
  // #endif
  const {
    current,
    steps,
    onSwiperChange,
    handleNext,
    handleSkip,
    handleStart,
  } = useGuideData()
</script>
<style lang="scss" scoped>
  @import './index.scss';
</style>
