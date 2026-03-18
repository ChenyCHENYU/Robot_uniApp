/**
 * @description C_Rate 评分 - 数据配置
 */

/** 默认属性 */
export const defaultProps = {
  /** 当前值 */
  modelValue: 0,
  /** 总数 */
  count: 5,
  /** 图标尺寸 rpx */
  size: 44,
  /** 间距 rpx */
  gap: 8,
  /** 选中颜色 */
  activeColor: 'var(--r-color-warning, #ff9f0a)',
  /** 未选中颜色 */
  inactiveColor: 'var(--r-text-color-placeholder, #ccc)',
  /** 选中图标 */
  activeIcon: 'star-fill',
  /** 未选中图标 */
  inactiveIcon: 'star',
  /** 是否允许半星 */
  allowHalf: false,
  /** 是否只读 */
  readonly: false,
  /** 是否禁用 */
  disabled: false,
  /** 是否允许归零 */
  clearable: false,
}
