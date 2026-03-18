/** C_Title 标题 - 类型定义 */

export type TitleType =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'default'
export type TitleLevel = 1 | 2 | 3 | 4 | 5
export type TitleSize = 'small' | 'default' | 'large'
export type TitleAlign = 'left' | 'center' | 'right'

export interface TitleProps {
  /** 标题文字 */
  title?: string
  /** 副标题 */
  subtitle?: string
  /** 标题类型 */
  type?: TitleType
  /** 标题层级 */
  level?: TitleLevel
  /** 标题大小 */
  size?: TitleSize
  /** 对齐方式 */
  align?: TitleAlign
  /** 左侧图标 */
  leftIcon?: string
  /** 是否显示装饰 */
  showDecoration?: boolean
  /** 是否显示分割线 */
  showDivider?: boolean
}
