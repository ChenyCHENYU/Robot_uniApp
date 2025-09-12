<template>
  <view class="c-layout" :class="layoutClasses">
    <!-- Header区域 -->
    <C_Header
      v-if="showHeader"
      ref="headerRef"
      v-bind="headerConfig"
      :notification-count="notificationCount"
      @user-click="emit('userClick', $event)"
      @notification-click="emit('notificationClick', $event)"
      @settings-click="emit('settingsClick')"
      @status-click="emit('statusClick', $event)"
      @back-click="handleBackClick"
    />

    <!-- 页面内容区域 -->
    <view class="layout-content" :style="contentStyles">
      <slot />
    </view>

    <!-- Tabbar区域 -->
    <C_Tabbar
      v-if="showTabbar"
      ref="tabbarRef"
      v-model="currentTabIndex"
      v-bind="tabbarConfig"
      @change="handleTabChange"
    />

    <!-- 全局Loading -->
    <view v-if="globalLoading" class="global-loading">
      <u-loading-page :loading="true" loading-text="加载中..." />
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useSmartLayout, layoutProps, layoutEmits, tabbarConfig, getCurrentTabIndex } from "./data.js";
import C_Header from "../C_Header/index.vue";
import C_Tabbar from "../C_Tabbar/index.vue";
import "./index.scss";

const props = defineProps(layoutProps);
const emit = defineEmits(layoutEmits);

const headerRef = ref();
const tabbarRef = ref();

const {
  isNavigating,
  currentTabIndex,
  currentPath,
  layoutType,
  showHeader,
  showTabbar,
  headerConfig,
  layoutClasses,
  contentStyles,
  canGoBack,
  getCurrentPath,
  getPageInfo,
} = useSmartLayout(props);

// 页面路径监听
watch(() => currentPath.value, (newPath) => {
  // 更新Tab索引
  if (showTabbar.value) {
    const activeIndex = getCurrentTabIndex(newPath);
    if (activeIndex !== -1) {
      currentTabIndex.value = activeIndex;
    }
  }
  emit("layoutChange", getPageInfo());
}, { immediate: true });

// H5返回修复逻辑
const executeH5BackStrategy = () => {
  // #ifdef H5
  // 策略1：URL参数返回
  const urlParams = new URLSearchParams(window.location?.search || '');
  const fromParam = urlParams.get('from');
  if (fromParam) {
    return uni.navigateTo({ url: fromParam });
  }

  // 策略2：导航历史返回
  try {
    const navHistory = JSON.parse(localStorage.getItem('nav_history') || '[]');
    if (navHistory.length > 1) {
      const previousPage = navHistory[navHistory.length - 2];
      const newHistory = navHistory.slice(0, -1);
      localStorage.setItem('nav_history', JSON.stringify(newHistory));
      return uni.navigateTo({ url: previousPage });
    }
  } catch (e) {}

  // 策略3：返回首个Tab页面
  const firstTab = tabbarConfig.list?.[0];
  if (firstTab) {
    return uni.switchTab({ url: firstTab.path });
  }
  // #endif
  
  // 兜底：无法返回
  emit("backFail", { reason: "no_strategy_available" });
};

// 智能返回处理
const handleBackClick = () => {
  emit("backClick");

  if (props.backBehavior === "custom") return;
  if (props.backBehavior === "none") return;

  const pages = getCurrentPages();
  const hasPageStack = pages.length > 1;

  // 正常返回
  if (hasPageStack) {
    uni.navigateBack({
      delta: props.backDelta,
      success: () => emit("backSuccess", { delta: props.backDelta, fromPath: currentPath.value }),
      fail: (err) => emit("backFail", { error: err, reason: "navigate_fail" })
    });
  } else {
    // H5修复策略
    executeH5BackStrategy();
  }
};

// Tab切换处理
const handleTabChange = (data) => {
  const { item, index } = data;
  
  currentTabIndex.value = index;

  if (item.path === currentPath.value) {
    emit("tabChange", data);
    return;
  }

  if (isNavigating.value) return;
  
  isNavigating.value = true;

  uni.switchTab({
    url: item.path,
    success: () => {
      emit("tabChange", { ...data, fromPath: currentPath.value, toPath: item.path });
      nextTick(() => setTimeout(() => { isNavigating.value = false; }, 300));
    },
    fail: (err) => {
      // 降级处理
      uni.reLaunch({
        url: item.path,
        success: () => {
          emit("tabChange", { ...data, fallback: 'reLaunch', fromPath: currentPath.value, toPath: item.path });
          setTimeout(() => { isNavigating.value = false; }, 300);
        },
        fail: (err2) => {
          isNavigating.value = false;
          emit("tabChange", { ...data, error: err2, success: false });
        },
      });
    },
  });
};

// 公共API
const setHeaderStatus = (status) => headerRef.value?.setAiStatus?.(status);
const setHeaderTheme = (theme) => headerRef.value?.setTheme?.(theme);
const goBack = () => handleBackClick();
const refreshPage = () => uni.reLaunch({ url: getPageInfo().path });

const setTabBadge = (tabId, count) => {
  const tab = tabbarConfig.list.find(item => item.id === tabId);
  if (tab) {
    tab.badge = count;
    tabbarRef.value?.updateBadge?.(tabId, count);
  }
};

const clearAllBadges = () => {
  tabbarConfig.list.forEach(tab => { tab.badge = 0; });
  tabbarRef.value?.clearAllBadges?.();
};

// 组件生命周期
onMounted(() => {
  if (showTabbar.value) {
    const activeIndex = getCurrentTabIndex(currentPath.value);
    if (activeIndex !== -1) {
      currentTabIndex.value = activeIndex;
    }
  }
  emit("layoutChange", { ...getPageInfo(), mounted: true });
});

// 对外暴露API
defineExpose({
  setHeaderStatus,
  setHeaderTheme,
  goBack,
  canGoBack,
  refreshPage,
  setTabBadge,
  clearAllBadges,
  getPageInfo,
  getCurrentPath,
  getLayoutType: () => layoutType.value,
  headerRef,
  tabbarRef,
  isNavigating: () => isNavigating.value,
  getCurrentTabIndex: () => currentTabIndex.value,
});
</script>