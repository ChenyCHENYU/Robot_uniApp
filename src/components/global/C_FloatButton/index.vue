<template>
  <view
    :class="['c-float-button', dragging && 'c-float-button--dragging']"
    :style="btnStyle"
    @click="$emit('click')"
    @touchstart="onTouchStart"
    @touchmove.prevent="onTouchMove"
    @touchend="onTouchEnd"
  >
    <slot>
      <wd-icon :name="icon" size="24px" color="#fff" />
    </slot>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { defaultProps } from './data.js'

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

defineEmits(['click'])

const dragging = ref(false)
const offsetX = ref(0)
const offsetY = ref(0)
let startX = 0
let startY = 0
let moved = false

const btnStyle = computed(() => {
  const style = {
    width: `${props.size}rpx`,
    height: `${props.size}rpx`,
    bottom: `calc(${props.bottom}rpx + env(safe-area-inset-bottom) + ${offsetY.value}px)`,
  }
  if (props.position === 'left-bottom') {
    style.left = `${props.left}rpx`
  } else {
    style.right = `${props.right}rpx`
  }
  return style
})

const onTouchStart = (e) => {
  if (!props.draggable) return
  const touch = e.touches[0]
  startX = touch.clientX - offsetX.value
  startY = touch.clientY - offsetY.value
  moved = false
  dragging.value = true
}

const onTouchMove = (e) => {
  if (!props.draggable || !dragging.value) return
  const touch = e.touches[0]
  offsetX.value = touch.clientX - startX
  offsetY.value = -(touch.clientY - startY)
  moved = true
}

const onTouchEnd = () => {
  dragging.value = false
  if (moved) {
    // 吸边效果可后续增加
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
