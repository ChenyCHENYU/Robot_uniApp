<!--
 * @Description: 全局底部Tabbar组件 - 双模式(glass玻璃拟态 / flat扁平简约)
-->
<template>
  <view
    class="c-tabbar"
    :class="['is-fixed', `mode-${mode}`]"
    :style="{ paddingBottom: safeAreaBottom + 'px' }"
  >
    <view class="c-tabbar__container">
      <view
        class="c-tabbar__item"
        v-for="(item, index) in tabList"
        :key="item.id"
        :class="{ 'is-active': currentIndex === index }"
        hover-class="c-tabbar__item--hover"
        :hover-stay-time="80"
        @click="handleTabClick(item, index)"
      >
        <!-- 图标区域 -->
        <view class="c-tabbar__icon">
          <!-- Fluent Color 多色图标 —— 始终同一图标，CSS 控制激活/未激活 -->
          <view
            v-if="item.unoIcon"
            class="c-tabbar__icon-img"
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
          class="c-tabbar__label"
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

<style lang="scss" scoped>
  @import './index.scss';
</style>
