<template>
  <view class="c-header" :style="{ paddingTop: safeAreaTop + 'px' }">
    <!-- 动态背景层 -->
    <view class="background-layers">
      <!-- 主渐变背景 -->
      <view class="gradient-bg"></view>
      <!-- 动态图案 -->
      <view class="pattern-overlay"></view>
    </view>

    <!-- 内容区域 -->
    <view class="header-content">
      <!-- 返回按钮区域（显示返回时） -->
      <view v-if="showBack" class="back-section" @click="handleBack">
        <view class="back-btn">
          <C_Icon name="mdi:keyboard-return" :size="20" color="#ffffff" />
        </view>
        <text v-if="title" class="back-title">{{ title }}</text>
      </view>
      
      <!-- 用户区域（不显示返回时） -->
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
          <text class="username">{{
            userInfo.nickname || defaultNickname
          }}</text>
        </view>
      </view>

      <!-- 操作区域 -->
      <view class="action-section">
        <!-- 状态指示器 -->
        <view class="status-pill" v-if="showStatus">
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

// Props
const props = defineProps(headerProps);

// Emits
const emit = defineEmits(headerEmits);

// 使用数据和逻辑
const {
  // 响应式数据
  aiStatus,
  avatarError,

  // 计算属性
  userInfo,
  safeAreaTop,
  avatarSrc,
  greeting,
  statusClass,
  statusText,

  // 方法
  handleUserClick,
  handleNotification,
  handleSettings,
  handleBack,
  handleAvatarError,
  setAiStatus,
} = useHeaderData(props, emit);

// 暴露方法给父组件
defineExpose({
  setAiStatus,
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>