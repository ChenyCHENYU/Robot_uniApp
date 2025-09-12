<template>
  <view class="c-header" :style="{ paddingTop: safeAreaTop + 'px' }">
    <!-- 动态背景层 -->
    <view class="background-layers">
      <view class="gradient-bg"></view>
      <view class="pattern-overlay"></view>
    </view>

    <!-- 内容区域 -->
    <view class="header-content">
      <!-- 返回按钮区域 -->
      <view v-if="showBack" class="back-section" @click="handleBack">
        <view class="back-btn">
          <u-icon name="arrow-left" :size="iconSize" color="#ffffff" />
        </view>
        <text v-if="title" class="back-title">{{ title }}</text>
      </view>
      
      <!-- 用户区域 -->
      <view v-else class="user-section" @click="handleUserClick">
        <!-- 头像容器 -->
        <view class="avatar-container">
          <image
            class="user-avatar"
            :src="avatarSrc"
            mode="aspectFill"
            @error="handleAvatarError"
          />
          <view class="online-indicator" v-if="showStatus">
            <view class="pulse-dot"></view>
          </view>
        </view>

        <!-- 用户信息 -->
        <view class="user-info">
          <text class="greeting">{{ greeting }}</text>
          <text class="username">{{ displayNickname }}</text>
        </view>
      </view>

      <!-- 操作区域 -->
      <view class="action-section">
        <!-- 状态指示器 -->
        <view 
          v-if="showStatus && !showBack" 
          class="status-pill"
          @click="handleStatusClick"
        >
          <view class="status-dot" :class="statusClass"></view>
          <text class="status-text">{{ statusText }}</text>
        </view>

        <!-- 通知按钮 -->
        <view class="action-button" @click="handleNotification">
          <view class="button-bg">
            <u-icon name="bell" :size="iconSize" color="#ffffff" />
          </view>
          <u-badge
            v-if="notificationCount > 0"
            :value="notificationCount"
            :max="99"
            absolute
            :offset="[8, -8]"
            bgColor="#FF3B30"
            color="#ffffff"
            size="mini"
          />
        </view>

        <!-- 设置按钮 -->
        <view class="action-button" @click="handleSettings">
          <view class="button-bg">
            <u-icon name="setting" :size="iconSize" color="#ffffff" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useHeaderData, headerProps, headerEmits } from "./data.js";
import "./index.scss";

// =================================
// 组件配置
// =================================
const props = defineProps(headerProps);
const emit = defineEmits(headerEmits);

// =================================
// 使用数据和逻辑
// =================================
const {
  // 响应式数据
  aiStatus,
  avatarError,
  
  // 计算属性
  userInfo,
  safeAreaTop,
  avatarSrc,
  displayNickname,
  greeting,
  statusClass,
  statusText,
  
  // 方法
  handleUserClick,
  handleNotification,
  handleSettings,
  handleStatusClick,
  handleBack,
  handleAvatarError,
  setAiStatus,
  resetAvatarError,
} = useHeaderData(props, emit);

// =================================
// 暴露给父组件的方法
// =================================
defineExpose({
  setAiStatus,
  resetAvatarError,
  
  // 获取当前状态的方法
  getCurrentStatus: () => aiStatus.value,
  getUserInfo: () => userInfo.value,
});
</script>