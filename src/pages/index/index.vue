<template>
  <C_Layout
    title="首页"
    :notification-count="unreadCount"
    @user-click="handleUserClick"
    @notification-click="handleNotificationClick"
    @settings-click="handleSettingsClick"
  >
    <view class="home">
      <!-- 问候区 -->
      <view class="home__hero">
        <view class="home__hero-left">
          <text class="home__hero-date">{{ todayText }}</text>
          <text class="home__hero-title"
            >{{ greeting }}，{{ displayName }}</text
          >
        </view>
        <view class="home__hero-avatar">
          <image
            :src="userStore.avatar"
            mode="aspectFill"
          />
        </view>
      </view>

      <!-- 待办提示条 -->
      <view
        v-if="todoCount > 0"
        class="home__todo-bar"
      >
        <view class="home__todo-dot"></view>
        <text class="home__todo-text"
          >今日还有 {{ todoCount }} 项待办待处理</text
        >
        <text class="home__todo-arrow">›</text>
      </view>

      <!-- 数据总览（2×2 紧凑网格，无需横滑） -->
      <view class="home__stats">
        <view
          v-if="kpiCards.length === 0"
          class="home__stat home__stat--loading"
        >
          <wd-loading
            :size="22"
            color="var(--r-text-placeholder)"
          />
        </view>
        <view
          v-for="kpi in kpiCards"
          v-else
          :key="kpi.label"
          class="home__stat"
          hover-class="home__stat--hover"
          :hover-stay-time="80"
          @click="handleStatClick(kpi)"
        >
          <text class="home__stat-value">{{ kpi.value }}</text>
          <text class="home__stat-label">{{ kpi.label }}</text>
          <view class="home__stat-trend">
            <text
              class="home__stat-trend-text"
              :class="kpi.trend >= 0 ? 'is-up' : 'is-down'"
              >{{ kpi.trend >= 0 ? '↑' : '↓' }}
              {{ Math.abs(kpi.trend) }}%</text
            >
          </view>
        </view>
      </view>

      <!-- 快捷入口 -->
      <view class="home__section">
        <text class="home__section-title">快捷操作</text>
        <view class="home__quick">
          <view
            v-for="action in quickActionsRef"
            :key="action.label"
            class="home__quick-item"
            hover-class="home__quick-item--hover"
            :hover-stay-time="80"
            @click="handleQuickAction(action)"
          >
            <view class="home__quick-icon">
              <text class="home__quick-emoji">{{ action.icon }}</text>
            </view>
            <text class="home__quick-label">{{ action.label }}</text>
          </view>
        </view>
      </view>

      <!-- 待办清单 -->
      <view class="home__section">
        <view class="home__section-head">
          <text class="home__section-title">今日待办</text>
          <text class="home__section-more">全部</text>
        </view>
        <view
          v-for="todo in todoList.slice(0, 3)"
          :key="todo.id"
          class="home__task"
          hover-class="home__task--hover"
          :hover-stay-time="80"
          @click="toggleTodo(todo)"
        >
          <view
            class="home__task-check"
            :class="{ 'is-done': todo.done }"
          >
            <text
              v-if="todo.done"
              class="home__task-check-icon"
              >✓</text
            >
          </view>
          <view class="home__task-body">
            <text
              class="home__task-title"
              :class="{ 'is-done': todo.done }"
              >{{ todo.title }}</text
            >
            <text class="home__task-time">{{ todo.time }}</text>
          </view>
        </view>
        <view
          v-if="todoList.length === 0"
          class="home__empty"
        >
          <text class="home__empty-text">暂无待办，享受当下 🎈</text>
        </view>
      </view>

      <!-- 最新动态 -->
      <view class="home__section">
        <view class="home__section-head">
          <text class="home__section-title">最新动态</text>
        </view>
        <view
          v-if="activities.length === 0"
          class="home__empty"
        >
          <text class="home__empty-text">{{
            activitiesLoading ? '加载中…' : '暂无动态'
          }}</text>
        </view>
        <view
          v-for="item in activities.slice(0, 4)"
          :key="item.id"
          class="home__feed"
        >
          <view class="home__feed-dot"></view>
          <view class="home__feed-body">
            <text class="home__feed-text">{{ item.text }}</text>
            <text class="home__feed-time">{{ item.time }}</text>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { onShow } from '@dcloudio/uni-app'
  import { useMessageStore } from '@/stores/modules/message'
  import { useUserStore } from '@/stores/modules/user'
  import { useDashboardData } from '@/composables/useDashboardData'
  import { APP_VERSION } from '@/constants'
  import { initialTodoList, quickActions, type TodoItem } from './data'

  const messageStore = useMessageStore()
  const userStore = useUserStore()
  const unreadCount = computed(() => messageStore.totalUnread)

  // 登录用户昵称（未登录兜底为访客）
  const displayName = computed(() => userStore.nickname || '访客')


  const todayText = new Date()
    .toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })

  const greeting = computed(() => {
    const h = new Date().getHours()
    if (h < 6) return '夜深了'
    if (h < 12) return '早上好'
    if (h < 14) return '中午好'
    if (h < 18) return '下午好'
    return '晚上好'
  })

  // ==================== KPI 与动态（useDashboardData 共享实现） ====================

  const { activities, activitiesLoading, kpiCards, loadStats, loadActivities } =
    useDashboardData()

  // ==================== 待办（本地演示数据，见 data.ts） ====================

  const todoList = ref<TodoItem[]>([...initialTodoList])

  const todoCount = computed(() => todoList.value.filter(i => !i.done).length)

  // ==================== 快捷入口（静态导航配置，见 data.ts） ====================

  const quickActionsRef = quickActions

  // 进入页面刷新服务端数据
  onShow(() => {
    loadStats()
    loadActivities()
  })

  const toggleTodo = (todo: TodoItem) => {
    todo.done = !todo.done
  }

  const handleStatClick = (stat: { label: string }) => {
    uni.showToast({ title: stat.label, icon: 'none' })
  }

  const handleQuickAction = (action: { label: string; url: string }) => {
    uni.navigateTo({
      url: action.url,
      fail: () => {
        uni.switchTab({
          url: action.url,
          fail: () => uni.reLaunch({ url: action.url }),
        })
      },
    })
  }

  const handleViewAllTodo = () => {
    uni.navigateTo({ url: '/pages/crud-list/index' })
  }

  const handleTodoClick = (todo: TodoItem) => {
    uni.showToast({ title: todo.title, icon: 'none' })
  }

  const handleUserClick = () => {
    uni.navigateTo({ url: '/pages/profile/index' })
  }
  // 通知/设置跳转由 C_Layout 默认处理，此处仅占位扩展
  const handleNotificationClick = () => {}
  const handleSettingsClick = () => {}
