<template>
  <view class="c-empty">
    <!-- 插画区域 -->
    <view class="c-empty__illustration">
      <slot name="icon">
        <view
          class="c-empty__icon-wrap"
          :class="'c-empty__icon-wrap--' + type"
        >
          <view class="c-empty__icon-circle"></view>
          <view class="c-empty__icon-dots">
            <view class="dot dot--1"></view>
            <view class="dot dot--2"></view>
            <view class="dot dot--3"></view>
          </view>
          <text
            :class="displayIcon"
            class="c-empty__icon"
            :style="{ fontSize: iconSize + 'px', color: iconColor }"
          />
        </view>
      </slot>
    </view>

    <!-- 文案区域 -->
    <view class="c-empty__content">
      <text class="c-empty__title">
        <slot>{{ displayText }}</slot>
      </text>
      <text
        v-if="displaySubText"
        class="c-empty__desc"
        >{{ displaySubText }}</text
      >
    </view>

    <!-- 操作按钮 -->
    <view
      v-if="showAction"
      class="c-empty__action"
      @click="$emit('action')"
    >
      <slot name="action">{{ actionText }}</slot>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { EMPTY_TYPES, defaultProps } from './data'

  const props = defineProps({
    /** 空状态类型 */
    type: { type: String, default: defaultProps.type },
    /** 自定义描述文案 */
    text: { type: String, default: '' },
    /** 自定义图标名 */
    icon: { type: String, default: '' },
    /** 图标尺寸 (px) */
    iconSize: { type: Number, default: defaultProps.iconSize },
    /** 是否显示操作按钮 */
    showAction: { type: Boolean, default: defaultProps.showAction },
    /** 操作按钮文案 */
    actionText: { type: String, default: defaultProps.actionText },
  })

  defineEmits(['action'])

  const typeConfig = computed(
    () => EMPTY_TYPES[props.type] || EMPTY_TYPES.default
  )
  const displayIcon = computed(() => props.icon || typeConfig.value.icon)
  const displayText = computed(() => props.text || typeConfig.value.text)
  const displaySubText = computed(() => typeConfig.value.subText || '')
  const iconColor = computed(() => typeConfig.value.color || '#a0aec0')
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
