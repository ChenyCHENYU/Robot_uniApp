import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { App } from 'vue'
import { createFeedbackController } from '@/utils/feedback'
import { createNavigationFeedback } from '@/utils/navigation-feedback'

type NavigationMethod =
  | 'navigateTo'
  | 'redirectTo'
  | 'reLaunch'
  | 'switchTab'
  | 'navigateBack'

interface SdkResult {
  errMsg: string
}

interface SdkOptions {
  url?: string
  delta?: number
  success?: (result: SdkResult) => void
  fail?: (result: SdkResult) => void
  complete?: (result: SdkResult) => void
}

interface Interceptor {
  invoke: (options: SdkOptions) => SdkOptions
  success: (result: SdkResult, options?: SdkOptions) => void
  fail: (result: SdkResult, options?: SdkOptions) => void
}

interface TestPage {
  route?: string
  $mpType?: string
  $page?: { fullPath?: string }
  $scope?: { route?: string }
  $vm?: TestPage
  $nextTick?: (callback: () => void) => unknown
}

interface PageHooks {
  onReady: (this: TestPage) => void
  onShow: (this: TestPage) => void
}

const methods: NavigationMethod[] = [
  'navigateTo',
  'redirectTo',
  'reLaunch',
  'switchTab',
  'navigateBack',
]

