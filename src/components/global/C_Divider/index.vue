<template>
  <view
    class="c-divider"
    :style="{ margin: `${margin}rpx 0` }"
  >
    <view
      :class="['c-divider__line', dashed && 'c-divider__line--dashed']"
      :style="{ borderColor: lineColor }"
    />
    <text
      v-if="text || $slots.default"
      :class="['c-divider__text', `c-divider__text--${textPosition}`]"
      :style="{ color: textColor, fontSize: textSize + 'rpx' }"
    >
      <slot>{{ text }}</slot>
    </text>
    <view
      :class="['c-divider__line', dashed && 'c-divider__line--dashed']"
      :style="{ borderColor: lineColor }"
    />
  </view>
</template>

<script setup lang="ts">
  import { defaultProps } from './data'

  defineProps({
    /** 文本内容 */
    text: { type: String, default: defaultProps.text },
    /** 文本位置 */
    textPosition: { type: String, default: defaultProps.textPosition },
    /** 是否虚线 */
    dashed: { type: Boolean, default: defaultProps.dashed },
    /** 线条颜色 */
    lineColor: { type: String, default: defaultProps.lineColor },
    /** 文字颜色 */
    textColor: { type: String, default: defaultProps.textColor },
    /** 文字大小 */
    textSize: { type: Number, default: defaultProps.textSize },
    /** 上下间距 */
    margin: { type: Number, default: defaultProps.margin },
  })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
