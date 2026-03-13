<template>
  <view v-if="visible">
    <!-- 遮罩 -->
    <view class="c-action-sheet__overlay" @click="onOverlayClick" />

    <!-- 面板 -->
    <view class="c-action-sheet__panel">
      <view v-if="title" class="c-action-sheet__title">{{ title }}</view>

      <view
        v-for="(item, index) in actions"
        :key="index"
        :class="[
          'c-action-sheet__item',
          item.danger && 'c-action-sheet__item--danger',
          item.disabled && 'c-action-sheet__item--disabled',
        ]"
        @click="onSelect(item, index)"
      >
        <wd-icon v-if="item.icon" :name="item.icon" size="20px" />
        <text>{{ item.name }}</text>
        <text v-if="item.description" class="c-action-sheet__desc">{{ item.description }}</text>
      </view>

      <template v-if="showCancel">
        <view class="c-action-sheet__gap" />
        <view class="c-action-sheet__cancel" @click="onCancel">{{ cancelText }}</view>
      </template>
    </view>
  </view>
</template>

<script setup>
import { defaultProps } from './data.js'

const props = defineProps({
  /** 是否显示 */
  visible: { type: Boolean, default: defaultProps.visible },
  /** 标题 */
  title: { type: String, default: defaultProps.title },
  /** 操作项 [{ name, icon, description, danger, disabled }] */
  actions: { type: Array, default: () => [] },
  /** 取消按钮文案 */
  cancelText: { type: String, default: defaultProps.cancelText },
  /** 是否显示取消按钮 */
  showCancel: { type: Boolean, default: defaultProps.showCancel },
  /** 点击遮罩关闭 */
  closeOnClickOverlay: { type: Boolean, default: defaultProps.closeOnClickOverlay },
})

const emit = defineEmits(['update:visible', 'select', 'cancel'])

const close = () => emit('update:visible', false)

const onOverlayClick = () => {
  if (props.closeOnClickOverlay) close()
}

const onSelect = (item, index) => {
  if (item.disabled) return
  emit('select', item, index)
  close()
}

const onCancel = () => {
  emit('cancel')
  close()
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
