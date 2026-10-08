<template>
  <view
    :class="['c-float-button', dragging && 'c-float-button--dragging']"
    :style="btnStyle"
    role="button"
    aria-label="快捷操作"
    @click="onClick"
    @touchstart="onTouchStart"
    @touchmove.prevent="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <slot>
      <wd-icon
        :name="icon"
        size="24px"
        color="#fff"
      />
    </slot>
  </view>
</template>

<script setup lang="ts">
  import { defaultProps, useFloatButton } from './data'

  const props = defineProps({
    /** 图标名 */
    icon: { type: String, default: defaultProps.icon },
    /** 位置 right-bottom / left-bottom */
    position: { type: String, default: defaultProps.position },
    /** 距底部距离 (rpx) */
    bottom: { type: Number, default: defaultProps.bottom },
    /** 距右侧距离 (rpx) */
    right: { type: Number, default: defaultProps.right },
    /** 距左侧距离 (rpx) */
    left: { type: Number, default: defaultProps.left },
    /** 按钮尺寸 (rpx) */
    size: { type: Number, default: defaultProps.size },
    /** 是否可拖拽 */
    draggable: { type: Boolean, default: false },
  })

  const emit = defineEmits(['click'])

  const { dragging, btnStyle, onClick, onTouchStart, onTouchMove, onTouchEnd } =
    useFloatButton(props, emit)
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
