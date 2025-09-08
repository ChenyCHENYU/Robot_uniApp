<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-08 
 * @Description: 全局头部组件 - 精致玻璃风版
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
            :src="userInfo.avatar || defaultAvatar"
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
import { computed, ref } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { useAppStore } from "@/stores/modules/app";

// Props
const props = defineProps({
  // 默认头像
  defaultAvatar: {
    type: String,
    default: "/static/logo.png",
  },
  // 默认昵称
  defaultNickname: {
    type: String,
    default: "CHENY",
  },
  // 是否显示状态指示器
  showStatus: {
    type: Boolean,
    default: true,
  },
  // 图标大小
  iconSize: {
    type: [Number, String],
    default: 24,
  },
  // 通知数量
  notificationCount: {
    type: Number,
    default: 0,
  },
});

// Emits
const emit = defineEmits(["userClick", "notificationClick", "settingsClick"]);

// Store
const userStore = useUserStore();
const appStore = useAppStore();

// 计算属性
const userInfo = computed(() => userStore.userInfo || {});
const safeAreaTop = computed(() => appStore.safeArea.top || 44);

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "上午好";
  if (hour < 18) return "下午好";
  return "晚上好";
});

// 状态相关
const aiStatus = ref("online"); // online, offline, busy
const statusClass = computed(() => `status-${aiStatus.value}`);
const statusText = computed(() => {
  const statusMap = {
    online: "在线",
    offline: "离线",
    busy: "忙碌中",
  };
  return statusMap[aiStatus.value] || "在线";
});

// 方法
const handleUserClick = () => {
  emit("userClick", userInfo.value);
};

const handleNotification = () => {
  emit("notificationClick", props.notificationCount);
};

const handleSettings = () => {
  emit("settingsClick");
};

// 暴露方法给父组件
defineExpose({
  setAiStatus: (status) => {
    aiStatus.value = status;
  },
});
</script>

<style lang="scss" scoped>
.c-header {
  position: relative;
  z-index: 100;
  overflow: hidden;
  min-height: 200rpx;
}

.background-layers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 50%, #006699 100%);
  background-size: 300% 300%;
  animation: gradientShift 8s ease-in-out infinite;
}

.pattern-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      circle at 20% 50%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(255, 255, 255, 0.08) 0%,
      transparent 50%
    );
  opacity: 0.6;
}

.header-content {
  position: relative;
  z-index: 2;
  padding: 32rpx 40rpx 40rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-section {
  display: flex;
  align-items: center;
  flex: 1;
  transition: all 0.3s ease;
}

.avatar-container {
  position: relative;
  margin-right: 32rpx;
}

.user-avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  border: 3rpx solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
}

.online-indicator {
  position: absolute;
  bottom: 4rpx;
  right: 4rpx;
  width: 24rpx;
  height: 24rpx;
  background: #00e676;
  border: 3rpx solid #ffffff;
  border-radius: 50%;
}

.pulse-dot {
  position: absolute;
  top: -6rpx;
  left: -6rpx;
  right: -6rpx;
  bottom: -6rpx;
  background: rgba(0, 230, 118, 0.4);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.user-info {
  .greeting {
    display: block;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 8rpx;
    font-weight: 400;
  }

  .username {
    display: block;
    font-size: 40rpx;
    font-weight: 700;
    color: #ffffff;
    text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
  }
}

.action-section {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.status-pill {
  display: flex;
  align-items: center;
  gap: 16rpx;
  background: rgba(255, 255, 255, 0.15);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 50rpx;
  padding: 20rpx 32rpx;
  backdrop-filter: blur(20rpx);
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.status-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;

  &.status-online {
    background: #00e676;
    animation: pulse 2s ease-in-out infinite;
  }

  &.status-offline {
    background: #9e9e9e;
  }

  &.status-busy {
    background: #ff9800;
    animation: pulse 2s ease-in-out infinite;
  }
}

.status-text {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: 600;
}

.action-button {
  position: relative;
  transition: all 0.3s ease;
}

.button-bg {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 1rpx solid rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20rpx);
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

// 动画定义
@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.7;
  }
}
</style>
