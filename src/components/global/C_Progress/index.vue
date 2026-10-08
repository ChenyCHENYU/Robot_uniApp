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
          >{{ clampedPercent }}%</text
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
      >{{ clampedPercent }}%</text
    >
  </view>
</template>

<script setup lang="ts">
  import { defaultProps, useProgress } from './data'

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

  const { canvasId, clampedPercent, activeColor } = useProgress(props)
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
