import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getModalConfirmStyle } from '@/components/global/C_FeedbackHost/data'
import {
  createFeedbackController,
  feedback,
  installUniFeedback,
  showStyledModal,
  showRequestLoading,
  hideRequestLoading,
  activeNativeFeedbackHost,
  claimNativeFeedbackHost,
  releaseNativeFeedbackHost,
} from '@/utils/feedback'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('应用反馈状态和异步结果', () => {
  it('confirmColor 是确认文字色，自定义颜色配中性底和边框', () => {
    const style = getModalConfirmStyle('#ff3b30')
    expect(style.color).toBe('#ff3b30')
    expect(style.background).not.toBe('#ff3b30')
    expect(style.background).toBe('var(--r-bg-grey)')
    expect(style.border).toContain('var(--r-border-color)')
    expect(getModalConfirmStyle('var(--r-color-primary)').color).toBe(
      'var(--r-color-primary)'
    )
  })
  it('未传 confirmColor 时沿用组件蓝底白字默认样式', () => {
    expect(getModalConfirmStyle(undefined)).toEqual({})
    expect(getModalConfirmStyle('')).toEqual({})
  })
  it('切页后旧页面晚到的 hide/unmount 不撤销新页面的原生展示权', () => {
    claimNativeFeedbackHost(101)
    claimNativeFeedbackHost(202)
    releaseNativeFeedbackHost(101)
    expect(activeNativeFeedbackHost.value).toBe(202)
    releaseNativeFeedbackHost(202)
    expect(activeNativeFeedbackHost.value).toBeNull()
  })
  it('替换 toast 后旧计时器不会提前关闭新提示', () => {
    const controller = createFeedbackController()
    controller.showToast({ title: '第一条', duration: 1000 })
    vi.advanceTimersByTime(800)
    controller.showToast({ title: '第二条', duration: 2000 })
    vi.advanceTimersByTime(200)
    expect(controller.state.toast?.title).toBe('第二条')
    vi.advanceTimersByTime(1800)
    expect(controller.state.toast).toBeNull()
  })

  it('关闭 loading 保留错误提示，手动 hideLoading 保留 HTTP 所有权', () => {
    const controller = createFeedbackController()
    controller.showLoading({ title: '请求中', mask: true }, 'http')
    controller.showLoading({ title: '正在保存' })
    controller.showToast({ title: '保存失败', icon: 'error' })
    controller.hideLoading()
    expect(controller.state.loading).toEqual({ title: '请求中', mask: true })
    controller.hideLoading({}, 'http')
    expect(controller.state.loading).toBeNull()
    expect(controller.state.toast?.title).toBe('保存失败')
  })

  it('多个页面 loading 合并为一层，任一所有者需要遮罩就保持遮罩', () => {
    const controller = createFeedbackController()
    controller.showLoading({ title: '页面', mask: true }, 'layout')
    controller.showLoading({ title: '后台', mask: false }, 'manual')
    expect(controller.state.loading).toEqual({ title: '后台', mask: true })
    controller.hideLoading({}, 'manual')
    expect(controller.state.loading?.title).toBe('页面')
    controller.hideLoading({}, 'layout')
    expect(controller.state.loading).toBeNull()
  })

  it('显示类回调和 complete 只执行一次，不等 toast 自动消失', () => {
    const controller = createFeedbackController()
    const success = vi.fn()
    const complete = vi.fn()
    controller.showToast({ title: '已保存', success, complete })
    expect(success).toHaveBeenCalledWith({ errMsg: 'showToast:ok' })
    expect(complete).toHaveBeenCalledTimes(1)
    vi.runAllTimers()
    expect(success).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledTimes(1)
  })

  it('弹窗按 FIFO 展示，回调中新弹窗不会挤掉已有等待项', async () => {
    const controller = createFeedbackController()
    const first = controller.showModal({
      title: '第一条',
      success: () => void controller.showModal({ title: '第三条' }),
    })
    const second = controller.showModal({ title: '第二条' })
    expect(controller.state.modal?.options.title).toBe('第一条')
    controller.finishModal(true)
    await expect(first).resolves.toMatchObject({ confirm: true, cancel: false })
    expect(controller.state.modal?.options.title).toBe('第二条')
    controller.finishModal(false)
    await expect(second).resolves.toMatchObject({
      confirm: false,
      cancel: true,
    })
    expect(controller.state.modal?.options.title).toBe('第三条')
    controller.finishModal(true)
    expect(controller.state.modal).toBeNull()
  })

  it('editable 确认返回输入，取消不携带未提交内容', async () => {
    const controller = createFeedbackController()
    const success = vi.fn()
    const complete = vi.fn()
    const confirm = controller.showModal({
      editable: true,
      content: '旧内容',
      success,
      complete,
    })
    controller.finishModal(true, '用户输入\n第二行')
    await expect(confirm).resolves.toMatchObject({
      confirm: true,
      content: '用户输入\n第二行',
    })
    expect(success).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledTimes(1)
    const cancel = controller.showModal({ editable: true })
    controller.finishModal(false, '未提交')
    await expect(cancel).resolves.not.toHaveProperty('content')
  })

  it('原生 styled modal 将字段转换为内容，保留原生 callback', async () => {
    const original = uni.showModal
    const success = vi.fn()
    const native = vi.fn((options: UniApp.ShowModalOptions) => {
      options.success?.({ confirm: true, cancel: false })
    })
    uni.showModal = native
    const result = showStyledModal({
      title: '详情',
      eyebrow: '通知',
      content: '正文',
      fields: [{ label: '时间', value: '今天' }],
      success,
    })
    await expect(result).resolves.toMatchObject({ confirm: true })
    expect(native.mock.calls[0][0].content).toBe('通知\n正文\n时间：今天')
    expect(success).toHaveBeenCalledTimes(1)
    uni.showModal = original
  })

  it('uni adapter 保留 callback/Promise 约定并幂等安装', async () => {
    installUniFeedback()
    const api = uni as unknown as {
      showModal(
        options: UniApp.ShowModalOptions
      ): Promise<UniApp.ShowModalRes> | undefined
      showToast(
        options: UniApp.ShowToastOptions
      ): Promise<{ errMsg: string }> | undefined
    }
    const installedModal = uni.showModal
    installUniFeedback()
    expect(uni.showModal).toBe(installedModal)
    const success = vi.fn()
    expect(api.showModal({ title: '回调弹窗', success })).toBeUndefined()
    feedback.finishModal(true)
    expect(success).toHaveBeenCalledWith(
      expect.objectContaining({ confirm: true })
    )
    const pending = api.showModal({ title: 'Promise 弹窗', editable: true })
    feedback.finishModal(true, '新标题')
    await expect(pending).resolves.toMatchObject({
      confirm: true,
      content: '新标题',
    })
    await expect(api.showToast({ title: 'Promise 提示' })).resolves.toEqual({
      errMsg: 'showToast:ok',
    })
    expect(
      api.showToast({ title: '回调提示', complete: vi.fn() })
    ).toBeUndefined()
    showRequestLoading()
    uni.hideLoading()
    expect(feedback.state.loading?.title).toBe('正在加载')
    hideRequestLoading()
    expect(feedback.state.loading).toBeNull()
    feedback.hideToast()
  })
})