beforeEach(() => {
  vi.resetModules()
  vi.useFakeTimers()
  vi.setSystemTime(1000)
  vi.stubGlobal('requestAnimationFrame', undefined)
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

/** 分离 API 与页面绘制信号，让测试能够控制二者先后顺序。 */
function createController() {
  const paints: Array<() => void> = []
  const show = vi.fn()
  const hide = vi.fn()
  const afterPaint = vi.fn((callback: () => void) => paints.push(callback))
  const controller = createNavigationFeedback({ show, hide, afterPaint })
  return { controller, show, hide, afterPaint, paints }
}

/** 页面对象身份用于区分缓存实例与同一路径的新实例。 */
function createPage(route: string): TestPage {
  return { route, $nextTick: vi.fn((callback: () => void) => callback()) }
}

/** 模拟 SDK 执行拦截器后调用原回调；安装器只注册拦截器，不替换导航函数。 */
async function installFixture() {
  const [{ installNavigationFeedback }, { feedback }] = await Promise.all([
    import('@/utils/navigation-feedback'),
    import('@/utils/feedback'),
  ])
  const interceptors = new Map<NavigationMethod, Interceptor>()
  const app = { mixin: vi.fn<(hooks: PageHooks) => void>() }
  const addInterceptor = vi.fn(
    (method: NavigationMethod, interceptor: Interceptor) => {
      interceptors.set(method, interceptor)
    }
  )
  const nativeMethods = Object.fromEntries(
    methods.map(method => [
      method,
      vi.fn((options: SdkOptions) => {
        const interceptor = interceptors.get(method)!
        interceptor.invoke(options)
        const result = { errMsg: `${method}:ok` }
        interceptor.success(result, options)
        options.success?.(result)
        options.complete?.(result)
        if (options.success || options.fail || options.complete) return
        return Promise.resolve(result)
      }),
    ])
  ) as Record<
    NavigationMethod,
    (options: SdkOptions) => Promise<SdkResult> | undefined
  >
  const api = { addInterceptor, ...nativeMethods }
  let pages: TestPage[] = [createPage('pages/index/index')]
  vi.stubGlobal('getCurrentPages', () => pages)
  const setPages = (...nextPages: TestPage[]) => {
    pages = nextPages
  }
  installNavigationFeedback(app as unknown as App, api as unknown as typeof uni)
  return {
    api,
    app,
    feedback,
    hooks: app.mixin.mock.calls[0][0],
    interceptors,
    nativeMethods,
    setPages,
    installNavigationFeedback,
  }
}

describe('导航展示权与页面绘制', () => {
  it.each(['success-first', 'paint-first'])(
    '%s：API 成功与目标页绘制缺一不可',
    order => {
      const { controller, show, hide, paints } = createController()
      const id = controller.begin('/pages/profile/index')
      expect(show).toHaveBeenCalledTimes(1)
      expect(controller.isNavigating()).toBe(true)
      vi.advanceTimersByTime(300)
      if (order === 'success-first') {
        controller.success(id)
        expect(hide).not.toHaveBeenCalled()
        controller.pageReady('pages/profile/index')
        expect(hide).not.toHaveBeenCalled()
        paints[0]()
      } else {
        controller.pageReady('pages/profile/index')
        paints[0]()
        expect(hide).not.toHaveBeenCalled()
        controller.success(id)
      }
      expect(hide).toHaveBeenCalledTimes(1)
      expect(controller.isNavigating()).toBe(false)
    }
  )

  it('快速缓存切页完整显示 220ms 入场，重复 success/ready 不延长显示', () => {
    const { controller, hide, afterPaint, paints } = createController()
    const id = controller.begin('/pages/message/index?from=tab#list')
    vi.advanceTimersByTime(90)
    controller.success(id)
    controller.pageReady('pages/message/index?cached=1')
    paints[0]()
    controller.pageReady('/pages/message/index')
    controller.success(id)
    expect(afterPaint).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(129)
    expect(hide).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(hide).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(8000)
    expect(hide).toHaveBeenCalledTimes(1)
  })

  it('来源页与无关目标 ready 不推进绘制，并传递目标页 render', () => {
    const { controller, hide, afterPaint, paints } = createController()
    const render = vi.fn()
    const id = controller.begin('/pages/profile/index')
    controller.success(id)
    controller.pageReady('pages/index/index')
    controller.pageReady('pages/message/index')
    expect(afterPaint).not.toHaveBeenCalled()
    vi.advanceTimersByTime(300)
    expect(hide).not.toHaveBeenCalled()
    controller.pageReady('///pages/profile/index#details', render)
    expect(afterPaint).toHaveBeenCalledWith(expect.any(Function), render)
    paints[0]()
    expect(hide).toHaveBeenCalledTimes(1)
  })

  it('旧 success/fail/paint 不能释放后续导航，即使两次目标路径相同', () => {
    const { controller, show, hide, paints } = createController()
    const oldId = controller.begin('/pages/profile/index')
    controller.pageReady('pages/profile/index')
    const newId = controller.begin('/pages/profile/index')
    controller.success(oldId)
    controller.fail(oldId)
    paints[0]()
    vi.advanceTimersByTime(300)
    expect(hide).not.toHaveBeenCalled()
    expect(controller.isNavigating()).toBe(true)
    controller.success(newId)
    expect(hide).not.toHaveBeenCalled()
    controller.pageReady('pages/profile/index')
    paints[1]()
    expect(show).toHaveBeenCalledTimes(2)
    expect(hide).toHaveBeenCalledTimes(1)
  })

  it('旧入场结束计时器不能在新导航期间隐藏反馈', () => {
    const { controller, hide, paints } = createController()
    const oldId = controller.begin('/pages/profile/index')
    controller.success(oldId)
    controller.pageReady('pages/profile/index')
    paints[0]()
    vi.advanceTimersByTime(100)
    const newId = controller.begin('/pages/message/index')
    vi.advanceTimersByTime(120)
    expect(hide).not.toHaveBeenCalled()
    controller.success(newId)
    controller.pageReady('pages/message/index')
    paints[1]()
    vi.advanceTimersByTime(99)
    expect(hide).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(hide).toHaveBeenCalledTimes(1)
  })

  it('旧超时计时器不能提前关闭新导航的 8 秒兜底', () => {
    const { controller, hide } = createController()
    controller.begin('/pages/profile/index')
    vi.advanceTimersByTime(7900)
    controller.begin('/pages/message/index')
    vi.advanceTimersByTime(100)
    expect(hide).not.toHaveBeenCalled()
    vi.advanceTimersByTime(7899)
    expect(hide).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(hide).toHaveBeenCalledTimes(1)
  })

  it('失败立即释放展示权，之后的绘制与入场计时器无效', () => {
    const { controller, hide, paints } = createController()
    const id = controller.begin('/pages/profile/index')
    controller.success(id)
    controller.pageReady('pages/profile/index')
    paints[0]()
    vi.advanceTimersByTime(20)
    controller.fail(id)
    expect(hide).toHaveBeenCalledTimes(1)
    expect(controller.isNavigating()).toBe(false)
    paints[0]()
    controller.success(id)
    vi.advanceTimersByTime(8000)
    expect(hide).toHaveBeenCalledTimes(1)
  })

  it.each(['API', 'ready', 'paint'])('丢失 %s 时在 8 秒释放反馈', missing => {
    const { controller, hide, paints } = createController()
    const id = controller.begin('/pages/profile/index')
    if (missing !== 'API') controller.success(id)
    if (missing !== 'ready') controller.pageReady('pages/profile/index')
    if (missing === 'API') paints[0]()
    vi.advanceTimersByTime(7999)
    expect(hide).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(hide).toHaveBeenCalledTimes(1)
    expect(controller.isNavigating()).toBe(false)
  })

  it('导航结束仅释放 navigation 所有权，保留 HTTP 加载', () => {
    const feedback = createFeedbackController()
    const controller = createNavigationFeedback({
      show: () =>
        feedback.showLoading({ title: '导航', mask: true }, 'navigation'),
      hide: () => feedback.hideLoading({}, 'navigation'),
      afterPaint: callback => callback(),
    })
    feedback.showLoading({ title: '请求中', mask: true }, 'http')
    const id = controller.begin('/pages/profile/index')
    expect(feedback.state.loading?.title).toBe('导航')
    controller.success(id)
    controller.pageReady('pages/profile/index')
    vi.advanceTimersByTime(220)
    expect(feedback.state.loading).toEqual({ title: '请求中', mask: true })
    feedback.hideLoading({}, 'http')
    expect(feedback.state.loading).toBeNull()
  })
})

describe('uni 导航拦截器与页面生命周期', () => {
  it('幂等注册五种导航 API，保留原 SDK 方法', async () => {
    const { api, app, nativeMethods, installNavigationFeedback } =
      await installFixture()
    expect(api.addInterceptor.mock.calls.map(([method]) => method)).toEqual(
      methods
    )
    expect(app.mixin).toHaveBeenCalledTimes(1)
    installNavigationFeedback(
      app as unknown as App,
      api as unknown as typeof uni
    )
    expect(api.addInterceptor).toHaveBeenCalledTimes(5)
    expect(app.mixin).toHaveBeenCalledTimes(1)
    methods.forEach(method => expect(api[method]).toBe(nativeMethods[method]))
  })

  it('当前 Tab、无可返回页面和空 URL 不建立导航展示权', async () => {
    const { interceptors, feedback, setPages } = await installFixture()
    setPages(createPage('pages/profile/index'))
    const sameTab = { url: '/pages/profile/index?from=tab' }
    const noBack = { delta: 1 }
    const noTarget = {}
    expect(interceptors.get('switchTab')!.invoke(sameTab)).toBe(sameTab)
    expect(interceptors.get('navigateBack')!.invoke(noBack)).toBe(noBack)
    expect(interceptors.get('navigateTo')!.invoke(noTarget)).toBe(noTarget)
    expect(feedback.state.loading).toBeNull()
  })

  it('SDK success/complete 同步完成，原 options 与回调身份不变', async () => {
    const { api, feedback } = await installFixture()
    const success = vi.fn()
    const fail = vi.fn()
    const complete = vi.fn()
    const options = Object.freeze({
      url: '/pages/profile/index?from=home',
      success,
      fail,
      complete,
    })
    expect(api.navigateTo(options)).toBeUndefined()
    expect(success).toHaveBeenCalledOnce()
    expect(success).toHaveBeenCalledWith({ errMsg: 'navigateTo:ok' })
    expect(complete).toHaveBeenCalledOnce()
    expect(fail).not.toHaveBeenCalled()
    expect(options).toEqual({
      url: '/pages/profile/index?from=home',
      success,
      fail,
      complete,
    })
    expect(feedback.state.loading).toEqual({ title: '正在加载', mask: true })
  })

  it('SDK Promise 无须等待页面 ready 或 220ms 入场', async () => {
    const { api, feedback } = await installFixture()
    const options = Object.freeze({ url: '/pages/profile/index' })
    const pending = api.navigateTo(options)
    expect(pending).toBeInstanceOf(Promise)
    await expect(pending).resolves.toEqual({ errMsg: 'navigateTo:ok' })
    expect(Object.keys(options)).toEqual(['url'])
    expect(feedback.state.loading).not.toBeNull()
    expect(Date.now()).toBe(1000)
  })

  it('首次 onShow 等待 onReady，缓存 Tab 再次 onShow 等待自身绘制', async () => {
    const { interceptors, feedback, hooks, setPages } = await installFixture()
    const home = createPage('pages/index/index')
    const profile = createPage('pages/profile/index')
    setPages(home)
    hooks.onShow.call(home)
    hooks.onReady.call(home)
    const options = { url: '/pages/profile/index' }
    interceptors.get('switchTab')!.invoke(options)
    interceptors.get('switchTab')!.success({ errMsg: 'switchTab:ok' }, options)
    setPages(profile)
    hooks.onShow.call(profile)
    vi.advanceTimersByTime(220)
    expect(feedback.state.loading).not.toBeNull()
    expect(profile.$nextTick).not.toHaveBeenCalled()
    hooks.onReady.call(profile)
    expect(feedback.state.loading).toBeNull()

    const back = { url: '/pages/index/index' }
    interceptors.get('switchTab')!.invoke(back)
    interceptors.get('switchTab')!.success({ errMsg: 'switchTab:ok' }, back)
    setPages(home)
    hooks.onShow.call(home)
    expect(home.$nextTick).toHaveBeenCalledTimes(1)
    expect(feedback.state.loading).not.toBeNull()
    vi.advanceTimersByTime(220)
    expect(feedback.state.loading).toBeNull()
  })

  it('navigateBack 按 delta 找到栈中目标，并复用缓存 onShow', async () => {
    const { interceptors, feedback, hooks, setPages } = await installFixture()
    const home = createPage('pages/index/index')
    const middle = createPage('pages/settings/index')
    const current = createPage('pages/about/index')
    setPages(home)
    hooks.onReady.call(home)
    setPages(home, middle, current)
    const options = { delta: 2 }
    interceptors.get('navigateBack')!.invoke(options)
    interceptors
      .get('navigateBack')!
      .success({ errMsg: 'navigateBack:ok' }, options)
    setPages(home)
    hooks.onShow.call(home)
    vi.advanceTimersByTime(220)
    expect(feedback.state.loading).toBeNull()
    expect(home.$nextTick).toHaveBeenCalledTimes(1)
  })

  it('同路径旧实例的 onReady/onShow 不能完成新实例导航', async () => {
    const { api, feedback, hooks, setPages } = await installFixture()
    const oldPage = createPage('pages/profile/index')
    const newPage = createPage('pages/profile/index')
    await api.navigateTo({ url: '/pages/profile/index' })
    setPages(newPage)
    hooks.onReady.call(oldPage)
    hooks.onShow.call(oldPage)
    vi.advanceTimersByTime(300)
    expect(oldPage.$nextTick).not.toHaveBeenCalled()
    expect(feedback.state.loading).not.toBeNull()
    hooks.onReady.call(newPage)
    expect(feedback.state.loading).toBeNull()
  })

  it.each(['scope', 'vm'])(
    '微信 %s 原生页面关联使用 $scope.route 与绑定页面 $nextTick',
    async association => {
      const { api, feedback, hooks, setPages } = await installFixture()
      const scope = { route: 'pages/profile/index' }
      let paint: (() => void) | undefined
      const page: TestPage = {
        $scope: scope,
        $nextTick: vi.fn((callback: () => void) => {
          paint = callback
        }),
      }
      await api.navigateTo({ url: '/pages/profile/index' })
      setPages(association === 'scope' ? scope : { ...scope, $vm: page })
      hooks.onReady.call(page)
      expect(page.$nextTick).toHaveBeenCalledOnce()
      expect(vi.mocked(page.$nextTick!).mock.instances[0]).toBe(page)
      vi.advanceTimersByTime(300)
      expect(feedback.state.loading).not.toBeNull()
      paint!()
      expect(feedback.state.loading).toBeNull()
    }
  )

  it('H5 在目标页 nextTick 后等两帧，再释放加载', async () => {
    const { api, feedback, hooks, setPages } = await installFixture()
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => frames.push(callback))
    )
    const page = createPage('pages/profile/index')
    await api.navigateTo({ url: '/pages/profile/index' })
    setPages(page)
    hooks.onReady.call(page)
    vi.advanceTimersByTime(300)
    expect(frames).toHaveLength(1)
    expect(feedback.state.loading).not.toBeNull()
    frames.shift()!(1300)
    expect(frames).toHaveLength(1)
    expect(feedback.state.loading).not.toBeNull()
    frames.shift()!(1316)
    expect(feedback.state.loading).toBeNull()
  })

  it('浏览器历史或系统返回的页面变化通过 onShow 补齐反馈', async () => {
    const { feedback, hooks, setPages } = await installFixture()
    const home = createPage('pages/index/index')
    const profile = createPage('pages/profile/index')
    setPages(home)
    hooks.onShow.call(home)
    hooks.onReady.call(home)
    expect(feedback.state.loading).toBeNull()
    setPages(profile)
    hooks.onShow.call(profile)
    expect(feedback.state.loading).not.toBeNull()
    hooks.onReady.call(profile)
    vi.advanceTimersByTime(220)
    expect(feedback.state.loading).toBeNull()
    setPages(home)
    hooks.onShow.call(home)
    expect(feedback.state.loading).not.toBeNull()
    vi.advanceTimersByTime(220)
    expect(feedback.state.loading).toBeNull()
    hooks.onShow.call(home)
    expect(feedback.state.loading).toBeNull()
  })

  it('App 全局生命周期及空路径不会推进页面导航', async () => {
    const { api, feedback, hooks, setPages } = await installFixture()
    const appPage = { ...createPage('pages/profile/index'), $mpType: 'app' }
    await api.navigateTo({ url: '/pages/profile/index' })
    setPages(appPage)
    hooks.onShow.call(appPage)
    hooks.onReady.call(appPage)
    setPages({})
    hooks.onShow.call({})
    vi.advanceTimersByTime(300)
    expect(feedback.state.loading).not.toBeNull()
    expect(appPage.$nextTick).not.toHaveBeenCalled()
    vi.advanceTimersByTime(7700)
    expect(feedback.state.loading).toBeNull()
  })

  it('拦截器失败立即释放导航所有权，HTTP 保持显示', async () => {
    const { feedback, interceptors } = await installFixture()
    feedback.showLoading({ title: '正在请求', mask: true }, 'http')
    const options = { url: '/pages/profile/index' }
    interceptors.get('navigateTo')!.invoke(options)
    expect(feedback.state.loading?.title).toBe('正在加载')
    interceptors.get('navigateTo')!.fail({ errMsg: 'navigateTo:fail' }, options)
    expect(feedback.state.loading).toEqual({ title: '正在请求', mask: true })
    vi.advanceTimersByTime(8000)
    expect(feedback.state.loading?.title).toBe('正在请求')
  })
})
