import { computed, type CSSProperties } from 'vue'

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
  default: 'var(--r-text-secondary)',
  primary: 'var(--r-color-primary)',
  success: 'var(--r-color-success)',
  warning: 'var(--r-color-warning)',
  danger: 'var(--r-color-error)',
  info: 'var(--r-text-secondary)',
}

/** 标题使用主题令牌，保留尺寸、对齐和装饰 API。 */
export function useTitle(
  props: {
    level: string | number
    size: string
    type: string
    bold: boolean
    clickable: boolean
    customStyle: CSSProperties
  },
  emit: (event: 'click', value: unknown) => void
) {
  const iconSize = computed(
    () => ({ small: 16, medium: 18, large: 20 })[props.size] || 18
  )
  const iconColor = computed(
    () => TYPE_ICON_COLOR[props.type as TitleType] || TYPE_ICON_COLOR.primary
  )
  const headingStyle = computed(() => {
    const level = Math.min(6, Math.max(1, Number(props.level) || 2))
    const baseSizes = [44, 38, 34, 30, 28, 26]
    const adjustment = { small: -4, medium: 0, large: 4 }[props.size] || 0
    return {
      fontSize: `${baseSizes[level - 1] + adjustment}rpx`,
      fontWeight: props.bold ? 600 : 400,
    }
  })
  const wrapperStyle = computed(() => props.customStyle)
  const handleClick = (event: unknown) => {
    if (props.clickable) emit('click', event)
  }
  return { iconSize, iconColor, headingStyle, wrapperStyle, handleClick }
}
