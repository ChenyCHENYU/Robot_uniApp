import { getCurrentInstance, nextTick, onBeforeUnmount, watch } from 'vue'

/** H5 的 uni-button 不是原生 button，按组件实例管理浮层焦点与键盘循环。 */
export function useDialogFocus(
  activeKey: () => boolean | number | null | undefined,
  resolvePanel: () => unknown,
  close: () => void
) {
  let onPanelKeydown: ((event: KeyboardEvent) => void) | undefined

  // #ifdef H5
  if (getCurrentInstance()) {
    let previousFocus: HTMLElement | null = null
    let listeningPanel: HTMLElement | null = null
    const detachPanel = () => {
      if (listeningPanel && onPanelKeydown)
        listeningPanel.removeEventListener('keydown', onPanelKeydown)
      listeningPanel = null
    }
    const getPanel = () => {
      const value = resolvePanel()
      const element =
        value && typeof value === 'object' && '$el' in value ? value.$el : value
      return element instanceof HTMLElement ? element : null
    }
    const isActive = () => activeKey() !== false && activeKey() != null
    const restoreFocus = () => {
      if (previousFocus?.isConnected) previousFocus.focus()
      previousFocus = null
    }
    const focusableElements = (panel: HTMLElement) =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button, [role="button"], input, textarea, select, a[href], [tabindex]'
        )
      ).filter(
        element =>
          element.tabIndex >= 0 &&
          !element.matches('[disabled], [aria-disabled="true"]') &&
          element.getClientRects().length > 0
      )

    watch(
      activeKey,
      async key => {
        detachPanel()
        if (!isActive()) {
          restoreFocus()
          return
        }
        if (!previousFocus)
          previousFocus =
            document.activeElement instanceof HTMLElement
              ? document.activeElement
              : null
        await nextTick()
        if (!isActive() || key !== activeKey()) return
        const panel = getPanel()
        if (!panel) return
        // uni-view 的包装键盘事件丢失 shiftKey，直接监听 DOM 以保留逆向 Tab。
        if (onPanelKeydown) panel.addEventListener('keydown', onPanelKeydown)
        listeningPanel = panel
        const choices = focusableElements(panel)
        const selected = choices.find(
          element => element.getAttribute('aria-pressed') === 'true'
        )
        const input = choices.find(element =>
          element.matches('input, textarea, select')
        )
        ;(selected ?? input ?? panel).focus()
      },
      { immediate: true, flush: 'post' }
    )

    const trapFocus = (event: KeyboardEvent, panel: HTMLElement) => {
      const choices = focusableElements(panel)
      const first = choices[0]
      const last = choices[choices.length - 1]
      const active = document.activeElement
      if (!first || !last) {
        event.preventDefault()
        panel.focus()
      } else if (
        !choices.includes(active as HTMLElement) ||
        (event.shiftKey ? active === first : active === last)
      ) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      }
    }
    onPanelKeydown = event => {
      if (
        !(event instanceof KeyboardEvent) ||
        event.defaultPrevented ||
        !isActive()
      )
        return
      const panel = getPanel()
      if (!panel) return
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        close()
      } else if (event.key === 'Tab') {
        event.stopPropagation()
        trapFocus(event, panel)
      }
    }
    onBeforeUnmount(() => {
      detachPanel()
      restoreFocus()
    })
  }
  // #endif

  return { onPanelKeydown }
}
