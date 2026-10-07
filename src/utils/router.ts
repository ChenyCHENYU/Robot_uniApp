/**
 * 路由封装和权限控制
 *
 * 守卫模型：默认所有页面需要登录，whiteList 中的页面放行；
 * permissionPages 可按页面追加角色/权限要求。
 *
 * 使用 uni.addInterceptor 官方拦截 API（不再覆写 uni.navigateTo）。
 * 依赖注入：main.ts 在 Pinia 初始化后调用 setUserStore（全平台，不依赖 window）。
 */
/** 守卫所需的用户状态结构（与 useUserStore 保持结构兼容） */
interface UserLikeStore {
  isLoggedIn: boolean
  permissions: string[]
  roles: string[]
}

/** 无需登录即可访问的页面 */
const WHITE_LIST = [
  '/pages/login/index',
  '/pages/register/index',
  '/pages/guide/index',
]

/** 需要特定角色/权限的页面（角色与权限任一命中即通过） */
const PERMISSION_PAGES: Record<string, string[]> = {
  // 示例：'/pages/admin/index': ['admin'],
}

/** 权限检查结果 */
interface CheckResult {
  pass: boolean
  type?: 'auth' | 'permission'
  message?: string
  redirectTo?: string
}

/** 用户状态依赖（由 main.ts 注入，避免循环引用） */
let userStoreInstance: UserLikeStore | null = null

/** 设置 store 实例（由 main.ts 在初始化后调用） */
export function setUserStore(store: UserLikeStore) {
  userStoreInstance = store
}

/** 获取当前用户状态 */
function getCurrentUserState() {
  if (!userStoreInstance) {
    return {
      isLoggedIn: false,
      permissions: [] as string[],
      roles: [] as string[],
    }
  }
  return {
    isLoggedIn: userStoreInstance.isLoggedIn,
    permissions: userStoreInstance.permissions || [],
    roles: userStoreInstance.roles || [],
  }
}

/** 权限检查（纯函数） */
export function checkPermission(pagePath: string): CheckResult {
  const userState = getCurrentUserState()

  // 白名单直接通过
  if (WHITE_LIST.includes(pagePath)) {
    return { pass: true }
  }

  // 默认需要登录
  if (!userState.isLoggedIn) {
    return {
      pass: false,
      type: 'auth',
      message: '请先登录',
      redirectTo: '/pages/login/index',
    }
  }

  // 特定权限检查
  const required = PERMISSION_PAGES[pagePath]
  if (required && required.length > 0) {
    const hasPermission = required.some(
      item =>
        userState.permissions.includes(item) || userState.roles.includes(item)
    )
    if (!hasPermission) {
      return {
        pass: false,
        type: 'permission',
        message: '权限不足',
        redirectTo: '/pages/index/index',
      }
    }
  }

  return { pass: true }
}

/** 处理权限拒绝：提示后立即跳转 */
function handlePermissionDenied(result: CheckResult) {
  uni.showToast({
    title: result.message || '无权访问',
    icon: 'none',
    duration: 1500,
  })

  const target = result.redirectTo || '/pages/login/index'
  // 登录页使用 reLaunch 清空页面栈，避免返回键回到受保护页
  setTimeout(() => {
    uni.reLaunch({ url: target })
  }, 300)
}

/** 提取页面路径（去掉参数） */
export function getPagePath(url: string): string {
  return (url || '').split('?')[0]
}

/** 安装路由守卫（拦截 4 种跳转 API） */
function installGuard() {
  const methods = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'] as const
  methods.forEach(method => {
    uni.addInterceptor(method, {
      invoke(args: { url: string }) {
        const pagePath = getPagePath(args?.url || '')
        if (!pagePath) return args

        const result = checkPermission(pagePath)
        if (!result.pass) {
          handlePermissionDenied(result)
          return false
        }
        return args
      },
    })
  })
}

installGuard()

/**
 * 编程式导航封装
 */
export const router = {
  push(url: string, params: Record<string, string | number> = {}) {
    uni.navigateTo({ url: this.buildUrl(url, params) })
  },

  replace(url: string, params: Record<string, string | number> = {}) {
    uni.redirectTo({ url: this.buildUrl(url, params) })
  },

  reLaunch(url: string, params: Record<string, string | number> = {}) {
    uni.reLaunch({ url: this.buildUrl(url, params) })
  },

  switchTab(url: string) {
    uni.switchTab({ url })
  },

  back(delta = 1) {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      uni.navigateBack({ delta })
    } else {
      // 页面栈仅一层时回首页，避免卡死
      uni.reLaunch({ url: '/pages/index/index' })
    }
  },

  /** 智能跳转：tabbar 页自动 switchTab，普通页 navigateTo */
  smartNavigate(url: string, params: Record<string, string | number> = {}) {
    const fullUrl = this.buildUrl(url, params)
    uni.switchTab({
      url: fullUrl,
      fail: () => {
        uni.navigateTo({ url: fullUrl })
      },
    })
  },

  buildUrl(url: string, params: Record<string, string | number> = {}) {
    if (!params || Object.keys(params).length === 0) return url
    const queryString = Object.keys(params)
      .map(
        key =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`
      )
      .join('&')
    return `${url}?${queryString}`
  },

  parseQuery(url: string): { path: string; params: Record<string, string> } {
    const [path, queryString] = (url || '').split('?')
    const params: Record<string, string> = {}
    if (queryString) {
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=')
        if (key)
          params[decodeURIComponent(key)] = decodeURIComponent(value || '')
      })
    }
    return { path, params }
  },
}

/**
 * 消费登录回跳地址（http 401 时保存，登录成功后调用）
 * 无保存地址时回首页
 */
export function consumeRedirectUrl(fallback = '/pages/index/index'): string {
  let redirect = fallback
  try {
    const saved = uni.getStorageSync('REDIRECT_URL') as string
    if (saved && typeof saved === 'string' && saved.startsWith('/')) {
      // 白名单页不作为回跳目标
      if (!WHITE_LIST.includes(getPagePath(saved))) {
        redirect = saved
      }
      uni.removeStorageSync('REDIRECT_URL')
    }
  } catch {
    // 存储异常时忽略，回退默认地址
  }
  return redirect
}

/** 路由系统初始化（守卫已在模块加载时安装，此处保留语义入口） */
export function initRouter() {
  // noop: guard installed on module load
}
