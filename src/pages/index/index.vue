<template>
  <view class="dashboard">
    <!-- 头部组件 -->
    <C_Header 
      default-nickname="CHENY"
      :notification-count="notificationCount"
      @user-click="handleUserClick"
      @notification-click="handleNotificationClick"
      @settings-click="handleSettingsClick"
    />
    
    <!-- 主要内容区域 -->
    <view class="main-content">
      <!-- 数据统计卡片 -->
      <view class="stats-section">
        <view class="stats-grid">
          <view class="stat-card" v-for="stat in stats" :key="stat.id" @click="handleStatClick(stat)">
            <view class="stat-icon" :style="{ backgroundColor: stat.color }">
              <u-icon :name="stat.icon" size="20" color="#fff"></u-icon>
            </view>
            <view class="stat-info">
              <text class="stat-value">{{ stat.value }}</text>
              <text class="stat-label">{{ stat.label }}</text>
            </view>
            <view class="stat-trend" :class="{ 'trend-up': stat.trend > 0, 'trend-down': stat.trend < 0 }">
              <u-icon :name="stat.trend > 0 ? 'arrow-up' : 'arrow-down'" size="12"></u-icon>
              <text>{{ Math.abs(stat.trend) }}%</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 快捷功能 -->
      <view class="quick-actions">
        <view class="section-title">
          <text>快捷功能</text>
        </view>
        <view class="actions-grid">
          <view class="action-item" v-for="action in quickActions" :key="action.id" @click="handleActionClick(action)">
            <view class="action-icon" :style="{ backgroundColor: action.color }">
              <u-icon :name="action.icon" size="24" color="#fff"></u-icon>
            </view>
            <text class="action-label">{{ action.label }}</text>
          </view>
        </view>
      </view>
      
      <!-- 最近动态 -->
      <view class="recent-activities">
        <view class="section-title">
          <text>最近动态</text>
          <text class="more-btn" @click="handleMoreActivities">查看更多</text>
        </view>
        <view class="activity-list">
          <view class="activity-item" v-for="activity in recentActivities" :key="activity.id">
            <view class="activity-avatar">
              <image :src="activity.avatar" mode="aspectFill"></image>
            </view>
            <view class="activity-content">
              <text class="activity-text">{{ activity.content }}</text>
              <text class="activity-time">{{ activity.time }}</text>
            </view>
            <view class="activity-status" :class="activity.status">
              <text>{{ getStatusText(activity.status) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部导航 -->
    <C_Tabbar 
      v-model="currentTab"
      :tab-list="tabList"
      :fixed="true"
      @change="handleTabChange"
    />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()

// 响应式数据
const currentTab = ref(0)
const notificationCount = ref(3)

// Tabbar 配置
const tabList = ref([
  {
    id: 'home',
    text: '首页',
    icon: 'home',
    activeIcon: 'home-fill',
    path: '/pages/index/index',
    badge: 0
  },
  {
    id: 'chat',
    text: 'AI对话',
    icon: 'chat',
    activeIcon: 'chat-fill', 
    path: '/pages/chat/index',
    badge: 2
  },
  {
    id: 'robot',
    text: '机器人',
    icon: 'robot',
    activeIcon: 'robot',
    path: '/pages/robot/index',
    badge: 0
  },
  {
    id: 'profile',
    text: '我的',
    icon: 'account',
    activeIcon: 'account-fill',
    path: '/pages/profile/index',
    badge: 0
  }
])

// 计算属性
const userInfo = computed(() => userStore.userInfo || {})
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

// 数据统计
const stats = ref([
  {
    id: 1,
    label: 'AI对话',
    value: '128',
    icon: 'chat-fill',
    color: '#00D4FF',
    trend: 15.8
  },
  {
    id: 2,
    label: '任务执行',
    value: '24',
    icon: 'checkmark-circle-fill',
    color: '#00E676',
    trend: 8.3
  },
  {
    id: 3,
    label: '智能分析',
    value: '36',
    icon: 'bar-chart-fill',
    color: '#FF6B6B',
    trend: 12.5
  },
  {
    id: 4,
    label: '学习进度',
    value: '89%',
    icon: 'school-fill',
    color: '#9C27B0',
    trend: 5.2
  }
])

// 快捷功能
const quickActions = ref([
  { id: 1, label: 'AI对话', icon: 'chat-fill', color: '#00D4FF' },
  { id: 2, label: '智能助手', icon: 'robot-fill', color: '#00E676' },
  { id: 3, label: '语音交互', icon: 'mic-fill', color: '#FF6B6B' },
  { id: 4, label: '图像识别', icon: 'camera-fill', color: '#FF9800' },
  { id: 5, label: '数据分析', icon: 'bar-chart-fill', color: '#9C27B0' },
  { id: 6, label: '设置中心', icon: 'setting-fill', color: '#8E8E93' }
])

// 最近动态
const recentActivities = ref([
  {
    id: 1,
    content: 'AI助手完成了数据分析报告',
    time: '2分钟前',
    avatar: '/static/logo.png',
    status: 'completed'
  },
  {
    id: 2,
    content: '语音识别模块需要更新',
    time: '15分钟前',
    avatar: '/static/logo.png',
    status: 'pending'
  },
  {
    id: 3,
    content: '机器学习模型训练完成',
    time: '1小时前',
    avatar: '/static/logo.png',
    status: 'completed'
  },
  {
    id: 4,
    content: '系统性能优化建议',
    time: '2小时前',
    avatar: '/static/logo.png',
    status: 'warning'
  }
])

// 方法
// 头部组件事件
const handleUserClick = (userInfo) => {
  uni.showToast({
    title: '查看用户资料',
    icon: 'none'
  })
}

const handleNotificationClick = (count) => {
  uni.showToast({
    title: `有${count}条新通知`,
    icon: 'none'
  })
}

const handleSettingsClick = () => {
  uni.showActionSheet({
    itemList: ['个人资料', '账户设置', '退出登录'],
    success: (res) => {
      if (res.tapIndex === 2) {
        uni.showModal({
          title: '提示',
          content: '确定要退出登录吗？',
          success: (modalRes) => {
            if (modalRes.confirm) {
              userStore.logout()
            }
          }
        })
      } else {
        uni.showToast({
          title: '功能开发中',
          icon: 'none'
        })
      }
    }
  })
}

// Tabbar 事件
const handleTabChange = ({ item, index }) => {
  console.log('切换到:', item.text, '索引:', index)
}

// 原有方法
const handleStatClick = (stat) => {
  uni.showToast({
    title: `查看${stat.label}详情`,
    icon: 'none'
  })
}

const handleActionClick = (action) => {
  uni.showToast({
    title: `打开${action.label}`,
    icon: 'none'
  })
}

const handleMoreActivities = () => {
  uni.showToast({
    title: '跳转到动态列表',
    icon: 'none'
  })
}

const getStatusText = (status) => {
  const statusMap = {
    completed: '已完成',
    pending: '待处理',
    warning: '需关注'
  }
  return statusMap[status] || '未知'
}

// 生命周期
onMounted(() => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    uni.reLaunch({
      url: '/pages/index/login/index'
    })
    return
  }
  
  console.log('工作台加载完成')
})
</script>

