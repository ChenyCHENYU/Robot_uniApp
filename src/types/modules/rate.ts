/** C_Rate 评分 - 类型定义 */

export interface RateProps {
  /** 当前分值 */
  modelValue?: number
  /** 图标总数 */
  count?: number
  /** 图标大小(rpx) */
  size?: number | string
  /** 图标间距(rpx) */
  gutter?: string
  /** 选中时图标颜色 */
  color?: string
  /** 未选中时图标颜色 */
  voidColor?: string
  /** 选中图标 */
  icon?: string
  /** 未选中图标 */
  voidIcon?: string
  /** 是否允许半选 */
  allowHalf?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否可触摸滑动选择 */
  touchable?: boolean
}
