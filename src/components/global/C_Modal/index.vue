<template>
  <view
    v-if="visible"
    class="c-modal__overlay"
    @touchmove.self.stop.prevent
    @wheel.self.stop.prevent
    @click.self="onOverlayClick"
  >
    <view
      ref="panelRef"
      class="c-modal__container"
      role="dialog"
      aria-modal="true"
      :aria-label="title || '提示'"
      :style="{ width }"
      tabindex="-1"
    >
      <!-- 头部 -->
      <view class="c-modal__header">
        <text class="c-modal__title">{{ title }}</text>
        <button
          v-if="showClose"
          class="c-modal__close"
          role="button"
          tabindex="0"
          aria-label="关闭弹窗"
          @click="onClose"
          @keydown.enter.stop.prevent="onClose"
          @keydown.space.stop.prevent="onClose"
        >
          <wd-icon
            name="close"
            size="20px"
            color="var(--r-text-secondary)"
          />
        </button>
      </view>

      <!-- 内容 -->
      <view class="c-modal__body">
        <slot>
          <text>{{ content }}</text>
        </slot>
      </view>

      <!-- 底部按钮 -->
      <view
        v-if="showCancel || showConfirm"
        class="c-modal__footer"
      >
        <button
          v-if="showCancel"
          class="c-modal__footer-btn c-modal__footer-btn--cancel"
          role="button"
          tabindex="0"
          @click="onCancel"
          @keydown.enter.stop.prevent="onCancel"
          @keydown.space.stop.prevent="onCancel"
        >
          {{ cancelText }}
        </button>
        <button
          v-if="showConfirm"
          class="c-modal__footer-btn c-modal__footer-btn--confirm"
          role="button"
          tabindex="0"
          @click="onConfirm"
          @keydown.enter.stop.prevent="onConfirm"
          @keydown.space.stop.prevent="onConfirm"
        >
          {{ confirmText }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { defaultProps, useModal } from './data'

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
    closeOnClickOverlay: {
      type: Boolean,
      default: defaultProps.closeOnClickOverlay,
    },
    /** 弹窗宽度 */
    width: { type: String, default: defaultProps.width },
  })

  const emit = defineEmits<{
    'update:visible': [visible: boolean]
    confirm: []
    cancel: []
    close: []
  }>()
  const { panelRef, onOverlayClick, onClose, onCancel, onConfirm } = useModal(
    props,
    emit
  )
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
