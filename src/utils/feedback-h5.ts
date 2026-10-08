// #ifdef H5
import { createVNode, render, type App } from 'vue'
import FeedbackHost from '@/components/global/C_FeedbackHost/index.vue'
import { installUniFeedback } from './feedback'

/** 在路由树之外挂一个 host，提示跨切页保持，覆盖登录等无 Layout 页面。 */
export function installH5Feedback(app: App) {
  if (typeof document === 'undefined') return
  installUniFeedback()
  if (document.getElementById('robot-feedback-root')) return
  const container = document.createElement('div')
  container.id = 'robot-feedback-root'
  document.body.appendChild(container)
  const node = createVNode(FeedbackHost)
  node.appContext = app._context
  render(node, container)

  let pending = false
  const finishBoot = () => {
    window.dispatchEvent(new Event('robot:ready'))
    observer.disconnect()
  }
  const checkPageReady = () => {
    if (pending) return
    const page = document.querySelector('uni-page-body')
    if (!page?.querySelector('uni-view, .c-layout, .login-page')) return
    pending = true
    window.requestAnimationFrame(() => window.requestAnimationFrame(finishBoot))
  }
  const observer = new MutationObserver(checkPageReady)
  observer.observe(document.getElementById('app') ?? document.body, {
    childList: true,
    subtree: true,
  })
  checkPageReady()
}
// #endif
