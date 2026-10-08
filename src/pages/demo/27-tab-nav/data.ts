/** TabNav 标签导航：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref, computed } from 'vue'

export const PAGE_META = {
  name: 'tab-nav',
  title: '标签导航',
  component: 'C_TabNav',
  summary: '顶部标签页切换组件',
  category: '导航',
  instruction: '点击标签切换内容，横向滚动可查看更多分类。',
  number: '27',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const activeTab = ref('all')

  const scrollTab = ref('recommend')

  const cardTab = ref('all')

  const badgeTab = ref('msg')

  const basicTabs = [
    { label: '全部', value: 'all' },
    { label: '进行中', value: 'doing' },
    { label: '已完成', value: 'done' },
  ]

  const scrollTabs = [
    { label: '推荐', value: 'recommend' },
    { label: '热榜', value: 'hot' },
    { label: '科技', value: 'tech' },
    { label: '财经', value: 'finance' },
    { label: '体育', value: 'sport' },
    { label: '娱乐', value: 'entertainment' },
    { label: '游戏', value: 'game' },
    { label: '教育', value: 'edu' },
  ]

  const badgeTabs = [
    { label: '消息', value: 'msg', badge: 5 },
    { label: '通知', value: 'notice', badge: '' },
    { label: '设置', value: 'settings' },
  ]
  const activeLabel = computed(
    () => basicTabs.find(tab => tab.value === activeTab.value)?.label
  )
  const scrollLabel = computed(
    () => scrollTabs.find(tab => tab.value === scrollTab.value)?.label
  )
  return {
    activeTab,
    activeLabel,
    scrollLabel,
    scrollTab,
    cardTab,
    badgeTab,
    basicTabs,
    scrollTabs,
    badgeTabs,
  }
}
