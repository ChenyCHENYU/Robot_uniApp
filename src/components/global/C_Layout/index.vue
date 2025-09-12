<template>
  <view class="c-layout" :class="layoutClasses">
    <!-- Header区域 -->
    <C_Header
      v-if="showHeader"
      ref="headerRef"
      v-bind="headerConfig"
      :notification-count="notificationCount"
      @user-click="handleUserClick"
      @notification-click="handleNotificationClick"
      @settings-click="handleSettingsClick"
      @status-click="handleStatusClick"
      @theme-change="handleThemeChange"
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

    <!-- 调试信息（开发环境） -->
    <view 
      v-if="debug && isDevelopment" 
      class="debug-info"
      @click="showDebugInfo"
    >
      <text class="debug-text">DEBUG</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { 
  useSmartLayout,
  layoutProps,
  layoutEmits,
  tabbarConfig,
  getCurrentTabIndex,
  debugCurrentPage
} from "./data.js";

// 导入子组件
import C_Header from "../C_Header/index.vue";
import C_Tabbar from "../C_Tabbar/index.vue";

// 导入样式
import "./index.scss";

// =================================
// 组件配置
// =================================
const props = defineProps(layoutProps);
const emit = defineEmits(layoutEmits);

// =================================
// 开发环境检测
// =================================
const isDevelopment = process.env.NODE_ENV === 'development';

// =================================
// 组件引用
// =================================
const headerRef = ref();
const tabbarRef = ref();

// =================================
// 使用智能Layout逻辑
// =================================
const {
  // 响应式数据
  isNavigating,
  currentTabIndex,
  
  // 计算属性
  currentPath,
  layoutType,
  showHeader,
  showTabbar,
  headerConfig,
  layoutClasses,
  contentStyles,
  
  // 工具方法
  canGoBack,
  getCurrentPath,
  getPageInfo,
} = useSmartLayout(props);

// =================================
// 调试功能
// =================================
if (props.debug && isDevelopment) {
  watch(
    () => currentPath.value,
    () => {
      console.log('🔍 Layout Debug:', debugCurrentPage());
    },
    { immediate: true }
  );
}

const showDebugInfo = () => {
  if (isDevelopment) {
    const debugInfo = debugCurrentPage();
    uni.showModal({
      title: '页面调试信息',
      content: `路径: ${debugInfo.当前路径}\n布局: ${debugInfo.Layout类型}\n返回: ${debugInfo.显示返回}`,
      showCancel: false
    });
  }
};

// =================================
// 页面路径监听
// =================================
watch(
  () => currentPath.value,
  (newPath) => {
    // 更新Tab索引
    if (showTabbar.value) {
      const activeIndex = getCurrentTabIndex(newPath);
      if (activeIndex !== -1) {
        currentTabIndex.value = activeIndex;
      }
    }

    // 触发Layout变化事件
    emit("layoutChange", getPageInfo());
    
    // 开发环境日志
    if (isDevelopment) {
      console.log('📍 页面切换:', {
        路径: newPath,
        布局: layoutType.value,
        显示Header: showHeader.value,
        显示TabBar: showTabbar.value,
        显示返回: headerConfig.value.showBack,
        标题: headerConfig.value.title,
        页面栈: getCurrentPages().length,
      });
    }
  },
  { immediate: true }
);

// =================================
// 事件处理器
// =================================

// Header事件
const handleUserClick = (data) => {
  console.log('Layout: 用户点击Header', data);
  emit("userClick", data);
};

const handleNotificationClick = (data) => {
  console.log('Layout: 点击通知', data);
  emit("notificationClick", data);
};

const handleSettingsClick = () => {
  console.log('Layout: 点击设置');
  emit("settingsClick");
};

const handleStatusClick = (data) => {
  console.log('Layout: 点击状态', data);
  emit("statusClick", data);
};

const handleThemeChange = (data) => {
  console.log('Layout: 主题变化', data);
  emit("themeChange", data);
};

