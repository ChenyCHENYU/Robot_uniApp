import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useMessageStore, type MessageItem } from '@/stores/modules/message'
import { router } from '@/utils/router'
import { showStyledModal } from '@/utils/feedback'
import type { ActionSheetItem } from '@/components/global/C_ActionSheet/data'

/** 页面状态、加载与交互。 */
export function useMessagePage() {
  const messageStore = useMessageStore()

  const messageIcon = (type: string) =>
    ({
      system: 'i-mdi-cog-outline',
      notify: 'i-mdi-bell-outline',
      todo: 'i-mdi-clipboard-text-outline',
      interact: 'i-mdi-comment-text-outline',
    })[type] || 'i-mdi-email-outline'
  const activeTab = ref('all')
  const showDetail = ref(false)
  const currentMsg = ref<MessageItem | null>(null)
  const loading = ref(false)
  const errorText = ref('')
  const hasMore = computed(() => messageStore.hasMore)
  const busy = computed(() => loading.value || messageStore.loading)
  const acting = ref(false)

  // 进入页面拉取最新消息（静默失败，保留本地缓存展示）
  const loadMessages = async () => {
    if (busy.value) return
    loading.value = true
    errorText.value = ''
    try {
      await messageStore.fetchMessages()
    } catch {
      errorText.value = '消息加载失败，请重试'
    } finally {
      loading.value = false
    }
  }

  onShow(() => {
    loadMessages()
  })

  const loadMore = async () => {
    if (busy.value || !hasMore.value) return
    try {
      await messageStore.loadMore()
    } catch {
      /* 请求层已提示。 */
    }
  }

  const detailActions = [
    { name: '标记为已读', value: 'read', icon: 'i-mdi-check' },
    {
      name: '删除该消息',
      value: 'delete',
      danger: true,
      icon: 'i-mdi-delete-outline',
    },
  ]

  const tabKeys = [
    { key: 'all', label: '全部' },
    { key: 'system', label: '系统' },
    { key: 'notify', label: '通知' },
    { key: 'todo', label: '待办' },
    { key: 'interact', label: '互动' },
  ]

  const messageTabs = computed(() =>
    tabKeys.map(t => ({
      ...t,
      count:
        t.key === 'all'
          ? messageStore.totalUnread
          : messageStore.unreadByType[t.key] || 0,
    }))
  )

  const filteredMessages = computed(() => {
    if (activeTab.value === 'all') return messageStore.messages
    return messageStore.messages.filter(msg => msg.type === activeTab.value)
  })

  const markAllRead = async () => {
    if (acting.value) return
    acting.value = true
    try {
      await messageStore.markAllRead()
      uni.showToast({ title: '已全部标记为已读', icon: 'none' })
    } catch {
      /* 请求失败保留可重试状态。 */
    } finally {
      acting.value = false
    }
  }

  const handleClearRead = () => {
    const count = messageStore.messages.filter(item => item.read).length
    if (!count || acting.value) {
      uni.showToast({ title: '没有可清除的已读消息', icon: 'none' })
      return
    }
    uni.showModal({
      title: '清除已读消息',
      content: `确定删除当前已载入的 ${count} 条已读消息？`,
      success: async ({ confirm }) => {
        if (!confirm || acting.value) return
        acting.value = true
        try {
          await messageStore.deleteReadMessages()
          uni.showToast({ title: '已清除', icon: 'success' })
        } catch {
          uni.showToast({ title: '部分消息清除失败，请重试', icon: 'none' })
        } finally {
          acting.value = false
        }
      },
    })
  }

  const handleMessageClick = (msg: MessageItem) => {
    if (!msg.read) void messageStore.markRead(msg.id).catch(() => {})

    void showStyledModal({
      title: msg.title,
      content: msg.content,
      eyebrow:
        {
          system: '系统消息',
          notify: '通知消息',
          todo: '待办消息',
          interact: '互动消息',
        }[msg.type] || '消息详情',
      icon: 'info',
      fields: [{ label: '接收时间', value: msg.time }],
      showCancel: Boolean(msg.actionUrl),
      cancelText: '关闭',
      confirmText: msg.actionUrl ? msg.actionLabel || '查看详情' : '知道了',
      success: ({ confirm }) => {
        if (confirm && msg.actionUrl) router.smartNavigate(msg.actionUrl)
      },
    })
  }

  const handleLongPress = (msg: MessageItem) => {
    currentMsg.value = msg
    showDetail.value = true
  }

  const handleDetailAction = async ({ item }: { item: { value: string } }) => {
    if (!currentMsg.value || acting.value) return
    acting.value = true
    try {
      if (item.value === 'read')
        await messageStore.markRead(currentMsg.value.id)
      if (item.value === 'delete') {
        await messageStore.deleteMessage(currentMsg.value.id)
        uni.showToast({ title: '已删除', icon: 'success' })
      }
    } catch {
      /* 请求层已提示。 */
    } finally {
      acting.value = false
      showDetail.value = false
    }
  }

  // 共享菜单返回原选项，业务处理仍接收既有的 { item } 事件结构。
  const onDetailSelect = (item: ActionSheetItem) => {
    if (typeof item.value === 'string')
      return handleDetailAction({ item: { value: item.value } })
  }

  const handleSettingsClick = () => {
    uni.navigateTo({ url: '/pages/settings/index' })
  }

  const refreshing = ref(false)
  const handleRefresh = async () => {
    if (refreshing.value) return
    refreshing.value = true
    try {
      await loadMessages()
    } finally {
      refreshing.value = false
    }
  }

  return {
    messageIcon,
    activeTab,
    showDetail,
    errorText,
    hasMore,
    busy,
    loadMessages,
    loadMore,
    detailActions,
    messageTabs,
    filteredMessages,
    markAllRead,
    handleClearRead,
    handleMessageClick,
    handleLongPress,
    handleDetailAction,
    onDetailSelect,
    handleSettingsClick,
    refreshing,
    handleRefresh,
  }
}
