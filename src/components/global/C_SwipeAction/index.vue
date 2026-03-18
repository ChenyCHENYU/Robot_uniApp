<template>
  <view
    class="c-swipe-action"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <!-- 左侧操作区 -->
    <view
      v-if="leftActions.length"
      class="c-swipe-action__left"
      :style="{ width: leftWidth + 'rpx' }"
    >
      <view
        v-for="(action, idx) in leftActions"
        :key="idx"
        :class="[
          'c-swipe-action__btn',
          action.type && `c-swipe-action__btn--${action.type}`,
        ]"
        :style="{ backgroundColor: action.bgColor, ...action.style }"
        @click.stop="onAction(action, idx, 'left')"
      >
        <wd-icon
          v-if="action.icon"
          :name="action.icon"
          size="18px"
          color="#fff"
        />
        <text
          v-if="action.text"
          class="c-swipe-action__btn-text"
          >{{ action.text }}</text
        >
      </view>
    </view>

    <!-- 内容区 -->
    <view
      class="c-swipe-action__content"
      :style="{
        transform: `translateX(${offsetX}rpx)`,
        transition: moving ? 'none' : 'transform 0.3s ease',
      }"
    >
      <slot />
    </view>

    <!-- 右侧操作区 -->
    <view
      v-if="rightActions.length"
      class="c-swipe-action__right"
      :style="{ width: rightWidth + 'rpx' }"
    >
      <view
        v-for="(action, idx) in rightActions"
        :key="idx"
        :class="[
          'c-swipe-action__btn',
          action.type && `c-swipe-action__btn--${action.type}`,
        ]"
        :style="{ backgroundColor: action.bgColor, ...action.style }"
        @click.stop="onAction(action, idx, 'right')"
      >
        <wd-icon
          v-if="action.icon"
          :name="action.icon"
          size="18px"
          color="#fff"
        />
        <text
          v-if="action.text"
          class="c-swipe-action__btn-text"
          >{{ action.text }}</text
        >
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref, computed, type PropType } from 'vue'
  import { defaultProps } from './data'

  interface SwipeActionItem {
    text?: string
    icon?: string
    type?: string
    bgColor?: string
    style?: Record<string, string>
  }

  const props = defineProps({
    /** 是否禁用 */
    disabled: { type: Boolean, default: defaultProps.disabled },
    /** 左侧操作按钮 */
    leftActions: {
      type: Array as PropType<SwipeActionItem[]>,
      default: () => defaultProps.leftActions,
    },
    /** 右侧操作按钮 */
    rightActions: {
      type: Array as PropType<SwipeActionItem[]>,
      default: () => defaultProps.rightActions,
    },
    /** 滑动阈值(rpx) */
    threshold: { type: Number, default: defaultProps.threshold },
  })

  const emit = defineEmits(['action', 'open', 'close'])

  const offsetX = ref(0)
  const moving = ref(false)
  let startX = 0
  let startOffsetX = 0

  const BTN_WIDTH = 160 // 每个按钮宽度(rpx)
  const leftWidth = computed(() => props.leftActions.length * BTN_WIDTH)
  const rightWidth = computed(() => props.rightActions.length * BTN_WIDTH)

  /** 触摸开始 */
  function onTouchStart(e) {
    if (props.disabled) return
    moving.value = true
    startX = e.touches[0].clientX
    startOffsetX = offsetX.value
  }

  /** 触摸移动 */
  function onTouchMove(e) {
    if (props.disabled || !moving.value) return
    const deltaX = (e.touches[0].clientX - startX) * 2 // clientX 转 rpx 近似
    let newOffset = startOffsetX + deltaX

    // 限制滑动范围
    const maxLeft = leftWidth.value
    const maxRight = -rightWidth.value
    newOffset = Math.min(maxLeft, Math.max(maxRight, newOffset))
    offsetX.value = newOffset
  }

  /** 触摸结束 */
  function onTouchEnd() {
    if (props.disabled) return
    moving.value = false

    // 判断是否超过阈值
    if (offsetX.value > props.threshold && leftWidth.value > 0) {
      offsetX.value = leftWidth.value
      emit('open', 'left')
    } else if (offsetX.value < -props.threshold && rightWidth.value > 0) {
      offsetX.value = -rightWidth.value
      emit('open', 'right')
    } else {
      offsetX.value = 0
      emit('close')
    }
  }

  /**
   * 点击操作按钮
   * @param {object} action
   * @param {number} index
   * @param {string} position
   */
  function onAction(action, index, position) {
    emit('action', { action, index, position })
    // 点击后自动关闭
    offsetX.value = 0
    emit('close')
  }

  /** 外部调用：关闭滑动 */
  function close() {
    offsetX.value = 0
  }

  defineExpose({ close })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
