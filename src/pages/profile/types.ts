/**
 * @Description: 个人中心类型定义
 */

export interface ProfileMenuItem {
  id: string
  label: string
  icon: string
  iconBg: string
  path?: string
  badge?: number
  extra?: string
}

export interface MenuGroup {
  title: string
  items: ProfileMenuItem[]
}
