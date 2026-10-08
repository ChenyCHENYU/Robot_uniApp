/** SwipeAction 滑动操作：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'

export const PAGE_META = {
  name: 'swipe-action',
  title: '滑动操作',
  component: 'C_SwipeAction',
  summary: '列表项左右滑动交互',
  category: '数据',
  instruction: '向左或向右滑动展开操作，体验置顶、删除和恢复列表。',
  number: '21',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const actionText = ref('')

  const initialItems = [
    { name: '张三', avatar: '张', msg: '你好，在吗？', color: 'bg-blue-500' },
    {
      name: '李四',
      avatar: '李',
      msg: '项目进展如何？',
      color: 'bg-green-500',
    },
    { name: '王五', avatar: '王', msg: '明天开会', color: 'bg-purple-500' },
  ]

  const listItems = ref([...initialItems])

  function onAction(action: { text: string }) {
    actionText.value = action.text
  }
  function onListAction(action: { text: string }, name: string) {
    const item = listItems.value.find(row => row.name === name)
    if (!item) return
    if (action.text === '删除')
      listItems.value = listItems.value.filter(row => row.name !== name)
    if (action.text === '置顶')
      listItems.value = [
        item,
        ...listItems.value.filter(row => row.name !== name),
      ]
    actionText.value = `${name}：已${action.text}`
  }
  function resetItems() {
    listItems.value = [...initialItems]
    actionText.value = '列表已恢复'
  }
  return { actionText, listItems, onAction, onListAction, resetItems }
}
