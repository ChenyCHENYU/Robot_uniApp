<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-01-09
 * @Description: 全局底部Tabbar组件 - 双模式(glass玻璃拟态 / flat扁平简约)
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
-->
<template>
  <view
    class="c-tabbar"
    :class="['is-fixed', `mode-${mode}`]"
    :style="{ paddingBottom: safeAreaBottom + 'px' }"
  >
    <view class="tabbar-container">
      <view
        class="tab-item"
        v-for="(item, index) in tabList"
        :key="item.id"
        :class="{ 'is-active': currentIndex === index }"
        @click="handleTabClick(item, index)"
      >
        <!-- 图标区域 -->
        <view class="icon-wrapper">
          <!-- Fluent Color 多色图标 —— 始终同一图标，CSS 控制激活/未激活 -->
          <view
            v-if="item.unoIcon"
            class="tab-icon"
            :class="[item.unoIcon, { 'is-active': currentIndex === index }]"
          ></view>
          <!-- 降级：wd-icon -->
          <wd-icon
            v-else
            :name="currentIndex === index ? item.activeIcon : item.icon"
            size="26px"
            :color="currentIndex === index ? activeColor : inactiveColor"
          />

          <!-- 角标 -->
          <wd-badge
            v-if="item.badge > 0"
            :modelValue="item.badge"
            :max="99"
            custom-style="position: absolute; top: -4px; right: -8px;"
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

<script setup lang="ts">
  import { useTabbarData, tabbarProps, tabbarEmits } from './data'

  const props = defineProps(tabbarProps)
  const emit = defineEmits(tabbarEmits)

  const {
    isNavigating: _isNavigating,
    currentIndex,
    safeAreaBottom,
    handleTabClick,
    setBadge,
    setCurrentIndex,
  } = useTabbarData(props, emit)

  defineExpose({ setBadge, setCurrentIndex })
</script>

<style lang="scss">
  @import './index.scss';
</style>
