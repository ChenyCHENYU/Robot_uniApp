<template>
  <view class="c-empty">
    <!-- 图标区域 -->
    <view class="c-empty__icon">
      <slot name="icon">
        <wd-icon :name="displayIcon" :size="iconSize + 'px'" color="#c0c4cc" />
      </slot>
    </view>

    <!-- 文案区域 -->
    <view class="c-empty__text">
      <slot>{{ displayText }}</slot>
    </view>

    <!-- 操作按钮 -->
    <view v-if="showAction" class="c-empty__action" @click="$emit('action')">
      <slot name="action">{{ actionText }}</slot>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { EMPTY_TYPES, defaultProps } from "./data.js";

const props = defineProps({
  /** 空状态类型 */
  type: { type: String, default: defaultProps.type },
  /** 自定义描述文案 */
  text: { type: String, default: "" },
  /** 自定义图标名 */
  icon: { type: String, default: "" },
  /** 图标尺寸 (px) */
  iconSize: { type: Number, default: defaultProps.iconSize },
  /** 是否显示操作按钮 */
  showAction: { type: Boolean, default: defaultProps.showAction },
  /** 操作按钮文案 */
  actionText: { type: String, default: defaultProps.actionText },
});

defineEmits(["action"]);

const typeConfig = computed(
  () => EMPTY_TYPES[props.type] || EMPTY_TYPES.default,
);
const displayIcon = computed(() => props.icon || typeConfig.value.icon);
const displayText = computed(() => props.text || typeConfig.value.text);
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
