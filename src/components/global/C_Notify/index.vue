<template>
  <view
    v-if="innerVisible"
    :class="['c-notify', `c-notify--${position}`]"
    :style="notifyStyle"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <text class="c-notify__text">{{ message }}</text>
  </view>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onBeforeUnmount } from 'vue'
  import { defaultProps, TYPE_COLORS } from './data'

  const props = defineProps({
    /** 是否显示 */
    visible: { type: Boolean, default: defaultProps.visible },
    /** 通知类型 */
    type: { type: String, default: defaultProps.type },
    /** 通知内容 */
    message: { type: String, default: defaultProps.message },
    /** 显示时长 */
    duration: { type: Number, default: defaultProps.duration },
    /** 背景色 */
    background: { type: String, default: defaultProps.background },
    /** 文字颜色 */
    color: { type: String, default: defaultProps.color },
    /** 位置 */
    position: { type: String, default: defaultProps.position },
    /** 是否允许滑动关闭 */
    swipeable: { type: Boolean, default: defaultProps.swipeable },
  })

  const emit = defineEmits(['update:visible', 'close'])

  const innerVisible = ref(false)
  let timer = null
  let startY = 0

  const typeStyle = computed(
    () => TYPE_COLORS[props.type] || TYPE_COLORS.primary
  )

  const notifyStyle = computed(() => ({
    background: props.background || typeStyle.value.bg,
    color: props.color || typeStyle.value.color,
  }))

  /**
   *
   */
  function startTimer() {
    clearTimer()
    if (props.duration > 0) {
      timer = setTimeout(close, props.duration)
    }
  }

  /**
   *
   */
  function clearTimer() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  /**
   *
   */
  function close() {
    clearTimer()
    innerVisible.value = false
    emit('update:visible', false)
    emit('close')
  }

  /**
   *
   */
  function onTouchStart(e) {
    if (!props.swipeable) return
    startY = e.touches[0].clientY
  }

  /**
   *
   */
  function onTouchMove(e) {
    if (!props.swipeable) return
    const deltaY = e.touches[0].clientY - startY
    if (props.position === 'top' && deltaY < -20) {
      close()
    } else if (props.position === 'bottom' && deltaY > 20) {
      close()
    }
  }

  /**
   *
   */
  function onTouchEnd() {
    startY = 0
  }

  watch(
    () => props.visible,
    val => {
      if (val) {
        innerVisible.value = true
        startTimer()
      } else {
        close()
      }
    }
  )

  onBeforeUnmount(clearTimer)
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
