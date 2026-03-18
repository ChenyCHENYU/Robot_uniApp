<template>
  <view class="c-badge">
    <slot />
    <view
      v-if="showBadge"
      class="c-badge__content"
      :style="offsetStyle"
    >
      <view
        v-if="dot"
        class="c-badge__dot"
        :style="{ background: color }"
      />
      <view
        v-else
        class="c-badge__text"
        :style="{ background: color }"
      >
        {{ displayValue }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { defaultProps } from './data'

  const props = defineProps({
    /** 徽标值 */
    value: { type: [Number, String], default: defaultProps.value },
    /** 最大数值 */
    max: { type: Number, default: defaultProps.max },
    /** 是否为圆点 */
    dot: { type: Boolean, default: defaultProps.dot },
    /** 值为 0 时是否显示 */
    showZero: { type: Boolean, default: defaultProps.showZero },
    /** 颜色 */
    color: { type: String, default: defaultProps.color },
    /** 偏移 [x, y] (rpx) */
    offset: { type: Array, default: () => defaultProps.offset },
  })

  const showBadge = computed(() => {
    if (props.dot) return true
    if (typeof props.value === 'string') return !!props.value
    return props.showZero || props.value > 0
  })

  const displayValue = computed(() => {
    if (typeof props.value === 'string') return props.value
    return props.value > props.max ? `${props.max}+` : props.value
  })

  const offsetStyle = computed(() => ({
    marginRight: `${-props.offset[0]}rpx`,
    marginTop: `${props.offset[1]}rpx`,
  }))
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
