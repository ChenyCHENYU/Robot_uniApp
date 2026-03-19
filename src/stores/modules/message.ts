import { defineStore } from 'pinia'
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
}

export const useMessageStore = defineStore('message', {
  state: (): MessageState => ({
    messages: [],
    loading: false,
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: true,
  }),

  getters: {
    totalUnread: state => state.messages.filter(m => !m.read).length,

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
    /** 拉取消息列表（首次或刷新） */
    async fetchMessages(type?: string) {
      this.loading = true
      this.page = 1
      try {
        const res = await getMessageList({
          page: 1,
          pageSize: this.pageSize,
          type,
        })
        const { list, total } = res as any
        this.messages = list || []
        this.total = total || 0
        this.hasMore = this.messages.length < this.total
      } finally {
        this.loading = false
      }
    },

    /** 加载更多 */
    async loadMore(type?: string) {
      if (this.loading || !this.hasMore) return
      this.loading = true
      this.page++
      try {
        const res = await getMessageList({
          page: this.page,
          pageSize: this.pageSize,
          type,
        })
        const { list } = res as any
        if (list?.length) {
          this.messages.push(...list)
          this.hasMore = this.messages.length < this.total
        } else {
          this.hasMore = false
        }
      } finally {
        this.loading = false
      }
    },

    /** 刷新未读数（轻量接口） */
    async refreshUnreadCount() {
      try {
        const res = await getUnreadCount()
        // 服务端返回 count，本地标记同步
        return (res as any)?.count ?? this.totalUnread
      } catch {
        return this.totalUnread
      }
    },

    async markRead(id: number) {
      const msg = this.messages.find(m => m.id === id)
      if (msg && !msg.read) {
        msg.read = true
        await markMessageRead(id).catch(() => {
          msg.read = false
        })
      }
    },

    async markAllRead() {
      const prev = this.messages.map(m => m.read)
      this.messages.forEach(m => (m.read = true))
      await markAllMessageRead().catch(() => {
        this.messages.forEach((m, i) => (m.read = prev[i]))
      })
    },

    async deleteMessage(id: number) {
      const idx = this.messages.findIndex(m => m.id === id)
      if (idx === -1) return
      const [removed] = this.messages.splice(idx, 1)
      await deleteMessageApi(id).catch(() => {
        this.messages.splice(idx, 0, removed)
      })
    },

    deleteReadMessages() {
      this.messages = this.messages.filter(m => !m.read)
    },
  },
})
