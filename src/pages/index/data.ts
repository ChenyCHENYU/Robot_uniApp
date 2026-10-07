/**
 * @Description: 首页静态演示数据（待办与快捷入口）
 */

export interface TodoItem {
  id: number
  title: string
  time: string
  done: boolean
  priority: string
}

export interface QuickAction {
  label: string
  icon: string
  bg: string
  url: string
}

export const initialTodoList: TodoItem[] = [
  {
    id: 1,
    title: '完成首页Dashboard布局',
    time: '今天 10:00',
    done: true,
    priority: 'high',
  },
  {
    id: 2,
    title: 'Q1产品规划评审',
    time: '今天 14:00',
    done: false,
    priority: 'high',
  },
  {
    id: 3,
    title: '组件库文档更新',
    time: '今天 16:00',
    done: false,
    priority: 'medium',
  },
  {
    id: 4,
    title: '优化H5响应式布局',
    time: '明天 09:00',
    done: false,
    priority: 'low',
  },
]

export const quickActions: QuickAction[] = [
  {
    label: '扫一扫',
    icon: '📷',
    bg: 'var(--r-gradient-primary)',
    url: '/pages/scan/index',
  },
  {
    label: '审批中心',
    icon: '✅',
    bg: 'var(--r-gradient-success)',
    url: '/pages/approval/index',
  },
  {
    label: '数据看板',
    icon: '📊',
    bg: 'var(--r-gradient-danger)',
    url: '/pages/dashboard/index',
  },
  {
    label: '表单模板',
    icon: '📝',
    bg: 'var(--r-gradient-info)',
    url: '/pages/form-template/index',
  },
  {
    label: 'CRUD列表',
    icon: '📋',
    bg: 'var(--r-gradient-warm)',
    url: '/pages/crud-list/index',
  },
  {
    label: '搜索',
    icon: '🔍',
    bg: 'var(--r-gradient-mint)',
    url: '/pages/search-result/index',
  },
  {
    label: '详情展示',
    icon: '📖',
    bg: 'var(--r-gradient-sun)',
    url: '/pages/detail/index',
  },
  {
    label: '关于',
    icon: 'ℹ️',
    bg: 'var(--r-gradient-lime)',
    url: '/pages/about/index',
  },
]
