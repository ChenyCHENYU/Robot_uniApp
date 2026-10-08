import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type CSSProperties,
} from 'vue'
import { feedback } from '@/utils/feedback'
import { useTheme } from '@/composables/useTheme'
import { useDialogFocus } from '@/composables/useDialogFocus'

const SYMBOLS: Record<string, string> = {
  success: '✓',
  error: '!',
  fail: '!',
  exception: '!',
  info: 'i',
  warning: '!',
}

/** uni confirmColor 指定文字色；中性底保留自定义文字的可读性。 */
export function getModalConfirmStyle(
  color: UniApp.ShowModalOptions['confirmColor']
): CSSProperties {
  if (!color) return {}
  return {
    color: String(color),
    background: 'var(--r-bg-grey)',
    border: '1px solid var(--r-border-color)',
  }
}

/** 单实例 host 的输入、焦点和键盘行为。 */
export function useFeedbackHost() {
  const { state } = feedback
  const { themeClass } = useTheme()
  const draft = ref('')
  const modalOptions = computed(() => state.modal?.options ?? {})
  const sheetOptions = computed(() => state.sheet?.options)
  const sheetItemStyle = computed(() => ({
    color: String(sheetOptions.value?.itemColor ?? ''),
  }))
  const selectSheet = (index: number) => feedback.finishActionSheet(index)
  const modalIcon = computed(() => modalOptions.value.icon)
  const modalSymbol = computed(() => SYMBOLS[modalIcon.value ?? ''] ?? '')
  const toastError = computed(() =>
    ['error', 'fail', 'exception'].includes(state.toast?.icon ?? '')
  )
  const toastSymbol = computed(() => SYMBOLS[state.toast?.icon ?? ''] ?? '')
  const confirmStyle = computed(() =>
    getModalConfirmStyle(modalOptions.value.confirmColor)
  )
  const cancelStyle = computed(() => ({
    color: String(modalOptions.value.cancelColor ?? ''),
  }))
  const confirm = () => feedback.finishModal(true, draft.value)
  const cancel = () => {
    if (state.sheet) {
      feedback.finishActionSheet()
      return
    }
    if (modalOptions.value.showCancel !== false) feedback.finishModal(false)
  }
  watch(
    () => state.modal?.id,
    () => {
      draft.value = modalOptions.value.content ?? ''
    },
    { immediate: true }
  )

  // #ifdef H5
  const getPanel = () =>
    document.querySelector<HTMLElement>(
      state.sheet ? '.robot-feedback__sheet' : '.robot-feedback__modal'
    )
  const { onPanelKeydown } = useDialogFocus(
    () => state.modal?.id ?? state.sheet?.id,
    getPanel,
    cancel
  )
  const handleKeyboard = (event: KeyboardEvent) => {
    if (!state.modal && !state.sheet) return
    if (
      event.key === 'Enter' &&
      state.modal &&
      !modalOptions.value.editable &&
      event.target === getPanel()
    ) {
      event.preventDefault()
      confirm()
      return
    }
    onPanelKeydown?.(event)
  }
  onMounted(() => document.addEventListener('keydown', handleKeyboard))
  onUnmounted(() => document.removeEventListener('keydown', handleKeyboard))
  // #endif

  return {
    state,
    themeClass,
    modalOptions,
    sheetOptions,
    sheetItemStyle,
    selectSheet,
    modalIcon,
    modalSymbol,
    draft,
    toastSymbol,
    toastError,
    confirmStyle,
    cancelStyle,
    confirm,
    cancel,
  }
}
