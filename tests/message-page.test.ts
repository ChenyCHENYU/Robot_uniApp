import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  store: {
    messages: [],
    loading: false,
    hasMore: false,
    totalUnread: 0,
    unreadByType: {},
    fetchMessages: vi.fn(),
    loadMore: vi.fn(),
    markRead: vi.fn(),
    markAllRead: vi.fn(),
    deleteReadMessages: vi.fn(),
    deleteMessage: vi.fn(),
  },
  modal: vi.fn(),
  navigate: vi.fn(),
}))
vi.mock('@dcloudio/uni-app', () => ({ onShow: vi.fn() }))
vi.mock('@/stores/modules/message', () => ({
  useMessageStore: () => mocks.store,
}))
vi.mock('@/utils/feedback', () => ({ showStyledModal: mocks.modal }))
vi.mock('@/utils/router', () => ({
  router: { smartNavigate: mocks.navigate },
}))

import { useMessagePage } from '@/pages/message/data'
import type { MessageItem } from '@/stores/modules/message'

const message: MessageItem = {
  id: 1,
  type: 'system',
  title: '项目通知',
  content: '第一行通知\n第二行说明',
  time: '2026-10-08 12:00',
  read: false,
  icon: 'notification',
  iconBg: '',
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.store.markRead.mockResolvedValue(undefined)
  mocks.modal.mockResolvedValue({ confirm: true, cancel: false })
})

describe('消息详情入口', () => {
  it('通过统一弹窗保留消息正文和接口时间，并请求标记已读', () => {
    useMessagePage().handleMessageClick(message)
    expect(mocks.store.markRead).toHaveBeenCalledWith(message.id)
    expect(mocks.modal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: message.title,
        content: message.content,
        eyebrow: '系统消息',
        fields: [{ label: '接收时间', value: message.time }],
        showCancel: false,
        confirmText: '知道了',
      })
    )
  })

  it('含业务入口的消息先展示详情，只在用户确认时进入页面', () => {
    const linked = {
      ...message,
      actionUrl: '/pages/approval/index',
      actionLabel: '处理审批',
    }
    useMessagePage().handleMessageClick(linked)
    expect(mocks.navigate).not.toHaveBeenCalled()
    const options = mocks.modal.mock.calls[0][0]
    expect(options.showCancel).toBe(true)
    expect(options.confirmText).toBe('处理审批')
    options.success({ confirm: false, cancel: true })
    expect(mocks.navigate).not.toHaveBeenCalled()
    options.success({ confirm: true, cancel: false })
    expect(mocks.navigate).toHaveBeenCalledWith(linked.actionUrl)
  })

  it('再次打开已读消息不会重复发送标记请求', () => {
    useMessagePage().handleMessageClick({ ...message, read: true })
    expect(mocks.store.markRead).not.toHaveBeenCalled()
    expect(mocks.modal).toHaveBeenCalledOnce()
  })
})
