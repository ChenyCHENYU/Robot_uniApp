import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/api', () => ({
  getMessageList: vi.fn(),
  markMessageRead: vi.fn(),
  markAllMessageRead: vi.fn(),
  deleteMessage: vi.fn(),
  getUnreadCount: vi.fn(),
}))
import {
  getMessageList,
  markMessageRead,
  markAllMessageRead,
  deleteMessage,
  getUnreadCount,
} from '@/api'
import { useMessageStore, type MessageItem } from '@/stores/modules/message'
const message = (id: number, read = false): MessageItem => ({
  id,
  read,
  type: 'system',
  title: '消息',
  content: '',
  time: '',
  icon: '',
  iconBg: '',
})

import { advanceRequestContext } from '@/services/request-context'

describe('消息列表的失败恢复与服务端同步', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
    vi.mocked(getUnreadCount).mockResolvedValue({ count: 7 })
  })
  it('下一页失败后重试同一页，不跳页', async () => {
    vi.mocked(getMessageList).mockResolvedValueOnce({
      list: [message(1)],
      total: 3,
    })
    const store = useMessageStore()
    await store.fetchMessages()
    vi.mocked(getMessageList).mockRejectedValueOnce(new Error('network'))
    await expect(store.loadMore()).rejects.toThrow('network')
    expect(store.page).toBe(1)
    expect(store.loading).toBe(false)
    vi.mocked(getMessageList).mockResolvedValueOnce({
      list: [message(2)],
      total: 3,
    })
    await store.loadMore()
    expect(
      vi
        .mocked(getMessageList)
        .mock.calls.slice(1)
        .map(([params]) => params?.page)
    ).toEqual([2, 2])
    expect(store.messages.map(item => item.id)).toEqual([1, 2])
  })
  it('更早的分类响应不覆盖当前分类', async () => {
    let resolveOld!: (value: unknown) => void
    vi.mocked(getMessageList).mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolveOld = resolve
        })
    )
    const store = useMessageStore()
    const oldRequest = store.fetchMessages('system')
    vi.mocked(getMessageList).mockResolvedValueOnce({
      list: [message(2)],
      total: 1,
    })
    await store.fetchMessages('todo')
    resolveOld({ list: [message(1)], total: 1 })
    await oldRequest
    expect(store.activeType).toBe('todo')
    expect(store.messages.map(item => item.id)).toEqual([2])
    expect(store.totalUnread).toBe(7)
  })
  it('标记已读失败保留原状态并向页面抛错', async () => {
    const store = useMessageStore()
    store.messages = [message(1)]
    vi.mocked(markMessageRead).mockRejectedValueOnce(new Error('network'))
    await expect(store.markRead(1)).rejects.toThrow('network')
    expect(store.messages[0].read).toBe(false)
  })
  it('批量删除仅移除服务端成功项，刷新偏移分页并报告部分失败', async () => {
    const store = useMessageStore()
    store.messages = [message(1, true), message(2, true), message(3)]
    store.total = 3
    vi.mocked(deleteMessage)
      .mockResolvedValueOnce(null)
      .mockRejectedValueOnce(new Error('network'))
    vi.mocked(getMessageList).mockResolvedValueOnce({
      list: [message(2, true), message(3)],
      total: 2,
    })
    await expect(store.deleteReadMessages()).rejects.toThrow('部分消息删除失败')
    expect(vi.mocked(deleteMessage).mock.calls.map(([id]) => id)).toEqual([
      1, 2,
    ])
    expect(store.messages.map(item => item.id)).toEqual([2, 3])
    expect(store.page).toBe(1)
    expect(store.total).toBe(2)
  })
  it('标记全部已读后，较早的未读计数响应不能恢复旧角标', async () => {
    let resolveCount!: (value: unknown) => void
    vi.mocked(getUnreadCount).mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolveCount = resolve
        })
    )
    vi.mocked(markAllMessageRead).mockResolvedValueOnce(null)
    const store = useMessageStore()
    const staleCount = store.refreshUnreadCount()
    await store.markAllRead()
    resolveCount({ count: 7 })
    await staleCount
    expect(store.totalUnread).toBe(0)
  })
  it('身份切换清空消息，并拒绝旧身份的在途列表', async () => {
    let resolveList!: (value: unknown) => void
    vi.mocked(getMessageList).mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolveList = resolve
        })
    )
    const store = useMessageStore()
    store.messages = [message(1)]
    store.serverUnread = 7
    const staleList = store.fetchMessages()
    advanceRequestContext()
    expect(store.messages).toEqual([])
    expect(store.totalUnread).toBe(0)
    resolveList({ list: [message(2)], total: 1 })
    await staleList
    expect(store.messages).toEqual([])
  })
})
