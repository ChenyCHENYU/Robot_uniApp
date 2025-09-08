/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-08 16:57:08
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-09-08 16:57:34
 * @FilePath: \Robot_uniApp\src\utils\permission.js
 * @Description: 权限检查工具
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
 */
// utils/permission.js - 权限检查工具
import { useUserStore } from "@/stores";

/**
 * 权限检查混入
 */
export const permissionMixin = {
  methods: {
    // 检查权限
    $hasPermission(permission) {
      const userStore = useUserStore();
      return userStore.hasPermission(permission);
    },

    // 检查角色
    $hasRole(role) {
      const userStore = useUserStore();
      return userStore.hasRole(role);
    },

    // 检查是否登录
    $isLoggedIn() {
      const userStore = useUserStore();
      return userStore.isLoggedIn;
    },
  },
};

/**
 * 权限指令（用于模板中）
 */
export const permissionDirectives = {
  // v-permission="'user:create'"
  permission: {
    mounted(el, binding) {
      const permission = binding.value;
      const userStore = useUserStore();

      if (!userStore.hasPermission(permission)) {
        el.style.display = "none";
      }
    },

    updated(el, binding) {
      const permission = binding.value;
      const userStore = useUserStore();

      if (!userStore.hasPermission(permission)) {
        el.style.display = "none";
      } else {
        el.style.display = "";
      }
    },
  },

  // v-role="'admin'"
  role: {
    mounted(el, binding) {
      const role = binding.value;
      const userStore = useUserStore();

      if (!userStore.hasRole(role)) {
        el.style.display = "none";
      }
    },

    updated(el, binding) {
      const role = binding.value;
      const userStore = useUserStore();

      if (!userStore.hasRole(role)) {
        el.style.display = "none";
      } else {
        el.style.display = "";
      }
    },
  },
};

// 导出初始化函数
export function initRouter() {
  // 路由守卫已在模块加载时自动初始化
  console.log("路由系统初始化完成");
}

// 注意：routerGuard 在 router.js 中定义，这里不需要导出
