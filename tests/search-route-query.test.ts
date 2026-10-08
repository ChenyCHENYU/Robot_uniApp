import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@dcloudio/uni-app', () => ({ onLoad: vi.fn() }))

import { onLoad } from '@dcloudio/uni-app'
import { useSearchResultPage } from '@/pages/search-result/data'
import { STORAGE_KEYS } from '@/constants'

/** 从页面真实 onLoad 入口读取平台路由参数，不直接测试解码实现。 */
function loadSearch(platform: string, keyword: string) {
  vi.stubEnv('UNI_PLATFORM', platform)
  const page = useSearchResultPage()
  const callback = vi.mocked(onLoad).mock.calls.at(-1)![0]
  callback({ keyword })
  return page
}

beforeEach(() => {
  vi.mocked(onLoad).mockClear()
  uni.clearStorageSync()
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('搜索页跨平台路由关键词', () => {
  it('微信编码中文还原后匹配真实审批入口，历史与用户原关键词去重', () => {
    uni.setStorageSync(
      STORAGE_KEYS.SEARCH_HISTORY,
      JSON.stringify(['审批', '已搜索'])
    )
    const page = loadSearch('mp-weixin', encodeURIComponent(' 审批 '))
    expect(page.keyword.value).toBe('审批')
    expect(page.hasSearched.value).toBe(true)
    expect(
      page.currentResults.value.some(
        item => item.path === '/pages/approval/index'
      )
    ).toBe(true)
    expect(page.searchHistory.value).toEqual(['审批', '已搜索'])
    expect(JSON.parse(uni.getStorageSync(STORAGE_KEYS.SEARCH_HISTORY))).toEqual(
      ['审批', '已搜索']
    )
  })

  it('微信入口保留中文与 & / # % 字面含义，搜索及历史使用还原后的内容', () => {
    const keyword = '审批 & / # 100%'
    const page = loadSearch('mp-weixin', encodeURIComponent(keyword))
    expect(page.keyword.value).toBe(keyword)
    expect(page.currentResults.value).toEqual([])
    expect(page.searchHistory.value).toEqual([keyword])
    expect(JSON.parse(uni.getStorageSync(STORAGE_KEYS.SEARCH_HISTORY))).toEqual(
      [keyword]
    )
  })

  it('微信对用户字面编码文本只还原一次，不误当中文关键词匹配', () => {
    const keyword = '%E5%AE%A1%E6%89%B9'
    const page = loadSearch('mp-weixin', encodeURIComponent(keyword))
    expect(page.keyword.value).toBe(keyword)
    expect(page.currentResults.value).toEqual([])
    expect(JSON.parse(uni.getStorageSync(STORAGE_KEYS.SEARCH_HISTORY))).toEqual(
      [keyword]
    )
  })

  it.each(['h5', 'app'])(
    '%s 已解析的字面编码文本不再解码，原文进入搜索历史',
    platform => {
      const keyword = '%E5%AE%A1%E6%89%B9'
      const page = loadSearch(platform, keyword)
      expect(page.keyword.value).toBe(keyword)
      expect(page.hasSearched.value).toBe(true)
      expect(page.currentResults.value).toEqual([])
      expect(
        JSON.parse(uni.getStorageSync(STORAGE_KEYS.SEARCH_HISTORY))
      ).toEqual([keyword])
    }
  )

  it('微信非法百分号原文仍可搜索并保存，不阻止页面进入', () => {
    const keyword = '审批%broken'
    const page = loadSearch('mp-weixin', keyword)
    expect(page.keyword.value).toBe(keyword)
    expect(page.hasSearched.value).toBe(true)
    expect(page.currentResults.value).toEqual([])
    expect(JSON.parse(uni.getStorageSync(STORAGE_KEYS.SEARCH_HISTORY))).toEqual(
      [keyword]
    )
  })
})