</script>

<style lang="scss" scoped>
  .home {
    padding: 24rpx 32rpx 48rpx;
    display: flex;
    flex-direction: column;
    gap: 28rpx;
  }

  /* ── 问候区 ── */
  .home__hero {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-date {
      display: block;
      font-size: 22rpx;
      color: var(--r-text-secondary);
      margin-bottom: 6rpx;
    }

    &-title {
      display: block;
      font-size: 36rpx;
      font-weight: 700;
      color: var(--r-text-primary);
      letter-spacing: 1rpx;
    }

    &-avatar {
      width: 88rpx;
      height: 88rpx;
      border-radius: 50%;
      overflow: hidden;
      border: 3rpx solid var(--r-bg-card);
      box-shadow: var(--r-shadow-sm);
      background: var(--r-bg-grey);

      image {
        width: 100%;
        height: 100%;
      }
    }
  }

  /* ── 待办提示条 ── */
  .home__todo-bar {
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding: 18rpx 24rpx;
    border-radius: var(--r-radius-md);
    background: color-mix(
      in srgb,
      var(--r-color-primary) 8%,
      var(--r-bg-card)
    );
    border: 1rpx solid color-mix(
      in srgb,
      var(--r-color-primary) 15%,
      transparent
    );

    &-dot {
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      background: var(--r-color-primary);
      flex-shrink: 0;
    }

    &-text {
      flex: 1;
      font-size: 24rpx;
      color: var(--r-text-regular);
    }

    &-arrow {
      font-size: 28rpx;
      color: var(--r-text-placeholder);
    }
  }

  /* ── 数据总览 2×2 ── */
  .home__stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20rpx;
  }

  .home__stat {
    padding: 24rpx;
    border-radius: var(--r-radius-lg);
    background: var(--r-bg-card);
    border: 1rpx solid var(--r-border-light);
    box-shadow: var(--r-shadow-sm);
    display: flex;
    flex-direction: column;
    gap: 4rpx;

    &--loading {
      grid-column: span 2;
      align-items: center;
      padding: 40rpx;
    }

    &--hover {
      transform: scale(0.98);
    }

    &-value {
      font-size: 40rpx;
      font-weight: 700;
      color: var(--r-text-primary);
      font-variant-numeric: tabular-nums;
    }

    &-label {
      font-size: 22rpx;
      color: var(--r-text-secondary);
    }

    &-trend {
      margin-top: 8rpx;

      &-text {
        font-size: 20rpx;
        font-weight: 600;

        &.is-up {
          color: var(--r-color-success);
        }

        &.is-down {
          color: var(--r-color-error);
        }
      }
    }
  }

  /* ── 区块 ── */
  .home__section {
    display: flex;
    flex-direction: column;
    gap: 16rpx;

    &-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-title {
      font-size: 28rpx;
      font-weight: 600;
      color: var(--r-text-primary);
    }

    &-more {
      font-size: 22rpx;
      color: var(--r-text-secondary);
    }
  }

  /* ── 快捷入口 ── */
  .home__quick {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16rpx;
  }

  .home__quick-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rpx;
    padding: 20rpx 8rpx;
    border-radius: var(--r-radius-md);
    background: var(--r-bg-card);
    border: 1rpx solid var(--r-border-light);

    &--hover {
      transform: scale(0.95);
      background: var(--r-bg-hover);
    }

    &-icon {
      width: 72rpx;
      height: 72rpx;
      border-radius: var(--r-radius-md);
      background: var(--r-bg-grey);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-emoji {
      font-size: 36rpx;
    }

    &-label {
      font-size: 20rpx;
      color: var(--r-text-regular);
    }
  }

  /* ── 待办 ── */
  .home__task {
    display: flex;
    align-items: center;
    gap: 20rpx;
    padding: 20rpx 24rpx;
    border-radius: var(--r-radius-md);
    background: var(--r-bg-card);
    border: 1rpx solid var(--r-border-light);

    &--hover {
      background: var(--r-bg-hover);
    }

    &-check {
      width: 36rpx;
      height: 36rpx;
      border-radius: 50%;
      border: 3rpx solid var(--r-border-color);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      &.is-done {
        background: var(--r-color-success);
        border-color: var(--r-color-success);
      }

      &-icon {
        font-size: 20rpx;
        color: #ffffff;
      }
    }

    &-body {
      flex: 1;
      min-width: 0;
    }

    &-title {
      display: block;
      font-size: 26rpx;
      color: var(--r-text-primary);

      &.is-done {
        text-decoration: line-through;
        color: var(--r-text-placeholder);
      }
    }

    &-time {
      display: block;
      font-size: 20rpx;
      color: var(--r-text-placeholder);
      margin-top: 4rpx;
    }
  }

  /* ── 动态 ── */
  .home__feed {
    display: flex;
    gap: 16rpx;

    &-dot {
      width: 10rpx;
      height: 10rpx;
      border-radius: 50%;
      background: var(--r-color-primary);
      margin-top: 12rpx;
      flex-shrink: 0;
    }

    &-body {
      flex: 1;
      min-width: 0;
      padding-bottom: 16rpx;
      border-bottom: 1rpx solid var(--r-divider);
    }

    &:last-child &-body {
      border-bottom: none;
      padding-bottom: 0;
    }

    &-text {
      display: block;
      font-size: 24rpx;
      color: var(--r-text-regular);
      line-height: 1.5;
    }

    &-time {
      display: block;
      font-size: 20rpx;
      color: var(--r-text-placeholder);
      margin-top: 4rpx;
    }
  }

  .home__empty {
    padding: 40rpx 0;
    text-align: center;

    &-text {
      font-size: 24rpx;
      color: var(--r-text-placeholder);
    }
  }
</style>
