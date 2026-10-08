<template>
  <C_Layout>
    <view class="demo-page demo-count-down">
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
          <text class="section-title">基础倒计时</text>
          <text class="section-desc">默认格式</text>
          <view class="demo-preview text-center">
            <C_CountDown :time="30 * 60 * 60 * 1000" />
          </view>
        </view>

        <!-- 自定义格式 -->
        <view class="demo-section">
          <text class="section-title">自定义格式</text>
          <text class="section-desc">format 属性</text>
          <view class="my-6 space-y-4">
            <view class="p-3 demo-subtle rounded-lg text-center">
              <text class="text-xs demo-muted block mb-1"
                >DD 天 HH 时 mm 分 ss 秒</text
              >
              <C_CountDown
                :time="24 * 60 * 60 * 1000"
                format="DD 天 HH 时 mm 分 ss 秒"
              />
            </view>
            <view class="p-3 demo-subtle rounded-lg text-center">
              <text class="text-xs demo-muted block mb-1">ss 秒</text>
              <C_CountDown
                :time="60 * 1000"
                format="ss 秒"
              />
            </view>
          </view>
        </view>

        <!-- 毫秒级 -->
        <view class="demo-section">
          <text class="section-title">毫秒级精度</text>
          <text class="section-desc">millisecond 属性</text>
          <view class="demo-preview text-center">
            <C_CountDown
              :time="30 * 60 * 60 * 1000"
              millisecond
              format="HH:mm:ss:SSS"
            />
          </view>
        </view>

        <!-- 自定义样式 -->
        <view class="demo-section">
          <text class="section-title">自定义样式</text>
          <text class="section-desc">颜色 & 大小</text>
          <view class="my-6 space-y-4">
            <view class="p-3 demo-subtle rounded-lg text-center">
              <C_CountDown
                :time="24 * 60 * 60 * 1000"
                class="count-down-large count-down-danger"
              />
            </view>
            <view class="p-3 demo-subtle rounded-lg text-center">
              <C_CountDown
                :time="24 * 60 * 60 * 1000"
                class="count-down-success"
              />
            </view>
          </view>
        </view>

        <!-- 手动控制 -->
        <view class="demo-section">
          <text class="section-title">手动控制</text>
          <text class="section-desc">开始 / 暂停 / 重置</text>
          <view class="demo-preview">
            <view class="text-center mb-4">
              <C_CountDown
                ref="countdownRef"
                :time="10000"
                :autoStart="false"
                @finish="handleFinish"
                format="ss:SSS"
                millisecond
              />
            </view>
            <text class="demo-status text-center block mb-3">{{
              countdownState
            }}</text>
            <view class="demo-row justify-center">
              <button
                class="demo-button"
                @click="handleStart"
                :disabled="
                  countdownState === '运行中' || countdownState === '已结束'
                "
                >开始</button
              >
              <button
                class="demo-button demo-button--quiet"
                @click="handlePause"
                :disabled="countdownState !== '运行中'"
                >暂停</button
              >
              <button
                class="demo-button demo-button--quiet"
                @click="handleReset"
                >重置</button
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
  const {
    countdownRef,
    countdownState,
    handleStart,
    handlePause,
    handleReset,
    handleFinish,
  } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
