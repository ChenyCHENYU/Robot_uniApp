/** C_Badge 徽标 - 类型定义 */

export interface BadgeProps {
  /** 徽标内容 */
  content?: string | number
  /** 是否为小红点 */
  dot?: boolean
  /** 最大显示值 */
  max?: number
  /** 类型：primary / success / warning / danger / info */
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** 是否显示 */
  show?: boolean
  /** 自定义位置偏移 [top, right] */
  offset?: [number, number]
}
