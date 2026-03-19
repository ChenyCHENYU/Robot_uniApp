<template>
  <C_Layout
    :notification-count="notificationCount"
    @user-click="handleUserClick"
    @notification-click="handleNotificationClick"
    @settings-click="handleSettingsClick"
  >
    <view class="dashboard">
      <!-- 问候语（轻量文字，无色块） -->
      <view class="greeting">
        <text class="greeting-text"
          >你好，<text class="greeting-name">ChenY</text> 👋</text
        >
        <text class="greeting-sub">今日有 {{ todoCount }} 项待办</text>
      </view>

      <!-- 数据概览 -->
      <view class="stats-grid">
        <view
          v-for="stat in statsCards"
          :key="stat.label"
          class="glass-stat"
          @click="handleStatClick(stat)"
        >
          <view class="stat-top">
            <view
              class="stat-icon"
              :style="{ background: stat.bg }"
            >
              <text class="stat-emoji">{{ stat.icon }}</text>
            </view>
            <view
              v-if="stat.trend"
              class="stat-badge"
              :class="stat.trend > 0 ? 'is-up' : 'is-down'"
            >
              <text class="badge-val"
                >{{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%</text
              >
            </view>
          </view>
          <text class="stat-value">{{ stat.value }}</text>
          <text class="stat-label">{{ stat.label }}</text>
        </view>
      </view>

      <!-- 快捷操作 -->
      <view class="section">
        <text class="section-heading">快捷操作</text>
        <view class="actions-grid">
          <view
            v-for="action in quickActions"
            :key="action.label"
            class="glass-action"
            @click="handleQuickAction(action)"
          >
            <view
              class="action-icon"
              :style="{ background: action.bg }"
            >
              <text class="action-emoji">{{ action.icon }}</text>
            </view>
            <text class="action-label">{{ action.label }}</text>
          </view>
        </view>
      </view>

      <!-- 待办事项 -->
      <view class="section">
        <view class="section-row">
          <text class="section-heading">待办事项</text>
          <text
            class="section-link"
            @click="handleViewAllTodo"
            >全部</text
          >
        </view>
        <view class="glass-card">
          <view
            v-for="todo in todoList"
            :key="todo.id"
            class="todo-row"
            @click="handleTodoClick(todo)"
          >
            <view
              class="todo-check"
              :class="{ done: todo.done }"
              @click.stop="toggleTodo(todo)"
            >
              <wd-icon
                v-if="todo.done"
                name="check"
                size="12px"
                color="#fff"
              />
            </view>
            <view class="todo-body">
              <text
                class="todo-title"
                :class="{ done: todo.done }"
                >{{ todo.title }}</text
              >
              <text class="todo-time">{{ todo.time }}</text>
            </view>
            <view
              class="todo-dot"
              :class="todo.priority"
            />
          </view>
        </view>
      </view>

      <!-- 最近动态 -->
      <view class="section">
        <text class="section-heading">最近动态</text>
        <view class="glass-card">
          <view
            v-for="item in activities"
            :key="item.id"
            class="activity-row"
          >
            <view
              class="activity-dot"
              :style="{ background: item.color }"
            />
            <view class="activity-body">
              <text class="activity-text">{{ item.text }}</text>
              <text class="activity-time">{{ item.time }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 版本信息 -->
      <view class="footer">
        <text class="footer-text">Robot UniApp v{{ version }}</text>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'

  const version = ref('1.0.0')
  const notificationCount = ref(3)

  const statsCards = ref([
    {
      label: '活跃用户',
      value: '12,486',
      icon: '👥',
      trend: 12.5,
      bg: 'linear-gradient(135deg, #667eea, #764ba2)',
    },
    {
      label: '今日访问',
      value: '3,829',
      icon: '📊',
      trend: 8.3,
      bg: 'linear-gradient(135deg, #f093fb, #f5576c)',
    },
    {
      label: '待处理',
      value: '26',
      icon: '📋',
      trend: -4.2,
      bg: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    },
    {
      label: '完成率',
      value: '94.6%',
      icon: '🎯',
      trend: 2.1,
      bg: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    },
  ])

  interface TodoItem {
    id: number
    title: string
    time: string
    done: boolean
    priority: string
  }

  const todoList = ref<TodoItem[]>([
    {
      id: 1,
      title: '完成首页Dashboard布局',
      time: '今天 10:00',
      done: true,
      priority: 'high',
    },
    {
      id: 2,
      title: 'Q1产品规划评审',
      time: '今天 14:00',
      done: false,
      priority: 'high',
    },
    {
      id: 3,
      title: '组件库文档更新',
      time: '今天 16:00',
      done: false,
      priority: 'medium',
    },
    {
      id: 4,
      title: '优化H5响应式布局',
      time: '明天 09:00',
      done: false,
      priority: 'low',
    },
  ])

  const todoCount = computed(() => todoList.value.filter(i => !i.done).length)

  const quickActions = ref([
    {
      label: '扫一扫',
      icon: '📷',
      bg: 'linear-gradient(135deg, #667eea, #764ba2)',
      url: '/pages/scan/index',
    },
    {
      label: '审批中心',
      icon: '✅',
      bg: 'linear-gradient(135deg, #43e97b, #38f9d7)',
      url: '/pages/approval/index',
    },
    {
      label: '数据看板',
      icon: '📊',
      bg: 'linear-gradient(135deg, #f093fb, #f5576c)',
      url: '/pages/dashboard/index',
    },
    {
      label: '表单模板',
      icon: '📝',
      bg: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      url: '/pages/form-template/index',
    },
    {
      label: 'CRUD列表',
      icon: '📋',
      bg: 'linear-gradient(135deg, #fa709a, #fee140)',
      url: '/pages/crud-list/index',
    },
    {
      label: '搜索',
      icon: '🔍',
      bg: 'linear-gradient(135deg, #a8edea, #fed6e3)',
      url: '/pages/search-result/index',
    },
    {
      label: '详情展示',
      icon: '📖',
      bg: 'linear-gradient(135deg, #fccb90, #d57eeb)',
      url: '/pages/detail/index',
    },
    {
      label: '关于',
      icon: 'ℹ️',
      bg: 'linear-gradient(135deg, #96e6a1, #d4fc79)',
      url: '/pages/about/index',
    },
  ])

  const activities = ref([
    {
      id: 1,
      text: '系统已升级至 v1.0.0 版本',
      time: '10分钟前',
      color: '#667eea',
    },
    { id: 2, text: '新增11个业务模板页面', time: '30分钟前', color: '#43e97b' },
    { id: 3, text: 'H5响应式适配优化完成', time: '1小时前', color: '#4facfe' },
    { id: 4, text: '虚拟滚动组件已上线', time: '2小时前', color: '#f093fb' },
    { id: 5, text: '骨架屏预渲染方案集成', time: '3小时前', color: '#fa709a' },
  ])

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

  const handleUserClick = () => {}
  const handleNotificationClick = () => {
    uni.switchTab({ url: '/pages/message/index' })
  }
  const handleSettingsClick = () => {
    uni.navigateTo({ url: '/pages/settings/index' })
  }
</script>

<style lang="scss" scoped>
  /* ── 玻璃拟态基础 mixin（通过 placeholder 复用） ── */
  %glass-surface {
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1rpx solid rgba(255, 255, 255, 0.8);
    box-shadow:
      0 2rpx 12rpx rgba(0, 0, 0, 0.03),
      0 8rpx 24rpx rgba(0, 0, 0, 0.05),
      inset 0 1rpx 0 rgba(255, 255, 255, 0.9);
  }

  .dashboard {
    min-height: 100vh;
    padding: 24rpx 24rpx 200rpx;
    background:
      linear-gradient(180deg, rgba(102, 126, 234, 0.06) 0%, transparent 40%),
      var(--r-bg-page);
  }

  /* ── 问候 ── */
  .greeting {
    padding: 16rpx 8rpx 28rpx;

    .greeting-text {
      display: block;
      font-size: 34rpx;
      color: var(--r-text-primary);
      font-weight: 500;
    }

    .greeting-name {
      font-weight: 700;
    }

    .greeting-sub {
      display: block;
      font-size: 24rpx;
      color: var(--r-text-secondary);
      margin-top: 4rpx;
    }
  }

  /* ── 数据概览 ── */
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16rpx;
    margin-bottom: 32rpx;
  }

  .glass-stat {
    @extend %glass-surface;
    border-radius: 24rpx;
    padding: 24rpx;
    transition: transform 0.2s ease;

    &:active {
      transform: scale(0.97);
    }

    .stat-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20rpx;
    }

    .stat-icon {
      width: 60rpx;
      height: 60rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    }

    .stat-emoji {
      font-size: 26rpx;
    }

    .stat-badge {
      padding: 4rpx 14rpx;
      border-radius: 12rpx;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);

      &.is-up {
        background: rgba(67, 233, 123, 0.14);
      }
      &.is-down {
        background: rgba(245, 108, 108, 0.14);
      }

      .badge-val {
        font-size: 20rpx;
        font-weight: 600;
      }

      &.is-up .badge-val {
        color: #2bb85a;
      }
      &.is-down .badge-val {
        color: #e84545;
      }
    }

    .stat-value {
      display: block;
      font-size: 40rpx;
      font-weight: 700;
      color: var(--r-text-primary);
      letter-spacing: -0.5px;
    }

    .stat-label {
      display: block;
      font-size: 22rpx;
      color: var(--r-text-secondary);
      margin-top: 4rpx;
    }
  }

  /* ── 区块公共 ── */
  .section {
    margin-bottom: 32rpx;
  }

  .section-heading {
    display: block;
    font-size: 30rpx;
    font-weight: 600;
    color: var(--r-text-primary);
    margin-bottom: 20rpx;
    padding: 0 4rpx;
  }

  .section-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
    padding: 0 4rpx;

    .section-heading {
      margin-bottom: 0;
    }
  }

  .section-link {
    font-size: 24rpx;
    color: #667eea;
    font-weight: 500;
  }

  /* ── 快捷操作 ── */
  .actions-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16rpx;
  }

  .glass-action {
    @extend %glass-surface;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
    padding: 24rpx 0 20rpx;
    transition: transform 0.2s ease;

    &:active {
      transform: scale(0.93);
    }

    .action-icon {
      width: 72rpx;
      height: 72rpx;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
    }

    .action-emoji {
      font-size: 28rpx;
    }

    .action-label {
      font-size: 22rpx;
      color: var(--r-text-regular);
      font-weight: 500;
    }
  }

  /* ── 玻璃卡片容器 ── */
  .glass-card {
    @extend %glass-surface;
    border-radius: 24rpx;
    overflow: hidden;
  }

  /* ── 待办 ── */
  .todo-row {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding: 24rpx 28rpx;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);

    &:last-child {
      border-bottom: none;
    }

    .todo-check {
      width: 36rpx;
      height: 36rpx;
      border-radius: 50%;
      border: 2rpx solid rgba(0, 0, 0, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.25s ease;

      &.done {
        background: linear-gradient(135deg, #43e97b, #38f9d7);
        border-color: transparent;
        box-shadow: 0 2rpx 8rpx rgba(67, 233, 123, 0.3);
      }
    }

    .todo-body {
      flex: 1;

      .todo-title {
        display: block;
        font-size: 28rpx;
        color: var(--r-text-primary);
        transition: all 0.2s ease;

        &.done {
          color: var(--r-text-placeholder);
          text-decoration: line-through;
        }
      }

      .todo-time {
        font-size: 22rpx;
        color: var(--r-text-placeholder);
      }
    }

    .todo-dot {
      width: 10rpx;
      height: 10rpx;
      border-radius: 50%;
      flex-shrink: 0;

      &.high {
        background: #f56c6c;
        box-shadow: 0 0 6rpx rgba(245, 108, 108, 0.5);
      }
      &.medium {
        background: #faad14;
        box-shadow: 0 0 6rpx rgba(250, 173, 20, 0.4);
      }
      &.low {
        background: #43e97b;
        box-shadow: 0 0 6rpx rgba(67, 233, 123, 0.4);
      }
    }
  }

  /* ── 动态 ── */
  .activity-row {
    display: flex;
    align-items: flex-start;
    gap: 16rpx;
    padding: 22rpx 28rpx;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);

    &:last-child {
      border-bottom: none;
    }

    .activity-dot {
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      margin-top: 10rpx;
      flex-shrink: 0;
      box-shadow: 0 0 8rpx currentcolor;
    }

    .activity-body {
      flex: 1;

      .activity-text {
        display: block;
        font-size: 26rpx;
        color: var(--r-text-primary);
      }

      .activity-time {
        font-size: 22rpx;
        color: var(--r-text-placeholder);
        margin-top: 4rpx;
      }
    }
  }

  /* ── 版本底部 ── */
  .footer {
    text-align: center;
    padding: 40rpx 0 16rpx;

    .footer-text {
      font-size: 22rpx;
      color: var(--r-text-placeholder);
      letter-spacing: 0.5px;
    }
  }
</style>
