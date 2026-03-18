<template>
  <!-- 圆形进度 -->
  <view
    v-if="circle"
    class="c-progress c-progress--circle"
    :style="{ width: circleSize + 'rpx', height: circleSize + 'rpx' }"
  >
    <canvas
      class="c-progress__canvas"
      :canvas-id="canvasId"
      :style="{ width: circleSize + 'rpx', height: circleSize + 'rpx' }"
    />
    <view class="c-progress__circle-content">
      <slot>
        <text
          v-if="showText"
          class="c-progress__circle-text"
          >{{ percent }}%</text
        >
      </slot>
    </view>
  </view>

  <!-- 线性进度 -->
  <view
    v-else
    class="c-progress"
  >
    <view
      class="c-progress__bar"
      :style="{
        height: strokeHeight + 'rpx',
        background: trackColor,
        borderRadius: strokeHeight / 2 + 'rpx',
      }"
    >
      <view
        class="c-progress__inner"
        :style="{
          width: clampedPercent + '%',
          background: activeColor,
          borderRadius: strokeHeight / 2 + 'rpx',
          transition: animated ? 'width 0.3s ease' : 'none',
        }"
      />
    </view>
    <text
      v-if="showText"
      class="c-progress__text"
      >{{ percent }}%</text
    >
  </view>
</template>

<script setup lang="ts">
  import { computed, watch, onMounted, getCurrentInstance } from 'vue'
  import { defaultProps, STATUS_COLORS } from './data'

  const props = defineProps({
    /** 进度百分比 */
    percent: { type: Number, default: defaultProps.percent },
    /** 是否显示文字 */
    showText: { type: Boolean, default: defaultProps.showText },
    /** 进度条高度 */
    strokeHeight: { type: Number, default: defaultProps.strokeHeight },
    /** 颜色 */
    color: { type: String, default: defaultProps.color },
    /** 轨道颜色 */
    trackColor: { type: String, default: defaultProps.trackColor },
    /** 是否开启过渡动画 */
    animated: { type: Boolean, default: defaultProps.animated },
    /** 状态 */
    status: { type: String, default: defaultProps.status },
    /** 是否圆形 */
    circle: { type: Boolean, default: defaultProps.circle },
    /** 圆形尺寸 */
    circleSize: { type: Number, default: defaultProps.circleSize },
    /** 圆形线宽 */
    circleStrokeWidth: {
      type: Number,
      default: defaultProps.circleStrokeWidth,
    },
  })

  const instance = getCurrentInstance()
  const canvasId = `progress_${instance?.uid || Date.now()}`

  const clampedPercent = computed(() =>
    Math.min(100, Math.max(0, props.percent))
  )
  const activeColor = computed(
    () => props.color || STATUS_COLORS[props.status] || STATUS_COLORS.normal
  )

  /** 绘制圆形进度 */
  function drawCircle() {
    if (!props.circle) return

    const sysInfo = uni.getSystemInfoSync()
    const rpxToPx = sysInfo.windowWidth / 750
    const size = props.circleSize * rpxToPx
    const lineWidth = props.circleStrokeWidth * rpxToPx
    const radius = (size - lineWidth) / 2
    const center = size / 2

    const ctx = uni.createCanvasContext(canvasId, instance.proxy)

    // 轨道
    ctx.beginPath()
    ctx.arc(center, center, radius, 0, 2 * Math.PI)
    ctx.setStrokeStyle(props.trackColor)
    ctx.setLineWidth(lineWidth)
    ctx.setLineCap('round')
    ctx.stroke()

    // 进度
    if (clampedPercent.value > 0) {
      const startAngle = -Math.PI / 2
      const endAngle = startAngle + (clampedPercent.value / 100) * 2 * Math.PI
      ctx.beginPath()
      ctx.arc(center, center, radius, startAngle, endAngle)
      ctx.setStrokeStyle(activeColor.value)
      ctx.setLineWidth(lineWidth)
      ctx.setLineCap('round')
      ctx.stroke()
    }

    ctx.draw()
  }

  watch(() => [props.percent, props.status, props.color], drawCircle)
  onMounted(drawCircle)
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
