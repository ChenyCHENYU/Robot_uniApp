<!--
 * @Description: 消息中心页面
-->
<template>
  <C_Layout @settings-click="handleSettingsClick">
    <view class="message-page">
      <!-- 消息分类 -->
      <view class="message-tabs">
        <view
          v-for="tab in messageTabs"
          :key="tab.key"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <text class="tab-text">{{ tab.label }}</text>
          <view
            v-if="tab.count > 0"
            class="tab-badge"
          >
            <text class="badge-text">{{
              tab.count > 99 ? '99+' : tab.count
            }}</text>
          </view>
        </view>
      </view>

      <!-- 操作栏 -->
      <view class="action-bar">
        <view class="action-left">
          <text class="msg-count">{{ filteredMessages.length }} 条消息</text>
        </view>
        <view class="action-right-group">
          <view
            class="action-btn"
            @click="handleClearRead"
          >
            <wd-icon
              name="delete"
              size="14px"
              color="var(--r-text-secondary)"
            />
            <text class="action-text secondary">清除已读</text>
          </view>
          <view
            class="action-btn"
            @click="markAllRead"
          >
            <wd-icon
              name="check"
              size="14px"
              color="#667eea"
            />
            <text class="action-text">全部已读</text>
          </view>
        </view>
      </view>

      <!-- 消息列表 -->
      <view class="message-list">
        <view
          v-for="msg in filteredMessages"
          :key="msg.id"
          class="message-card-wrapper"
        >
          <view
            class="message-card"
            :class="{ unread: !msg.read }"
            @click="handleMessageClick(msg)"
            @longpress="handleLongPress(msg)"
          >
            <view
              class="msg-icon-wrap"
              :style="{ background: msg.iconBg }"
            >
              <wd-icon
                :name="msg.icon"
                size="20px"
                color="#fff"
              />
            </view>
            <view class="msg-body">
              <view class="msg-header">
                <text class="msg-title">{{ msg.title }}</text>
                <text class="msg-time">{{ msg.time }}</text>
              </view>
              <text class="msg-content">{{ msg.content }}</text>
              <view
                v-if="msg.actionLabel"
                class="msg-action"
              >
                <text class="msg-action-text">{{ msg.actionLabel }}</text>
                <wd-icon
                  name="arrow-right"
                  size="12px"
                  color="var(--r-color-primary)"
                />
              </view>
            </view>
            <view
              v-if="!msg.read"
              class="unread-dot"
            ></view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view
        v-if="filteredMessages.length === 0"
        class="empty-state"
      >
        <wd-icon
          name="chat"
          size="64px"
          color="#ddd"
        />
        <text class="empty-text">暂无消息</text>
        <text class="empty-desc">当前分类下没有新消息</text>
      </view>

      <!-- 消息详情弹窗 -->
      <wd-action-sheet
        v-model="showDetail"
        :actions="detailActions"
        cancel-text="取消"
        @select="handleDetailAction"
      />
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useMessageStore, type MessageItem } from '@/stores/modules/message'

  const messageStore = useMessageStore()

  const activeTab = ref('all')
  const showDetail = ref(false)
  const currentMsg = ref<MessageItem | null>(null)

  const detailActions = [
    { name: '标记为已读', value: 'read' },
    { name: '删除该消息', value: 'delete', color: '#f5576c' },
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

  const markAllRead = () => {
    messageStore.markAllRead()
    uni.showToast({ title: '已全部标记为已读', icon: 'none' })
  }

  const handleClearRead = () => {
    const readCount = messageStore.messages.filter(m => m.read).length
    if (readCount === 0) {
      uni.showToast({ title: '没有已读消息', icon: 'none' })
      return
    }
    uni.showModal({
      title: '清除已读消息',
      content: `确定删除 ${readCount} 条已读消息？`,
      success: ({ confirm }) => {
        if (confirm) {
          messageStore.deleteReadMessages()
          uni.showToast({ title: '已清除', icon: 'success' })
        }
      },
    })
  }

  const handleMessageClick = (msg: MessageItem) => {
    if (!msg.read) messageStore.markRead(msg.id)

    if (msg.actionUrl) {
      uni.navigateTo({ url: msg.actionUrl })
      return
    }

    uni.showModal({
      title: msg.title,
      content: msg.content,
      showCancel: false,
      confirmText: '知道了',
    })
  }

  const handleLongPress = (msg: MessageItem) => {
    currentMsg.value = msg
    showDetail.value = true
  }

  const handleDetailAction = ({ value }: { value: string }) => {
    if (!currentMsg.value) return
    if (value === 'read') {
      messageStore.markRead(currentMsg.value.id)
    } else if (value === 'delete') {
      messageStore.deleteMessage(currentMsg.value.id)
      uni.showToast({ title: '已删除', icon: 'success' })
    }
  }

  const handleSettingsClick = () => {
    uni.navigateTo({ url: '/pages/settings/index' })
  }
</script>

<style lang="scss" scoped>
  .message-page {
    background: var(--r-bg-page, #f5f7fa);
    padding-bottom: 32rpx;
  }

  .message-tabs {
    display: flex;
    padding: 24rpx 32rpx;
    gap: 16rpx;
    background: var(--r-bg-card);
    border-bottom: 1rpx solid var(--r-divider);
    overflow-x: auto;
    overscroll-behavior-x: contain;

    .tab-item {
      position: relative;
      padding: 16rpx 28rpx;
      border-radius: 40rpx;
      background: var(--r-bg-hover);
      border: 1rpx solid transparent;
      transition: all 0.3s ease;
      flex-shrink: 0;

      &.active {
        background: var(--r-bg-hover);
        border-color: var(--r-border-color);

        .tab-text {
          color: var(--r-color-primary);
          font-weight: 600;
        }
      }

      .tab-text {
        font-size: 26rpx;
        color: var(--r-text-regular);
      }

      .tab-badge {
        position: absolute;
        top: -8rpx;
        right: -8rpx;
        min-width: 32rpx;
        height: 32rpx;
        padding: 0 8rpx;
        background: var(--r-color-error);
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        .badge-text {
          font-size: 20rpx;
          color: var(--r-text-inverse);
          font-weight: 600;
        }
      }
    }
  }

  .action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 32rpx;

    .msg-count {
      font-size: 24rpx;
      color: var(--r-text-secondary);
    }

    .action-right-group {
      display: flex;
      gap: 16rpx;

      .action-btn {
        display: flex;
        align-items: center;
        gap: 8rpx;
        padding: 8rpx 16rpx;
        border-radius: 20rpx;
        background: var(--r-bg-hover);

        .action-text {
          font-size: 24rpx;
          color: var(--r-color-primary);
          font-weight: 500;

          &.secondary {
            color: var(--r-text-secondary);
          }
        }
      }
    }
  }

  .message-list {
    padding: 0 32rpx;

    .message-card-wrapper {
      margin-bottom: 16rpx;
    }

    .message-card {
      display: flex;
      align-items: center;
      padding: 28rpx;
      background: var(--r-bg-card);
      border-radius: 20rpx;
      border: 1rpx solid var(--r-divider);
      box-shadow: var(--r-shadow-sm);
      transition: all 0.3s ease;

      &.unread {
        background: var(--r-bg-card);
        border-color: var(--r-border-color);
      }

      &:active {
        transform: scale(0.98);
      }

      .msg-icon-wrap {
        width: 80rpx;
        height: 80rpx;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .msg-body {
        flex: 1;
        margin-left: 24rpx;
        overflow: hidden;

        .msg-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8rpx;

          .msg-title {
            font-size: 28rpx;
            font-weight: 600;
            color: var(--r-text-primary);
          }
          .msg-time {
            font-size: 22rpx;
            color: var(--r-text-secondary);
            flex-shrink: 0;
          }
        }

        .msg-content {
          font-size: 24rpx;
          color: var(--r-text-regular);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .msg-action {
          display: flex;
          align-items: center;
          gap: 4rpx;
          margin-top: 12rpx;

          .msg-action-text {
            font-size: 22rpx;
            color: var(--r-color-primary);
            font-weight: 500;
          }
        }
      }

      .unread-dot {
        width: 16rpx;
        height: 16rpx;
        background: var(--r-color-error);
        border-radius: 50%;
        flex-shrink: 0;
        margin-left: 16rpx;
      }
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 0;

    .empty-text {
      font-size: 30rpx;
      color: var(--r-text-secondary);
      margin-top: 24rpx;
    }
    .empty-desc {
      font-size: 24rpx;
      color: var(--r-text-placeholder);
      margin-top: 8rpx;
    }
  }
</style>
