/**
 * @Description: 个人中心静态配置与菜单数据
 */
import type { MenuGroup } from './types'

export interface ProfileStat {
  value: string
  label: string
}

/** 模板资产统计（演示数据） */
export const userStats: ProfileStat[] = [
  { value: '33', label: '组件' },
  { value: '8', label: 'Composables' },
  { value: '12', label: '常量' },
  { value: '5', label: '样式' },
]

export interface CreateMenuOptions {
  /** 未读消息数（函数形式，保证响应式） */
  unread: () => number
  /** 应用版本号 */
  version: string
}

/** 构建菜单配置（badge/版本号等动态值以 getter 传入，消费侧用 computed 包裹） */
export function createMenuGroups({
  unread,
  version,
}: CreateMenuOptions): MenuGroup[] {
  return [
    {
      title: '个人服务',
      items: [
        {
          id: 'settings',
          label: '个人设置',
          icon: 'setting',
          iconBg: 'var(--r-gradient-primary)',
          path: '/pages/settings/index',
        },
        {
          id: 'notification',
          label: '消息通知',
          icon: 'notification',
          iconBg: 'var(--r-gradient-warm)',
          badge: unread(),
          path: '/pages/message/index',
        },
        {
          id: 'privacy',
          label: '隐私管理',
          icon: 'shield',
          iconBg: 'var(--r-gradient-success)',
        },
      ],
    },
    {
      title: '开发工具',
      items: [
        {
          id: 'docs',
          label: '开发文档',
          icon: 'books',
          iconBg: 'var(--r-gradient-danger)',
          path: '/pages/webview/index?url=https%3A%2F%2Funiapp.dcloud.net.cn&title=开发文档',
        },
        {
          id: 'templates',
          label: '业务模板',
          icon: 'list',
          iconBg: 'var(--r-gradient-info)',
          path: '/pages/demo/index',
        },
        {
          id: 'changelog',
          label: '更新日志',
          icon: 'calendar',
          iconBg: 'var(--r-gradient-mint)',
          extra: `v${version}`,
        },
      ],
    },
    {
      title: '其他',
      items: [
        {
          id: 'feedback',
          label: '意见反馈',
          icon: 'edit-outline',
          iconBg: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
        },
        {
          id: 'about',
          label: '关于应用',
          icon: 'info-circle',
          iconBg: 'linear-gradient(135deg, #c3cfe2, #f5f7fa)',
          path: '/pages/about/index',
        },
        {
          id: 'cache',
          label: '清除缓存',
          icon: 'delete',
          iconBg: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
        },
      ],
    },
  ]
}
