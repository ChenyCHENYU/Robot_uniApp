/** C_Empty 空状态 - 类型定义 */

export type EmptyType =
  | 'default'
  | 'network'
  | 'search'
  | 'data'
  | 'order'
  | 'permission'
  | 'custom'

export interface EmptyProps {
  /** 空状态类型 */
  type?: EmptyType
  /** 图片地址(自定义图片) */
  image?: string
  /** 图片尺寸(rpx) */
  imageSize?: number | string
  /** 描述文字 */
  description?: string
  /** 是否显示操作按钮 */
  showAction?: boolean
  /** 按钮文字 */
  actionText?: string
}
