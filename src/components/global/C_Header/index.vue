<template>
  <view
    class="c-header"
    :class="{ 'compact-mode': isCompactMode }"
    :style="{ paddingTop: safeAreaTop + 'px' }"
  >
    <!-- 动态背景层 -->
    <view class="c-header__bg-layers">
      <view class="c-header__gradient"></view>
      <view class="c-header__pattern"></view>
      <view class="c-header__glass"></view>
    </view>

    <!-- 内容区域 -->
    <view class="c-header__content">
      <!-- 返回按钮区域 -->
      <view
        v-if="showBack"
        class="c-header__back-section"
        @click="handleBack"
      >
        <view class="c-header__back-btn">
          <view class="c-header__btn-glass">
            <wd-icon
              name="arrow-left"
              :size="iconSize + 'px'"
              color="#ffffff"
            />
          </view>
        </view>
        <text
          v-if="title"
          class="c-header__back-title"
          >{{ title }}</text
        >
      </view>

      <!-- 用户区域 -->
      <view
        v-else
        class="c-header__user-section"
        @click="handleUserClick"
      >
        <!-- 头像容器 -->
        <view class="c-header__avatar-box">
          <view class="c-header__avatar-ring">
            <image
              class="c-header__avatar"
              :src="avatarSrc"
              mode="aspectFill"
              @error="handleAvatarError"
            />
            <view
              class="c-header__online"
              v-if="showStatus"
            >
              <view class="c-header__pulse-ring"></view>
              <view class="c-header__status-dot"></view>
            </view>
          </view>
        </view>

        <!-- 用户信息 -->
        <view class="c-header__user-info">
          <text class="c-header__greeting">{{ greeting }}</text>
          <text class="c-header__username">{{ displayNickname }}</text>
        </view>
      </view>

      <!-- 操作区域 -->
      <view class="c-header__actions">
        <!-- 状态指示器 -->
        <view
          v-if="showStatus && !showBack"
          class="c-header__status-pill"
          @click="handleStatusClick"
        >
          <view class="c-header__status-pill-bg">
            <view
              class="c-header__status-dot"
              :class="statusClass"
            ></view>
            <text class="c-header__status-text">{{ statusText }}</text>
          </view>
        </view>

        <!-- 通知按钮 -->
        <view
          class="c-header__action-btn"
          @click="handleNotification"
        >
          <view class="c-header__action-glass">
            <wd-icon
              name="notification"
              :size="iconSize + 'px'"
              color="#ffffff"
            />
          </view>
          <wd-badge
            v-if="notificationCount > 0"
            :modelValue="notificationCount"
            :max="99"
            custom-style="position: absolute; top: 0px; right: 0px;"
          />
        </view>

        <!-- 设置按钮 -->
        <view
          class="c-header__action-btn"
          @click="handleSettings"
        >
          <view class="c-header__action-glass">
            <wd-icon
              name="setting"
              :size="iconSize + 'px'"
              color="#ffffff"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { computed } from 'vue' // 🔥 添加computed导入
  import { useHeaderData, headerProps, headerEmits } from './data'

  // =================================
  // 组件配置
  // =================================
  const props = defineProps(headerProps)
  const emit = defineEmits(headerEmits)

  // =================================
  // 使用数据和逻辑
  // =================================
  const {
    // 响应式数据
    aiStatus,
    avatarError: _avatarError,

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
  } = useHeaderData(props, emit)

  // 🔥 新增：紧凑模式计算属性
  const isCompactMode = computed(() => props.isCompactMode)

  // =================================
  // 暴露给父组件的方法
  // =================================
  defineExpose({
    setAiStatus,
    resetAvatarError,

    // 获取当前状态的方法
    getCurrentStatus: () => aiStatus.value,
    getUserInfo: () => userInfo.value,
  })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
