/** 全平台导航反馈：页面准备与 API 成功共同结束加载，不占用 HTTP 的展示权。 */
import { nextTick, type App } from 'vue'
import { feedback } from './feedback'

interface NavigationFeedbackDependencies {
  show: () => void
  hide: () => void
  afterPaint: (callback: () => void, render?: PageRender) => void
}

type PageRender = (callback: () => void) => unknown

interface NavigationTask {
  id: number
  path: string
  startedAt: number
  succeeded: boolean
  painted: boolean
  paintScheduled: boolean
  finishTimer?: ReturnType<typeof setTimeout>
  timeoutTimer?: ReturnType<typeof setTimeout>
}

interface NavigationOptions {
  url?: string
  delta?: number
}

interface NavigationPage {
  $mpType?: string
  $nextTick?: PageRender
  route?: string
  $page?: { fullPath?: string }
  $scope?: { route?: string }
}

// 与反馈层 0.22s 入场一致，快速缓存切页也能完整呈现；导航执行不等待动画。
const ENTER_DURATION = 220
const NAVIGATION_TIMEOUT = 8000

function pagePath(route = '') {
  const path = route.split(/[?#]/)[0]
  return path ? `/${path.replace(/^\/+/, '')}` : ''
}

/** 单次有效导航持有展示权，过期回调和页面生命周期不能结束下一次导航。 */
export function createNavigationFeedback(
  dependencies: NavigationFeedbackDependencies
) {
  let sequence = 0
  let active: NavigationTask | undefined

  const clearTimers = (task: NavigationTask) => {
    clearTimeout(task.finishTimer)
    clearTimeout(task.timeoutTimer)
  }

  const finish = (id: number) => {
    if (active?.id !== id) return
    clearTimers(active)
    active = undefined
    dependencies.hide()
  }

  const finishWhenReady = (task: NavigationTask) => {
    if (!task.succeeded || !task.painted || task.finishTimer) return
    const remaining = Math.max(
      0,
      ENTER_DURATION - (Date.now() - task.startedAt)
    )
    if (remaining === 0) finish(task.id)
    else task.finishTimer = setTimeout(() => finish(task.id), remaining)
  }

  return {
    isNavigating: () => !!active,
    begin(path: string) {
      if (active) clearTimers(active)
      const task: NavigationTask = {
        id: ++sequence,
        path: pagePath(path),
        startedAt: Date.now(),
        succeeded: false,
        painted: false,
        paintScheduled: false,
      }
      active = task
      dependencies.show()
      // 系统异常丢失生命周期时释放遮罩，不改变导航结果或业务回调。
      task.timeoutTimer = setTimeout(() => finish(task.id), NAVIGATION_TIMEOUT)
      return task.id
    },
    success(id: number) {
      if (active?.id !== id) return
      active.succeeded = true
      finishWhenReady(active)
    },
    fail: finish,
    pageReady(route: string, render?: PageRender) {
      const task = active
      if (!task || task.path !== pagePath(route) || task.paintScheduled) return
      task.paintScheduled = true
      dependencies.afterPaint(() => {
        if (active !== task) return
        task.painted = true
        finishWhenReady(task)
      }, render)
    },
  }
}

/** onReady 后等待平台视图更新，H5 额外等两帧，保证目标内容已经可见。 */
function afterPagePaint(callback: () => void, render: PageRender = nextTick) {
  // 微信端页面 $nextTick 会等待该页 setData 完成，不能以通用 Vue tick 替代。
  render(() => {
    // #ifdef H5
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => requestAnimationFrame(callback))
      return
    }
    // #endif
    callback()
  })
}

let installed = false

/** 守卫先安装；通过官方拦截器追踪调用，保留 SDK 的 Promise、回调和返回值。 */
export function installNavigationFeedback(app: App, api: typeof uni = uni) {
  if (installed) return
  installed = true
  const controller = createNavigationFeedback({
    show: () =>
      feedback.showLoading({ title: '正在加载', mask: true }, 'navigation'),
    hide: () => feedback.hideLoading({}, 'navigation'),
    afterPaint: afterPagePaint,
  })
  const calls = new WeakMap<NavigationOptions, number>()
  const readyPages = new WeakSet<NavigationPage>()
  let shownRoute = ''
  const methods = [
    'navigateTo',
    'redirectTo',
    'reLaunch',
    'switchTab',
    'navigateBack',
  ] as const

  methods.forEach(method => {
    api.addInterceptor(method, {
      invoke(options: NavigationOptions) {
        const pages = getCurrentPages()
        const current = pagePath(pages[pages.length - 1]?.route)
        const delta = Math.max(1, Math.floor(options.delta || 1))
        const target =
          method === 'navigateBack'
            ? pagePath(pages[Math.max(0, pages.length - 1 - delta)]?.route)
            : pagePath(options.url)
        if (
          !target ||
          (method === 'navigateBack' && pages.length <= 1) ||
          (method === 'switchTab' && target === current)
        )
          return options
        calls.set(options, controller.begin(target))
        return options
      },
      // 当前 uni SDK 向 success/fail 传入同一 options，类型声明未列出第二参数。
      success(_result: unknown, options?: NavigationOptions) {
        const id = options && calls.get(options)
        if (id !== undefined) controller.success(id)
      },
      fail(_result: unknown, options?: NavigationOptions) {
        const id = options && calls.get(options)
        if (id !== undefined) controller.fail(id)
      },
    })
  })

  const routeOf = (page: NavigationPage) =>
    page.route || page.$scope?.route || page.$page?.fullPath || ''
  const renderPage =
    (page: NavigationPage): PageRender =>
    callback =>
      page.$nextTick ? page.$nextTick(callback) : nextTick(callback)
  const isCurrentPage = (page: NavigationPage) => {
    const pages = getCurrentPages()
    // H5 返回 VM，微信返回持有 $vm 的原生 Page，App 也通过 $vm 关联。
    const current = pages[pages.length - 1] as
      | (NavigationPage & { $vm?: NavigationPage })
      | undefined
    return (
      !!current &&
      (current === page || current.$vm === page || current === page.$scope)
    )
  }
  app.mixin({
    onReady(this: NavigationPage) {
      if (this.$mpType === 'app') return
      readyPages.add(this)
      if (isCurrentPage(this))
        controller.pageReady(routeOf(this), renderPage(this))
    },
    onShow(this: NavigationPage) {
      const path = pagePath(routeOf(this))
      if (!path || this.$mpType === 'app' || !isCurrentPage(this)) return
      // 浏览器历史返回、系统返回/侧滑不一定调用 uni API，以实际页面显示补齐。
      if (shownRoute && shownRoute !== path && !controller.isNavigating()) {
        const id = controller.begin(path)
        controller.success(id)
      }
      shownRoute = path
      // 首次创建等 onReady；缓存页再次显示不再触发 onReady，使用 onShow。
      if (readyPages.has(this))
        controller.pageReady(routeOf(this), renderPage(this))
    },
  })
}
