<template>
  <view
    class="c-icon"
    :style="iconStyle"
    :aria-label="label || undefined"
    @click="handleClick"
  >
    <view
      v-if="type === 'unocss' && hasValidName"
      class="c-icon__glyph"
      :class="normalizedName"
      :style="unocssStyle"
    />
    <wd-icon
      v-else-if="type === 'wot' && hasValidName"
      v-bind="wotProps"
    />
    <image
      v-else-if="(type === 'svg' || type === 'image') && hasValidName"
      class="c-icon__image"
      :src="name"
      :style="imageStyle"
      mode="aspectFit"
      @error="onImageError"
    />
    <slot v-else-if="type === 'custom'" />
    <view
      v-else
      class="c-icon__fallback"
      :aria-label="fallbackLabel"
      ><text>?</text></view
    >
  </view>
</template>

<script setup lang="ts">
  import { type PropType } from 'vue'
  import {
    defaultIconProps,
    useIcon,
    type IconType,
    type IconProps,
  } from './data'

  defineOptions({ name: 'CIcon' })
  const props = defineProps({
    type: {
      type: String as PropType<IconType>,
      default: defaultIconProps.type,
    },
    name: { type: String, default: '' },
    size: { type: [String, Number], default: defaultIconProps.size },
    color: { type: String, default: defaultIconProps.color },
    bold: { type: Boolean, default: false },
    label: { type: String, default: '' },
    customPrefix: { type: String, default: '' },
    customStyle: {
      type: Object as PropType<IconProps['customStyle']>,
      default: () => ({}),
    },
  })
  const emit = defineEmits<{ click: [event: unknown] }>()
  const {
    normalizedName,
    hasValidName,
    iconStyle,
    unocssStyle,
    imageStyle,
    wotProps,
    fallbackLabel,
    onImageError,
    handleClick,
  } = useIcon(props, emit)
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