// 🔥 智能返回处理（集成H5修复）
const handleBackClick = () => {
  console.log('Layout: 点击返回按钮');
  emit("backClick");

  // 根据配置决定行为
  if (props.backBehavior === "custom") {
    console.log('Layout: 使用自定义返回行为');
    return;
  } else if (props.backBehavior === "none") {
    console.log('Layout: 返回功能已禁用');
    return;
  }

  // 获取页面栈信息
  const pages = getCurrentPages();
  const canGoBack = pages.length > 1;

  // 正常情况：有页面栈
  if (canGoBack) {
    uni.navigateBack({
      delta: props.backDelta,
      success: () => {
        console.log(`Layout: 返回成功，返回${props.backDelta}层`);
        emit("backSuccess", { 
          delta: props.backDelta,
          fromPath: currentPath.value
        });
      },
      fail: (err) => {
        console.error("Layout: 返回失败", err);
        emit("backFail", { error: err, reason: "navigate_fail" });
      }
    });
    return;
  }

  // 页面栈只有1层的情况 - H5修复逻辑
  console.log('Layout: 检测到单页面栈，启用H5修复策略');

  // #ifdef H5
  // 策略1：检查URL参数
  let urlParams = {};
  try {
    if (typeof window !== 'undefined' && window.location?.search) {
      new URLSearchParams(window.location.search).forEach((value, key) => {
        urlParams[key] = value;
      });
    }
  } catch (e) {}

  if (urlParams.from) {
    console.log('Layout: 使用from参数返回:', urlParams.from);
    uni.navigateTo({ 
      url: urlParams.from,
      success: () => {
        console.log('Layout: from参数返回成功');
        emit("backSuccess", { method: "url_param", target: urlParams.from });
      },
      fail: (err) => {
        console.error('Layout: from参数返回失败', err);
        emit("backFail", { error: err, method: "url_param" });
      }
    });
    return;
  }

  // 策略2：检查导航历史
  let navHistory = [];
  try {
    navHistory = JSON.parse(localStorage.getItem('nav_history') || '[]');
  } catch (e) {}

  if (navHistory.length > 1) {
    const previousPage = navHistory[navHistory.length - 2];
    console.log('Layout: 使用导航历史返回:', previousPage);
    
    // 更新历史记录
    const newHistory = navHistory.slice(0, -1);
    try {
      localStorage.setItem('nav_history', JSON.stringify(newHistory));
    } catch (e) {}
    
    uni.navigateTo({ 
      url: previousPage,
      success: () => {
        console.log('Layout: 历史记录返回成功');
        emit("backSuccess", { method: "history", target: previousPage });
      },
      fail: (err) => {
        console.error('Layout: 历史记录返回失败', err);
        emit("backFail", { error: err, method: "history" });
      }
    });
    return;
  }

  // 策略3：返回首个Tab页面
  const firstTab = tabbarConfig.list?.[0];
  if (firstTab) {
    console.log('Layout: 返回首个Tab页面:', firstTab.path);
    uni.switchTab({ 
      url: firstTab.path,
      success: () => {
        console.log('Layout: 返回Tab成功');
        emit("backSuccess", { method: "first_tab", target: firstTab.path });
      },
      fail: (err) => {
        console.error('Layout: 返回Tab失败', err);
        emit("backFail", { error: err, method: "first_tab" });
      }
    });
    return;
  }
  // #endif

  // 兜底：无法返回
  console.warn("Layout: 无法返回，所有策略均失败");
  emit("backFail", { 
    reason: "no_strategy_available",
    pageStack: pages.length,
    currentPath: currentPath.value
  });
};

