/**
 * 权限指令定义
 *
 * v-auth="'user:create'"          需具备该权限
 * v-auth.some="['a','b']"         任一权限即可
 * v-role="'admin'"
 *
 * 跨端说明：uni-app 自定义指令仅在 H5 端生效；
 * 小程序/App 端请使用 v-if="userStore.hasPermission('xxx')" 方案。
 */
import type { DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/modules/user'

/** 无权限时隐藏元素（display 隐藏可随权限变化恢复，且不依赖 DOM 移除） */
function setHidden(el: HTMLElement, hidden: boolean) {
  if (el?.style) {
    el.style.display = hidden ? 'none' : ''
  }
}

/** 校验权限并控制元素显隐 */
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
  setHidden(el, !hasAccess)
}

/** 校验角色并控制元素显隐 */
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
  setHidden(el, !hasAccess)
}

export const permissionDirectives = {
  /** v-auth="'user:create'" 或 v-auth="['user:create','user:edit']" */
  auth: {
    mounted: checkPermission,
    updated: checkPermission,
  },
  /** v-role="'admin'" */
  role: {
    mounted: checkRole,
    updated: checkRole,
  },
}
