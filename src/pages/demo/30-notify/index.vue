<template>
  <C_Layout>
    <view class="demo-page demo-notify">
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
        <!-- 基础通知 -->
        <view class="demo-section">
          <text class="section-title">基础通知</text>
          <text class="section-desc">默认样式</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button"
              @click="showNotify('primary')"
              >主要通知</button
            >
          </view>
        </view>

        <!-- 成功通知 -->
        <view class="demo-section">
          <text class="section-title">成功通知</text>
          <text class="section-desc">type=success</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button"
              @click="showNotify('success')"
              >成功通知</button
            >
          </view>
        </view>

        <!-- 警告通知 -->
        <view class="demo-section">
          <text class="section-title">警告通知</text>
          <text class="section-desc">type=warning</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button demo-button--quiet"
              @click="showNotify('warning')"
              >警告通知</button
            >
          </view>
        </view>

        <!-- 危险通知 -->
        <view class="demo-section">
          <text class="section-title">危险通知</text>
          <text class="section-desc">type=danger</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button demo-button--danger"
              @click="showNotify('danger')"
              >危险通知</button
            >
          </view>
        </view>

        <!-- 自定义时长 -->
        <view class="demo-section">
          <text class="section-title">自定义时长</text>
          <text class="section-desc">duration 属性</text>
          <view class="demo-preview flex justify-center gap-4">
            <button
              class="demo-button"
              @click="showLong"
              >展示 5 秒</button
            >
            <button
              class="demo-button demo-button--quiet"
              @click="showShort"
              >展示 1 秒</button
            >
          </view>
        </view>
      </view>

      <C_Notify
        :key="notifyKey"
        :visible="notifyVisible"
        :type="notifyType"
        :message="notifyMessage"
        :duration="notifyDuration"
        @close="notifyVisible = false"
      />
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const {
    notifyVisible,
    notifyKey,
    notifyType,
    notifyMessage,
    notifyDuration,
    showNotify,
    showLong,
    showShort,
  } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
