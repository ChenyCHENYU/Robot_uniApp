/**
 * @description C_Progress 进度条 - 数据配置
 */

/** 默认属性 */
export const defaultProps = {
  /** 进度百分比 0-100 */
  percent: 0,
  /** 是否显示文字 */
  showText: true,
  /** 进度条高度 rpx */
  strokeHeight: 16,
  /** 颜色 */
  color: '',
  /** 轨道颜色 */
  trackColor: '#f0f0f0',
  /** 是否开启过渡动画 */
  animated: true,
  /** 状态 */
  status: 'normal',
  /** 是否圆形 */
  circle: false,
  /** 圆形尺寸 rpx */
  circleSize: 240,
  /** 圆形线宽 rpx */
  circleStrokeWidth: 12,
}

/** 状态颜色映射 */
export const STATUS_COLORS = {
  normal: 'var(--r-color-primary, #2b6bff)',
  success: 'var(--r-color-success, #34c759)',
  warning: 'var(--r-color-warning, #ff9f0a)',
  error: 'var(--r-color-danger, #ff4d4f)',
}
