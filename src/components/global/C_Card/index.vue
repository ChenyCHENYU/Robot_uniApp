<template>
  <view
    :class="[
      'c-card',
      `c-card--shadow-${shadow}`,
      clickable && 'c-card--clickable',
    ]"
    @click="clickable && $emit('click')"
  >
    <!-- 头部 -->
    <view v-if="title || $slots.header" class="c-card__header">
      <slot name="header">
        <view>
          <view class="c-card__title">{{ title }}</view>
          <view v-if="subtitle" class="c-card__subtitle">{{ subtitle }}</view>
        </view>
      </slot>
      <slot name="extra" />
    </view>

    <!-- 主体 -->
    <view :class="['c-card__body', padding && 'c-card__body--padding']">
      <slot />
    </view>

    <!-- 底部 -->
    <view v-if="$slots.footer" class="c-card__footer">
      <slot name="footer" />
    </view>
  </view>
</template>

<script setup>
import { defaultProps } from "./data.js";

defineProps({
  /** 卡片标题 */
  title: { type: String, default: defaultProps.title },
  /** 副标题 */
  subtitle: { type: String, default: defaultProps.subtitle },
  /** 阴影等级 sm / md / lg / none */
  shadow: { type: String, default: defaultProps.shadow },
  /** 内容区是否有内边距 */
  padding: { type: Boolean, default: defaultProps.padding },
  /** 是否可点击 (点击态) */
  clickable: { type: Boolean, default: defaultProps.clickable },
});

defineEmits(["click"]);
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
