import { defineStore } from 'pinia'

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
}

export const useMessageStore = defineStore('message', {
  state: (): MessageState => ({
    messages: [
      {
        id: 1,
        type: 'system',
        title: '系统更新',
        content: 'Robot UniApp v1.1.0 已发布，新增 15 个通用组件，优化整体性能',
        time: '刚刚',
        read: false,
        icon: 'setting',
        iconBg: 'linear-gradient(135deg, #667eea, #764ba2)',
      },
      {
        id: 2,
        type: 'notify',
        title: '组件库更新',
        content: 'C_Form、C_Upload 等组件已完成开发，可前往组件库查看',
        time: '10分钟前',
        read: false,
        icon: 'notification',
        iconBg: 'linear-gradient(135deg, #f093fb, #f5576c)',
        actionLabel: '前往查看',
        actionUrl: '/pages/demo/index',
      },
      {
        id: 3,
        type: 'system',
        title: '安全提醒',
        content: '检测到新设备登录，请确认是否为本人操作',
        time: '1小时前',
        read: false,
        icon: 'warning',
        iconBg: 'linear-gradient(135deg, #fa709a, #fee140)',
      },
      {
        id: 4,
        type: 'todo',
        title: '审批待办',
        content: '您有 1 条新的审批申请需要处理，请及时审批',
        time: '2小时前',
        read: false,
        icon: 'edit-outline',
        iconBg: 'linear-gradient(135deg, #4facfe, #00f2fe)',
        actionLabel: '去处理',
        actionUrl: '/pages/approval/index',
      },
      {
        id: 5,
        type: 'notify',
        title: '数据看板',
        content: '本周访问量同比上升 12.5%，点击查看详情',
        time: '3小时前',
        read: false,
        icon: 'chart',
        iconBg: 'linear-gradient(135deg, #43e97b, #38f9d7)',
        actionLabel: '查看详情',
        actionUrl: '/pages/dashboard/index',
      },
      {
        id: 6,
        type: 'todo',
        title: '表单提交',
        content: '有 2 份新的表单待审核，请尽快处理',
        time: '昨天',
        read: false,
        icon: 'list',
        iconBg: 'linear-gradient(135deg, #a8edea, #fed6e3)',
        actionLabel: '去审核',
        actionUrl: '/pages/crud-list/index',
      },
      {
        id: 7,
        type: 'interact',
        title: '新评论',
        content: '用户 Alex 评论了您的项目：「设计非常出色！」',
        time: '昨天',
        read: false,
        icon: 'comment',
        iconBg: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
      },
      {
        id: 8,
        type: 'notify',
        title: '欢迎使用',
        content: '欢迎体验 Robot UniApp 企业级跨平台开发框架',
        time: '2天前',
        read: true,
        icon: 'heart',
        iconBg: 'linear-gradient(135deg, #43e97b, #38f9d7)',
      },
    ],
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
    markRead(id: number) {
      const msg = this.messages.find(m => m.id === id)
      if (msg) msg.read = true
    },

    markAllRead() {
      this.messages.forEach(m => (m.read = true))
    },

    deleteMessage(id: number) {
      this.messages = this.messages.filter(m => m.id !== id)
    },

    deleteReadMessages() {
      this.messages = this.messages.filter(m => !m.read)
    },
  },
})
