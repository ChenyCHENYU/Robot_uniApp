<template>
  <C_Layout
    :notification-count="notificationCount"
    @user-click="handleUserClick"
    @notification-click="handleNotificationClick"
    @settings-click="handleSettingsClick"
  >
    <view class="homepage">
      <!-- 欢迎区 -->
      <view class="welcome-section">
        <view class="welcome-content">
          <view class="welcome-text">
            <text class="greeting">{{ greeting }}，</text>
            <text class="username">ChenY 👋</text>
          </view>
          <text class="welcome-desc"
            >欢迎回来，今日有 {{ todoCount }} 项待办</text
          >
        </view>
        <view class="avatar-wrap">
          <image
            class="avatar"
            src="/static/images/avatar.png"
            mode="aspectFill"
          />
        </view>
      </view>

      <!-- 数据概览卡片 -->
      <view class="stats-grid">
        <view
          v-for="stat in statsCards"
          :key="stat.label"
          class="stat-card"
          @click="handleStatClick(stat)"
        >
          <view class="stat-header">
            <view
              class="stat-icon"
              :style="{ background: stat.bg }"
            >
              <text class="icon-text">{{ stat.icon }}</text>
            </view>
            <view
              v-if="stat.trend"
              class="stat-trend"
              :class="stat.trend > 0 ? 'up' : 'down'"
            >
              <text class="trend-text"
                >{{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%</text
              >
            </view>
          </view>
          <text class="stat-value">{{ stat.value }}</text>
          <text class="stat-label">{{ stat.label }}</text>
        </view>
      </view>

      <!-- 快捷操作 -->
      <view class="quick-section">
        <view class="section-title-row">
          <text class="section-title">快捷操作</text>
        </view>
        <view class="quick-grid">
          <view
            v-for="action in quickActions"
            :key="action.label"
            class="quick-item"
            @click="handleQuickAction(action)"
          >
            <view
              class="quick-icon"
              :style="{ background: action.bg }"
            >
              <text class="icon-text">{{ action.icon }}</text>
            </view>
            <text class="quick-label">{{ action.label }}</text>
          </view>
        </view>
      </view>

      <!-- 待办事项 -->
      <view class="todo-section">
        <view class="section-title-row">
          <text class="section-title">待办事项</text>
          <text
            class="section-action"
            @click="handleViewAllTodo"
            >查看全部</text
          >
        </view>
        <view class="todo-list">
          <view
            v-for="todo in todoList"
            :key="todo.id"
            class="todo-item"
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
            <view class="todo-content">
              <text
                class="todo-title"
                :class="{ done: todo.done }"
                >{{ todo.title }}</text
              >
              <text class="todo-time">{{ todo.time }}</text>
            </view>
            <view
              class="todo-priority"
              :class="todo.priority"
            >
              <text class="priority-dot"></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 最近动态 -->
      <view class="activity-section">
        <view class="section-title-row">
          <text class="section-title">最近动态</text>
        </view>
        <view class="activity-list">
          <view
            v-for="item in activities"
            :key="item.id"
            class="activity-item"
          >
            <view
              class="activity-dot"
              :style="{ background: item.color }"
            ></view>
            <view class="activity-content">
              <text class="activity-text">{{ item.text }}</text>
              <text class="activity-time">{{ item.time }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 项目信息 -->
      <view class="project-footer">
        <text class="project-name">Robot UniApp v{{ version }}</text>
        <text class="project-desc">企业级跨平台应用框架</text>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'

  const version = ref('1.0.0')
  const notificationCount = ref(3)

  const greeting = computed(() => {
    const h = new Date().getHours()
    if (h < 6) return '夜深了'
    if (h < 12) return '早上好'
    if (h < 14) return '中午好'
    if (h < 18) return '下午好'
    return '晚上好'
  })

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
  .homepage {
    background: var(--r-bg-page);
    padding: 24rpx;
    min-height: 100vh;
  }

  .welcome-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 32rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 24rpx;
    margin-bottom: 24rpx;

    .welcome-content {
      .welcome-text {
        display: flex;
        align-items: baseline;
        gap: 4rpx;
        margin-bottom: 8rpx;

        .greeting {
          font-size: 28rpx;
          color: rgba(255, 255, 255, 0.85);
        }

        .username {
          font-size: 36rpx;
          font-weight: 700;
          color: #fff;
        }
      }

      .welcome-desc {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.7);
      }
    }

    .avatar-wrap {
      .avatar {
        width: 96rpx;
        height: 96rpx;
        border-radius: 50%;
        border: 4rpx solid rgba(255, 255, 255, 0.3);
      }
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16rpx;
    margin-bottom: 28rpx;

    .stat-card {
      padding: 24rpx;
      background: var(--r-bg-card);
      border-radius: 20rpx;
      box-shadow: var(--r-shadow-sm);

      .stat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16rpx;

        .stat-icon {
          width: 56rpx;
          height: 56rpx;
          border-radius: 14rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          .icon-text {
            font-size: 24rpx;
          }
        }

        .stat-trend {
          padding: 4rpx 12rpx;
          border-radius: 8rpx;

          &.up {
            background: rgba(67, 233, 123, 0.1);
          }
          &.down {
            background: rgba(245, 108, 108, 0.1);
          }

          .trend-text {
            font-size: 20rpx;
            font-weight: 600;
          }

          &.up .trend-text {
            color: #43e97b;
          }
          &.down .trend-text {
            color: #f56c6c;
          }
        }
      }

      .stat-value {
        display: block;
        font-size: 36rpx;
        font-weight: 700;
        color: var(--r-text-primary);
      }

      .stat-label {
        font-size: 22rpx;
        color: var(--r-text-secondary);
        margin-top: 4rpx;
      }
    }
  }

  .section-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 30rpx;
      font-weight: 600;
      color: var(--r-text-primary);
    }

    .section-action {
      font-size: 24rpx;
      color: #667eea;
    }
  }

  .quick-section {
    margin-bottom: 28rpx;

    .quick-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16rpx;

      .quick-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10rpx;
        padding: 20rpx 0;
        background: var(--r-bg-card);
        border-radius: 16rpx;
        box-shadow: var(--r-shadow-sm);

        .quick-icon {
          width: 72rpx;
          height: 72rpx;
          border-radius: 20rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          .icon-text {
            font-size: 28rpx;
          }
        }

        .quick-label {
          font-size: 22rpx;
          color: var(--r-text-secondary);
        }
      }
    }
  }

  .todo-section {
    margin-bottom: 28rpx;

    .todo-list {
      background: var(--r-bg-card);
      border-radius: 20rpx;
      overflow: hidden;
      box-shadow: var(--r-shadow-sm);

      .todo-item {
        display: flex;
        align-items: center;
        gap: 16rpx;
        padding: 24rpx 28rpx;
        border-bottom: 1rpx solid var(--r-border-light);

        &:last-child {
          border-bottom: none;
        }

        .todo-check {
          width: 36rpx;
          height: 36rpx;
          border-radius: 50%;
          border: 2rpx solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          &.done {
            background: #43e97b;
            border-color: #43e97b;
          }
        }

        .todo-content {
          flex: 1;

          .todo-title {
            display: block;
            font-size: 28rpx;
            color: var(--r-text-primary);

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

        .todo-priority {
          .priority-dot {
            width: 12rpx;
            height: 12rpx;
            border-radius: 50%;
            display: block;
          }

          &.high .priority-dot {
            background: #f56c6c;
          }
          &.medium .priority-dot {
            background: #faad14;
          }
          &.low .priority-dot {
            background: #43e97b;
          }
        }
      }
    }
  }

  .activity-section {
    margin-bottom: 28rpx;

    .activity-list {
      padding: 8rpx 28rpx;
      background: var(--r-bg-card);
      border-radius: 20rpx;
      box-shadow: var(--r-shadow-sm);

      .activity-item {
        display: flex;
        align-items: flex-start;
        gap: 16rpx;
        padding: 20rpx 0;
        border-bottom: 1rpx solid var(--r-border-light);

        &:last-child {
          border-bottom: none;
        }

        .activity-dot {
          width: 12rpx;
          height: 12rpx;
          border-radius: 50%;
          margin-top: 10rpx;
          flex-shrink: 0;
        }

        .activity-content {
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
    }
  }

  .project-footer {
    text-align: center;
    padding: 32rpx 0 16rpx;

    .project-name {
      display: block;
      font-size: 24rpx;
      color: var(--r-text-placeholder);
    }

    .project-desc {
      font-size: 22rpx;
      color: var(--r-text-placeholder);
    }
  }
</style>
