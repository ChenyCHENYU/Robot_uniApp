/**
 * 存储 Key 枚举
 *
 * 统一管理 uni.getStorageSync / setStorageSync 的 key
 * 避免硬编码字符串散落在代码中
 */

export const STORAGE_KEYS = {
  // 用户相关
  TOKEN: "robot_token",
  USER_INFO: "robot_user_info",
  REMEMBER_ME: "robot_remember_me",
  LOGIN_ACCOUNT: "robot_login_account",

  // 应用相关
  THEME: "robot_theme",
  LANGUAGE: "robot_language",
  FIRST_LAUNCH: "robot_first_launch",
  APP_VERSION: "robot_app_version",

  // 搜索相关
  SEARCH_HISTORY: "robot_search_history",

  // 缓存相关
  DICT_CACHE: "robot_dict_cache",
  API_CACHE_PREFIX: "robot_api_cache_",
};
