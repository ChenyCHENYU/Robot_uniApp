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
        <WdIcon
          name="delete"
          size="16px"
        />
        <text>清除</text>
      </view>
      <view
        class="c-signature__btn c-signature__btn--undo"
        @click="undo"
      >
        <WdIcon
          name="arrow-left"
          size="16px"
        />
        <text>撤销</text>
      </view>
      <view
        class="c-signature__btn c-signature__btn--confirm"
        @click="confirm"
      >
        <WdIcon
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
  import { ref, onMounted } from 'vue'
  import { defaultProps } from './data'

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

  const canvasId = `signature-${Date.now()}`
  const isEmpty = ref(true)

  let ctx = null
  let paths = [] // 所有笔画
  let currentPath = [] // 当前笔画

  onMounted(() => {
    ctx = uni.createCanvasContext(canvasId)
    _initCanvas()
  })

  /** 初始化画布 */
  function _initCanvas() {
    if (!ctx) return
    ctx.setFillStyle(props.bgColor)
    ctx.fillRect(0, 0, 9999, 9999)
    ctx.setStrokeStyle(props.penColor)
    ctx.setLineWidth(props.lineWidth)
    ctx.setLineCap('round')
    ctx.setLineJoin('round')
    ctx.draw()
  }

  /** 触摸开始 */
  function onTouchStart(e) {
    const { x, y } = e.touches[0]
    currentPath = [{ x, y }]
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  /** 触摸移动 */
  function onTouchMove(e) {
    const { x, y } = e.touches[0]
    currentPath.push({ x, y })
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.draw(true)
    ctx.moveTo(x, y)
  }

  /** 触摸结束 */
  function onTouchEnd() {
    if (currentPath.length > 1) {
      paths.push([...currentPath])
      isEmpty.value = false
    }
    currentPath = []
  }

  /** 清除画布 */
  function clear() {
    paths = []
    currentPath = []
    isEmpty.value = true
    _initCanvas()
    emit('clear')
  }

  /** 撤销上一笔 */
  function undo() {
    if (paths.length === 0) return
    paths.pop()
    _redraw()
    if (paths.length === 0) isEmpty.value = true
  }

  /** 重绘所有笔画 */
  function _redraw() {
    _initCanvas()
    // 需要等初始化 draw 完成后再绘制
    setTimeout(() => {
      paths.forEach(path => {
        ctx.beginPath()
        ctx.moveTo(path[0].x, path[0].y)
        path.forEach((point, i) => {
          if (i > 0) ctx.lineTo(point.x, point.y)
        })
        ctx.stroke()
      })
      ctx.draw(true)
    }, 50)
  }

  /** 确认签名 → 导出图片 */
  function confirm() {
    if (isEmpty.value) {
      uni.showToast({ title: '请先签名', icon: 'none' })
      return
    }

    uni.canvasToTempFilePath({
      canvasId,
      fileType: props.exportType,
      success: res => {
        emit('confirm', res.tempFilePath)
      },
      fail: () => {
        uni.showToast({ title: '导出失败', icon: 'none' })
      },
    })
  }

  defineExpose({ clear, undo, confirm })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
