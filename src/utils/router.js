// utils/router.js - 路由封装
import { useUserStore } from "@/stores";

/**
 * 路由配置
 */
export const routeConfig = {
  // 无需登录的页面
  whiteList: [
    "/pages/login/index",
    "/pages/register/index",
    "/pages/forgot/index",
    "/pages/index/index", // 首页可以不登录访问
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
    this.userStore = null;
    this.init();
  }

  init() {
    // 延迟获取 store，避免循环引用
    setTimeout(() => {
      this.userStore = useUserStore();
    }, 0);

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

    // 检查权限
    const checkResult = this.checkPermission(pagePath);

    if (!checkResult.pass) {
      this.handlePermissionDenied(checkResult, method);
      return;
    }

    // 权限通过，执行原始跳转
    return originalMethod.call(uni, options);
  }

  // 提取页面路径（去掉参数）
  getPagePath(url) {
    return url.split("?")[0];
  }

  // 权限检查
  checkPermission(pagePath) {
    if (!this.userStore) {
      return { pass: true };
    }

    // 白名单直接通过
    if (routeConfig.whiteList.includes(pagePath)) {
      return { pass: true };
    }

    // 检查是否需要登录
    if (routeConfig.authPages.includes(pagePath)) {
      if (!this.userStore.isLoggedIn) {
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
      if (!this.userStore.isLoggedIn) {
        return {
          pass: false,
          type: "auth",
          message: "请先登录",
          redirectTo: "/pages/login/index",
        };
      }

      const hasPermission = requiredPermissions.some(
        (permission) =>
          this.userStore.hasPermission(permission) ||
          this.userStore.hasRole(permission)
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

    // 显示提示
    uni.showToast({
      title: message,
      icon: "none",
      duration: 2000,
    });

    // 根据不同情况进行重定向
    setTimeout(() => {
      if (type === "auth") {
        // 登录验证失败，跳转到登录页
        if (routeMethod === "switchTab") {
          uni.reLaunch({ url: redirectTo });
        } else {
          uni.navigateTo({ url: redirectTo });
        }
      } else if (type === "permission") {
        // 权限不足，根据原来的跳转方式决定返回方式
        if (routeMethod === "switchTab") {
          // 如果是 tab 切换，跳转到首页
          uni.switchTab({ url: redirectTo });
        } else {
          // 其他情况返回上一页或首页
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

// 创建路由守卫实例
const routerGuard = new RouterGuard();

/**
 * 编程式导航封装
 */
export const router = {
  // 带权限检查的导航
  push(url, params = {}) {
    const fullUrl = this.buildUrl(url, params);
    uni.navigateTo({ url: fullUrl });
  },

  // 替换当前页面
  replace(url, params = {}) {
    const fullUrl = this.buildUrl(url, params);
    uni.redirectTo({ url: fullUrl });
  },

  // 重新启动应用
  reLaunch(url, params = {}) {
    const fullUrl = this.buildUrl(url, params);
    uni.reLaunch({ url: fullUrl });
  },

  // Tab 切换
  switchTab(url) {
    uni.switchTab({ url });
  },

  // 返回上一页
  back(delta = 1) {
    uni.navigateBack({ delta });
  },

  // 构建完整URL
  buildUrl(url, params) {
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const queryString = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join("&");

    return `${url}?${queryString}`;
  },

  // 解析URL参数
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

// 导出初始化函数
export function initRouter() {
  // 路由守卫已在模块加载时自动初始化
  console.log("路由系统初始化完成");
}

// 导出权限指令，供 main.js 使用
export { permissionDirectives } from "./permission";

export default routerGuard;
