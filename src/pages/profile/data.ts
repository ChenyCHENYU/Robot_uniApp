/**
 * @Description: 个人中心静态配置与菜单数据
 */
import { ref, computed, watch } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { useMessageStore } from '@/stores/modules/message'
import { APP_VERSION, STORAGE_KEYS } from '@/constants'
import type { MenuGroup, ProfileMenuItem } from './types'
import { projectInventory } from '@/constants/project'

export interface ProfileStat {
  value: string
  label: string
}

/** 资源来自实际组件登记与 pages.json，不保留手写的组合函数/常量/样式数量。 */
export const userStats: ProfileStat[] = projectInventory

export interface CreateMenuOptions {
  /** 未读消息数（函数形式，保证响应式） */
  unread: () => number
  /** 应用版本号 */
  version: string
}

/** 构建菜单配置（badge/版本号等动态值以 getter 传入，消费侧用 computed 包裹） */
export function createMenuGroups({
  unread,
  version,
}: CreateMenuOptions): MenuGroup[] {
  return [
    {
      title: '个人服务',
      items: [
        {
          id: 'settings',
          label: '个人设置',
          icon: 'i-mdi-cog-outline',
          iconBg: 'var(--r-color-primary-soft)',
          path: '/pages/settings/index',
        },
        {
          id: 'notification',
          label: '消息通知',
          icon: 'i-mdi-bell-outline',
          iconBg: 'var(--r-color-primary-soft)',
          badge: unread(),
          path: '/pages/message/index',
        },
        {
          id: 'privacy',
          label: '隐私管理',
          icon: 'i-mdi-shield-check-outline',
          iconBg: 'var(--r-color-primary-soft)',
        },
      ],
    },
    {
      title: '开发工具',
      items: [
        {
          id: 'docs',
          label: '开发文档',
          icon: 'i-mdi-book-open-page-variant-outline',
          iconBg: 'var(--r-color-primary-soft)',
          path: '/pages/webview/index?url=https%3A%2F%2Funiapp.dcloud.net.cn&title=开发文档',
        },
        {
          id: 'templates',
          label: '业务模板',
          icon: 'i-mdi-view-grid-outline',
          iconBg: 'var(--r-color-primary-soft)',
          path: '/pages/search-result/index?keyword=%E4%B8%9A%E5%8A%A1',
        },
        {
          id: 'changelog',
          label: '更新日志',
          icon: 'i-mdi-calendar-outline',
          iconBg: 'var(--r-color-primary-soft)',
          extra: `v${version}`,
        },
      ],
    },
    {
      title: '其他',
      items: [
        {
          id: 'feedback',
          label: '意见反馈',
          icon: 'i-mdi-message-text-outline',
          iconBg: 'var(--r-color-primary-soft)',
        },
        {
          id: 'about',
          label: '关于应用',
          icon: 'i-mdi-information-outline',
          iconBg: 'var(--r-color-primary-soft)',
          path: '/pages/about/index',
        },
        {
          id: 'cache',
          label: '清除缓存',
          icon: 'i-mdi-delete-outline',
          iconBg: 'var(--r-color-primary-soft)',
        },
      ],
    },
  ]
}

/** 页面状态、加载与交互。 */
export function useProfilePage() {
  const appVersion = APP_VERSION

  const userStore = useUserStore()
  const messageStore = useMessageStore()

  const avatarError = ref(false)
  const userAvatar = computed(() => userStore.avatar)
  const hasCustomAvatar = computed(
    () => !avatarError.value && !userAvatar.value.endsWith('default-avatar.png')
  )
  const handleAvatarError = () => {
    avatarError.value = true
  }
  const userName = computed(() => userStore.nickname)
  const userInitial = computed(() => (userName.value || '用户').slice(0, 1))
  watch(userAvatar, () => {
    avatarError.value = false
  })
  const userRole = computed(() => {
    if (userStore.isAdmin) return '系统管理员'
    if (userStore.roles?.length) return userStore.roles[0]
    return '普通用户'
  })
  const userId = computed(() => userStore.userInfo?.id || '—')

  const menuGroups = computed(() =>
    createMenuGroups({
      unread: () => messageStore.totalUnread,
      version: APP_VERSION,
    })
  )

  const userStatsRef = userStats

  const goToSettings = () => {
    uni.navigateTo({ url: '/pages/settings/index' })
  }

  const handleMenuClick = (item: ProfileMenuItem) => {
    if (item.path) {
      // tab页面用switchTab，普通页面用navigateTo
      const tabPaths = [
        '/pages/index/index',
        '/pages/message/index',
        '/pages/robot/index',
        '/pages/profile/index',
      ]
      if (tabPaths.includes(item.path)) {
        uni.switchTab({ url: item.path })
      } else {
        uni.navigateTo({ url: item.path })
      }
      return
    }

    const actions: Record<string, () => void> = {
      docs: () => uni.showToast({ title: '开发文档建设中', icon: 'none' }),
      changelog: () =>
        uni.showModal({
          title: '更新日志',
          content: `v${APP_VERSION}\n- 精简首页工作台布局与快捷入口\n- 重设计组件库页面，修复导航与图标显示\n- 统一提示、弹窗、加载与启动体验，适配深色主题\n- 修复账号资料、缓存身份与消息状态同步\n- 完善搜索参数解析和网络断开、恢复提示`,
          showCancel: false,
        }),
      feedback: () =>
        uni.showModal({
          title: '意见反馈',
          content: '请将问题场景、截图和应用版本发给项目维护人员。',
          showCancel: false,
        }),
      privacy: () =>
        uni.showModal({
          title: '隐私管理',
          content:
            '我们重视您的隐私保护。\n\n• 个人信息仅用于应用功能\n• 不会向第三方共享数据\n• 您可随时清除本地数据',
          showCancel: false,
          confirmText: '我知道了',
        }),
      about: () => uni.navigateTo({ url: '/pages/about/index' }),
      cache: () => {
        uni.showModal({
          title: '清除缓存',
          content: '清除搜索、字典与接口缓存，保留登录、偏好和本地资料。',
          success: ({ confirm }) => {
            if (!confirm) return
            const { keys } = uni.getStorageInfoSync()
            keys
              .filter(
                key =>
                  key === STORAGE_KEYS.SEARCH_HISTORY ||
                  key === STORAGE_KEYS.DICT_CACHE ||
                  key.startsWith(STORAGE_KEYS.API_CACHE_PREFIX)
              )
              .forEach(key => uni.removeStorageSync(key))
            uni.showToast({ title: '缓存已清除', icon: 'success' })
          },
        })
      },
    }
    actions[item.id]?.()
  }

  const logoutting = ref(false)

  const handleLogout = () => {
    if (logoutting.value) return
    uni.showModal({
      title: '退出登录',
      content: '确定要退出当前账户吗？',
      success: async ({ confirm }) => {
        if (!confirm || logoutting.value) return
        logoutting.value = true
        try {
          await userStore.logout()
        } finally {
          logoutting.value = false
        }
      },
    })
  }

  return {
    appVersion,
    userAvatar,
    hasCustomAvatar,
    userInitial,
    handleAvatarError,
    userName,
    userRole,
    userId,
    menuGroups,
    userStatsRef,
    goToSettings,
    handleMenuClick,
    logoutting,
    handleLogout,
  }
}
