/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-08 15:53:45
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-09-09 16:38:49
 * @FilePath: \Robot_uniApp\src\utils\router.js
 * @Description: 路由封装和权限控制
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
 */

// 使用依赖注入模式，避免循环引用
let userStoreInstance = null;

// 设置 store 实例（由 main.js 在初始化后调用）C
export function setUserStore(store) {
  userStoreInstance = store;
}

// 获取当前用户状态（纯函数，无副作用）
function getCurrentUserState() {
  if (!userStoreInstance) {
    return {
      isLoggedIn: false,
      permissions: [],
      roles: []
    };
  }
  
  return {
    isLoggedIn: userStoreInstance.isLoggedIn,
    permissions: userStoreInstance.permissions || [],
    roles: userStoreInstance.roles || []
  };
}

/**
 * 路由配置
 */
export const routeConfig = {
  // 无需登录的页面
  whiteList: [
    "/pages/login/index",
    "/pages/register/index",
    "/pages/forgot/index",
    "/pages/index/index",
  ],

  // 需要登录的页面
  authPages: [
    "/pages/user/profile",
    "/pages/user/settings",
    "/pages/order/list",
    "/pages/order/detail",
  ],

  // 需要特定权限的页面
  permissionPages: {
    "/pages/admin/dashboard": ["admin"],
    "/pages/admin/users": ["admin", "user:manage"],
    "/pages/finance/report": ["finance:view"],
  },
};

/**
 * 路由守卫类
 */
class RouterGuard {
  constructor() {
    this.interceptRoutes();
  }

  // 拦截所有路由方法
  interceptRoutes() {
    const routeMethods = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
    routeMethods.forEach((method) => {
      this.interceptRoute(method);
    });
  }

  // 拦截单个路由方法
  interceptRoute(method) {
    const originalMethod = uni[method];
    uni[method] = (options) => {
      return this.beforeRoute(options, originalMethod, method);
    };
  }

  // 路由前置守卫
  beforeRoute(options, originalMethod, method) {
    const { url } = options;
    const pagePath = this.getPagePath(url);
    const checkResult = this.checkPermission(pagePath);

    if (!checkResult.pass) {
      this.handlePermissionDenied(checkResult, method);
      return;
    }

    return originalMethod.call(uni, options);
  }

  // 提取页面路径（去掉参数）
  getPagePath(url) {
    return url.split("?")[0];
  }

  // 权限检查（纯函数，无副作用）
  checkPermission(pagePath) {
    const userState = getCurrentUserState();
    
    // 白名单直接通过
    if (routeConfig.whiteList.includes(pagePath)) {
      return { pass: true };
    }

    // 检查是否需要登录
    if (routeConfig.authPages.includes(pagePath)) {
      if (!userState.isLoggedIn) {
        return {
          pass: false,
          type: "auth",
          message: "请先登录",
          redirectTo: "/pages/login/index",
        };
      }
    }

    // 检查特定权限
    const requiredPermissions = routeConfig.permissionPages[pagePath];
    if (requiredPermissions) {
      if (!userState.isLoggedIn) {
        return {
          pass: false,
          type: "auth",
          message: "请先登录",
          redirectTo: "/pages/login/index",
        };
      }

      const hasPermission = requiredPermissions.some(
        (permission) =>
          userState.permissions.includes(permission) ||
          userState.roles.includes(permission)
      );

      if (!hasPermission) {
        return {
          pass: false,
          type: "permission",
          message: "权限不足",
          redirectTo: "/pages/index/index",
        };
      }
    }

    return { pass: true };
  }

  // 处理权限拒绝
  handlePermissionDenied(checkResult, routeMethod) {
    const { type, message, redirectTo } = checkResult;

    uni.showToast({
      title: message,
      icon: "none",
      duration: 2000,
    });

    setTimeout(() => {
      if (type === "auth") {
        if (routeMethod === "switchTab") {
          uni.reLaunch({ url: redirectTo });
        } else {
          uni.navigateTo({ url: redirectTo });
        }
      } else if (type === "permission") {
        if (routeMethod === "switchTab") {
          uni.switchTab({ url: redirectTo });
        } else {
          const pages = getCurrentPages();
          if (pages.length > 1) {
            uni.navigateBack();
          } else {
            uni.reLaunch({ url: redirectTo });
          }
        }
      }
    }, 2000);
  }
}

/**
 * 编程式导航封装
 */
export const router = {
  push(url, params = {}) {
    const fullUrl = this.buildUrl(url, params);
    uni.navigateTo({ url: fullUrl });
  },

  replace(url, params = {}) {
    const fullUrl = this.buildUrl(url, params);
    uni.redirectTo({ url: fullUrl });
  },

  reLaunch(url, params = {}) {
    const fullUrl = this.buildUrl(url, params);
    uni.reLaunch({ url: fullUrl });
  },

  switchTab(url) {
    uni.switchTab({ url });
  },

  back(delta = 1) {
    uni.navigateBack({ delta });
  },

  buildUrl(url, params) {
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const queryString = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join("&");

    return `${url}?${queryString}`;
  },

  parseQuery(url) {
    const [path, queryString] = url.split("?");
    const params = {};

    if (queryString) {
      queryString.split("&").forEach((param) => {
        const [key, value] = param.split("=");
        params[key] = decodeURIComponent(value || "");
      });
    }

    return { path, params };
  },
};

// 初始化路由守卫
const routerGuard = new RouterGuard();

// 导出初始化函数
export function initRouter() {
  console.log("路由系统初始化完成");
}

export default routerGuard;
