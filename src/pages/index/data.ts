import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useMessageStore } from '@/stores/modules/message'
import { useUserStore } from '@/stores/modules/user'
import { useAppStore } from '@/stores/modules/app'
import { APP_NAME, STORAGE_KEYS } from '@/constants'
import pages from '@/pages.json'
import packageInfo from '../../../package.json'

export interface HomeEntry {
  title: string
  description: string
  icon: string
  url: string
  tone: 'blue' | 'green' | 'purple' | 'orange'
}

const registeredRoutes = [
  ...pages.pages.map(page => `/${page.path}`),
  ...pages.subPackages.flatMap(group =>
    group.pages.map(page => `/${group.root}/${page.path}`)
  ),
]
const tabRoutes = pages.tabBar.list.map(page => `/${page.pagePath}`)

/** 入口指向当前 pages.json 已注册的页面，业务页在开发环境是交互示例。 */
export const pageEntries: HomeEntry[] = (
  [
    {
      title: '信息填报',
      description: '填写与校验',
      icon: 'mdi-form-select',
      url: '/pages/form-template/index',
      tone: 'blue',
    },
    {
      title: '数据管理',
      description: '查询与管理',
      icon: 'mdi-format-list-bulleted',
      url: '/pages/crud-list/index',
      tone: 'green',
    },
    {
      title: '流程审批',
      description: '查看与处理',
      icon: 'mdi-checkbox-marked-circle-outline',
      url: '/pages/approval/index',
      tone: 'purple',
    },
    {
      title: '扫一扫',
      description: '识别二维码',
      icon: 'mdi-qrcode-scan',
      url: '/pages/scan/index',
      tone: 'orange',
    },
  ] satisfies HomeEntry[]
).filter(entry => registeredRoutes.includes(entry.url))

export const spaceEntries: HomeEntry[] = (
  [
    {
      title: '个人资料',
      description: '查看账号信息',
      icon: 'mdi-account-outline',
      url: '/pages/profile/index',
      tone: 'blue',
    },
    {
      title: '偏好设置',
      description: '外观与通知',
      icon: 'mdi-cog-outline',
      url: '/pages/settings/index',
      tone: 'green',
    },
  ] satisfies HomeEntry[]
).filter(entry => registeredRoutes.includes(entry.url))

/** 本机搜索历史沿用搜索页缓存，不造默认热门词或浏览记录。 */
function readRecentSearches(): string[] {
  try {
    const saved: unknown = JSON.parse(
      String(uni.getStorageSync(STORAGE_KEYS.SEARCH_HISTORY) || '[]')
    )
    if (!Array.isArray(saved)) return []
    const queries = saved
      .filter((item): item is string => typeof item === 'string')
      .map(item => item.trim())
      .filter(Boolean)
    return [...new Set(queries)].slice(0, 3)
  } catch {
    return []
  }
}

/** 个人工作台只展示已有入口、本机历史和当前会话，不扩展组件目录或业务统计。 */
export function useHomeData() {
  const userStore = useUserStore()
  const messageStore = useMessageStore()
  const appStore = useAppStore()
  const unreadCount = computed(() => messageStore.totalUnread)
  const displayName = computed(() => userStore.nickname)
  const now = ref(new Date())
  const todayText = computed(() =>
    now.value.toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  )
  const greeting = computed(() => {
    const hour = now.value.getHours()
    if (hour < 6) return '夜深了'
    if (hour < 12) return '早上好'
    if (hour < 18) return '下午好'
    return '晚上好'
  })
  const recentSearches = ref(readRecentSearches())
  const networkLabel = computed(() => {
    const labels: Record<string, string> = {
      unknown: '待检测',
      none: '离线',
      wifi: 'Wi-Fi',
      '2g': '2G',
      '3g': '3G',
      '4g': '4G',
      '5g': '5G',
    }
    return labels[appStore.networkType] || appStore.networkType
  })
  const networkOnline = computed(
    () =>
      !!appStore.networkType &&
      !['unknown', 'none'].includes(appStore.networkType)
  )
  const platformName = computed(() => {
    const labels: Record<string, string> = {
      web: 'H5',
      h5: 'H5',
      'mp-weixin': '微信小程序',
      app: 'App',
      'app-plus': 'App',
    }
    const currentPlatform =
      appStore.systemInfo?.uniPlatform || process.env.UNI_PLATFORM || ''
    return labels[currentPlatform] || '当前设备'
  })
  const openSearch = (keyword?: string) => {
    const query = typeof keyword === 'string' ? keyword.trim() : ''
    const url = '/pages/search-result/index'
    uni.navigateTo({
      url: query ? `${url}?keyword=${encodeURIComponent(query)}` : url,
    })
  }
  const openAbout = () => uni.navigateTo({ url: '/pages/about/index' })
  const openPage = (entry: HomeEntry) => uni.navigateTo({ url: entry.url })
  const openSpaceEntry = (entry: HomeEntry) => {
    if (tabRoutes.includes(entry.url)) uni.switchTab({ url: entry.url })
    else uni.navigateTo({ url: entry.url })
  }
  onShow(() => {
    now.value = new Date()
    recentSearches.value = readRecentSearches()
  })
  return {
    unreadCount,
    displayName,
    todayText,
    greeting,
    pageEntries,
    recentSearches,
    spaceEntries,
    networkLabel,
    networkOnline,
    platformName,
    appName: APP_NAME,
    projectVersion: packageInfo.version,
    openSearch,
    openAbout,
    openPage,
    openSpaceEntry,
  }
}
