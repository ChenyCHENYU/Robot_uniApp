import { defineStore, getActivePinia } from 'pinia'
import { onRequestContextChange } from '@/services/request-context'
import {
  getMessageList,
  markMessageRead,
  markAllMessageRead,
  deleteMessage as deleteMessageApi,
  getUnreadCount,
} from '@/api'

export interface MessageItem {
  id: number
  type: string
  title: string
  content: string
  time: string
  read: boolean
  icon: string
  iconBg: string
  actionLabel?: string
  actionUrl?: string
}

interface MessageState {
  messages: MessageItem[]
  loading: boolean
  page: number
  pageSize: number
  total: number
  hasMore: boolean
  activeType?: string
  requestVersion: number
  serverUnread: number | null
  unreadVersion: number
}

export const useMessageStore = defineStore('message', {
  state: (): MessageState => ({
    messages: [],
    loading: false,
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: true,
    activeType: undefined,
    requestVersion: 0,
    serverUnread: null,
    unreadVersion: 0,
  }),

  getters: {
    totalUnread: state =>
      state.serverUnread ?? state.messages.filter(m => !m.read).length,

    unreadByType: state => {
      const counts: Record<string, number> = {}
      state.messages.forEach(m => {
        if (!m.read) {
          counts[m.type] = (counts[m.type] || 0) + 1
        }
      })
      return counts
    },
  },

  actions: {
    /** 登出和切号立即清理旧消息，同时失效旧身份的在途响应。 */
    resetForAccountChange() {
      const requestVersion = this.requestVersion + 1
      const unreadVersion = this.unreadVersion + 1
      this.$reset()
      this.requestVersion = requestVersion
      this.unreadVersion = unreadVersion
    },

    /** 刷新成功后提交页码；较早的分类请求不可覆盖较新的结果。 */
    async fetchMessages(type?: string) {
      const version = ++this.requestVersion
      this.activeType = type
      this.loading = true
      try {
        const res = await getMessageList({
          page: 1,
          pageSize: this.pageSize,
          type,
        })
        if (version !== this.requestVersion) return
        const { list, total } = res as { list?: MessageItem[]; total?: number }
        this.messages = list || []
        this.page = 1
        this.total = total || 0
        this.hasMore = this.messages.length < this.total
        await this.refreshUnreadCount()
      } finally {
        if (version === this.requestVersion) this.loading = false
      }
    },

    /** 加载失败保留原页码，重试仍读取同一页。 */
    async loadMore(type?: string) {
      if (this.loading || !this.hasMore) return
      if (type !== this.activeType) return this.fetchMessages(type)
      const version = this.requestVersion
      const nextPage = this.page + 1
      this.loading = true
      try {
        const res = await getMessageList({
          page: nextPage,
          pageSize: this.pageSize,
          type,
        })
        if (version !== this.requestVersion) return
        const { list, total } = res as { list?: MessageItem[]; total?: number }
        this.page = nextPage
        this.total = total ?? this.total
        const knownIds = new Set(this.messages.map(item => item.id))
        this.messages.push(
          ...(list || []).filter(item => !knownIds.has(item.id))
        )
        this.hasMore =
          Boolean(list?.length) && this.messages.length < this.total
      } finally {
        if (version === this.requestVersion) this.loading = false
      }
    },

    /** 刷新未读数（轻量接口） */
    async refreshUnreadCount() {
      const version = ++this.unreadVersion
      try {
        const res = await getUnreadCount()
        // 服务端返回 count，本地标记同步
        if (version !== this.unreadVersion) return this.totalUnread
        const count = (res as { count?: number })?.count
        if (typeof count === 'number') this.serverUnread = Math.max(0, count)
        return this.totalUnread
      } catch {
        return this.totalUnread
      }
    },

    async markRead(id: number) {
      const msg = this.messages.find(item => item.id === id)
      if (!msg || msg.read) return
      await markMessageRead(id)
      msg.read = true
      this.unreadVersion++
      await this.refreshUnreadCount()
    },

    async markAllRead() {
      await markAllMessageRead()
      this.messages.forEach(item => {
        item.read = true
      })
      this.unreadVersion++
      this.serverUnread = 0
    },

    async deleteMessage(id: number) {
      await deleteMessageApi(id)
      this.unreadVersion++
      this.messages = this.messages.filter(item => item.id !== id)
      this.total = Math.max(0, this.total - 1)
      // 偏移分页在删除后重置，避免后续加载跳过已向前移动的记录。
      await this.fetchMessages(this.activeType)
    },

    /** 逐项使用已有删除接口；失败项保留并将错误交给页面反馈。 */
    async deleteReadMessages() {
      const ids = this.messages.filter(item => item.read).map(item => item.id)
      const results = await Promise.allSettled(
        ids.map(id => deleteMessageApi(id))
      )
      this.unreadVersion++
      const deleted = new Set(
        ids.filter((_, index) => results[index].status === 'fulfilled')
      )
      this.messages = this.messages.filter(item => !deleted.has(item.id))
      this.total = Math.max(0, this.total - deleted.size)
      if (deleted.size > 0) await this.fetchMessages(this.activeType)
      if (results.some(result => result.status === 'rejected')) {
        throw new Error('部分消息删除失败，请重试')
      }
      return deleted.size
    },
  },
})

// 订阅纯请求上下文模块，监听器只在已初始化的 Pinia 中访问 store。
onRequestContextChange(() => {
  const pinia = getActivePinia()
  if (pinia) useMessageStore(pinia).resetForAccountChange()
})
