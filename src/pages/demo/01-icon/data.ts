/** 图标演示：集合、样例和交互状态均由本页维护，无业务接口。 */
import { computed, ref } from 'vue'

export const PAGE_META = {
  name: 'icon',
  title: '图标',
  component: 'C_Icon',
  summary: '清晰的图形，统一的尺寸与交互。',
  category: '基础',
  instruction: '点击任意图标查看名称，切换尺寸与单色图标的颜色。',
  number: '01',
} as const

export interface IconSample {
  name: string
  label: string
}

/** 名称已按项目安装的 Iconify JSON 核对；彩色集合保留 SVG 原始配色。 */
export const ICON_COLLECTIONS = [
  {
    id: 'mdi',
    title: 'Material Design',
    description: '常用线框图标，适合导航与操作。',
    colored: false,
    icons: [
      { name: 'i-mdi-home-outline', label: '首页' },
      { name: 'i-mdi-file-document-outline', label: '文档' },
      { name: 'i-mdi-bell-outline', label: '通知' },
      { name: 'i-mdi-account-group-outline', label: '团队' },
    ],
  },
  {
    id: 'solar',
    title: 'Solar',
    description: '圆润的线条，适合轻量内容与工具。',
    colored: false,
    icons: [
      { name: 'i-solar-home-2-linear', label: '首页' },
      { name: 'i-solar-document-text-linear', label: '文档' },
      { name: 'i-solar-bell-linear', label: '通知' },
      { name: 'i-solar-users-group-rounded-linear', label: '团队' },
    ],
  },
  {
    id: 'fluent',
    title: 'Fluent',
    description: '简洁的办公图标，适合工作台与表单。',
    colored: false,
    icons: [
      { name: 'i-fluent-home-24-regular', label: '首页' },
      { name: 'i-fluent-document-24-regular', label: '文档' },
      { name: 'i-fluent-alert-24-regular', label: '通知' },
      { name: 'i-fluent-people-team-24-regular', label: '团队' },
    ],
  },
  {
    id: 'fluent-color',
    title: 'Fluent Color',
    description: '保留原始多色 SVG，颜色设置不改变图形。',
    colored: true,
    icons: [
      { name: 'i-fluent-color-home-24', label: '首页' },
      { name: 'i-fluent-color-document-24', label: '文档' },
      { name: 'i-fluent-color-alert-24', label: '通知' },
      { name: 'i-fluent-color-people-24', label: '团队' },
    ],
  },
  {
    id: 'ion',
    title: 'Ionicons',
    description: '移动端线框图标，适合功能入口。',
    colored: false,
    icons: [
      { name: 'i-ion-home-outline', label: '首页' },
      { name: 'i-ion-document-text-outline', label: '文档' },
      { name: 'i-ion-notifications-outline', label: '通知' },
      { name: 'i-ion-people-outline', label: '团队' },
    ],
  },
] as const

export const WOT_SAMPLES = [
  { name: 'home', label: '首页' },
  { name: 'search', label: '搜索' },
  { name: 'notification', label: '通知' },
  { name: 'user', label: '用户' },
] as const

export const SIZE_OPTIONS = [20, 28, 36, 44] as const
export const COLOR_OPTIONS = [
  { id: 'primary', label: '蓝色', value: 'var(--r-color-primary)' },
  { id: 'neutral', label: '正文', value: 'var(--r-text-primary)' },
  { id: 'success', label: '绿色', value: 'var(--r-color-success)' },
  { id: 'warning', label: '橙色', value: 'var(--r-color-warning)' },
] as const

/** 真实星形 SVG，不使用纯色像素或矩形替代图标。 */
export const SVG_DATA_URI =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2QjM1Ii8+Cjwvc3ZnPgo='

/** 创建独立选择状态；展示操作不改变其他页面。 */
export function useDemo() {
  const selectedIcon = ref<IconSample>(ICON_COLLECTIONS[0].icons[0])
  const selectedSize = ref<number>(28)
  const selectedColor = ref<string>(COLOR_OPTIONS[0].value)
  const lastIconAction = ref('点击下方图标进行选择')
  const isColored = computed(() =>
    selectedIcon.value.name.includes('fluent-color')
  )

  function selectIcon(icon: IconSample) {
    selectedIcon.value = icon
    lastIconAction.value = `已选择${icon.label}图标`
  }

  function handleIconClick() {
    lastIconAction.value = `${selectedIcon.value.label}图标已响应点击`
  }

  function copyIconName() {
    uni.setClipboardData({
      data: selectedIcon.value.name,
      success: () => {
        lastIconAction.value = '图标名称已复制'
      },
    })
  }

  return {
    selectedIcon,
    selectedSize,
    selectedColor,
    isColored,
    lastIconAction,
    selectIcon,
    handleIconClick,
    copyIconName,
  }
}
