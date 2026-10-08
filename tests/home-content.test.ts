import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const mocks = vi.hoisted(() => ({
  app: {
    networkType: 'unknown',
    systemInfo: null as { uniPlatform: string } | null,
  },
  message: { totalUnread: 0 },
  switchTab: vi.fn(),
}))
vi.mock('@dcloudio/uni-app', () => ({ onShow: vi.fn() }))
vi.mock('@/api', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  getUserInfo: vi.fn(),
  getDashboardStats: vi.fn(),
  getActivities: vi.fn(),
  getChartData: vi.fn(),
}))
vi.mock('@/stores/modules/app', async () => {
  const { reactive } = await import('vue')
  const app = reactive(mocks.app)
  return { useAppStore: () => app }
})
vi.mock('@/stores/modules/message', () => ({
  useMessageStore: () => mocks.message,
}))

import { onShow } from '@dcloudio/uni-app'
import { getDashboardStats, getActivities, getChartData } from '@/api'
import { useUserStore } from '@/stores/modules/user'
import { useAppStore } from '@/stores/modules/app'
import { useHomeData } from '@/pages/index/data'
import { STORAGE_KEYS } from '@/constants'
import pages from '@/pages.json'
import packageInfo from '../package.json'

beforeEach(() => {
  vi.clearAllMocks()
  uni.clearStorageSync()
  setActivePinia(createPinia())
  vi.stubGlobal('uni', { ...uni, switchTab: mocks.switchTab })
  useAppStore().networkType = 'unknown'
  useAppStore().systemInfo = null
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('首页内容与实际项目一致', () => {
  it('问候显示实际账号而非管理员角色，并响应真实昵称更新', () => {
    const user = useUserStore()
    user.$patch({
      token: 'cheny_token',
      loginAccount: 'CHENY',
      roles: ['admin'],
    })
    const home = useHomeData()
    expect(home.displayName.value).toBe('CHENY')

    user.$patch({
      userInfo: {
        id: 2,
        username: 'CHENY',
        nickname: '陈宇',
        avatar: '/local/avatar.png',
      },
    })
    expect(home.displayName.value).toBe('陈宇')
  })

  it.each([
    ['web', 'H5'],
    ['mp-weixin', '微信小程序'],
    ['app', 'App'],
  ])('设备报告的平台 %s 显示为 %s', (uniPlatform, expected) => {
    useAppStore().systemInfo = { uniPlatform } as UniApp.GetSystemInfoResult
    expect(useHomeData().platformName.value).toBe(expected)
  })

  it('设备平台尚未返回时使用 Uni 编译注入的平台，不读未注入的 Vite 字段', () => {
    vi.stubEnv('UNI_PLATFORM', 'h5')
    expect(useHomeData().platformName.value).toBe('H5')
    vi.stubEnv('UNI_PLATFORM', 'mp-weixin')
    expect(useHomeData().platformName.value).toBe('微信小程序')
  })

  it('进入和返回首页不请求虚构统计、任务或动态，网络只显示设备实际状态', () => {
    const home = useHomeData()
    const onShowCallback = vi.mocked(onShow).mock.calls[0][0]
    onShowCallback()
    expect(getDashboardStats).not.toHaveBeenCalled()
    expect(getActivities).not.toHaveBeenCalled()
    expect(getChartData).not.toHaveBeenCalled()
    expect(home.networkLabel.value).toBe('待检测')
    expect(home.networkOnline.value).toBe(false)
    useAppStore().networkType = 'none'
    expect(home.networkLabel.value).toBe('离线')
    expect(home.networkOnline.value).toBe(false)
    useAppStore().networkType = 'wifi'
    expect(home.networkLabel.value).toBe('Wi-Fi')
    expect(home.networkOnline.value).toBe(true)
  })

  it('只提供既有应用与个人入口，不重复组件目录、计数或依赖技术栈', () => {
    const home = useHomeData()
    const manifestRoutes = [
      ...pages.pages.map(page => `/${page.path}`),
      ...pages.subPackages.flatMap(group =>
        group.pages.map(page => `/${group.root}/${page.path}`)
      ),
    ]
    expect(home.projectVersion).toBe(packageInfo.version)
    expect(home.pageEntries.map(entry => entry.url)).toEqual([
      '/pages/form-template/index',
      '/pages/crud-list/index',
      '/pages/approval/index',
      '/pages/scan/index',
    ])
    expect(home.spaceEntries.map(entry => entry.url)).toEqual([
      '/pages/profile/index',
      '/pages/settings/index',
    ])
    ;[
      'inventory',
      'componentEntries',
      'projectDependencies',
      'openCatalog',
      'openComponent',
      'sessionRows',
    ].forEach(key => {
      expect(home).not.toHaveProperty(key)
    })
    const sourceDirectory = fileURLToPath(new URL('../src', import.meta.url))
    const entries = [...home.pageEntries, ...home.spaceEntries]
    entries.forEach(entry => {
      expect(manifestRoutes).toContain(entry.url)
      expect(
        existsSync(resolve(sourceDirectory, `${entry.url.slice(1)}.vue`))
      ).toBe(true)
    })
  })

  it('个人资料使用 switchTab，设置和常用应用使用已有页面路径导航', () => {
    const navigate = vi.spyOn(uni, 'navigateTo')
    const home = useHomeData()
    home.openSpaceEntry(home.spaceEntries[0])
    expect(mocks.switchTab.mock.calls.map(([options]) => options.url)).toEqual([
      '/pages/profile/index',
    ])
    home.openSpaceEntry(home.spaceEntries[1])
    home.openPage(home.pageEntries[0])
    home.openSearch()
    expect(navigate.mock.calls.map(([options]) => options.url)).toEqual([
      '/pages/settings/index',
      home.pageEntries[0].url,
      '/pages/search-result/index',
    ])
  })

  it('最近搜索仅读取本机有效去重历史，最多3条，返回首页重新读取', () => {
    uni.setStorageSync(
      STORAGE_KEYS.SEARCH_HISTORY,
      JSON.stringify([
        ' 审批 ',
        4,
        '数据 查询',
        '审批',
        '',
        'a&b/你好',
        '第四个关键词',
      ])
    )
    const home = useHomeData()
    expect(home.recentSearches.value).toEqual(['审批', '数据 查询', 'a&b/你好'])
    uni.setStorageSync(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(['新搜索']))
    vi.mocked(onShow).mock.calls[0][0]()
    expect(home.recentSearches.value).toEqual(['新搜索'])
    uni.removeStorageSync(STORAGE_KEYS.SEARCH_HISTORY)
    vi.mocked(onShow).mock.calls[0][0]()
    expect(home.recentSearches.value).toEqual([])
  })

  it.each(['{broken', 'null', '{"keyword":"不是数组"}'])(
    '损坏或无效历史 %s 显示自然空状态，不填造默认搜索词',
    saved => {
      uni.setStorageSync(STORAGE_KEYS.SEARCH_HISTORY, saved)
      expect(useHomeData().recentSearches.value).toEqual([])
    }
  )

  it('选择历史词只编码导航到搜索页，不擅自改写历史；空搜索无查询参数', () => {
    const navigate = vi.spyOn(uni, 'navigateTo')
    const saved = JSON.stringify(['原历史'])
    uni.setStorageSync(STORAGE_KEYS.SEARCH_HISTORY, saved)
    const home = useHomeData()
    home.openSearch('  审批 & 2026/10  ')
    home.openSearch('  ')
    expect(navigate.mock.calls.map(([options]) => options.url)).toEqual([
      `/pages/search-result/index?keyword=${encodeURIComponent('审批 & 2026/10')}`,
      '/pages/search-result/index',
    ])
    expect(uni.getStorageSync(STORAGE_KEYS.SEARCH_HISTORY)).toBe(saved)
  })

  it('问候与日期使用设备时间，返回后更新，不复用固定演示日期', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 8, 9))
    const home = useHomeData()
    expect(home.greeting.value).toBe('早上好')
    expect(home.todayText.value).toContain('10月8日')
    vi.setSystemTime(new Date(2026, 9, 9, 17))
    vi.mocked(onShow).mock.calls[0][0]()
    expect(home.greeting.value).toBe('下午好')
    expect(home.todayText.value).toContain('10月9日')
  })
})
