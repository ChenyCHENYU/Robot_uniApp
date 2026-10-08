/** 全平台应用级反馈状态、API 契约和加载所有权。 */
import {
  getCurrentInstance,
  onScopeDispose,
  ref,
  shallowReactive,
  watch,
} from 'vue'

export interface StyledModalOptions extends UniApp.ShowModalOptions {
  eyebrow?: string
  icon?: 'info' | 'success' | 'warning' | 'error'
  fields?: Array<{ label: string; value: string }>
}

interface FeedbackToast {
  id: number
  title: string
  icon: NonNullable<UniApp.ShowToastOptions['icon']>
  image: string
  mask: boolean
  position: NonNullable<UniApp.ShowToastOptions['position']>
}

interface FeedbackLoading {
  title: string
  mask: boolean
}

interface FeedbackModal {
  id: number
  options: StyledModalOptions
}

interface ModalRequest extends FeedbackModal {
  resolve: (result: UniApp.ShowModalRes) => void
}

export interface FeedbackState {
  toast: FeedbackToast | null
  loading: FeedbackLoading | null
  modal: FeedbackModal | null
}

type CompletionOptions = Pick<UniApp.ShowLoadingOptions, 'success' | 'complete'>

/** 显示类 API 在成功创建反馈后立即回调，弹窗在用户操作后回调。 */
function notifySuccess(options: CompletionOptions, name: string) {
  const result = { errMsg: `${name}:ok` }
  try {
    options.success?.(result)
  } finally {
    options.complete?.(result)
  }
  return result
}

/** 单例控制器也可独立创建，用于验证队列、计时器和 loading 所有权。 */
export function createFeedbackController() {
  const state = shallowReactive<FeedbackState>({
    toast: null,
    loading: null,
    modal: null,
  })
  let sequence = 0
  let toastTimer: ReturnType<typeof setTimeout> | undefined
  const loadingOwners = new Map<string, FeedbackLoading>()
  const modalQueue: ModalRequest[] = []

  const hideToast = (options: CompletionOptions = {}) => {
    clearTimeout(toastTimer)
    toastTimer = undefined
    state.toast = null
    return notifySuccess(options, 'hideToast')
  }

  const showToast = (options: UniApp.ShowToastOptions = {}) => {
    clearTimeout(toastTimer)
    const id = ++sequence
    state.toast = {
      id,
      title: String(options.title ?? ''),
      icon: options.icon ?? 'success',
      image: options.image ?? '',
      mask: !!options.mask,
      position: options.position ?? 'center',
    }
    const duration = options.duration ?? 1500
    const delay = Number.isFinite(duration) ? Math.max(0, duration) : 1500
    toastTimer = setTimeout(() => {
      if (state.toast?.id === id) state.toast = null
    }, delay)
    return notifySuccess(options, 'showToast')
  }

  const syncLoading = () => {
    const values = Array.from(loadingOwners.values())
    const latest = values[values.length - 1]
    state.loading = latest
      ? { ...latest, mask: values.some(item => item.mask) }
      : null
  }

  const showLoading = (
    options: UniApp.ShowLoadingOptions = {},
    owner = 'manual'
  ) => {
    loadingOwners.delete(owner)
    loadingOwners.set(owner, {
      title: String(options.title ?? '加载中'),
      mask: !!options.mask,
    })
    syncLoading()
    return notifySuccess(options, 'showLoading')
  }

  const hideLoading = (options: CompletionOptions = {}, owner = 'manual') => {
    loadingOwners.delete(owner)
    syncLoading()
    return notifySuccess(options, 'hideLoading')
  }

  const showModal = (options: StyledModalOptions) =>
    new Promise<UniApp.ShowModalRes>(resolve => {
      const request = { id: ++sequence, options: { ...options }, resolve }
      modalQueue.push(request)
      if (!state.modal) state.modal = request
    })

  const finishModal = (confirm: boolean, content = '') => {
    const request = modalQueue.shift()
    if (!request) return
    const result: UniApp.ShowModalRes & { errMsg: string } = {
      errMsg: 'showModal:ok',
      confirm,
      cancel: !confirm,
    }
    if (confirm && request.options.editable) result.content = content
    // 先释放当前队列位置，回调中打开的弹窗仍按 FIFO 排序。
    state.modal = modalQueue[0] ?? null
    request.resolve(result)
    try {
      request.options.success?.(result)
    } finally {
      request.options.complete?.(result)
    }
  }

  return {
    state,
    showToast,
    hideToast,
    showLoading,
    hideLoading,
    showModal,
    finishModal,
  }
}

