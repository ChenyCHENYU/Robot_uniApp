import pagesConfig from '@/pages.json'
import { computed, ref, reactive } from 'vue'
import { defaultTabList } from '../C_Tabbar/data'

// =================================
// 配置定义
// =================================
export const layoutProps = {
  refresherEnabled: { type: Boolean, default: false },
  refresherTriggered: { type: Boolean, default: false },
  globalLoading: { type: Boolean, default: false },
  notificationCount: { type: Number, default: 0 },
  forceLayoutType: {
    type: String,
    default: '',
    validator: value => ['', 'none', 'header-only', 'full'].includes(value),
  },
  showBack: { type: Boolean, default: undefined },
  title: { type: String, default: '' },
  showStatus: { type: Boolean, default: undefined },
  theme: { type: String, default: 'default' },
  backBehavior: {
    type: String,
    default: 'auto',
    validator: value => ['auto', 'custom', 'none'].includes(value),
  },
  backDelta: { type: Number, default: 1 },
  debug: { type: Boolean, default: false },
}

export const layoutEmits = [
  'refresh',
  'reachBottom',
  'userClick',
  'notificationClick',
  'settingsClick',
  'statusClick',
  'themeChange',
  'tabChange',
  'layoutChange',
  'backClick',
  'backSuccess',
  'backFail',
]

export const tabbarConfig = reactive({
  tabList: defaultTabList,
  fixed: false,
  mode: 'flat' as const,
  activeColor: 'var(--r-color-primary)',
  inactiveColor: 'var(--r-text-secondary)',
})

// 特殊页面配置
export const noLayoutPages = [
  '/pages/login/index',
  '/pages/register/index',
  '/pages/guide/index',
]

export const noBackPages: string[] = []
export const specialHeaderConfigs = {}

// =================================
// H5导航历史管理
// =================================
const NAV_KEY = 'nav_history'
const MAX_HISTORY = 5

const saveNavHistory = path => {
  // #ifdef H5
  try {
    const raw = uni.getStorageSync(NAV_KEY)
    const history: string[] = raw ? JSON.parse(String(raw)) : []
    if (history[history.length - 1] !== path) {
      history.push(path)
      if (history.length > MAX_HISTORY) history.shift()
      uni.setStorageSync(NAV_KEY, JSON.stringify(history))
    }
  } catch {}
  // #endif
}

const getNavHistory = (): string[] => {
  // #ifdef H5
  try {
    const raw = uni.getStorageSync(NAV_KEY)
    return raw ? JSON.parse(String(raw)) : []
  } catch {
    return []
  }
  // #endif
  return []
}

const getUrlParams = (): Record<string, string> => {
  // #ifdef H5
  if (typeof window !== 'undefined' && window.location?.search) {
    const params = {}
    new URLSearchParams(window.location.search).forEach((value, key) => {
      params[key] = value
    })
    return params
  }
  // #endif
  return {}
}

// =================================
// 核心判断逻辑
// =================================
const getTabBarPaths = () => tabbarConfig.tabList.map(item => item.path)
const cleanPath = path => path.split('?')[0]

export const isTabBarPage = path => getTabBarPaths().includes(cleanPath(path))
export const isNoLayoutPage = path => noLayoutPages.includes(cleanPath(path))

export const getPageStackInfo = () => {
  const pages = getCurrentPages()
  return {
    total: pages.length,
    current: pages[pages.length - 1],
    canGoBack: pages.length > 1,
    isFirstPage: pages.length === 1,
    stack: pages.map(page => `/${page.route}`),
  }
}

export const getSmartLayoutType = currentPath => {
  const path = cleanPath(currentPath)
  if (isNoLayoutPage(path)) return 'none'
  if (isTabBarPage(path)) return 'full'
  return 'header-only'
}

// H5刷新修复的返回按钮判断
export const shouldShowBackButton = currentPath => {
  const path = cleanPath(currentPath)
  return (
    !isTabBarPage(path) && !isNoLayoutPage(path) && !noBackPages.includes(path)
  )
}

/** 模块名 → 中文标题 */
const MODULE_TITLE_MAP = {
  settings: '设置',
  profile: '个人中心',
  message: '消息中心',
  robot: '组件库',
  index: '工作台',
  demo: '组件演示',
  about: '关于',
  approval: '审批中心',
  dashboard: '数据看板',
  'crud-list': '业务列表',
  'form-template': '表单模板',
  'search-result': '搜索',
  scan: '扫一扫',
  webview: '网页浏览',
  order: '订单',
  user: '用户',
}

/** 页面名 → 中文后缀 */
const PAGE_TITLE_MAP = {
  detail: '详情',
  edit: '编辑',
  add: '添加',
  list: '列表',
}

/** 由路径段派生标题（pages/<module>/<page> 结构） */
function deriveTitleFromPath(path) {
  const segments = path.split('/').filter(Boolean)
  if (segments.length < 2) return null

  const [, module, page = 'index'] = segments
  const moduleTitle = MODULE_TITLE_MAP[module] || module
  const pageTitle = PAGE_TITLE_MAP[page] || ''
  return pageTitle ? `${moduleTitle}${pageTitle}` : moduleTitle
}

const routeTitles = new Map([
  ...pagesConfig.pages.map(
    page => [`/${page.path}`, page.style.navigationBarTitleText] as const
  ),
  ...pagesConfig.subPackages.flatMap(group =>
    group.pages.map(
      page =>
        [
          `/${group.root}/${page.path}`,
          page.style.navigationBarTitleText,
        ] as const
    )
  ),
])

// 智能标题生成
export const getSmartPageTitle = (currentPath, propsTitle = '') => {
  if (propsTitle?.trim()) return propsTitle.trim()

  const path = cleanPath(currentPath)
  const specialTitle = specialHeaderConfigs[path]?.title
  if (specialTitle) return specialTitle

  return routeTitles.get(path) || deriveTitleFromPath(path) || '页面'
}

