<template>
  <view
    v-if="show"
    :class="['c-tag', round && 'c-tag--round', `c-tag--${size}`]"
    :style="tagStyle"
  >
    <slot>{{ text }}</slot>
    <view v-if="closeable" class="c-tag__close" @click.stop="onClose">
      <wd-icon name="close" :size="size === 'small' ? '10px' : '12px'" :color="colorSet.text" />
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { TAG_COLORS, defaultProps } from './data.js'

const props = defineProps({
  /** 标签文本 */
  text: { type: String, default: '' },
  /** 类型 primary / success / warning / error / info */
  type: { type: String, default: defaultProps.type },
  /** 朴素模式 */
  plain: { type: Boolean, default: defaultProps.plain },
  /** 圆角 */
  round: { type: Boolean, default: defaultProps.round },
  /** 可关闭 */
  closeable: { type: Boolean, default: defaultProps.closeable },
  /** 尺寸 small / default / large */
  size: { type: String, default: defaultProps.size },
  /** 自定义颜色 */
  color: { type: String, default: '' },
})

const emit = defineEmits(['close'])
const show = ref(true)

const colorSet = computed(() => {
  if (props.color) {
    return { bg: `${props.color}1a`, text: props.color, border: `${props.color}4d` }
  }
  return TAG_COLORS[props.type] || TAG_COLORS.primary
})

const tagStyle = computed(() => {
  const c = colorSet.value
  if (props.plain) {
    return { background: c.bg, color: c.text, borderColor: c.border }
  }
  return { background: c.text, color: '#fff', borderColor: c.text }
})

const onClose = () => {
  show.value = false
  emit('close')
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
