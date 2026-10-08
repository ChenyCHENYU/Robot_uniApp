<template>
  <C_Layout>
    <view class="demo-page demo-action-sheet">
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
          <text class="section-title">基础操作面板</text>
          <text class="section-desc">常用操作选项</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button"
              @click="showBasic = true"
              >打开基础面板</button
            >
          </view>
          <C_ActionSheet
            v-model:visible="showBasic"
            :actions="basicItems"
            @select="onSelect"
          />
        </view>

        <!-- 带标题 -->
        <view class="demo-section">
          <text class="section-title">带标题面板</text>
          <text class="section-desc">title 属性</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button"
              @click="showTitle = true"
              >带标题面板</button
            >
          </view>
          <C_ActionSheet
            v-model:visible="showTitle"
            title="请选择分享方式"
            :actions="shareItems"
            @select="onSelect"
          />
        </view>

        <!-- 带图标 -->
        <view class="demo-section">
          <text class="section-title">带图标选项</text>
          <text class="section-desc">item.icon 属性</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button demo-button--quiet"
              @click="showIcon = true"
              >带图标面板</button
            >
          </view>
          <C_ActionSheet
            v-model:visible="showIcon"
            title="文件操作"
            :actions="iconItems"
            @select="onSelect"
          />
        </view>

        <!-- 危险操作 -->
        <view class="demo-section">
          <text class="section-title">危险操作</text>
          <text class="section-desc">item.danger 样式</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button demo-button--danger"
              @click="showDanger = true"
              >危险操作面板</button
            >
          </view>
          <C_ActionSheet
            v-model:visible="showDanger"
            :actions="dangerItems"
            :showCancel="true"
            cancelText="取消"
            @select="onSelect"
          />
        </view>
      </view>

      <!-- 选择结果 -->
      <view
        v-if="selectedAction"
        class="mt-6 demo-surface rounded-lg p-4"
      >
        <view class="flex items-center gap-2 justify-center">
          <text class="text-blue-500">→</text>
          <text class="text-sm demo-regular"
            >您选择了：{{ selectedAction }}</text
          >
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const {
    showBasic,
    showTitle,
    showIcon,
    showDanger,
    selectedAction,
    basicItems,
    shareItems,
    iconItems,
    dangerItems,
    onSelect,
  } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
