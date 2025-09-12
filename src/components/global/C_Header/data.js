import { computed, ref } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { useAppStore } from "@/stores/modules/app";

// =================================
// 组件Props定义
// =================================

export const headerProps = {
  // 基础配置
  defaultAvatar: {
    type: String,
    default: "/static/robot-avatar.png",
  },
  defaultNickname: {
    type: String,
    default: "CHENY",
  },

  // 功能开关
  showStatus: {
    type: Boolean,
    default: true,
  },
  showBack: {
    type: Boolean,
    default: false,
  },
  showThemeToggle: {
    type: Boolean,
    default: false,
  },

  // 🔥 新增：紧凑模式配置
  isCompactMode: {
    type: Boolean,
    default: false,
  },

  // 显示内容
  title: {
    type: String,
    default: "",
  },
  notificationCount: {
    type: Number,
    default: 0,
  },

  // 主题配置
  theme: {
    type: String,
    default: "default",
    validator: (value) =>
      ["default", "primary", "ocean", "sunset", "forest"].includes(value),
  },
  iconSize: {
    type: [Number, String],
    default: 20,
  },

  // 动画配置
  enableAnimations: {
    type: Boolean,
    default: true,
  },
};

// =================================
// 组件Emits定义
// =================================
export const headerEmits = [
  "userClick",
  "notificationClick",
  "settingsClick",
  "statusClick",
  "themeChange",
  "backClick",
];

// =================================
// 状态配置
// =================================
export const statusConfig = {
  online: {
    text: "在线",
    color: "#00e676",
    class: "status-online",
  },
  offline: {
    text: "离线",
    color: "#9e9e9e",
    class: "status-offline",
  },
  busy: {
    text: "忙碌中",
    color: "#ff9800",
    class: "status-busy",
  },
  away: {
    text: "离开",
    color: "#ffc107",
    class: "status-away",
  },
};

// =================================
// 问候语配置
// =================================
export const greetingConfig = {
  morning: {
    text: "上午好",
    timeRange: [6, 12],
    icon: "☀️",
  },
  afternoon: {
    text: "下午好",
    timeRange: [12, 18],
    icon: "🌤️",
  },
  evening: {
    text: "晚上好",
    timeRange: [18, 24],
    icon: "🌙",
  },
  night: {
    text: "深夜好",
    timeRange: [0, 6],
    icon: "🌟",
  },
};

// =================================
// 主题配置
// =================================
export const themeConfig = {
  default: {
    gradient:
      "linear-gradient(135deg, #00d4ff 0%, #0099cc 40%, #006699 80%, rgba(0, 102, 153, 0.95) 100%)",
    name: "默认蓝色",
  },
  primary: {
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    name: "主题紫色",
  },
  ocean: {
    gradient:
      "linear-gradient(135deg, #00d4ff 0%, #0099cc 40%, #006699 80%, rgba(0, 102, 153, 0.95) 100%)",
    name: "海洋蓝色",
  },
  sunset: {
    gradient: "linear-gradient(135deg, #ff9a56 0%, #ff6b6b 50%, #ee5a24 100%)",
    name: "日落橙色",
  },
  forest: {
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    name: "森林绿色",
  },
};

