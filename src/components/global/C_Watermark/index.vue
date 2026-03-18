<template>
  <view :class="['c-watermark', fullPage && 'c-watermark--full-page']">
    <slot />
    <view
      v-if="text"
      class="c-watermark__layer"
    >
      <view
        v-for="row in 10"
        :key="row"
        class="c-watermark__row"
        :style="{ height: gap[1] + 'px' }"
      >
        <text
          v-for="col in 6"
          :key="col"
          class="c-watermark__text"
          :style="{
            fontSize: fontSize + 'px',
            color: color,
            transform: `rotate(${rotate}deg)`,
            marginRight: gap[0] + 'px',
          }"
          >{{ text }}</text
        >
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { defaultProps } from './data'

  defineProps({
    /** 水印文字 */
    text: { type: String, default: defaultProps.text },
    /** 字号 (px) */
    fontSize: { type: Number, default: defaultProps.fontSize },
    /** 颜色 */
    color: { type: String, default: defaultProps.color },
    /** 旋转角度 */
    rotate: { type: Number, default: defaultProps.rotate },
    /** 间距 [x, y] */
    gap: { type: Array, default: () => defaultProps.gap },
    /** 是否覆盖到整个页面 */
    fullPage: { type: Boolean, default: defaultProps.fullPage },
  })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
