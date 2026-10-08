import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { components } from '@/components/local/ComponentCatalog/data'
import { STORAGE_KEYS } from '@/constants'

interface SearchResult {
  id: string
  title: string
  desc: string
  extra: string
  icon: string
  type: string
  path: string
}

/** 本地索引搜索，结果与现有页面路由对应。 */
export function useSearchResultPage() {
  const keyword = ref('')
  const searchedKeyword = ref('')
  const hasSearched = ref(false)
  const activeTab = ref('all')
  const readHistory = (): string[] => {
    try {
      const saved: unknown = JSON.parse(
        String(uni.getStorageSync(STORAGE_KEYS.SEARCH_HISTORY) || '[]')
      )
      return Array.isArray(saved)
        ? saved
            .filter((item): item is string => typeof item === 'string')
            .slice(0, 10)
        : []
    } catch {
      return []
    }
  }
  const searchHistory = ref(readHistory())
  const hotSearches = [
    '表单',
    '列表',
    '数据看板',
    '审批',
    '上传',
    '日历',
    '图标',
    '布局',
  ]
  const pageResults: SearchResult[] = [
    {
      id: 'form',
      title: '表单模板',
      desc: '人员信息填报与校验',
      extra: '业务页面',
      icon: 'i-mdi-form-select',
      type: 'page',
      path: '/pages/form-template/index',
    },
    {
      id: 'dashboard',
      title: '数据看板',
      desc: '核心指标与访问趋势',
      extra: '业务页面',
      icon: 'i-mdi-chart-bar',
      type: 'page',
      path: '/pages/dashboard/index',
    },
    {
      id: 'approval',
      title: '审批中心',
      desc: '申请详情与审批流程',
      extra: '业务页面',
      icon: 'i-mdi-clipboard-check-outline',
      type: 'page',
      path: '/pages/approval/index',
    },
    {
      id: 'crud',
      title: '数据列表',
      desc: '数据查询、筛选与管理',
      extra: '业务页面',
      icon: 'i-mdi-format-list-bulleted',
      type: 'page',
      path: '/pages/crud-list/index',
    },
    {
      id: 'doc',
      title: 'UniApp 使用文档',
      desc: '跨平台框架使用指南与 API 文档',
      extra: '文档',
      icon: 'i-mdi-book-open-page-variant-outline',
      type: 'doc',
      path: '/pages/webview/index?url=https%3A%2F%2Funiapp.dcloud.net.cn&title=UniApp文档',
    },
  ]
  const allResults: SearchResult[] = [
    ...pageResults,
    ...components.map(item => ({
      id: item.id,
      title: item.name,
      desc: item.description,
      extra: item.tags.join(' · '),
      icon: `i-${item.icon}`,
      type: 'component',
      path: item.path,
    })),
  ]
  const matchedResults = computed(() => {
    const query = searchedKeyword.value.toLowerCase()
    return allResults.filter(item =>
      `${item.title} ${item.desc} ${item.extra}`.toLowerCase().includes(query)
    )
  })
  const resultTabs = computed(() =>
    ['all', 'page', 'component', 'doc'].map((key, index) => ({
      key,
      label: ['全部', '页面', '组件', '文档'][index],
      count: matchedResults.value.filter(
        item => key === 'all' || item.type === key
      ).length,
    }))
  )
  const currentResults = computed(() =>
    matchedResults.value.filter(
      item => activeTab.value === 'all' || item.type === activeTab.value
    )
  )
  const handleSearch = () => {
    const query = keyword.value.trim()
    if (!query) return
    keyword.value = query
    searchedKeyword.value = query
    hasSearched.value = true
    activeTab.value = 'all'
    searchHistory.value = [
      query,
      ...searchHistory.value.filter(item => item !== query),
    ].slice(0, 10)
    uni.setStorageSync(
      STORAGE_KEYS.SEARCH_HISTORY,
      JSON.stringify(searchHistory.value)
    )
  }
  const clearKeyword = () => {
    keyword.value = ''
    searchedKeyword.value = ''
    hasSearched.value = false
    activeTab.value = 'all'
  }
  const clearHistory = () => {
    searchHistory.value = []
    uni.removeStorageSync(STORAGE_KEYS.SEARCH_HISTORY)
  }
  const quickSearch = (text: string) => {
    keyword.value = text
    handleSearch()
  }
  const handleResultClick = (item: SearchResult) =>
    uni.navigateTo({ url: item.path })
  onLoad(query => {
    if (!query?.keyword) return
    let routeKeyword = String(query.keyword)
    // 微信 onLoad 透传 query；H5/App 路由已解析，不能再次解码字面百分号。
    if (process.env.UNI_PLATFORM === 'mp-weixin') {
      try {
        routeKeyword = decodeURIComponent(routeKeyword)
      } catch {
        // 外部链接的非法百分号保留原文，仍允许用户修改和重新搜索。
      }
    }
    quickSearch(routeKeyword)
  })
  return {
    keyword,
    hasSearched,
    activeTab,
    searchHistory,
    hotSearches,
    resultTabs,
    currentResults,
    handleSearch,
    clearKeyword,
    clearHistory,
    quickSearch,
    handleResultClick,
  }
}
