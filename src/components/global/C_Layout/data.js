export const layoutConfig = {
  // 完全不需要Layout的页面（登录页、引导页等）
  noLayout: [
    "/pages/login/index",
    "/pages/register/index",
    "/pages/guide/index",
    // 后续如果有其他不需要Layout的页面，在这里添加
  ],

  // 只需要Header，不需要Tabbar的页面（详情页、设置页等）
  headerOnly: [
    "/pages/settings/index",
    "/pages/order/detail",
    "/pages/user/edit",
    // 后续如果有只需要Header的页面，在这里添加
  ],

  // 其他所有页面默认都是：Header + Tabbar
};

// Header主题配置（针对不同页面可以有不同主题）
export const headerThemeConfig = {
  // 默认主题
  default: {
    theme: "primary",
    showStatus: true,
    showThemeToggle: false,
  },

  // 特定页面的Header配置
  "/pages/index/index": {
    theme: "ocean",
    showStatus: true,
    showThemeToggle: true,
  },

  "/pages/chat/index": {
    theme: "primary",
    showStatus: true,
    showThemeToggle: false,
  },

  "/pages/robot/index": {
    theme: "sunset",
    showStatus: true,
    showThemeToggle: false,
  },

  "/pages/profile/index": {
    theme: "forest",
    showStatus: false,
    showThemeToggle: true,
  },
};

// Tabbar配置
export const tabbarConfig = {
  fixed: true,
  backgroundColor: "#ffffff",
  activeColor: "#007AFF",
  inactiveColor: "#8E8E93",

  // Tab列表
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
      showText: "R", // 自定义显示文字
    },
    {
      id: "profile",
      text: "我的",
      icon: "account",
      activeIcon: "account-fill",
      path: "/pages/profile/index",
      badge: 0,
    },
  ],
};

// 工具函数：判断当前页面需要什么Layout
export function getLayoutType(currentPath) {
  // 去掉查询参数，只保留路径
  const pagePath = currentPath.split("?")[0];

  // 检查是否不需要Layout
  if (layoutConfig.noLayout.includes(pagePath)) {
    return "none";
  }

  // 检查是否只需要Header
  if (layoutConfig.headerOnly.includes(pagePath)) {
    return "header-only";
  }

  // 默认情况：Header + Tabbar
  return "full";
}

// 工具函数：获取当前页面的Header配置
export function getHeaderConfig(currentPath) {
  const pagePath = currentPath.split("?")[0];
  return headerThemeConfig[pagePath] || headerThemeConfig.default;
}

// 工具函数：检查当前Tab是否激活
export function getActiveTabIndex(currentPath) {
  const pagePath = currentPath.split("?")[0];
  return tabbarConfig.list.findIndex((item) => item.path === pagePath);
}