// Header配置生成
export const getSmartHeaderConfig = (
  currentPath: string,
  props: Record<string, any> = {}
) => {
  // 🔥 添加紧凑模式计算
  const layoutType = getSmartLayoutType(currentPath)
  const isCompactMode = layoutType === 'header-only' // 无TabBar的页面使用紧凑模式

  return {
    defaultAvatar: '/static/images/default-avatar.png',
    defaultNickname: '未设置昵称',
    showBack:
      props.showBack !== undefined
        ? props.showBack
        : shouldShowBackButton(currentPath),
    title: getSmartPageTitle(currentPath, props.title),
    showStatus: true,
    theme: 'default',
    iconSize: 20,
    enableAnimations: true,

    // 添加紧凑模式配置
    isCompactMode: isCompactMode,

    ...specialHeaderConfigs[cleanPath(currentPath)],
    ...Object.fromEntries(
      Object.entries(props).filter(
        ([key, value]) =>
          value !== undefined && !(key === 'title' && !String(value).trim())
      )
    ),
  }
}

// 工具函数
export const getCurrentTabIndex = currentPath => {
  return tabbarConfig.tabList.findIndex(
    item => item.path === cleanPath(currentPath)
  )
}

export const updateTabBadge = (tabId, count) => {
  const tab = tabbarConfig.tabList.find(item => item.id === tabId)
  if (tab) tab.badge = count
}

export const getCurrentPageInfo = () => {
  const pages = getCurrentPages()
  if (!pages.length) return null

  const currentPage = pages[pages.length - 1]
  const currentPath = `/${currentPage.route}`

  return {
    path: currentPath,
    query: (currentPage as any).options || {},
    layoutType: getSmartLayoutType(currentPath),
    headerConfig: getSmartHeaderConfig(currentPath),
    canGoBack: pages.length > 1,
    pageStack: pages.length,
    stackInfo: getPageStackInfo(),
  }
}

// =================================
// 增强的导航功能
// =================================
const enhancedGoBack = (delta = 1) => {
  const { canGoBack } = getPageStackInfo()

  // 正常返回
  if (canGoBack) {
    return uni.navigateBack({ delta })
  }

  // #ifdef H5
  // H5修复策略
  const urlParams = getUrlParams()
  if (urlParams.from) {
    return uni.navigateTo({ url: urlParams.from })
  }

  const history = getNavHistory()
  if (history.length > 1) {
    const previousPage = history[history.length - 2]
    const newHistory = history.slice(0, -1)
    uni.setStorageSync(NAV_KEY, JSON.stringify(newHistory))
    return uni.navigateTo({ url: previousPage })
  }
  // #endif

  // 返回首页
  const firstTab = tabbarConfig.tabList?.[0]
  return firstTab
    ? uni.switchTab({ url: firstTab.path })
    : uni.reLaunch({ url: '/pages/index/index' })
}

const enhancedNavigateTo = url => {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const currentPath = `/${pages[pages.length - 1].route}`
    saveNavHistory(currentPath)
  }
  return uni.navigateTo({ url })
}

// =================================
// 主Hook函数
// =================================
/**
 *
 */
export function useSmartLayout(props) {
  const isNavigating = ref(false)
  const currentTabIndex = ref(0)

  const getCurrentPath = () => {
    const pages = getCurrentPages()
    return pages.length > 0
      ? `/${pages[pages.length - 1].route}`
      : '/pages/index/index'
  }

  const currentPath = ref(getCurrentPath())
  const layoutType = computed(
    () => props.forceLayoutType || getSmartLayoutType(currentPath.value)
  )
  const showHeader = computed(() =>
    ['header-only', 'full'].includes(layoutType.value)
  )
  const showTabbar = computed(() => layoutType.value === 'full')

  const headerConfig = computed(() =>
    getSmartHeaderConfig(currentPath.value, {
      showBack: props.showBack,
      title: props.title,
      showStatus: props.showStatus,
      theme: props.theme,
    })
  )

  const layoutClasses = computed(() => ({
    [`layout-${layoutType.value}`]: true,
    'has-header': showHeader.value,
    'has-tabbar': showTabbar.value,
  }))

  const contentStyles = computed(() => ({}))

  const canGoBack = () => getPageStackInfo().canGoBack

  const getPageInfo = () => ({
    path: currentPath.value,
    layoutType: layoutType.value,
    showHeader: showHeader.value,
    showTabbar: showTabbar.value,
    headerConfig: headerConfig.value,
    stackInfo: getPageStackInfo(),
  })

  // 保存导航历史
  saveNavHistory(currentPath.value)

  return {
    // 状态
    isNavigating,
    currentTabIndex,

    // 计算属性
    currentPath,
    layoutType,
    showHeader,
    showTabbar,
    headerConfig,
    layoutClasses,
    contentStyles,

    // 方法
    canGoBack,
    getCurrentPath,
    getPageInfo,
    enhancedGoBack,
    enhancedNavigateTo,
  }
}

// =================================
// 调试工具
// =================================
export const debugCurrentPage = () => {
  const pages = getCurrentPages()
  const currentPath =
    pages.length > 0 ? `/${pages[pages.length - 1].route}` : ''

  const info = {
    当前路径: currentPath,
    页面层级: pages.length,
    Layout类型: getSmartLayoutType(currentPath),
    显示返回: shouldShowBackButton(currentPath),
    Header配置: getSmartHeaderConfig(currentPath),
  }

  return info
}

// 开发环境注册调试
if (import.meta.env.DEV) {
  ;(globalThis as any).debugCurrentPage = debugCurrentPage
}
