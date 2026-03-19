/**
 * C_Icon 数据定义
 */
export type IconType = 'unocss' | 'wot' | 'svg' | 'image' | 'custom'

export interface IconProps {
  type?: IconType
  name?: string
  size?: string | number
  color?: string
  bold?: boolean
  label?: string
  customPrefix?: string
  customStyle?: Record<string, any>
}

export const defaultIconProps: Required<
  Pick<IconProps, 'type' | 'size' | 'color'>
> = {
  type: 'unocss',
  size: 24,
  color: '#333',
}