describe('统一操作菜单', () => {
  it('选择返回原始 tapIndex，success/complete 各执行一次', async () => {
    const controller = createFeedbackController()
    const success = vi.fn()
    const complete = vi.fn()
    const pending = controller.showActionSheet({
      title: '外观模式',
      itemList: ['跟随系统', '浅色', '深色'],
      selectedIndex: 2,
      success,
      complete,
    })
    expect(controller.state.sheet?.options.selectedIndex).toBe(2)
    controller.finishActionSheet(1)
    await expect(pending).resolves.toEqual({
      errMsg: 'showActionSheet:ok',
      tapIndex: 1,
    })
    expect(success).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(controller.state.sheet).toBeNull()
  })

  it('取消以 fail cancel 拒绝，不能调用 success', async () => {
    const controller = createFeedbackController()
    const success = vi.fn()
    const fail = vi.fn()
    const complete = vi.fn()
    const pending = controller.showActionSheet({
      itemList: ['复制链接'],
      success,
      fail,
      complete,
    })
    const assertion = expect(pending).rejects.toEqual({
      errMsg: 'showActionSheet:fail cancel',
    })
    controller.finishActionSheet()
    await assertion
    expect(success).not.toHaveBeenCalled()
    expect(fail).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledWith({
      errMsg: 'showActionSheet:fail cancel',
    })
  })

  it('混合弹窗/菜单按一个 FIFO 展示，取消回调中的新请求不插队', async () => {
    const controller = createFeedbackController()
    const first = controller.showModal({ title: '确认' })
    const second = controller.showActionSheet({
      itemList: ['选择'],
      fail: () => void controller.showActionSheet({ itemList: ['第四条'] }),
    })
    const assertion = expect(second).rejects.toMatchObject({
      errMsg: 'showActionSheet:fail cancel',
    })
    const third = controller.showModal({ title: '第三条' })
    expect(controller.state.sheet).toBeNull()
    controller.finishActionSheet(0)
    expect(controller.state.modal?.options.title).toBe('确认')
    controller.finishModal(true)
    await first
    expect(controller.state.modal).toBeNull()
    expect(controller.state.sheet?.options.itemList).toEqual(['选择'])
    controller.finishActionSheet()
    await assertion
    expect(controller.state.modal?.options.title).toBe('第三条')
    controller.finishModal(false)
    await third
    expect(controller.state.sheet?.options.itemList).toEqual(['第四条'])
    controller.finishActionSheet(0)
    expect(controller.state.sheet).toBeNull()
  })

  it('越界选择不关闭菜单，入队后不受调用方修改数组影响', async () => {
    const controller = createFeedbackController()
    const items = ['拍照', '相册']
    const pending = controller.showActionSheet({ itemList: items })
    items.pop()
    controller.finishActionSheet(-1)
    controller.finishActionSheet(2)
    controller.finishActionSheet(0.5)
    expect(controller.state.sheet?.options.itemList).toEqual(['拍照', '相册'])
    controller.finishActionSheet(1)
    await expect(pending).resolves.toMatchObject({ tapIndex: 1 })
  })

  it('空菜单立即 fail/complete，不阻塞后续弹窗', async () => {
    const controller = createFeedbackController()
    const fail = vi.fn()
    const complete = vi.fn()
    await expect(
      controller.showActionSheet({ itemList: [], fail, complete })
    ).rejects.toMatchObject({ errMsg: expect.stringContaining('itemList') })
    expect(fail).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledTimes(1)
    const pending = controller.showModal({ title: '下一条' })
    controller.finishModal(true)
    await expect(pending).resolves.toMatchObject({ confirm: true })
  })

  it('uni 菜单保留回调/Promise 约定，回调模式取消不产生未处理拒绝', async () => {
    installUniFeedback()
    const api = uni as unknown as {
      showActionSheet(
        options: UniApp.ShowActionSheetOptions
      ): Promise<UniApp.ShowActionSheetRes> | undefined
    }
    const fail = vi.fn()
    const complete = vi.fn()
    expect(
      api.showActionSheet({ itemList: ['复制链接'], fail, complete })
    ).toBeUndefined()
    feedback.finishActionSheet()
    await Promise.resolve()
    expect(fail).toHaveBeenCalledWith({ errMsg: 'showActionSheet:fail cancel' })
    expect(complete).toHaveBeenCalledTimes(1)
    const pending = api.showActionSheet({ itemList: ['第一项', '第二项'] })
    feedback.finishActionSheet(1)
    await expect(pending).resolves.toMatchObject({ tapIndex: 1 })
    const cancelled = api.showActionSheet({ itemList: ['选择'] })
    const assertion = expect(cancelled).rejects.toMatchObject({
      errMsg: 'showActionSheet:fail cancel',
    })
    feedback.finishActionSheet()
    await assertion
  })
})
