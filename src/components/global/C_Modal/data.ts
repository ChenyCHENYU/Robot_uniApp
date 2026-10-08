/**
 * C_Modal - 弹窗组件数据逻辑
 */
import { useDialogFocus } from '@/composables/useDialogFocus'
import { ref } from 'vue'

export const defaultProps = {
  visible: false,
  title: '提示',
  showClose: true,
  showCancel: true,
  showConfirm: true,
  confirmText: '确定',
  cancelText: '取消',
  closeOnClickOverlay: true,
  width: '640rpx',
}

type ModalEmit = {
  (event: 'update:visible', visible: boolean): void
  (event: 'close'): void
  (event: 'cancel'): void
  (event: 'confirm'): void
}

/** 确认由调用方控制关闭，允许异步提交失败时保留弹窗内容。 */
export function useModal(
  props: { visible?: boolean; closeOnClickOverlay: boolean },
  emit: ModalEmit
) {
  const close = () => emit('update:visible', false)
  const onClose = () => {
    close()
    emit('close')
  }
  const onOverlayClick = () => {
    if (props.closeOnClickOverlay) onClose()
  }
  const onCancel = () => {
    close()
    emit('cancel')
  }
  const onConfirm = () => emit('confirm')
  const panelRef = ref<unknown>(null)
  const focus = useDialogFocus(
    () => props.visible === true,
    () => panelRef.value,
    onClose
  )
  return { panelRef, ...focus, onOverlayClick, onClose, onCancel, onConfirm }
}
