import { computed, ref } from "vue";

// =================================
// 配置定义
// =================================
export const layoutProps = {
  globalLoading: { type: Boolean, default: false },
  notificationCount: { type: Number, default: 0 },
  forceLayoutType: { 
    type: String, 
    default: "",
    validator: (value) => ["", "none", "header-only", "full"].includes(value)
  },
  showBack: { type: Boolean, default: undefined },
  title: { type: String, default: "" },
  showStatus: { type: Boolean, default: undefined },
  theme: { type: String, default: "default" },
  backBehavior: { 
    type: String, 
    default: "auto",
    validator: (value) => ["auto", "custom", "none"].includes(value)
  },
  backDelta: { type: Number, default: 1 },
  debug: { type: Boolean, default: false },
};

export const layoutEmits = [
  "userClick", "notificationClick", "settingsClick", "statusClick", 
  "themeChange", "tabChange", "layoutChange", "backClick", "backSuccess", "backFail"
];

export const tabbarConfig = {
  list: [
    { id: "home", text: "首页", icon: "home", activeIcon: "home-fill", path: "/pages/index/index", badge: 0 },
    { id: "chat", text: "AI对话", icon: "chat", activeIcon: "chat-fill", path: "/pages/chat/index", badge: 0 },
    { id: "robot", text: "机器人", icon: "android-circle", activeIcon: "android-circle-fill", path: "/pages/robot/index", badge: 0 },
    { id: "profile", text: "我的", icon: "account", activeIcon: "account-fill", path: "/pages/profile/index", badge: 0 },
  ],
  fixed: true,
  backgroundColor: "#ffffff",
  activeColor: "#007AFF",
  inactiveColor: "#8E8E93",
  borderTopColor: "rgba(0, 0, 0, 0.05)",
};

// 特殊页面配置
export const noLayoutPages = [
  "/pages/login/index", "/pages/register/index", 
  "/pages/guide/index", "/pages/splash/index"
];

export const noBackPages = [];
export const specialHeaderConfigs = {};

// =================================
// H5导航历史管理
// =================================
const NAV_KEY = 'nav_history';
const MAX_HISTORY = 5;

const saveNavHistory = (path) => {
  // #ifdef H5
  try {
    let history = JSON.parse(localStorage.getItem(NAV_KEY) || '[]');
    if (history[history.length - 1] !== path) {
      history.push(path);
      if (history.length > MAX_HISTORY) history.shift();
      localStorage.setItem(NAV_KEY, JSON.stringify(history));
    }
  } catch (e) {}
  // #endif
};

const getNavHistory = () => {
  // #ifdef H5
  try {
    return JSON.parse(localStorage.getItem(NAV_KEY) || '[]');
  } catch (e) {
    return [];
  }
  // #endif
  return [];
};

const getUrlParams = () => {
  // #ifdef H5
  if (typeof window !== 'undefined' && window.location?.search) {
    const params = {};
    new URLSearchParams(window.location.search).forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }
  // #endif
  return {};
};

// =================================
// 核心判断逻辑
// =================================
const getTabBarPaths = () => tabbarConfig.list.map(item => item.path);
const cleanPath = (path) => path.split('?')[0];

export const isTabBarPage = (path) => getTabBarPaths().includes(cleanPath(path));
export const isNoLayoutPage = (path) => noLayoutPages.includes(cleanPath(path));

export const getPageStackInfo = () => {
  const pages = getCurrentPages();
  return {
    total: pages.length,
    current: pages[pages.length - 1],
    canGoBack: pages.length > 1,
    isFirstPage: pages.length === 1,
    stack: pages.map(page => `/${page.route}`),
  };
};

export const getSmartLayoutType = (currentPath) => {
  const path = cleanPath(currentPath);
  if (isNoLayoutPage(path)) return 'none';
  if (isTabBarPage(path)) return 'full';
  return 'header-only';
};

// H5刷新修复的返回按钮判断
export const shouldShowBackButton = (currentPath) => {
  const path = cleanPath(currentPath);
  const { canGoBack, isFirstPage } = getPageStackInfo();
  
  // TabBar页面和特殊页面不显示返回
  if (isTabBarPage(path) || noBackPages.includes(path)) return false;
  
  // 正常页面栈情况
  if (canGoBack) return true;
  
  // H5刷新修复逻辑
  if (isFirstPage) {
    // #ifdef H5
    // 检查URL参数
    if (getUrlParams().from) return true;
    
    // 检查导航历史
    if (getNavHistory().length > 1) return true;
    
    // 检查页面特征（详情类页面）
    const detailPatterns = ['/detail/', '/info/', '/edit/', '/settings/', '/profile/', '/order/', '/user/'];
    if (detailPatterns.some(pattern => path.includes(pattern))) return true;
    // #endif
    return false;
  }
  
  return canGoBack;
};

// 智能标题生成
export const getSmartPageTitle = (currentPath, propsTitle = '') => {
  if (propsTitle?.trim()) return propsTitle.trim();
  
  const path = cleanPath(currentPath);
  const specialTitle = specialHeaderConfigs[path]?.title;
  if (specialTitle) return specialTitle;
  
  // 根据路径生成标题
  const segments = path.split('/').filter(Boolean);
  if (segments.length >= 2) {
    const [, module, page = 'index'] = segments;
    
    const moduleMap = {
      'settings': '设置', 'profile': '个人中心', 'chat': '聊天', 
      'robot': '机器人', 'order': '订单', 'user': '用户'
    };
    
    const pageMap = {
      'detail': '详情', 'edit': '编辑', 'add': '添加', 'list': '列表'
    };
    
    const moduleTitle = moduleMap[module] || module;
    const pageTitle = pageMap[page] || '';
    
    return pageTitle ? `${moduleTitle}${pageTitle}` : moduleTitle;
  }
  
  return '页面';
};