// =================================
// 主要逻辑Hook
// =================================
export function useHeaderData(props, emit) {
  // Store
  const userStore = useUserStore();
  const appStore = useAppStore();

  // 响应式数据
  const aiStatus = ref("online");
  const avatarError = ref(false);

  // =================================
  // 计算属性
  // =================================

  // 用户信息
  const userInfo = computed(() => userStore.userInfo || {});

  // 安全区域
  const safeAreaTop = computed(() => {
    try {
      const systemInfo = uni.getSystemInfoSync();
      return systemInfo.safeAreaInsets?.top || systemInfo.statusBarHeight || 44;
    } catch (e) {
      console.warn("获取安全区域失败，使用默认值:", e);
      return 44;
    }
  });

  // 头像显示逻辑
  const avatarSrc = computed(() => {
    if (avatarError.value) return props.defaultAvatar;

    const userAvatar = userInfo.value?.avatar;

    // 检查用户头像是否有效
    if (
      !userAvatar ||
      userAvatar === "/static/default-avatar.png" ||
      userAvatar.includes("undefined") ||
      userAvatar.includes("null")
    ) {
      return props.defaultAvatar;
    }

    return userAvatar;
  });

  // 用户显示名称
  const displayNickname = computed(() => {
    const nickname = userInfo.value?.nickname || userInfo.value?.name;
    return nickname || props.defaultNickname;
  });

  // 问候语逻辑
  const greeting = computed(() => {
    const hour = new Date().getHours();

    for (const [key, config] of Object.entries(greetingConfig)) {
      const [start, end] = config.timeRange;

      // 处理跨零点的时间段（如深夜 0-6点）
      if (start <= end) {
        if (hour >= start && hour < end) {
          return config.text;
        }
      } else {
        if (hour >= start || hour < end) {
          return config.text;
        }
      }
    }

    return "你好"; // 默认问候语
  });

  // 状态相关
  const currentStatus = computed(() => {
    return statusConfig[aiStatus.value] || statusConfig.online;
  });

  const statusClass = computed(() => {
    return currentStatus.value.class;
  });

  const statusText = computed(() => {
    return currentStatus.value.text;
  });

  // 当前主题配置
  const currentTheme = computed(() => {
    return themeConfig[props.theme] || themeConfig.default;
  });

  // =================================
  // 事件处理方法
  // =================================

  const handleUserClick = () => {
    emit("userClick", {
      userInfo: userInfo.value,
      greeting: greeting.value,
      displayName: displayNickname.value,
    });
  };

  const handleNotification = () => {
    emit("notificationClick", {
      count: props.notificationCount,
      timestamp: Date.now(),
    });
  };

  const handleSettings = () => {
    emit("settingsClick", {
      currentTheme: props.theme,
      timestamp: Date.now(),
    });
  };

  const handleStatusClick = () => {
    emit("statusClick", {
      status: aiStatus.value,
      statusText: statusText.value,
      statusColor: currentStatus.value.color,
    });
  };

  const handleBack = () => {
    emit("backClick", {
      timestamp: Date.now(),
      title: props.title,
    });
  };

  const handleAvatarError = () => {
    console.warn("Header: 用户头像加载失败，使用默认头像");
    avatarError.value = true;
  };

  // =================================
  // 公共方法
  // =================================

  /**
   * 设置AI状态
   * @param {string} status - 状态值: online | offline | busy | away
   */
  const setAiStatus = (status) => {
    if (statusConfig[status]) {
      const oldStatus = aiStatus.value;
      aiStatus.value = status;

      console.log(`Header: AI状态从 ${oldStatus} 切换到 ${status}`);

      // 触发状态变化事件
      emit("statusClick", {
        oldStatus,
        newStatus: status,
        statusText: statusConfig[status].text,
      });
    } else {
      console.warn(`Header: 无效的状态值: ${status}`);
    }
  };

  /**
   * 重置头像错误状态
   */
  const resetAvatarError = () => {
    avatarError.value = false;
    console.log("Header: 重置头像错误状态");
  };

  /**
   * 切换AI状态（循环切换）
   */
  const toggleAiStatus = () => {
    const statusKeys = Object.keys(statusConfig);
    const currentIndex = statusKeys.indexOf(aiStatus.value);
    const nextIndex = (currentIndex + 1) % statusKeys.length;
    const nextStatus = statusKeys[nextIndex];

    setAiStatus(nextStatus);
  };

  /**
   * 获取完整的状态信息
   */
  const getStatusInfo = () => {
    return {
      current: aiStatus.value,
      config: currentStatus.value,
      all: statusConfig,
    };
  };

  /**
   * 获取用户完整信息
   */
  const getUserFullInfo = () => {
    return {
      raw: userInfo.value,
      displayName: displayNickname.value,
      avatarSrc: avatarSrc.value,
      greeting: greeting.value,
    };
  };

  // =================================
  // 开发调试方法
  // =================================

  /**
   * 调试信息输出
   */
  const debugInfo = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Header Debug Info:", {
        props: props,
        userInfo: userInfo.value,
        displayName: displayNickname.value,
        avatarSrc: avatarSrc.value,
        greeting: greeting.value,
        status: getStatusInfo(),
        theme: currentTheme.value,
        safeAreaTop: safeAreaTop.value,
      });
    }
  };

  // =================================
  // 返回接口
  // =================================
  return {
    // 响应式数据
    aiStatus,
    avatarError,

    // 计算属性
    userInfo,
    safeAreaTop,
    avatarSrc,
    displayNickname,
    greeting,
    statusClass,
    statusText,
    currentStatus,
    currentTheme,

    // 事件处理方法
    handleUserClick,
    handleNotification,
    handleSettings,
    handleStatusClick,
    handleBack,
    handleAvatarError,

    // 公共方法
    setAiStatus,
    resetAvatarError,
    toggleAiStatus,
    getStatusInfo,
    getUserFullInfo,
    debugInfo,
  };
}
