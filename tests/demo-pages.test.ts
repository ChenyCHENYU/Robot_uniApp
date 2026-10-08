import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDemo as useList } from '@/pages/demo/16-list/data'
import { useDemo as useTabs } from '@/pages/demo/07-tabbar/data'
import { useDemo as useSwipe } from '@/pages/demo/21-swipe-action/data'
import { useDemo as useSignature } from '@/pages/demo/23-signature/data'
import { useDemo as useForm } from '@/pages/demo/10-form/data'
import { useDemo as useNotify } from '@/pages/demo/30-notify/data'
import { useDemo as useCalendar } from '@/pages/demo/25-calendar/data'
import { useDemo as useCountdown } from '@/pages/demo/33-count-down/data'

const { cleanupHandlers } = vi.hoisted(() => ({
  cleanupHandlers: [] as (() => void)[],
}))
vi.mock('vue', async importOriginal => ({
  ...(await importOriginal<typeof import('vue')>()),
  onBeforeUnmount: (fn: () => void) => cleanupHandlers.push(fn),
  onMounted: () => {},
}))

beforeEach(() => {
  vi.useFakeTimers()
  cleanupHandlers.length = 0
})
afterEach(() => {
  cleanupHandlers.forEach(fn => fn())
  vi.useRealTimers()
})

describe('演示页的交互回归', () => {
  it('列表连续触底只加载一页，重置取消旧任务', () => {
    const page = useList()
    page.onLoad()
    page.onLoad()
    vi.advanceTimersByTime(400)
    page.resetList()
    vi.advanceTimersByTime(800)
    expect(page.list.value).toHaveLength(10)
    expect(page.list.value[0]).toBe(1)
    page.onLoad()
    vi.advanceTimersByTime(800)
    page.onLoad()
    vi.advanceTimersByTime(800)
    page.onLoad()
    vi.advanceTimersByTime(800)
    expect(page.list.value).toHaveLength(30)
    expect(page.finished.value).toBe(true)
  })
  it('退出列表页面会取消尚未完成的任务', () => {
    const page = useList()
    page.onLoad()
    cleanupHandlers.forEach(fn => fn())
    vi.advanceTimersByTime(800)
    expect(page.list.value).toHaveLength(0)
  })
  it('标签选择与角标选择相互独立，圆点不需要数字', () => {
    const page = useTabs()
    page.selectTab('我的')
    page.selectBadgeTab('消息')
    expect(page.selectedTab.value).toBe('我的')
    expect(page.selectedBadgeTab.value).toBe('消息')
    expect(page.badgeTabs.some(tab => tab.dot && tab.badge === 0)).toBe(true)
  })
  it('滑动删除、置顶、恢复会实际更新列表', () => {
    const page = useSwipe()
    page.onListAction({ text: '置顶' }, '王五')
    expect(page.listItems.value[0].name).toBe('王五')
    page.onListAction({ text: '删除' }, '李四')
    expect(page.listItems.value.map(item => item.name)).not.toContain('李四')
    page.resetItems()
    expect(page.listItems.value.map(item => item.name)).toEqual([
      '张三',
      '李四',
      '王五',
    ])
  })
  it('签名导出由确认事件更新结果，清除后取消结果', () => {
    const page = useSignature()
    const confirm = vi.fn()
    const clear = vi.fn()
    page.signatureRef.value = { confirm, clear }
    page.handleConfirm()
    expect(confirm).toHaveBeenCalledOnce()
    expect(page.signResult.value).toBe('')
    page.onSignatureConfirm('/tmp/signature.png')
    expect(page.signResult.value).toBe('/tmp/signature.png')
    page.handleClear()
    expect(clear).toHaveBeenCalledOnce()
    expect(page.signResult.value).toBe('')
  })
  it('表单校验失败保留错误，成功与重置各有明确结果', async () => {
    const page = useForm()
    const validate = vi.fn().mockReturnValue(false)
    const resetValidation = vi.fn()
    page.formRef.value = {
      validate,
      resetValidation,
      errors: { username: '请输入用户名' },
    }
    await page.onSubmit()
    expect(page.validateResult.value).toBe('校验失败，请检查必填项')
    expect(page.formErrors.value.username).toBe('请输入用户名')
    validate.mockReturnValue(true)
    await page.onSubmit()
    expect(page.validateResult.value).toBe('校验通过')
    page.formData.value.username = 'test'
    page.onReset()
    expect(page.formData.value.username).toBe('')
    expect(resetValidation).toHaveBeenCalledOnce()
  })
  it('连续通知重新创建展示周期，时长操作会正确切换', () => {
    const page = useNotify()
    page.showNotify('success')
    const first = page.notifyKey.value
    page.showNotify('success')
    expect(page.notifyKey.value).toBe(first + 1)
    page.showLong()
    expect(page.notifyDuration.value).toBe(5000)
    page.showShort()
    expect(page.notifyDuration.value).toBe(1000)
  })
  it('不完整日期区间不会成为确认结果，完整结果可回填', () => {
    const page = useCalendar()
    page.onRangeConfirm(['2026-10-08'])
    expect(page.rangeText.value).toBe('')
    expect(page.selectedRange.value).toEqual([])
    page.onRangeConfirm(['2026-10-08', '2026-10-10'])
    expect(page.selectedRange.value).toEqual(['2026-10-08', '2026-10-10'])
  })
  it('手动计时开始、暂停、结束和重置同步当前状态', () => {
    const page = useCountdown()
    page.countdownRef.value = { start: vi.fn(), pause: vi.fn(), reset: vi.fn() }
    page.handleStart()
    expect(page.countdownState.value).toBe('运行中')
    page.handlePause()
    expect(page.countdownState.value).toBe('已暂停')
    page.handleFinish()
    expect(page.countdownState.value).toBe('已结束')
    page.handleReset()
    expect(page.countdownState.value).toBe('待开始')
  })
})