// Header配置生成
export const getSmartHeaderConfig = (currentPath, props = {}) => {
  // 🔥 添加紧凑模式计算
  const layoutType = getSmartLayoutType(currentPath);
  const isCompactMode = layoutType === "header-only"; // 无TabBar的页面使用紧凑模式

  // 调试日志
  console.log("🔍 Header配置调试:", {
    路径: currentPath,
    布局类型: layoutType,
    是否紧凑模式: isCompactMode,
  });

  return {
    defaultAvatar: "/static/robot-avatar.png",
    defaultNickname: "CHENY",
    showBack:
      props.showBack !== undefined
        ? props.showBack
        : shouldShowBackButton(currentPath),
    title: getSmartPageTitle(currentPath, props.title),
    showStatus: true,
    theme: "default",
    iconSize: 20,
    enableAnimations: true,

    // 添加紧凑模式配置
    isCompactMode: isCompactMode,

    ...specialHeaderConfigs[cleanPath(currentPath)],
    ...Object.fromEntries(
      Object.entries(props).filter(([_, value]) => value !== undefined)
    ),
  };
};

// 工具函数
export const getCurrentTabIndex = (currentPath) => {
  return tabbarConfig.list.findIndex(item => item.path === cleanPath(currentPath));
};

export const updateTabBadge = (tabId, count) => {
  const tab = tabbarConfig.list.find(item => item.id === tabId);
  if (tab) tab.badge = count;
};

export const getCurrentPageInfo = () => {
  const pages = getCurrentPages();
  if (!pages.length) return null;
  
  const currentPage = pages[pages.length - 1];
  const currentPath = `/${currentPage.route}`;
  
  return {
    path: currentPath,
    query: currentPage.options || {},
    layoutType: getSmartLayoutType(currentPath),
    headerConfig: getSmartHeaderConfig(currentPath),
    canGoBack: pages.length > 1,
    pageStack: pages.length,
    stackInfo: getPageStackInfo(),
  };
};

// =================================
// 增强的导航功能
// =================================
const enhancedGoBack = (delta = 1) => {
  const { canGoBack } = getPageStackInfo();
  
  // 正常返回
  if (canGoBack) {
    return uni.navigateBack({ delta });
  }
  
  // #ifdef H5
  // H5修复策略
  const urlParams = getUrlParams();
  if (urlParams.from) {
    return uni.navigateTo({ url: urlParams.from });
  }
  
  const history = getNavHistory();
  if (history.length > 1) {
    const previousPage = history[history.length - 2];
    const newHistory = history.slice(0, -1);
    localStorage.setItem(NAV_KEY, JSON.stringify(newHistory));
    return uni.navigateTo({ url: previousPage });
  }
  // #endif
  
  // 返回首页
  const firstTab = tabbarConfig.list[0];
  return firstTab ? uni.switchTab({ url: firstTab.path }) : uni.reLaunch({ url: '/pages/index/index' });
};

const enhancedNavigateTo = (url) => {
  const pages = getCurrentPages();
  if (pages.length > 0) {
    const currentPath = `/${pages[pages.length - 1].route}`;
    saveNavHistory(currentPath);
  }
  return uni.navigateTo({ url });
};

// =================================
// 主Hook函数
// =================================
export function useSmartLayout(props) {
  const isNavigating = ref(false);
  const currentTabIndex = ref(0);

  const getCurrentPath = () => {
    const pages = getCurrentPages();
    return pages.length > 0 ? `/${pages[pages.length - 1].route}` : "/pages/index/index";
  };

  const currentPath = computed(() => getCurrentPath());
  const layoutType = computed(() => props.forceLayoutType || getSmartLayoutType(currentPath.value));
  const showHeader = computed(() => ['header-only', 'full'].includes(layoutType.value));
  const showTabbar = computed(() => layoutType.value === 'full');

  const headerConfig = computed(() => getSmartHeaderConfig(currentPath.value, {
    showBack: props.showBack,
    title: props.title,
    showStatus: props.showStatus,
    theme: props.theme,
  }));

  const layoutClasses = computed(() => ({
    [`layout-${layoutType.value}`]: true,
    'has-header': showHeader.value,
    'has-tabbar': showTabbar.value,
  }));

  const contentStyles = computed(() => {
    const styles = {};
    if (showTabbar.value) styles.paddingBottom = "120rpx";
    return styles;
  });

  const canGoBack = () => getPageStackInfo().canGoBack;

  const getPageInfo = () => ({
    path: currentPath.value,
    layoutType: layoutType.value,
    showHeader: showHeader.value,
    showTabbar: showTabbar.value,
    headerConfig: headerConfig.value,
    stackInfo: getPageStackInfo(),
  });

  // 保存导航历史
  saveNavHistory(currentPath.value);

  return {
    // 状态
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
    
    // 方法
    canGoBack,
    getCurrentPath,
    getPageInfo,
    enhancedGoBack,
    enhancedNavigateTo,
  };
}

// =================================
// 调试工具
// =================================
export const debugCurrentPage = () => {
  const pages = getCurrentPages();
  const currentPath = pages.length > 0 ? `/${pages[pages.length - 1].route}` : '';
  
  const info = {
    当前路径: currentPath,
    页面层级: pages.length,
    Layout类型: getSmartLayoutType(currentPath),
    显示返回: shouldShowBackButton(currentPath),
    Header配置: getSmartHeaderConfig(currentPath),
  };
  
  console.log('页面调试信息:', info);
  return info;
};

// 开发环境注册调试
if (process.env.NODE_ENV === 'development') {
  globalThis.debugCurrentPage = debugCurrentPage;
}