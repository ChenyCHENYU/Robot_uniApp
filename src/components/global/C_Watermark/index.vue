<template>
  <view :class="['c-watermark', fullPage && 'c-watermark--full-page']">
    <slot />
    <view v-if="text" class="c-watermark__layer" :style="layerStyle" />
  </view>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { defaultProps } from './data.js'

const props = defineProps({
  /** 水印文字 */
  text: { type: String, default: defaultProps.text },
  /** 字号 (px) */
  fontSize: { type: Number, default: defaultProps.fontSize },
  /** 颜色 */
  color: { type: String, default: defaultProps.color },
  /** 旋转角度 */
  rotate: { type: Number, default: defaultProps.rotate },
  /** 间距 [x, y] */
  gap: { type: Array, default: () => defaultProps.gap },
  /** 是否覆盖到整个页面 */
  fullPage: { type: Boolean, default: defaultProps.fullPage },
})

const bgImage = ref('')

const generateWatermark = () => {
  // #ifdef H5
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const ratio = window.devicePixelRatio || 1

  const textWidth = props.text.length * props.fontSize
  const width = textWidth + props.gap[0]
  const height = props.fontSize * 2 + props.gap[1]

  canvas.width = width * ratio
  canvas.height = height * ratio
  ctx.scale(ratio, ratio)

  ctx.translate(width / 2, height / 2)
  ctx.rotate((props.rotate * Math.PI) / 180)
  ctx.font = `${props.fontSize}px sans-serif`
  ctx.fillStyle = props.color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(props.text, 0, 0)

  bgImage.value = canvas.toDataURL()
  // #endif

  // #ifndef H5
  // 非 H5 环境使用 CSS 文字重复方案作为降级
  bgImage.value = ''
  // #endif
}

const layerStyle = computed(() => {
  if (!bgImage.value) return {}
  return { backgroundImage: `url(${bgImage.value})` }
})

onMounted(generateWatermark)
watch(() => [props.text, props.fontSize, props.color, props.rotate], generateWatermark)
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
