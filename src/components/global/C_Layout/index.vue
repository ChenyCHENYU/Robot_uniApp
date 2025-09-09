<template>
  <view class="c-layout" :class="layoutClasses">
    <!-- Header区域 -->
    <C_Header
      v-if="showHeader"
      ref="headerRef"
      :default-avatar="headerConfig.defaultAvatar"
      :default-nickname="headerConfig.defaultNickname"
      :show-status="headerConfig.showStatus"
      :show-theme-toggle="headerConfig.showThemeToggle"
      :notification-count="notificationCount"
      :theme="headerConfig.theme"
      :enable-animations="headerConfig.enableAnimations"
      @user-click="handleUserClick"
      @notification-click="handleNotificationClick"
      @settings-click="handleSettingsClick"
      @status-click="handleStatusClick"
      @theme-change="handleThemeChange"
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
      :tab-list="tabbarConfig.list"
      :fixed="tabbarConfig.fixed"
      :background-color="tabbarConfig.backgroundColor"
      :active-color="tabbarConfig.activeColor"
      :inactive-color="tabbarConfig.inactiveColor"
      @change="handleTabChange"
    />

    <!-- 全局Loading -->
    <view v-if="globalLoading" class="global-loading">
      <u-loading-page :loading="true" loading-text="加载中..." />
    </view>
  </view>
</template>

<script setup>
import { computed, ref, onMounted, watch, getCurrentInstance } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { useAppStore } from "@/stores/modules/app";
import {
  layoutConfig,
  headerThemeConfig,
  tabbarConfig,
  getLayoutType,
  getHeaderConfig,
  getActiveTabIndex,
} from "./data.js";

// 导入子组件
import C_Header from "../C_Header/index.vue";
import C_Tabbar from "../C_Tabbar/index.vue";

// 导入样式
import "./index.scss";

// Props
const props = defineProps({
  // 是否显示全局loading
  globalLoading: {
    type: Boolean,
    default: false,
  },
  // 强制Layout类型 (可选: 'none', 'header-only', 'full')
  forceLayoutType: {
    type: String,
    default: "",
    validator: (value) => ["", "none", "header-only", "full"].includes(value),
  },
  // 通知数量
  notificationCount: {
    type: Number,
    default: 0,
  },
});

// Emits
const emit = defineEmits([
  "userClick",
  "notificationClick",
  "settingsClick",
  "statusClick",
  "themeChange",
  "tabChange",
  "layoutChange",
]);

// Store
const userStore = useUserStore();
const appStore = useAppStore();

// 响应式数据
const headerRef = ref();
const tabbarRef = ref();
const currentTabIndex = ref(0);

// 获取当前页面路径
const getCurrentPath = () => {
  const pages = getCurrentPages();
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1];
    return `/${currentPage.route}`;
  }
  return "/pages/index/index"; // 默认路径
};

// 计算属性
const currentPath = computed(() => getCurrentPath());

const layoutType = computed(() => {
  if (props.forceLayoutType) {
    return props.forceLayoutType;
  }
  return getLayoutType(currentPath.value);
});

const showHeader = computed(() => {
  return layoutType.value === "header-only" || layoutType.value === "full";
});

const showTabbar = computed(() => {
  return layoutType.value === "full";
});

const headerConfig = computed(() => {
  const config = getHeaderConfig(currentPath.value);
  return {
    defaultAvatar: "/static/robot-avatar.png",
    defaultNickname: "CHENY",
    enableAnimations: true,
    ...config,
  };
});

const layoutClasses = computed(() => ({
  "layout-none": layoutType.value === "none",
  "layout-header-only": layoutType.value === "header-only",
  "layout-full": layoutType.value === "full",
  "has-header": showHeader.value,
  "has-tabbar": showTabbar.value,
}));

const contentStyles = computed(() => {
  const styles = {};

  // 根据是否有Tabbar调整底部间距
  if (showTabbar.value) {
    styles.paddingBottom = "120rpx"; // Tabbar高度
  }

  return styles;
});

// 监听当前Tab
watch(
  () => currentPath.value,
  (newPath) => {
    if (showTabbar.value) {
      const activeIndex = getActiveTabIndex(newPath);
      if (activeIndex !== -1) {
        currentTabIndex.value = activeIndex;
      }
    }

    // 触发Layout变化事件
    emit("layoutChange", {
      path: newPath,
      layoutType: layoutType.value,
      showHeader: showHeader.value,
      showTabbar: showTabbar.value,
    });
  },
  { immediate: true }
);

// 事件处理
const handleUserClick = (data) => {
  emit("userClick", data);
};

const handleNotificationClick = (data) => {
  emit("notificationClick", data);
};

const handleSettingsClick = () => {
  emit("settingsClick");
};

const handleStatusClick = (data) => {
  emit("statusClick", data);
};

const handleThemeChange = (data) => {
  emit("themeChange", data);
};

// 导航状态管理
const isNavigating = ref(false);

const handleTabChange = (data) => {
  const { item, index } = data;

  // 更新当前Tab索引
  currentTabIndex.value = index;

  // 跳转到对应页面
  if (item.path !== currentPath.value) {
    if (isNavigating.value) {
      console.log("Layout: 正在导航中，忽略此次跳转");
      return;
    }

    isNavigating.value = true;

    // 对H5环境特殊处理
    // #ifdef H5
    setTimeout(() => {
      uni.navigateTo({
        url: item.path,
        success: () => {
          emit("tabChange", data);
          setTimeout(() => {
            isNavigating.value = false;
          }, 300);
        },
        fail: (err) => {
          console.error("Layout H5跳转失败:", err);
          isNavigating.value = false;
        },
      });
    }, 100);
    // #endif

    // 其他平台使用redirectTo
    // #ifndef H5
    uni.redirectTo({
      url: item.path,
      success: () => {
        emit("tabChange", data);
        setTimeout(() => {
          isNavigating.value = false;
        }, 500);
      },
      fail: (err) => {
        console.error("Tab切换失败:", err);
        // 降级处理
        uni.navigateTo({
          url: item.path,
          success: () => {
            emit("tabChange", data);
            setTimeout(() => {
              isNavigating.value = false;
            }, 500);
          },
          fail: (err2) => {
            console.error("Layout: 降级跳转也失败:", err2);
            isNavigating.value = false;
          },
        });
      },
    });
    // #endif
  } else {
    emit("tabChange", data);
  }
};

// 公共方法
const setHeaderStatus = (status) => {
  headerRef.value?.setAiStatus?.(status);
};

const setHeaderTheme = (theme) => {
  headerRef.value?.setTheme?.(theme);
};

const updateTabBadge = (tabId, count) => {
  const tab = tabbarConfig.list.find((item) => item.id === tabId);
  if (tab) {
    tab.badge = count;
  }
};

const getLayoutInfo = () => ({
  currentPath: currentPath.value,
  layoutType: layoutType.value,
  showHeader: showHeader.value,
  showTabbar: showTabbar.value,
  headerConfig: headerConfig.value,
  tabbarConfig: tabbarConfig,
});

// 初始化
onMounted(() => {
  // 设置初始Tab索引
  if (showTabbar.value) {
    const activeIndex = getActiveTabIndex(currentPath.value);
    if (activeIndex !== -1) {
      currentTabIndex.value = activeIndex;
    }
  }
});

// 暴露方法给父组件
defineExpose({
  setHeaderStatus,
  setHeaderTheme,
  updateTabBadge,
  getLayoutInfo,
  headerRef,
  tabbarRef,
});
</script>
