import { ref, computed } from 'vue'
/** Layout 布局：仅在当前页面维护演示状态，不调用业务接口。 */

export const PAGE_META = {
  name: 'layout',
  title: '布局',
  component: 'C_Layout',
  summary: '统一页面结构与导航容器',
  category: '导航',
  instruction: '切换布局模式，观察页头、内容和导航如何分配空间。',
  number: '06',
} as const

/** 管理当前演示交互状态。 */
export function useDemo() {
  const layoutModes = [
    { value: 'auto', label: '自动' },
    { value: 'header-only', label: '页头' },
    { value: 'full', label: '完整' },
    { value: 'none', label: '内容' },
  ] as const
  const selectedMode = ref('full')
  const selectMode = (mode: string) => {
    selectedMode.value = mode
  }
  const showSampleHeader = computed(() => selectedMode.value !== 'none')
  const showSampleTabbar = computed(() => selectedMode.value === 'full')
  const descriptions: Record<string, string> = {
    auto: '自动模式：当前详情路由显示返回页头',
    'header-only': '页头模式：内容占据剩余可用空间',
    full: '完整模式：页头、内容与底部导航各自占位',
    none: '内容模式：隐藏公共导航，适合独立内容页面',
  }
  const modeDescription = computed(() => descriptions[selectedMode.value])
  return {
    layoutModes,
    selectedMode,
    selectMode,
    showSampleHeader,
    showSampleTabbar,
    modeDescription,
  }
}
