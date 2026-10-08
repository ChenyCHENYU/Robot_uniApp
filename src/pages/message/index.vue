<!--
 * @Description: 消息中心页面
-->
<template>
  <C_Layout
    :refresher-enabled="true"
    :refresher-triggered="refreshing"
    @refresh="handleRefresh"
    @reach-bottom="loadMore"
    @settings-click="handleSettingsClick"
  >
    <view class="message-page"
      ><view class="page-heading"
        ><text class="page-eyebrow">NOTIFICATIONS</text
        ><text class="page-title">消息中心</text
        ><text class="page-description"
          >查看通知详情，集中处理未读消息</text
        ></view
      >
      <!-- 消息分类 -->
      <view
        class="message-tabs"
        role="tablist"
        aria-label="消息分类"
      >
        <view
          v-for="tab in messageTabs"
          :key="tab.key"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          role="tab"
          :aria-selected="activeTab === tab.key"
          tabindex="0"
          @click="activeTab = tab.key"
          @keydown.enter="activeTab = tab.key"
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
              color="var(--r-color-primary)"
            />
            <text class="action-text">全部已读</text>
          </view>
        </view>
      </view>

      <!-- 消息列表 -->
      <C_Skeleton
        v-if="busy && filteredMessages.length === 0"
        :rows="4"
      /><view class="message-list">
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
            <view class="msg-icon-wrap">
              <C_Icon
                :name="messageIcon(msg.type)"
                :size="22"
                color="var(--r-color-primary)"
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
        v-if="filteredMessages.length === 0 && !busy"
        class="empty-state"
      >
        <wd-icon
          name="chat"
          size="64px"
          color="var(--r-text-placeholder)"
        />
        <text class="empty-text">暂无消息</text>
        <text class="empty-desc">{{
          errorText ||
          (hasMore
            ? '当前已载入消息中没有该分类，可加载更多'
            : '当前分类下没有消息')
        }}</text
        ><button
          v-if="errorText"
          class="retry-btn"
          @click="loadMessages"
          >重新加载</button
        >
      </view>

      <button
        v-if="hasMore"
        class="load-more-btn"
        :disabled="busy"
        @click="loadMore"
        >{{ busy ? '加载中…' : '加载更多消息' }}</button
      >
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
  import { useMessagePage } from './data'

  const {
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
    handleSettingsClick,
    refreshing,
    handleRefresh,
  } = useMessagePage()
</script>

<style lang="scss" scoped src="./index.scss"></style>
