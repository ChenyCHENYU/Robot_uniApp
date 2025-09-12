
import { computed, ref } from "vue";

// =================================
// 组件Props定义
// =================================
export const layoutProps = {
  // 基础配置
  globalLoading: {
    type: Boolean,
    default: false,
  },
  notificationCount: {
    type: Number,
    default: 0,
  },
  
  // 覆盖智能判断的配置（可选）
  forceLayoutType: {
    type: String,
    default: "",
    validator: (value) => ["", "none", "header-only", "full"].includes(value),
  },
  showBack: {
    type: Boolean,
    default: undefined, // undefined表示使用智能判断
  },
  title: {
    type: String,
    default: "", // 空字符串表示使用智能生成
  },
  showStatus: {
    type: Boolean,
    default: undefined, // undefined表示使用智能判断
  },
  theme: {
    type: String,
    default: "default",
  },
  
  // 返回行为配置
  backBehavior: {
    type: String,
    default: "auto", // auto | custom | none
    validator: (value) => ["auto", "custom", "none"].includes(value),
  },
  backDelta: {
    type: Number,
    default: 1,
  },
  
  // 开发调试
  debug: {
    type: Boolean,
    default: false,
  },
};

// =================================
// 组件Emits定义  
// =================================
export const layoutEmits = [
  "userClick",
  "notificationClick",
  "settingsClick", 
  "statusClick",
  "themeChange",
  "tabChange",
  "layoutChange",
  "backClick",
  "backSuccess",
  "backFail",
];

// =================================
// 核心配置：TabBar页面定义
// =================================
export const tabbarConfig = {
  // Tab页面列表 - 根据你的实际页面修改这里
  list: [
    {
      id: "home",
      text: "首页", 
      icon: "home",
      activeIcon: "home-fill",
      path: "/pages/index/index",
      badge: 0,
    },
    {
      id: "chat",
      text: "AI对话",
      icon: "chat",
      activeIcon: "chat-fill", 
      path: "/pages/chat/index",
      badge: 0,
    },
    {
      id: "robot", 
      text: "机器人",
      icon: "android-circle",
      activeIcon: "android-circle-fill",
      path: "/pages/robot/index",
      badge: 0,
    },
    {
      id: "profile",
      text: "我的",
      icon: "account",
      activeIcon: "account-fill",
      path: "/pages/profile/index", 
      badge: 0,
    },
    // 如需添加新Tab页面，在此处添加：
    // {
    //   id: "discover",
    //   text: "发现",
    //   icon: "compass",
    //   activeIcon: "compass-fill",
    //   path: "/pages/discover/index",
    //   badge: 0,
    // },
  ],
  
  // UI配置
  fixed: true,
  backgroundColor: "#ffffff",
  activeColor: "#007AFF", 
  inactiveColor: "#8E8E93",
  borderTopColor: "rgba(0, 0, 0, 0.05)",
};

// =================================
// 例外配置：少量特殊页面
// =================================

// 完全不需要导航的页面（登录、引导、启动页等）
export const noLayoutPages = [
  "/pages/login/index",
  "/pages/register/index", 
  "/pages/guide/index",
  "/pages/splash/index",
  // 如需添加无Layout页面，在此处添加：
  // "/pages/welcome/index",    // 欢迎页
  // "/pages/maintenance/index", // 维护页
];

// 强制不显示返回按钮的页面（即使不是Tab页面）
export const noBackPages = [
  // 根据需要添加不显示返回按钮的页面：
  // "/pages/welcome/index",    // 欢迎页
  // "/pages/error/index",      // 错误页
  // "/pages/maintenance/index", // 维护页
];

// 特殊的Header配置（仅配置实际存在且需要特殊设置的页面）
export const specialHeaderConfigs = {
  // 根据你的实际页面需要，在此处添加特殊配置：
  
  // 示例：个人资料编辑页
  // "/pages/profile/edit": {
  //   title: "编辑个人资料",
  //   showStatus: false,
  //   theme: "default",
  // },
  
  // 示例：聊天详情页
  // "/pages/chat/conversation": {
  //   title: "AI对话",
  //   showStatus: true,
  //   theme: "primary",
  // },
  
  // 示例：设置页面
  // "/pages/settings/index": {
  //   title: "设置",
  //   showStatus: false,
  //   theme: "default",
  // },
  
  // 示例：关于页面
  // "/pages/settings/about": {
  //   title: "关于我们",
  //   showStatus: false,
  //   theme: "default",
  // },
  
  // 只有实际存在的页面才需要在这里配置！
  // 大部分页面都会自动判断，无需配置
};

// =================================
// 智能判断逻辑：约定大于配置
// =================================

/**
 * 获取TabBar页面路径集合
 */
const getTabBarPaths = () => {
  return tabbarConfig.list.map(item => item.path);
};

/**
 * 检查是否为TabBar页面
 */
export const isTabBarPage = (path) => {
  const cleanPath = path.split('?')[0];
  return getTabBarPaths().includes(cleanPath);
};

/**
 * 检查是否为无Layout页面
 */
