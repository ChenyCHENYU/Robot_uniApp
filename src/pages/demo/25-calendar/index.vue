<template>
  <C_Layout>
    <view class="demo-page demo-calendar">
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
        <!-- 单选模式 -->
        <view class="demo-section">
          <text class="section-title">单选模式</text>
          <text class="section-desc">选择一个日期</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button"
              @click="showSingle = true"
            >
              {{ selectedDate || '选择日期' }}
            </button>
          </view>
          <C_Calendar
            v-model:visible="showSingle"
            mode="single"
            :defaultDate="selectedDate"
            @confirm="onSingleConfirm"
          />
        </view>

        <!-- 区间选择 -->
        <view class="demo-section">
          <text class="section-title">区间选择</text>
          <text class="section-desc">选择日期范围</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button"
              @click="showRange = true"
              >选择日期范围</button
            >
            <text
              v-if="rangeText"
              class="text-xs demo-muted block mt-3"
              >{{ rangeText }}</text
            >
          </view>
          <C_Calendar
            v-model:visible="showRange"
            mode="range"
            :defaultDate="selectedRange"
            @confirm="onRangeConfirm"
          />
        </view>

        <!-- 自定义颜色 -->
        <view class="demo-section">
          <text class="section-title">自定义主题色</text>
          <text class="section-desc">通过主题变量设置</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button demo-button--quiet"
              @click="showCustom = true"
              >{{ customDate || '选择主题日期' }}</button
            >
          </view>
          <C_Calendar
            v-model:visible="showCustom"
            mode="single"
            class="calendar-custom"
            :defaultDate="customDate"
            @confirm="onCustomConfirm"
          />
        </view>

        <!-- 功能特性 -->
        <view class="demo-section">
          <text class="section-title">功能特性</text>
          <view class="my-6 space-y-3">
            <view class="flex items-center gap-3 p-3 demo-subtle rounded-lg">
              <C_Icon
                name="i-mdi-calendar-month-outline"
                :size="24"
                class="demo-feature-icon"
              />
              <view>
                <text class="text-sm font-bold block">多种模式</text>
                <text class="text-xs demo-muted">单选 / 多选 / 区间</text>
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 demo-subtle rounded-lg">
              <C_Icon
                name="i-mdi-pin-outline"
                :size="24"
                class="demo-feature-icon"
              />
              <view>
                <text class="text-sm font-bold block">日期标记</text>
                <text class="text-xs demo-muted">用圆点标记日期</text>
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 demo-subtle rounded-lg">
              <C_Icon
                name="i-mdi-lock-outline"
                :size="24"
                class="demo-feature-icon"
              />
              <view>
                <text class="text-sm font-bold block">范围限制</text>
                <text class="text-xs demo-muted">minDate / maxDate</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const {
    showSingle,
    showRange,
    showCustom,
    selectedDate,
    customDate,
    rangeText,
    selectedRange,
    onSingleConfirm,
    onRangeConfirm,
    onCustomConfirm,
  } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
