import { describe, it, expect, beforeEach } from 'vitest'
import {
  setUserStore,
  checkPermission,
  getPagePath,
  consumeRedirectUrl,
} from '@/utils/router'

// 可控的用户状态桩
let state: { isLoggedIn: boolean; permissions: string[]; roles: string[] }

beforeEach(() => {
  state = { isLoggedIn: false, permissions: [], roles: [] }
  setUserStore(state as never)
  // 清理 REDIRECT_URL
  uni.removeStorageSync('REDIRECT_URL')
})

describe('路由守卫（默认拒绝模型）', () => {
  it('白名单页面未登录可访问', () => {
    expect(checkPermission('/pages/login/index').pass).toBe(true)
    expect(checkPermission('/pages/register/index').pass).toBe(true)
    expect(checkPermission('/pages/guide/index').pass).toBe(true)
  })

  it('非白名单页面未登录被拒并指向登录页', () => {
    const result = checkPermission('/pages/settings/index')
    expect(result.pass).toBe(false)
    expect(result.type).toBe('auth')
    expect(result.redirectTo).toBe('/pages/login/index')
  })

  it('登录后非权限页全部放行', () => {
    state.isLoggedIn = true
    expect(checkPermission('/pages/settings/index').pass).toBe(true)
    expect(checkPermission('/pages/index/index').pass).toBe(true)
  })

  it('带查询参数的路径只按页面路径判定', () => {
    const result = checkPermission('/pages/login/index?from=xxx')
    expect(result.pass).toBe(true)
  })
})

describe('getPagePath', () => {
  it('剥离查询串', () => {
    expect(getPagePath('/pages/webview/index?url=https%3A%2F%2Fx.com')).toBe(
      '/pages/webview/index'
    )
  })
})

describe('consumeRedirectUrl（登录回跳）', () => {
  it('无存储时回退首页', () => {
    expect(consumeRedirectUrl()).toBe('/pages/index/index')
  })

  it('读取后清除存储（只消费一次）', () => {
    uni.setStorageSync('REDIRECT_URL', '/pages/settings/index')
    expect(consumeRedirectUrl()).toBe('/pages/settings/index')
    expect(consumeRedirectUrl()).toBe('/pages/index/index')
  })

  it('白名单页不作为回跳目标（避免登录后回登录页）', () => {
    uni.setStorageSync('REDIRECT_URL', '/pages/login/index')
    expect(consumeRedirectUrl()).toBe('/pages/index/index')
  })
})
