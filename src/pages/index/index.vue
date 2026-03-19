<template>
  <C_Layout
    :notification-count="unreadCount"
    @user-click="handleUserClick"
    @notification-click="handleNotificationClick"
    @settings-click="handleSettingsClick"
  >
    <view class="dashboard">
      <!-- 问候语 -->
      <view class="greeting">
        <text class="greeting-text"
          >{{ greeting }}，<text class="greeting-name">ChenY</text> 👋</text
        >
        <text class="greeting-sub">今日有 {{ todoCount }} 项待办</text>
      </view>

      <!-- 核心指标卡片 — 横向滑动 -->
      <scroll-view
        class="kpi-scroll"
        scroll-x
        enhanced
        :show-scrollbar="false"
      >
        <view class="kpi-track">
          <view
            v-for="kpi in kpiCards"
            :key="kpi.label"
            class="kpi-card"
            @click="handleStatClick(kpi)"
          >
            <view class="kpi-head">
              <text class="kpi-emoji">{{ kpi.icon }}</text>
              <view
                v-if="kpi.trend"
                class="kpi-trend"
                :class="kpi.trend > 0 ? 'is-up' : 'is-down'"
              >
                <text class="trend-val"
                  >{{ kpi.trend > 0 ? '↑' : '↓'
                  }}{{ Math.abs(kpi.trend) }}%</text
                >
              </view>
            </view>
            <text class="kpi-value">{{ kpi.value }}</text>
            <text class="kpi-label">{{ kpi.label }}</text>
            <!-- 迷你进度条 -->
            <view
              v-if="kpi.progress != null"
              class="kpi-bar"
            >
              <view
                class="kpi-bar-fill"
                :style="{ width: kpi.progress + '%', background: kpi.barColor }"
              />
            </view>
          </view>
        </view>
      </scroll-view>

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
  import { useMessageStore } from '@/stores/modules/message'
  import { APP_VERSION } from '@/constants'

  const messageStore = useMessageStore()
  const unreadCount = computed(() => messageStore.totalUnread)

  const version = APP_VERSION

  const greeting = computed(() => {
    const h = new Date().getHours()
    if (h < 6) return '夜深了'
    if (h < 12) return '早上好'
    if (h < 14) return '中午好'
    if (h < 18) return '下午好'
    return '晚上好'
  })

  const kpiCards = ref([
    {
      label: '活跃用户',
      value: '12,486',
      icon: '👥',
      trend: 12.5,
      progress: 78,
      barColor: 'linear-gradient(90deg,#667eea,#764ba2)',
    },
    {
      label: '今日访问',
      value: '3,829',
      icon: '📊',
      trend: 8.3,
      progress: 62,
      barColor: 'linear-gradient(90deg,#f093fb,#f5576c)',
    },
    {
      label: '待处理',
      value: '26',
      icon: '📋',
      trend: -4.2,
      progress: 26,
      barColor: 'linear-gradient(90deg,#4facfe,#00f2fe)',
    },
    {
      label: '完成率',
      value: '94.6%',
      icon: '🎯',
      trend: 2.1,
      progress: 94.6,
      barColor: 'linear-gradient(90deg,#43e97b,#38f9d7)',
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
  .dashboard {
    min-height: 100vh;
    padding: 24rpx 24rpx 0;
    background:
      linear-gradient(180deg, rgba(102, 126, 234, 0.06) 0%, transparent 40%),
      var(--r-bg-page);
  }

  /* ── 问候 ── */
  .greeting {
    padding: 16rpx 8rpx 24rpx;

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

  /* ── KPI 横滑卡片 ── */
  .kpi-scroll {
    margin: 0 -24rpx 28rpx;
    white-space: nowrap;
  }

  .kpi-track {
    display: inline-flex;
    gap: 16rpx;
    padding: 0 24rpx 8rpx;
  }

  .kpi-card {
    @include glass-surface;
    display: inline-flex;
    flex-direction: column;
    width: 240rpx;
    padding: 24rpx;
    border-radius: 24rpx;
    flex-shrink: 0;
    white-space: normal;
    transition: transform 0.2s ease;

    &:active {
      transform: scale(0.96);
    }

    .kpi-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16rpx;
    }

    .kpi-emoji {
      font-size: 32rpx;
    }

    .kpi-trend {
      padding: 2rpx 10rpx;
      border-radius: 8rpx;

      &.is-up {
        background: rgba(67, 233, 123, 0.14);
      }
      &.is-down {
        background: rgba(245, 108, 108, 0.14);
      }

      .trend-val {
        font-size: 18rpx;
        font-weight: 600;
      }
      &.is-up .trend-val {
        color: #2bb85a;
      }
      &.is-down .trend-val {
        color: #e84545;
      }
    }

    .kpi-value {
      display: block;
      font-size: 36rpx;
      font-weight: 700;
      color: var(--r-text-primary);
      letter-spacing: -0.5px;
      line-height: 1.2;
    }

    .kpi-label {
      display: block;
      font-size: 22rpx;
      color: var(--r-text-secondary);
      margin-top: 4rpx;
    }

    .kpi-bar {
      height: 6rpx;
      border-radius: 3rpx;
      background: rgba(0, 0, 0, 0.05);
      margin-top: 16rpx;
      overflow: hidden;
    }

    .kpi-bar-fill {
      height: 100%;
      border-radius: 3rpx;
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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
    @include glass-surface;
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
    @include glass-surface;
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
