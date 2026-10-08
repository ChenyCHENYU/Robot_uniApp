<template>
  <C_Layout>
    <view class="demo-page demo-empty">
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
        <view class="demo-section">
          <text class="section-title">场景选择</text>
          <text class="section-desc">选择场景查看提示、图标和下一步操作</text>
          <view class="empty-options">
            <button
              v-for="scene in emptyScenes"
              :key="scene.value"
              class="demo-button demo-button--quiet"
              :class="
                selectedScene === scene.value ? 'empty-option--active' : ''
              "
              @click="selectScene(scene.value)"
              >{{ scene.label }}</button
            >
          </view>
        </view>
        <view class="demo-section">
          <text class="section-title">{{ currentScene.label }}</text>
          <text class="section-desc">{{ currentScene.description }}</text>
          <view class="empty-preview demo-preview"
            ><C_Empty
              :key="selectedScene"
              :type="selectedScene"
              :showAction="Boolean(currentScene.action)"
              :actionText="currentScene.action"
              @action="onEmptyAction"
          /></view>
          <text class="demo-status">{{ actionResult }}</text>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const {
    emptyScenes,
    selectedScene,
    currentScene,
    selectScene,
    onEmptyAction,
    actionResult,
  } = useDemo()
</script>
<style lang="scss" scoped>
  @import './index.scss';
</style>
