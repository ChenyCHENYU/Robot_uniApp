<template>
  <view
    :class="[
      'c-title',
      `c-title--${type}`,
      `c-title--${align}`,
      `c-title--${size}`,
      clickable && 'c-title--clickable',
    ]"
    :style="wrapperStyle"
    @click="handleClick"
  >
    <view
      v-if="showDivider && dividerPosition === 'top'"
      class="c-title__divider"
    />
    <view class="c-title__body">
      <view
        v-if="leftIcon"
        class="c-title__icon"
      >
        <C_Icon
          :name="leftIcon"
          :type="iconType"
          :size="iconSize"
          :color="iconColor"
        />
      </view>
      <view class="c-title__content">
        <text
          class="c-title__heading"
          :style="headingStyle"
          >{{ title }}</text
        >
        <text
          v-if="subtitle"
          class="c-title__subtitle"
          >{{ subtitle }}</text
        >
      </view>
      <view
        v-if="rightIcon"
        class="c-title__icon"
      >
        <C_Icon
          :name="rightIcon"
          :type="iconType"
          :size="iconSize"
          :color="iconColor"
        />
      </view>
    </view>
    <view
      v-if="showDivider && dividerPosition === 'bottom'"
      class="c-title__divider"
    />
    <view
      v-if="showDecoration"
      class="c-title__decoration"
    />
  </view>
</template>

<script setup lang="ts">
  import { useTitle } from './data'

  defineOptions({ name: 'CTitle' })

  const props = defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    level: { type: [Number, String], default: 2 },
    type: { type: String, default: 'primary' },
    align: { type: String, default: 'left' },
    size: { type: String, default: 'medium' },
    leftIcon: { type: String, default: '' },
    rightIcon: { type: String, default: '' },
    iconType: { type: String, default: 'unocss' },
    bold: { type: Boolean, default: true },
    showDivider: { type: Boolean, default: false },
    dividerPosition: { type: String, default: 'bottom' },
    showDecoration: { type: Boolean, default: false },
    clickable: { type: Boolean, default: false },
    customStyle: { type: Object, default: () => ({}) },
  })
  const emit = defineEmits(['click'])
  const { iconSize, iconColor, headingStyle, wrapperStyle, handleClick } =
    useTitle(props, emit)
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