export const isNoLayoutPage = (path) => {
  const cleanPath = path.split('?')[0];
  return noLayoutPages.includes(cleanPath);
};

/**
 * 获取页面层级信息
 */
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

/**
 * 🔥 智能判断Layout类型
 * 
 * 约定规则：
 * 1. 在noLayoutPages中 → none（无导航）
 * 2. 在TabBar中 → full（Header + TabBar）  
 * 3. 不在TabBar中 → header-only（只有Header + 返回按钮）
 */
export const getSmartLayoutType = (currentPath) => {
  const cleanPath = currentPath.split('?')[0];
  
  // 规则1：无Layout页面
  if (isNoLayoutPage(cleanPath)) {
    return 'none';
  }
  
  // 规则2：TabBar页面 = Header + TabBar
  if (isTabBarPage(cleanPath)) {
    return 'full';
  }
  
  // 规则3：其他所有页面 = Header + 返回按钮
  return 'header-only';
};

/**
 * 🔥 智能判断是否显示返回按钮
 * 
 * 约定规则：
 * 1. TabBar页面 → 不显示返回按钮
 * 2. noBackPages中的页面 → 不显示返回按钮
 * 3. 页面栈只有1层 → 不显示返回按钮（防止首页异常显示返回）
 * 4. 其他情况 → 显示返回按钮
 */
export const shouldShowBackButton = (currentPath) => {
  const cleanPath = currentPath.split('?')[0];
  const { canGoBack, isFirstPage } = getPageStackInfo();
  
  // 规则1：TabBar页面不显示返回按钮
  if (isTabBarPage(cleanPath)) {
    return false;
  }
  
  // 规则2：特殊页面不显示返回按钮
  if (noBackPages.includes(cleanPath)) {
    return false;
  }
  
  // 规则3：首页不显示返回按钮（防止异常情况）
  if (isFirstPage) {
    return false;
  }
  
  // 规则4：其他情况根据页面栈判断
  return canGoBack;
};

/**
 * 🔥 智能生成页面标题
 * 
 * 约定规则：
 * 1. 优先使用传入的title参数
 * 2. 其次使用specialHeaderConfigs中的配置
 * 3. 最后根据路径自动生成标题
 */
export const getSmartPageTitle = (currentPath, propsTitle = '') => {
  const cleanPath = currentPath.split('?')[0];
  
  // 规则1：优先使用props传入的title
  if (propsTitle && propsTitle.trim()) {
    return propsTitle.trim();
  }
  
  // 规则2：使用特殊配置的title
  const specialConfig = specialHeaderConfigs[cleanPath];
  if (specialConfig?.title) {
    return specialConfig.title;
  }
  
  // 规则3：根据路径自动生成标题
  const pathSegments = cleanPath.split('/').filter(Boolean);
  
  if (pathSegments.length >= 2) {
    const moduleName = pathSegments[1]; // pages/[module]/xxx
    const pageName = pathSegments[2] || 'index'; // 页面名
    
    // 模块标题映射（根据你的实际模块修改）
    const moduleMap = {
      'settings': '设置',
      'profile': '个人中心', 
      'order': '订单',
      'chat': '聊天',
      'user': '用户',
      'product': '商品',
      'article': '文章',
      'demo': '演示',
      'test': '测试',
      'about': '关于',
      'help': '帮助',
      'feedback': '意见反馈',
      // 根据你的实际模块在此添加更多映射
    };
    
    // 页面标题映射
    const pageMap = {
      'detail': '详情',
      'edit': '编辑',
      'create': '创建',
      'add': '添加',
      'list': '列表',
      'index': '', // index页面不显示额外标题
      'about': '关于',
      'privacy': '隐私政策',
      'help': '帮助',
      'feedback': '反馈',
      'profile': '个人资料',
      'setting': '设置',
      // 根据你的实际页面在此添加更多映射
    };
    
    const moduleTitle = moduleMap[moduleName] || moduleName;
    const pageTitle = pageMap[pageName] || pageName;
    
    // 组合标题
    if (pageTitle && pageTitle !== moduleTitle) {
      return `${moduleTitle}${pageTitle}`;
    } else {
      return moduleTitle;
    }
  }
  
  // 兜底标题
  return '页面';
};

/**
 * 🔥 智能获取Header配置
 */
export const getSmartHeaderConfig = (currentPath, props = {}) => {
  const cleanPath = currentPath.split('?')[0];
  const specialConfig = specialHeaderConfigs[cleanPath] || {};
  
  return {
    // 基础配置
    defaultAvatar: "/static/robot-avatar.png",
    defaultNickname: "CHENY",
    enableAnimations: true,
    
    // 智能判断的配置
    showBack: props.showBack !== undefined ? props.showBack : shouldShowBackButton(currentPath),
    title: getSmartPageTitle(currentPath, props.title),
    
    // 默认配置
    showStatus: true,
    theme: 'default',
    showThemeToggle: false,
    iconSize: 20,
    
    // 覆盖特殊配置
    ...specialConfig,
    
    // props优先级最高（过滤掉undefined值）
    ...Object.fromEntries(
      Object.entries(props).filter(([_, value]) => value !== undefined)
    ),
  };
};

