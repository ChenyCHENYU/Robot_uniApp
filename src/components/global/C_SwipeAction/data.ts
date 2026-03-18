/**
 * C_SwipeAction - 滑动操作组件数据逻辑
 */

export const defaultProps = {
  /** 是否禁用 */
  disabled: false,
  /** 左侧操作按钮 */
  leftActions: [],
  /** 右侧操作按钮 */
  rightActions: [],
  /** 滑动阈值(rpx)，超过时自动展开 */
  threshold: 60,
}