export const feedback = createFeedbackController()
/** 原生端缓存页面可能同时保留，只允许当前页的 host 展示。 */
export const activeNativeFeedbackHost = ref<number | null>(null)
export function claimNativeFeedbackHost(id: number) {
  activeNativeFeedbackHost.value = id
}
export function releaseNativeFeedbackHost(id: number) {
  if (activeNativeFeedbackHost.value === id)
    activeNativeFeedbackHost.value = null
}
let installed = false

/** 保留 uni 调用约定：传回调时返回 void，不传回调时返回 Promise。 */
function withUniReturn<T>(
  options: CompletionOptions & { fail?: unknown },
  result: T
) {
  if (options.success || options.fail || options.complete) return
  return Promise.resolve(result)
}

/** 全平台安装同一反馈契约，由对应平台的 host 展示。 */
export function installUniFeedback(api: typeof uni = uni) {
  if (installed) return
  installed = true
  api.showToast = ((options: UniApp.ShowToastOptions = {}) =>
    withUniReturn(options, feedback.showToast(options))) as typeof api.showToast
  api.hideToast = ((options: CompletionOptions = {}) =>
    withUniReturn(options, feedback.hideToast(options))) as typeof api.hideToast
  api.showLoading = ((options: UniApp.ShowLoadingOptions = {}) =>
    withUniReturn(
      options,
      feedback.showLoading(options)
    )) as typeof api.showLoading
  api.hideLoading = ((options: CompletionOptions = {}) =>
    withUniReturn(
      options,
      feedback.hideLoading(options)
    )) as typeof api.hideLoading
  api.showModal = ((options: UniApp.ShowModalOptions) =>
    withUniReturn(options, feedback.showModal(options))) as typeof api.showModal
}

/** HTTP 使用独立所有者，手动 hideLoading 不会提前隐藏并发请求。 */
export function showRequestLoading() {
  const options = { title: '正在加载', mask: true }
  if (installed) feedback.showLoading(options, 'http')
  else uni.showLoading(options)
}

export function hideRequestLoading() {
  if (installed) feedback.hideLoading({}, 'http')
  else uni.hideLoading()
}

/** 页面级加载接入同一个反馈层，叠加请求时仍只展示一层。 */
export function useFeedbackLoading(
  visible: () => boolean,
  title: () => string
) {
  const owner = `component-${getCurrentInstance()?.uid}`
  watch(
    [visible, title],
    ([show, text]) => {
      if (!installed) return
      if (show) feedback.showLoading({ title: text, mask: true }, owner)
      else feedback.hideLoading({}, owner)
    },
    { immediate: true }
  )
  onScopeDispose(() => feedback.hideLoading({}, owner))
}

/** 支持信息标签与字段的统一弹窗；原生平台转为可读文本。 */
export function showStyledModal(options: StyledModalOptions) {
  if (installed) return feedback.showModal(options)
  const { eyebrow, icon: _icon, fields, ...nativeOptions } = options
  const sections = [eyebrow, options.content]
  fields?.forEach(field => sections.push(`${field.label}：${field.value}`))
  return new Promise<UniApp.ShowModalRes>((resolve, reject) => {
    uni.showModal({
      ...nativeOptions,
      content: options.editable
        ? options.content
        : sections.filter(Boolean).join('\n'),
      success: result => {
        resolve(result)
        options.success?.(result)
      },
      fail: error => {
        reject(error)
        options.fail?.(error)
      },
    })
  })
}
