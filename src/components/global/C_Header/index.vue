<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-01-09
 * @Description: 全局头部组件 - 玻璃风设计
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
-->
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
      <!-- 用户区域 -->
      <view class="user-section" @click="handleUserClick">
        <!-- 头像容器 -->
        <view class="avatar-container">
          <image
            class="user-avatar"
            :src="(userInfo.avatar && userInfo.avatar !== '/static/default-avatar.png') ? userInfo.avatar : defaultAvatar"
            mode="aspectFill"
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

  // 计算属性
  userInfo,
  safeAreaTop,
  greeting,
  statusClass,
  statusText,

  // 方法
  handleUserClick,
  handleNotification,
  handleSettings,
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