// 🔥 智能Tab切换
const handleTabChange = (data) => {
  const { item, index } = data;
  
  console.log(`Layout: 切换Tab到 ${item.text}(${index})`);
  
  // 更新当前Tab索引
  currentTabIndex.value = index;

  // 如果目标页面与当前页面相同，不进行跳转
  if (item.path === currentPath.value) {
    console.log('Layout: 目标页面与当前页面相同，不跳转');
    emit("tabChange", data);
    return;
  }

  // 防重复点击
  if (isNavigating.value) {
    console.log("Layout: 导航中，忽略重复点击");
    return;
  }

  isNavigating.value = true;

  // 使用switchTab进行Tab页面跳转
  uni.switchTab({
    url: item.path,
    success: () => {
      console.log(`Layout: switchTab到${item.text}成功`);
      emit("tabChange", {
        ...data,
        fromPath: currentPath.value,
        toPath: item.path
      });
      
      // 延迟重置导航状态
      nextTick(() => {
        setTimeout(() => {
          isNavigating.value = false;
        }, 300);
      });
    },
    fail: (err) => {
      console.error("Layout: switchTab失败", err);
      
      // 降级处理：使用reLaunch
      uni.reLaunch({
        url: item.path,
        success: () => {
          console.log("Layout: reLaunch降级跳转成功");
          emit("tabChange", {
            ...data,
            fallback: 'reLaunch',
            fromPath: currentPath.value,
            toPath: item.path
          });
          setTimeout(() => {
            isNavigating.value = false;
          }, 300);
        },
        fail: (err2) => {
          console.error("Layout: 降级跳转也失败", err2);
          isNavigating.value = false;
          
          // 通知跳转失败
          emit("tabChange", {
            ...data,
            error: err2,
            success: false
          });
        },
      });
    },
  });
};

// =================================
// 公共API
// =================================

// Header状态控制
const setHeaderStatus = (status) => {
  console.log(`Layout: 设置Header状态为 ${status}`);
  headerRef.value?.setAiStatus?.(status);
};

const setHeaderTheme = (theme) => {
  console.log(`Layout: 设置Header主题为 ${theme}`);
  headerRef.value?.setTheme?.(theme);
};

// 返回功能
const goBack = (delta = 1) => {
  handleBackClick();
};

// 页面刷新
const refreshPage = () => {
  const pageInfo = getPageInfo();
  console.log('Layout: 刷新当前页面', pageInfo.path);
  
  uni.reLaunch({
    url: pageInfo.path
  });
};

// Tab Badge管理
const setTabBadge = (tabId, count) => {
  console.log(`Layout: 设置Tab[${tabId}]的Badge为 ${count}`);
  
  const tab = tabbarConfig.list.find(item => item.id === tabId);
  if (tab) {
    tab.badge = count;
    tabbarRef.value?.updateBadge?.(tabId, count);
  } else {
    console.warn(`Layout: 找不到Tab[${tabId}]`);
  }
};

// 清除所有Badge
const clearAllBadges = () => {
  console.log('Layout: 清除所有Tab Badge');
  tabbarConfig.list.forEach(tab => {
    tab.badge = 0;
  });
  tabbarRef.value?.clearAllBadges?.();
};

// 获取当前页面完整信息
const getLayoutFullInfo = () => {
  const pageInfo = getPageInfo();
  return {
    ...pageInfo,
    currentTabIndex: currentTabIndex.value,
    tabbarConfig,
    isNavigating: isNavigating.value,
    headerRef: headerRef.value,
    tabbarRef: tabbarRef.value,
  };
};

// =================================
// 组件生命周期
// =================================
onMounted(() => {
  // 设置初始Tab索引
  if (showTabbar.value) {
    const activeIndex = getCurrentTabIndex(currentPath.value);
    if (activeIndex !== -1) {
      currentTabIndex.value = activeIndex;
    }
  }
  
  const pageInfo = getPageInfo();
  console.log("🚀 Layout组件已挂载", pageInfo);
  
  // 触发挂载完成事件
  emit("layoutChange", {
    ...pageInfo,
    mounted: true
  });
});

// =================================
// 对外暴露的API
// =================================
defineExpose({
  // 核心功能
  setHeaderStatus,
  setHeaderTheme,
  goBack,
  canGoBack,
  refreshPage,
  
  // Tab管理
  setTabBadge,
  clearAllBadges,
  
  // 信息获取
  getPageInfo,
  getLayoutFullInfo,
  getCurrentPath,
  getLayoutType: () => layoutType.value,
  
  // 组件引用
  headerRef,
  tabbarRef,
  
  // 状态访问
  isNavigating: () => isNavigating.value,
  getCurrentTabIndex: () => currentTabIndex.value,
  
  // 调试方法
  debug: debugCurrentPage,
  debugInfo: getLayoutFullInfo,
});
</script>