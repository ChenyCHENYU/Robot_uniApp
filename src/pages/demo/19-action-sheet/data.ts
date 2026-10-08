/** ActionSheet 操作面板：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'

export const PAGE_META = {
  name: 'action-sheet',
  title: '操作面板',
  component: 'C_ActionSheet',
  summary: '底部弹出的操作菜单',
  category: '反馈',
  instruction: '打开操作面板并选择选项，查看当前选择；取消不会变更结果。',
  number: '19',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const showBasic = ref(false)

  const showTitle = ref(false)

  const showIcon = ref(false)

  const showDanger = ref(false)

  const selectedAction = ref('')

  const basicItems = [
    { name: '选项一' },
    { name: '选项二' },
    { name: '选项三' },
  ]

  const shareItems = [
    { name: '微信好友', icon: 'i-mdi-wechat' },
    { name: '朋友圈', icon: 'i-mdi-account-group' },
    { name: '复制链接', icon: 'i-mdi-link-variant' },
    { name: '保存图片', icon: 'i-mdi-download' },
  ]

  const iconItems = [
    { name: '编辑', icon: 'i-mdi-pencil' },
    { name: '复制', icon: 'i-mdi-content-copy' },
    { name: '移动', icon: 'i-mdi-folder-move' },
    { name: '重命名', icon: 'i-mdi-rename-box' },
  ]

  const dangerItems = [
    { name: '置顶聊天' },
    { name: '标为已读' },
    { name: '删除聊天', danger: true },
    { name: '举报', danger: true },
  ]

  function onSelect(item: { name?: string; text?: string }) {
    selectedAction.value = item.name || item.text || ''
  }
  return {
    showBasic,
    showTitle,
    showIcon,
    showDanger,
    selectedAction,
    basicItems,
    shareItems,
    iconItems,
    dangerItems,
    onSelect,
  }
}
