/**
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-01-09
 * @Description: C_Tabbar 组件数据和逻辑
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
 */

import { computed, ref } from "vue";
import { useAppStore } from "@/stores/modules/app";

export function useTabbarData(props, emit) {
  // Store
  const appStore = useAppStore();

  // 响应式数据
  const isNavigating = ref(false);

  // 计算属性
  const currentIndex = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
  });

  const safeAreaBottom = computed(() => appStore.safeArea.bottom || 0);

  // 方法 - 仅发射事件，导航由C_Layout统一处理
  const handleTabClick = (item, index) => {
    if (currentIndex.value === index) return;
    if (isNavigating.value) return;

    currentIndex.value = index;
    emit("change", { item, index });
    emit("tabClick", { item, index });
  };

  const setBadge = (tabId, count) => {
    const tab = props.tabList.find((item) => item.id === tabId);
    if (tab) {
      tab.badge = count;
    }
  };

  const setCurrentIndex = (index) => {
    currentIndex.value = index;
  };

  return {
    // 响应式数据
    isNavigating,

    // 计算属性
    currentIndex,
    safeAreaBottom,

    // 方法
    handleTabClick,
    setBadge,
    setCurrentIndex,
  };
}

// 默认Tab列表配置
export const defaultTabList = [
  {
    id: "home",
    text: "首页",
    icon: "home",
    activeIcon: "home1",
    path: "/pages/index/index",
    badge: 0,
  },
  {
    id: "message",
    text: "消息",
    icon: "chat",
    activeIcon: "chat1",
    path: "/pages/message/index",
    badge: 0,
  },
  {
    id: "components",
    text: "组件库",
    icon: "app",
    activeIcon: "app",
    path: "/pages/robot/index",
    badge: 0,
    showText: "C",
  },
  {
    id: "profile",
    text: "我的",
    icon: "user",
    activeIcon: "user-circle",
    path: "/pages/profile/index",
    badge: 0,
  },
];

// Props 定义
export const tabbarProps = {
  // 当前激活的索引
  modelValue: {
    type: Number,
    default: 0,
  },
  // 标签列表
  tabList: {
    type: Array,
    default: () => defaultTabList,
  },
  // 激活颜色
  activeColor: {
    type: String,
    default: "#00D4FF",
  },
  // 非激活颜色
  inactiveColor: {
    type: String,
    default: "#8E8E93",
  },
  // 是否固定在底部
  fixed: {
    type: Boolean,
    default: true,
  },
};

// Emits 定义
export const tabbarEmits = ["update:modelValue", "change", "tabClick"];
