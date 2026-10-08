<template>
  <view
    class="c-loading-indicator"
    :class="{ 'c-loading-indicator--small': size === 'small' }"
    :style="{ '--feedback-dot-color': color }"
    aria-hidden="true"
  >
    <view
      v-if="size !== 'small'"
      class="c-loading-indicator__orbit"
    />
    <view class="c-loading-indicator__dot" />
    <view class="c-loading-indicator__dot c-loading-indicator__dot--second" />
    <view class="c-loading-indicator__dot c-loading-indicator__dot--third" />
  </view>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{ color?: string; size?: 'normal' | 'small' }>(), {
    color: 'var(--r-color-primary, #0071e3)',
    size: 'normal',
  })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
