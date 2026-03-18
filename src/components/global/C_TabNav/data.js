/**
 * @description C_TabNav 标签页导航 - 数据配置
 */

/** 默认属性 */
export const defaultProps = {
  /** 标签列表 [{ label, value, badge?, disabled? }] */
  tabs: [],
  /** 当前激活值 */
  modelValue: '',
  /** 是否可滚动 */
  scrollable: false,
  /** 是否显示下划线 */
  showLine: true,
  /** 下划线宽度 rpx */
  lineWidth: 60,
  /** 是否等分 */
  equalWidth: false,
  /** 是否开启滑动切换 */
  swipeable: false,
  /** 是否吸顶 */
  sticky: false,
  /** 吸顶偏移量 px */
  stickyOffset: 0,
}
