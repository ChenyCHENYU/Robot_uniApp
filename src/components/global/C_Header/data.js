/**
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-01-09
 * @Description: C_Header 组件数据和逻辑
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
 */

import { computed, ref } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { useAppStore } from "@/stores/modules/app";

export function useHeaderData(props, emit) {
  // Store
  const userStore = useUserStore();
  const appStore = useAppStore();

  // 响应式数据
  const aiStatus = ref("online");
  const avatarError = ref(false);

  // 计算属性
  const userInfo = computed(() => userStore.userInfo || {});
  const safeAreaTop = computed(() => appStore.safeArea.top || 44);

  // 头像显示逻辑 - 简洁优雅
  const avatarSrc = computed(() => {
    if (avatarError.value) {
      return props.defaultAvatar;
    }

    const userAvatar = userInfo.value?.avatar;
    if (!userAvatar || userAvatar === "/static/default-avatar.png") {
      return props.defaultAvatar;
    }

    return userAvatar;
  });

  const greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "上午好";
    if (hour < 18) return "下午好";
    return "晚上好";
  });

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

  const handleAvatarError = () => {
    avatarError.value = true;
  };

  const setAiStatus = (status) => {
    aiStatus.value = status;
  };

  return {
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
    handleAvatarError,
    setAiStatus,
  };
}

// Props 定义
export const headerProps = {
  // 默认头像
  defaultAvatar: {
    type: String,
    default: "/static/robot-avatar.png",
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
};

// Emits 定义
export const headerEmits = ["userClick", "notificationClick", "settingsClick"];
