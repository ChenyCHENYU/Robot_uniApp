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
import { useUserStore } from '@/stores'

/**
 * 权限检查混入
 */
export const permissionMixin = {
  methods: {
    // 检查权限
    /**
     *
     */
    $hasPermission(permission) {
      const userStore = useUserStore()
      return userStore.hasPermission(permission)
    },

    // 检查角色
    /**
     *
     */
    $hasRole(role) {
      const userStore = useUserStore()
      return userStore.hasRole(role)
    },

    // 检查是否登录
    /**
     *
     */
    $isLoggedIn() {
      const userStore = useUserStore()
      return userStore.isLoggedIn
    },
  },
}

/**
 * 权限指令（用于模板中）
 */
export const permissionDirectives = {
  // v-permission="'user:create'"
  permission: {
    /**
     *
     */
    mounted(el, binding) {
      const permission = binding.value
      const userStore = useUserStore()

      if (!userStore.hasPermission(permission)) {
        el.parentNode?.removeChild(el)
      }
    },

    /**
     *
     */
    updated(el, binding) {
      const permission = binding.value
      const userStore = useUserStore()

      if (!userStore.hasPermission(permission)) {
        el.parentNode?.removeChild(el)
      }
    },
  },

  // v-role="'admin'"
  role: {
    /**
     *
     */
    mounted(el, binding) {
      const role = binding.value
      const userStore = useUserStore()

      if (!userStore.hasRole(role)) {
        el.parentNode?.removeChild(el)
      }
    },

    /**
     *
     */
    updated(el, binding) {
      const role = binding.value
      const userStore = useUserStore()

      if (!userStore.hasRole(role)) {
        el.parentNode?.removeChild(el)
      }
    },
  },
}
