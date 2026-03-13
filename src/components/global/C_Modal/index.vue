<template>
  <view v-if="visible" class="c-modal__overlay" @click.self="onOverlayClick">
    <view class="c-modal__container" :style="{ width }">
      <!-- 头部 -->
      <view class="c-modal__header">
        <text class="c-modal__title">{{ title }}</text>
        <view v-if="showClose" class="c-modal__close" @click="onClose">
          <wd-icon name="close" size="20px" color="#909399" />
        </view>
      </view>

      <!-- 内容 -->
      <view class="c-modal__body">
        <slot>
          <text>{{ content }}</text>
        </slot>
      </view>

      <!-- 底部按钮 -->
      <view v-if="showCancel || showConfirm" class="c-modal__footer">
        <view
          v-if="showCancel"
          class="c-modal__footer-btn c-modal__footer-btn--cancel"
          @click="onCancel"
        >
          {{ cancelText }}
        </view>
        <view
          v-if="showConfirm"
          class="c-modal__footer-btn c-modal__footer-btn--confirm"
          @click="onConfirm"
        >
          {{ confirmText }}
        </view>
      </view>
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
  /** 纯文本内容（插槽优先） */
  content: { type: String, default: '' },
  /** 是否显示关闭按钮 */
  showClose: { type: Boolean, default: defaultProps.showClose },
  /** 是否显示取消按钮 */
  showCancel: { type: Boolean, default: defaultProps.showCancel },
  /** 是否显示确认按钮 */
  showConfirm: { type: Boolean, default: defaultProps.showConfirm },
  /** 确认按钮文案 */
  confirmText: { type: String, default: defaultProps.confirmText },
  /** 取消按钮文案 */
  cancelText: { type: String, default: defaultProps.cancelText },
  /** 点击遮罩关闭 */
  closeOnClickOverlay: { type: Boolean, default: defaultProps.closeOnClickOverlay },
  /** 弹窗宽度 */
  width: { type: String, default: defaultProps.width },
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel', 'close'])

const close = () => emit('update:visible', false)

const onOverlayClick = () => {
  if (props.closeOnClickOverlay) {
    close()
    emit('close')
  }
}

const onClose = () => { close(); emit('close') }
const onCancel = () => { close(); emit('cancel') }
const onConfirm = () => { emit('confirm') }
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
