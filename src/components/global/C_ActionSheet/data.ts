/**
 * C_ActionSheet - 底部操作面板组件数据逻辑
 */
import { normalizeIconName } from '@/components/global/C_Icon/data'
import { useDialogFocus } from '@/composables/useDialogFocus'
import { ref } from 'vue'

export const defaultProps = {
  visible: false,
  title: '',
  cancelText: '取消',
  showCancel: true,
  closeOnClickOverlay: true,
  selectedIndex: -1,
}

export interface ActionSheetItem {
  name?: string
  text?: string
  value?: string | number
  icon?: string
  description?: string
  danger?: boolean
  disabled?: boolean
}

interface ActionSheetProps {
  visible?: boolean
  closeOnClickOverlay: boolean
}

type ActionSheetEmit = {
  (event: 'update:visible', visible: boolean): void
  (event: 'select', item: ActionSheetItem, index: number): void
  (event: 'cancel'): void
}

/** 保留选项对象与序号的既有事件契约，禁用项和取消均不触发选择。 */
export function useActionSheet(props: ActionSheetProps, emit: ActionSheetEmit) {
  const actionIconType = (name: string) =>
    normalizeIconName(name).startsWith('i-') ? 'unocss' : 'wot'
  const close = () => emit('update:visible', false)
  const onCancel = () => {
    emit('cancel')
    close()
  }
  const onOverlayClick = () => {
    if (props.closeOnClickOverlay) onCancel()
  }
  const onSelect = (item: ActionSheetItem, index: number) => {
    if (item.disabled) return
    emit('select', item, index)
    close()
  }
  const panelRef = ref<unknown>(null)
  const focus = useDialogFocus(
    () => props.visible === true,
    () => panelRef.value,
    onCancel
  )
  return {
    panelRef,
    ...focus,
    actionIconType,
    onOverlayClick,
    onSelect,
    onCancel,
  }
}
