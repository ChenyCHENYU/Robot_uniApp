/** C_Tag 标签 - 类型定义 */

export type TagType = 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type TagSize = 'small' | 'default' | 'large'

export interface TagColorConfig {
  bg: string
  text: string
  border: string
}

export interface TagProps {
  /** 标签类型 */
  type?: TagType
  /** 是否为朴素模式 */
  plain?: boolean
  /** 是否为圆角 */
  round?: boolean
  /** 是否可关闭 */
  closeable?: boolean
  /** 标签大小 */
  size?: TagSize
}

/** 标签颜色配置映射 */
export type TagColorMap = Record<TagType, TagColorConfig>