/**
 * 获取当前Tab索引
 */
export const getCurrentTabIndex = (currentPath) => {
  const cleanPath = currentPath.split('?')[0];
  return tabbarConfig.list.findIndex(item => item.path === cleanPath);
};

/**
 * 更新指定Tab的Badge数量
 */
export const updateTabBadge = (tabId, count) => {
  const tab = tabbarConfig.list.find((item) => item.id === tabId);
  if (tab) {
    tab.badge = count;
    console.log(`更新Tab[${tabId}]的Badge: ${count}`);
  } else {
    console.warn(`找不到Tab[${tabId}]`);
  }
};

/**
 * 获取当前页面完整信息
 */
export const getCurrentPageInfo = () => {
  const pages = getCurrentPages();
  if (pages.length === 0) return null;
  
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
// 智能Layout Hook
// =================================
export function useSmartLayout(props) {
  const isNavigating = ref(false);
  const currentTabIndex = ref(0);

  // 获取当前页面路径
  const getCurrentPath = () => {
    const pages = getCurrentPages();
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      return `/${currentPage.route}`;
    }
    return "/pages/index/index";
  };

  // 响应式计算属性
  const currentPath = computed(() => getCurrentPath());
  
  const layoutType = computed(() => {
    if (props.forceLayoutType) {
      return props.forceLayoutType;
    }
    return getSmartLayoutType(currentPath.value);
  });

  const showHeader = computed(() => {
    return layoutType.value === "header-only" || layoutType.value === "full";
  });

  const showTabbar = computed(() => {
    return layoutType.value === "full";
  });

  const headerConfig = computed(() => {
    return getSmartHeaderConfig(currentPath.value, {
      showBack: props.showBack,
      title: props.title,
      showStatus: props.showStatus,
      theme: props.theme,
    });
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
    if (showTabbar.value) {
      styles.paddingBottom = "120rpx"; // 为TabBar预留空间
    }
    return styles;
  });

  // 工具方法
  const canGoBack = () => {
    return getPageStackInfo().canGoBack;
  };

  const getPageInfo = () => {
    return {
      path: currentPath.value,
      layoutType: layoutType.value,
      showHeader: showHeader.value, 
      showTabbar: showTabbar.value,
      headerConfig: headerConfig.value,
      stackInfo: getPageStackInfo(),
    };
  };

  return {
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
  };
}

// =================================
// 调试工具：显示当前页面的智能判断结果
// =================================
export const debugCurrentPage = () => {
  const pages = getCurrentPages();
  const currentPath = pages.length > 0 ? `/${pages[pages.length - 1].route}` : '';
  const pageInfo = getPageStackInfo();
  
  const result = {
    当前路径: currentPath,
    页面层级: pageInfo.total,
    页面栈: pageInfo.stack,
    是否可返回: pageInfo.canGoBack,
    是否TabBar页面: isTabBarPage(currentPath),
    是否无Layout页面: isNoLayoutPage(currentPath),
    Layout类型: getSmartLayoutType(currentPath),
    是否显示返回按钮: shouldShowBackButton(currentPath),
    智能标题: getSmartPageTitle(currentPath),
    Header配置: getSmartHeaderConfig(currentPath),
    当前Tab索引: getCurrentTabIndex(currentPath),
  };
  
  console.log('🔍 页面智能判断结果:', result);
  
  return result;
};

// 开发环境下自动注册调试方法
if (process.env.NODE_ENV === 'development') {
  // 可以在控制台调用 debugCurrentPage() 查看当前页面判断结果
  globalThis.debugCurrentPage = debugCurrentPage;
  
  // 添加全局快捷调试方法
  globalThis.layoutDebug = {
    currentPage: debugCurrentPage,
    isTabBarPage,
    isNoLayoutPage,
    getPageStackInfo,
    getSmartLayoutType,
    shouldShowBackButton,
    getSmartPageTitle,
    getSmartHeaderConfig,
  };
  
  console.log('🛠️ Layout调试工具已加载，可在控制台使用：');
  console.log('  - debugCurrentPage() // 查看当前页面信息');
  console.log('  - layoutDebug // 访问所有调试工具');
}

// =================================
// 使用指南：如何添加新页面配置
// =================================

/**
 * 📖 使用指南：
 * 
 * 1. 添加新的Tab页面：
 *    在 tabbarConfig.list 中添加新的Tab配置
 * 
 * 2. 添加无Layout页面：
 *    在 noLayoutPages 数组中添加页面路径
 * 
 * 3. 添加不显示返回按钮的页面：
 *    在 noBackPages 数组中添加页面路径
 * 
 * 4. 添加特殊Header配置：
 *    在 specialHeaderConfigs 对象中添加页面配置
 * 
 * 5. 大部分普通页面：
 *    什么都不需要配置！系统会自动判断显示Header+返回按钮
 * 
 * 6. 自定义标题映射：
 *    在 getSmartPageTitle 函数中的 moduleMap 和 pageMap 中添加映射
 */