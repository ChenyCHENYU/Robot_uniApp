<template>
  <view class="c-signature">
    <!-- 签名区域 -->
    <view
      class="c-signature__canvas-wrap"
      :style="{ height: height + 'rpx', background: bgColor }"
    >
      <canvas
        class="c-signature__canvas"
        :canvas-id="canvasId"
        :id="canvasId"
        :disable-scroll="true"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
      />
      <view
        v-if="isEmpty && placeholder"
        class="c-signature__placeholder"
      >
        <text class="c-signature__placeholder-text">{{ placeholder }}</text>
      </view>
    </view>

    <!-- 操作栏 -->
    <view
      v-if="showFooter"
      class="c-signature__footer"
    >
      <view
        class="c-signature__btn c-signature__btn--clear"
        @click="clear"
      >
        <wd-icon
          name="delete"
          size="16px"
        />
        <text>清除</text>
      </view>
      <view
        class="c-signature__btn c-signature__btn--undo"
        @click="undo"
      >
        <wd-icon
          name="arrow-left"
          size="16px"
        />
        <text>撤销</text>
      </view>
      <view
        class="c-signature__btn c-signature__btn--confirm"
        @click="confirm"
      >
        <wd-icon
          name="check"
          size="16px"
          color="#fff"
        />
        <text>确认</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { defaultProps, useSignature } from './data'

  const props = defineProps({
    /** 画笔颜色 */
    penColor: { type: String, default: defaultProps.penColor },
    /** 画笔粗细 */
    lineWidth: { type: Number, default: defaultProps.lineWidth },
    /** 画布背景色 */
    bgColor: { type: String, default: defaultProps.bgColor },
    /** 画布高度(rpx) */
    height: { type: Number, default: defaultProps.height },
    /** 是否显示底部操作栏 */
    showFooter: { type: Boolean, default: defaultProps.showFooter },
    /** 导出图片类型 */
    exportType: { type: String, default: defaultProps.exportType },
    /** 占位提示 */
    placeholder: { type: String, default: defaultProps.placeholder },
  })

  const emit = defineEmits(['confirm', 'clear'])

  const {
    canvasId,
    isEmpty,
    clear,
    undo,
    confirm,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  } = useSignature(props, emit)
  defineExpose({ clear, undo, confirm })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
