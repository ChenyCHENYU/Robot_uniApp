/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2026-03-19 14:05:13
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2026-03-19 14:50:25
 * @FilePath: \Robot_uniApp\src\components\global\C_Title\data.ts
 * @Description:
 * Copyright (c) 2026 by CHENY, All Rights Reserved 😎.
 */
/**
 * C_Title 数据定义
 */
export type TitleType =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
export type TitleAlign = 'left' | 'center' | 'right'
export type TitleSize = 'small' | 'medium' | 'large'

export interface TitleProps {
  title: string
  subtitle?: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  type?: TitleType
  align?: TitleAlign
  size?: TitleSize
  leftIcon?: string
  rightIcon?: string
  iconType?: string
  bold?: boolean
  showDivider?: boolean
  dividerPosition?: 'top' | 'bottom'
  showDecoration?: boolean
  clickable?: boolean
  customStyle?: Record<string, any>
}

/** 各类型对应的图标颜色 */
export const TYPE_ICON_COLOR: Record<TitleType, string> = {
  default: '#64748b',
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#6b7280',
}
