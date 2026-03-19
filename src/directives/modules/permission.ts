/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-09 09:51:09
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-09-09 09:54:14
 * @FilePath: \Robot_uniApp\src\directives\modules\permission.js
 * @Description: 权限指令定义
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
 */
import type { DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/modules/user'

/**
 *
 */
function checkPermission(
  el: HTMLElement,
  binding: DirectiveBinding<string | string[]>
) {
  const userStore = useUserStore()
  const { value } = binding
  const required = Array.isArray(value) ? value : [value]
  const hasAccess = binding.modifiers.some
    ? required.some(p => userStore.hasPermission(p))
    : required.every(p => userStore.hasPermission(p))
  if (!hasAccess) {
    el.parentNode?.removeChild(el)
  }
}

/**
 *
 */
function checkRole(
  el: HTMLElement,
  binding: DirectiveBinding<string | string[]>
) {
  const userStore = useUserStore()
  const { value } = binding
  const required = Array.isArray(value) ? value : [value]
  const hasAccess = binding.modifiers.some
    ? required.some(r => userStore.hasRole(r))
    : required.every(r => userStore.hasRole(r))
  if (!hasAccess) {
    el.parentNode?.removeChild(el)
  }
}

export const permissionDirectives = {
  /** v-auth="'user:create'" 或 v-auth="['user:create','user:edit']" */
  auth: {
    mounted: checkPermission,
    updated: checkPermission,
  },
  /** v-role="'admin'" 或 v-role="['admin','editor']" */
  role: {
    mounted: checkRole,
    updated: checkRole,
  },
}
