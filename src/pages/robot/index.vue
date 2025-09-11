<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-08 
 * @Description: 机器人管理页面
-->
<template>
  <C_Layout
    :notification-count="notificationCount"
    @user-click="handleUserClick"
    @notification-click="handleNotificationClick"
    @settings-click="handleSettingsClick"
    @tab-change="handleTabChange"
  >
    <view class="robot-content p-4">
      <!-- 页面标题 -->
      <view class="page-header mb-6">
        <view class="header-card p-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl text-white">
          <view class="flex items-center mb-2">
            <C_Icon name="mdi-robot" :size="32" color="white" />
            <text class="ml-3 text-lg font-bold">机器人管理中心</text>
          </view>
          <text class="text-sm opacity-90">
            管理和配置你的AI机器人，查看组件演示
          </text>
        </view>
      </view>

      <!-- 快捷操作 -->
      <view class="quick-actions mb-6">
        <view class="section-title mb-4 text-lg font-bold text-gray-800">🚀 快捷操作</view>
        
        <view class="actions-grid grid grid-cols-2 gap-4">
          <!-- 组件管理 -->
          <view 
            class="action-card p-4 bg-white rounded-lg shadow-sm border border-gray-100"
            @click="navigateToComponents"
          >
            <view class="card-header flex items-center mb-3">
              <view class="icon-wrapper w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <C_Icon name="mdi-package-variant" :size="24" color="#409eff" />
              </view>
              <view>
                <text class="card-title text-base font-bold text-gray-800">组件管理</text>
                <text class="card-desc block text-xs text-gray-500 mt-1">查看所有组件演示</text>
              </view>
            </view>
            <view class="card-footer flex items-center justify-between">
              <text class="text-xs text-blue-600">立即进入</text>
              <C_Icon name="mdi-chevron-right" :size="16" color="#409eff" />
            </view>
          </view>

          <!-- AI对话 -->
          <view 
            class="action-card p-4 bg-white rounded-lg shadow-sm border border-gray-100"
            @click="navigateToChat"
          >
            <view class="card-header flex items-center mb-3">
              <view class="icon-wrapper w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <C_Icon name="mdi-message-text" :size="24" color="#67c23a" />
              </view>
              <view>
                <text class="card-title text-base font-bold text-gray-800">AI对话</text>
                <text class="card-desc block text-xs text-gray-500 mt-1">与机器人对话</text>
              </view>
            </view>
            <view class="card-footer flex items-center justify-between">
              <text class="text-xs text-green-600">开始对话</text>
              <C_Icon name="mdi-chevron-right" :size="16" color="#67c23a" />
            </view>
          </view>
        </view>
      </view>

      <!-- 组件列表预览 -->
      <view class="components-preview mb-6">
        <view class="section-header flex items-center justify-between mb-4">
          <text class="section-title text-lg font-bold text-gray-800">🎨 组件预览</text>
          <view class="view-all-btn" @click="navigateToComponents">
            <text class="text-xs text-blue-600">查看全部</text>
            <C_Icon name="mdi-arrow-right" :size="14" color="#409eff" />
          </view>
        </view>

        <view class="components-grid grid grid-cols-1 gap-3">
          <view 
            v-for="component in featuredComponents" 
            :key="component.id"
            class="component-card p-3 bg-white rounded-lg shadow-sm border border-gray-100"
            @click="navigateToComponentDemo(component)"
          >
            <view class="flex items-center justify-between">
              <view class="component-info flex items-center">
                <view 
                  class="icon-wrapper w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                  :style="{ backgroundColor: component.color + '20' }"
                >
                  <C_Icon :name="component.icon" :size="16" :color="component.color" />
                </view>
                <view>
                  <text class="component-name text-sm font-bold text-gray-800">{{ component.name }}</text>
                  <text class="component-desc block text-xs text-gray-500 mt-1">{{ component.description }}</text>
                </view>
              </view>
              <view class="component-action">
                <C_Icon name="mdi-play-circle" :size="20" color="#409eff" />
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 统计信息 -->
      <view class="stats-section">
        <view class="section-title mb-4 text-lg font-bold text-gray-800">📊 统计信息</view>
        
        <view class="stats-grid grid grid-cols-3 gap-3">
          <view class="stat-card p-3 bg-white rounded-lg shadow-sm text-center">
            <text class="stat-number text-xl font-bold text-blue-600">4</text>
            <text class="stat-label block text-xs text-gray-500 mt-1">组件总数</text>
          </view>
          <view class="stat-card p-3 bg-white rounded-lg shadow-sm text-center">
            <text class="stat-number text-xl font-bold text-green-600">1</text>
            <text class="stat-label block text-xs text-gray-500 mt-1">已完成</text>
          </view>
          <view class="stat-card p-3 bg-white rounded-lg shadow-sm text-center">
            <text class="stat-number text-xl font-bold text-orange-600">3</text>
            <text class="stat-label block text-xs text-gray-500 mt-1">开发中</text>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
import { ref } from "vue";

const notificationCount = ref(0);

// 组件数据
const featuredComponents = [
  {
    id: 'c-icon',
    name: 'C_Icon',
    description: '通用图标组件，支持多种类型',
    icon: 'mdi-palette',
    color: '#ff6b6b',
    path: '/pages/demo/01-icon/index'
  },
  {
    id: 'c-header',
    name: 'C_Header',
    description: '统一头部导航组件',
    icon: 'mdi-page-layout-header',
    color: '#4ecdc4'
  },
  {
    id: 'c-layout',
    name: 'C_Layout',
    description: '页面布局组件',
    icon: 'mdi-view-dashboard-outline',
    color: '#45b7d1'
  }
];

// 事件处理
const handleUserClick = (user) => {
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
  uni.showToast({
    title: '打开设置',
    icon: 'none'
  })
}

const handleTabChange = ({ item, index }) => {
  console.log('切换到:', item.text, '索引:', index)
}

// 导航方法
const navigateToComponents = () => {
  uni.navigateTo({
    url: '/pages/demo/index'
  })
}

const navigateToChat = () => {
  uni.switchTab({
    url: '/pages/chat/index'
  })
}

const navigateToComponentDemo = (component) => {
  if (component.id === 'c-icon') {
    uni.navigateTo({
      url: component.path
    })
  } else {
    uni.showModal({
      title: '即将推出',
      content: `${component.name} 组件演示页面正在开发中，敬请期待！`,
      showCancel: false,
      confirmText: '知道了'
    })
  }
}
</script>

<style lang="scss" scoped>
.robot-content {
  background: #f8fafc;
  min-height: 100vh;
}

.header-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.action-card {
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: #409eff;
  }
}

.component-card {
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #409eff;
  }
}

.stat-card {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(2px);
  }
}

.icon-wrapper {
  transition: all 0.3s ease;
}

.action-card:hover .icon-wrapper,
.component-card:hover .icon-wrapper {
  transform: scale(1.1);
}

// UnoCSS 工具类补充
.text-blue-600 {
  color: #2563eb;
}

.text-green-600 {
  color: #059669;
}

.text-orange-600 {
  color: #ea580c;
}
</style>
