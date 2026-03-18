/**
 * useModal - Promise 化弹窗调用
 *
 * @example
 * const { confirm, alert, toast } = useModal()
 * const ok = await confirm('确定删除？')
 * if (ok) { ... }
 */

interface ModalOptions {
  title?: string
  confirmText?: string
  cancelText?: string
  confirmColor?: string
  [key: string]: any
}

interface ToastOptions {
  icon?: 'success' | 'error' | 'none' | 'loading'
  duration?: number
  [key: string]: any
}

export function useModal() {
  const confirm = (content: string, options: ModalOptions = {}) => {
    return new Promise<boolean>(resolve => {
      uni.showModal({
        title: options.title || '提示',
        content,
        showCancel: true,
        confirmText: options.confirmText || '确定',
        cancelText: options.cancelText || '取消',
        confirmColor: options.confirmColor || '#007AFF',
        ...options,
        success: res => resolve(!!res.confirm),
        fail: () => resolve(false),
      })
    })
  }

  const alert = (content: string, options: ModalOptions = {}) => {
    return new Promise<void>(resolve => {
      uni.showModal({
        title: options.title || '提示',
        content,
        showCancel: false,
        confirmText: options.confirmText || '知道了',
        ...options,
        success: () => resolve(),
        fail: () => resolve(),
      })
    })
  }

  const toast = (title: string, options: ToastOptions = {}) => {
    uni.showToast({
      title,
      icon: options.icon || 'none',
      duration: options.duration || 2000,
      ...options,
    })
  }

  const success = (title: string) => toast(title, { icon: 'success' })

  const error = (title: string) => toast(title, { icon: 'error' })

  return { confirm, alert, toast, success, error }
}
