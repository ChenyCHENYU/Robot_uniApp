<template>
  <view
    v-if="loading"
    :class="['c-skeleton', animate && 'c-skeleton--animate']"
  >
    <view
      v-if="avatar"
      class="c-skeleton__avatar"
    />
    <view class="c-skeleton__content">
      <view
        v-if="title"
        class="c-skeleton__title"
      />
      <view
        v-for="i in rows"
        :key="i"
        class="c-skeleton__row"
        :style="{ width: getRowWidth(i) }"
      />
    </view>
  </view>
  <slot v-else />
</template>

<script setup lang="ts">
  import { defaultProps } from './data'

  const props = defineProps({
    /** 是否展示骨架屏 */
    loading: { type: Boolean, default: defaultProps.loading },
    /** 段落行数 */
    rows: { type: Number, default: defaultProps.rows },
    /** 是否启用动画 */
    animate: { type: Boolean, default: defaultProps.animate },
    /** 是否显示头像占位 */
    avatar: { type: Boolean, default: defaultProps.avatar },
    /** 是否显示标题占位 */
    title: { type: Boolean, default: defaultProps.title },
  })

  const getRowWidth = index => {
    if (index === props.rows) return '60%'
    return '100%'
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
