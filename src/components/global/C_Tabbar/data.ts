/**
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-01-09
 * @Description: C_Tabbar 组件数据和逻辑
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
 */

import { computed, ref, type PropType } from 'vue'
import { useAppStore } from '@/stores/modules/app'

/** 单个 Tab 项的类型 */
export interface TabItem {
  id: string
  text: string
  icon: string
  activeIcon: string
  unoIcon?: string
  path: string
  badge: number
}

/** Tabbar 数据与逻辑 */
export function useTabbarData(props, emit) {
  // Store
  const appStore = useAppStore()

  // 响应式数据
  const isNavigating = ref(false)

  // 计算属性
  const currentIndex = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  const safeAreaBottom = computed(() => {
    // #ifdef H5
    return 0
    // #endif
    return appStore.safeArea.bottom || 0
  })
  const tabbarStyle = computed(() => ({
    '--tab-active-color': props.activeColor,
    '--tab-inactive-color': props.inactiveColor,
    paddingBottom:
      safeAreaBottom.value > 0
        ? `${safeAreaBottom.value}px`
        : 'env(safe-area-inset-bottom, 0px)',
  }))

  // 方法 - 仅发射事件，导航由C_Layout统一处理
  const handleTabClick = (item, index) => {
    if (currentIndex.value === index) return
    if (isNavigating.value) return

    currentIndex.value = index
    emit('change', { item, index })
    emit('tabClick', { item, index })
  }

  const setBadge = (tabId, count) => {
    const tab = props.tabList.find(item => item.id === tabId)
    if (tab) {
      tab.badge = Math.max(0, count)
    }
  }

  const setCurrentIndex = index => {
    currentIndex.value = index
  }

  return {
    // 响应式数据
    isNavigating,

    // 计算属性
    currentIndex,
    safeAreaBottom,
    tabbarStyle,

    // 方法
    handleTabClick,
    setBadge,
    setCurrentIndex,
  }
}

// 默认Tab列表配置
// fluent-color: 微软 Fluent Color 多色图标，激活/未激活用同一图标，CSS 控制灰度
export const defaultTabList = [
  {
    id: 'home',
    text: '首页',
    icon: 'home',
    activeIcon: 'home1',
    unoIcon: 'i-mdi-home-outline',
    path: '/pages/index/index',
    badge: 0,
  },
  {
    id: 'message',
    text: '消息',
    icon: 'chat',
    activeIcon: 'chat1',
    unoIcon: 'i-mdi-message-text-outline',
    path: '/pages/message/index',
    badge: 0,
  },
  {
    id: 'components',
    text: '组件库',
    icon: 'app',
    activeIcon: 'app',
    unoIcon: 'i-mdi-view-grid-outline',
    path: '/pages/robot/index',
    badge: 0,
  },
  {
    id: 'profile',
    text: '我的',
    icon: 'user',
    activeIcon: 'user-circle',
    unoIcon: 'i-mdi-account-outline',
    path: '/pages/profile/index',
    badge: 0,
  },
]

// Props 定义
export const tabbarProps = {
  // 当前激活的索引
  modelValue: {
    type: Number,
    default: 0,
  },
  // 标签列表
  tabList: {
    type: Array as PropType<TabItem[]>,
    default: () => defaultTabList,
  },
  // 风格模式: glass(苹果拟态玻璃) | flat(扁平简约)
  mode: {
    type: String as () => 'glass' | 'flat',
    default: 'flat',
  },
  // 激活颜色
  activeColor: {
    type: String,
    default: 'var(--r-color-primary)', // iOS Theme Blue
  },
  // 非激活颜色
  inactiveColor: {
    type: String,
    default: 'var(--r-text-secondary)', // iOS Inactive Grey
  },
  // 是否固定在底部
  fixed: {
    type: Boolean,
    default: true,
  },
}

// Emits 定义
export const tabbarEmits = ['update:modelValue', 'change', 'tabClick']
