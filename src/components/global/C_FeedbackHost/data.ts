import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type CSSProperties,
} from 'vue'
import { feedback } from '@/utils/feedback'
import { useTheme } from '@/composables/useTheme'

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
  let previousFocus: HTMLElement | null = null
  const getPanel = () =>
    document.querySelector<HTMLElement>('.robot-feedback__modal')
  const focusModal = async () => {
    if (!previousFocus) previousFocus = document.activeElement as HTMLElement
    await nextTick()
    const panel = getPanel()
    const input = panel?.querySelector<HTMLTextAreaElement>('textarea')
    ;(input ?? panel)?.focus()
  }

  watch(
    () => state.modal?.id,
    id => {
      if (id) void focusModal()
      else {
        if (previousFocus?.isConnected) previousFocus.focus()
        previousFocus = null
      }
    },
    { immediate: true }
  )

  const trapFocus = (event: KeyboardEvent) => {
    const buttons = Array.from(
      getPanel()?.querySelectorAll<HTMLElement>(
        '.robot-feedback__button, textarea'
      ) ?? []
    )
    if (!buttons.length) return
    const first = buttons[0]
    const last = buttons[buttons.length - 1]
    const target = event.shiftKey ? last : first
    const edge = event.shiftKey ? first : last
    if (
      document.activeElement === edge ||
      !buttons.includes(document.activeElement as HTMLElement)
    ) {
      event.preventDefault()
      target.focus()
    }
  }
  const handleKeyboard = (event: KeyboardEvent) => {
    if (!state.modal) return
    if (event.key === 'Escape') {
      event.preventDefault()
      cancel()
      return
    }
    if (
      event.key === 'Enter' &&
      !modalOptions.value.editable &&
      event.target === getPanel()
    ) {
      event.preventDefault()
      confirm()
      return
    }
    if (event.key === 'Tab') trapFocus(event)
  }
  onMounted(() => document.addEventListener('keydown', handleKeyboard))
  onUnmounted(() => document.removeEventListener('keydown', handleKeyboard))
  // #endif

  return {
    state,
    themeClass,
    modalOptions,
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
