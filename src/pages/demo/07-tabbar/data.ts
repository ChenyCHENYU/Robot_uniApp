/** Tabbar 标签栏：仅在当前页面维护演示状态，不调用业务接口。 */

export const PAGE_META = {
  name: 'tabbar',
  title: '标签栏',
  component: 'C_Tabbar',
  summary: '底部导航标签栏组件',
  category: '导航',
  instruction: '点击标签切换选中态，对比数字角标与圆点提示。',
  number: '07',
} as const

import { ref } from 'vue'

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const selectedIndex = ref(0)
  const selectedTab = ref('首页')
  const selectedBadgeTab = ref('首页')
  const selectTab = (name: string) => {
    selectedTab.value = name
    selectedIndex.value = tabs.findIndex(tab => tab.name === name)
  }
  const selectBadgeTab = (name: string) => {
    selectedBadgeTab.value = name
  }
  const tabs = [
    { name: '首页', icon: 'i-mdi-home', active: true },
    { name: '消息', icon: 'i-mdi-chat', active: false },
    { name: '机器人', icon: 'i-mdi-robot', active: false },
    { name: '我的', icon: 'i-mdi-account', active: false },
    { name: '设置', icon: 'i-mdi-cog', active: false },
  ]

  const tabItems = tabs.map((tab, index) => ({
    id: `preview-${index}`,
    text: tab.name,
    icon: 'home',
    activeIcon: 'home',
    unoIcon: tab.icon,
    path: '',
    badge: 0,
  }))
  const onActualTabChange = (event: {
    item: { text: string }
    index: number
  }) => {
    selectTab(event.item.text)
  }

  const badgeTabs = [
    { name: '首页', icon: 'i-mdi-home', active: true, badge: 0, dot: false },
    { name: '消息', icon: 'i-mdi-chat', active: false, badge: 12, dot: false },
    { name: '机器人', icon: 'i-mdi-robot', active: false, badge: 0, dot: true },
    {
      name: '我的',
      icon: 'i-mdi-account',
      active: false,
      badge: 0,
      dot: false,
    },
    { name: '设置', icon: 'i-mdi-cog', active: false, badge: 99, dot: false },
  ]
  return {
    tabItems,
    selectedIndex,
    onActualTabChange,
    badgeTabs,
    selectedTab,
    selectedBadgeTab,
    selectTab,
    selectBadgeTab,
  }
}
