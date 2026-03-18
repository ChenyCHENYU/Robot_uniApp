<template>
  <view class="c-count-down">
    <slot
      :time="timeData"
      :text="displayText"
    >
      <text class="c-count-down__text">{{ displayText }}</text>
    </slot>
  </view>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onBeforeUnmount } from 'vue'
  import { defaultProps, parseTime, formatTime } from './data'

  const props = defineProps({
    /** 倒计时时长 ms */
    time: { type: Number, default: defaultProps.time },
    /** 格式化模板 */
    format: { type: String, default: defaultProps.format },
    /** 是否自动开始 */
    autoStart: { type: Boolean, default: defaultProps.autoStart },
    /** 是否开启毫秒级渲染 */
    millisecond: { type: Boolean, default: defaultProps.millisecond },
  })

  const emit = defineEmits(['finish', 'change'])

  const remaining = ref(props.time)
  let endTime = 0
  let timer = null
  let counting = false

  const timeData = computed(() => parseTime(remaining.value))
  const displayText = computed(() => formatTime(props.format, timeData.value))

  /**
   *
   */
  function start() {
    if (counting) return
    counting = true
    endTime = Date.now() + remaining.value
    tick()
  }

  /**
   *
   */
  function pause() {
    counting = false
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  /**
   *
   */
  function reset() {
    pause()
    remaining.value = props.time
    if (props.autoStart) start()
  }

  /**
   *
   */
  function tick() {
    if (!counting) return

    const diff = endTime - Date.now()
    remaining.value = Math.max(0, diff)
    emit('change', timeData.value)

    if (remaining.value <= 0) {
      counting = false
      emit('finish')
      return
    }

    const interval = props.millisecond ? 30 : 1000
    timer = setTimeout(tick, interval)
  }

  watch(
    () => props.time,
    () => reset()
  )

  if (props.autoStart && props.time > 0) {
    start()
  }

  onBeforeUnmount(() => pause())

  defineExpose({ start, pause, reset })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