<style lang="scss" scoped>
.dashboard {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-bottom: 160rpx; /* 留出 tabbar 空间 */
}

.stats-section {
  padding: 40rpx;
  
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24rpx;
    
    .stat-card {
      background: #fff;
      border-radius: 20rpx;
      padding: 32rpx;
      box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
      position: relative;
      
      .stat-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20rpx;
      }
      
      .stat-info {
        .stat-value {
          display: block;
          font-size: 48rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 8rpx;
        }
        
        .stat-label {
          display: block;
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .stat-trend {
        position: absolute;
        top: 32rpx;
        right: 32rpx;
        display: flex;
        align-items: center;
        gap: 8rpx;
        font-size: 20rpx;
        
        &.trend-up {
          color: #34C759;
        }
        
        &.trend-down {
          color: #FF3B30;
        }
      }
    }
  }
}

.quick-actions {
  padding: 0 40rpx 40rpx;
  
  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32rpx;
    
    text {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .actions-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32rpx;
    
    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .action-icon {
        width: 100rpx;
        height: 100rpx;
        border-radius: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16rpx;
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
      }
      
      .action-label {
        font-size: 24rpx;
        color: #666;
        text-align: center;
      }
    }
  }
}

.recent-activities {
  padding: 0 40rpx 40rpx;
  
  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32rpx;
    
    text {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      
      &.more-btn {
        font-size: 28rpx;
        font-weight: normal;
        color: #007AFF;
      }
    }
  }
  
  .activity-list {
    background: #fff;
    border-radius: 20rpx;
    padding: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
    
    .activity-item {
      display: flex;
      align-items: center;
      padding: 24rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .activity-avatar {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        margin-right: 24rpx;
        overflow: hidden;
        
        image {
          width: 100%;
          height: 100%;
        }
      }
      
      .activity-content {
        flex: 1;
        
        .activity-text {
          display: block;
          font-size: 28rpx;
          color: #333;
          margin-bottom: 8rpx;
        }
        
        .activity-time {
          display: block;
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .activity-status {
        padding: 8rpx 16rpx;
        border-radius: 16rpx;
        font-size: 20rpx;
        
        &.completed {
          background: #e8f5e8;
          color: #34C759;
        }
        
        &.pending {
          background: #fff3e0;
          color: #FF9500;
        }
        
        &.warning {
          background: #ffebee;
          color: #FF3B30;
        }
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}
</style>