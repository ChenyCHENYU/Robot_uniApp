<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-01-09
 * @Description: 全局底部Tabbar组件 - 玻璃风设计
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
-->
<template>
  <view class="c-tabbar" :class="{ 'is-fixed': fixed }">
    <!-- 玻璃风背景 -->
    <view class="tabbar-backdrop">
      <view class="glass-bg"></view>
      <view class="border-line"></view>
    </view>

    <!-- 内容区域 -->
    <view
      class="tabbar-container"
      :style="{ paddingBottom: safeAreaBottom + 'px' }"
    >
      <view
        class="tab-item"
        v-for="(item, index) in tabList"
        :key="item.id"
        :class="{ 'is-active': currentIndex === index }"
        @click="handleTabClick(item, index)"
      >
        <!-- 激活状态背景 -->
        <view class="active-indicator" v-show="currentIndex === index">
          <view class="glow-bg"></view>
        </view>

        <!-- 图标区域 -->
        <view class="icon-wrapper">
          <view
            class="icon-bg"
            :class="{ 'is-active': currentIndex === index }"
          >
            <u-icon
              :name="currentIndex === index ? item.activeIcon : item.icon"
              :size="currentIndex === index ? 20 : 18"
              :color="currentIndex === index ? '#ffffff' : inactiveColor"
            />
          </view>

          <!-- 角标 -->
          <u-badge
            v-if="item.badge > 0"
            :value="item.badge"
            :max="99"
            absolute
            :offset="[8, -8]"
            bgColor="#FF3B30"
            color="#ffffff"
            size="mini"
          />
        </view>

        <!-- 文字标签 -->
        <text
          class="tab-label"
          :class="{ 'is-active': currentIndex === index }"
        >
          {{ item.text }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useTabbarData, tabbarProps, tabbarEmits } from "./data.js";
import "./index.scss";

// Props
const props = defineProps(tabbarProps);

// Emits
const emit = defineEmits(tabbarEmits);

// 使用数据和逻辑
const {
  // 响应式数据
  isNavigating,

  // 计算属性
  currentIndex,
  safeAreaBottom,

  // 方法
  handleTabClick,
  setBadge,
  setCurrentIndex,
} = useTabbarData(props, emit);

// 暴露方法给父组件
defineExpose({
  setBadge,
  setCurrentIndex,
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
