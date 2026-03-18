/** C_Progress 进度条 - 类型定义 */

export interface ProgressProps {
  /** 当前进度百分比 */
  percentage?: number
  /** 进度条高度(rpx) */
  strokeHeight?: number | string
  /** 是否显示文字 */
  showText?: boolean
  /** 是否在进度条内显示文字 */
  textInside?: boolean
  /** 进度条激活颜色 */
  color?: string
  /** 轨道颜色 */
  trackColor?: string
  /** 是否为圆形进度条 */
  type?: 'line' | 'circle'
  /** 圆形进度条直径(rpx) */
  size?: number | string
  /** 进度条宽度(rpx, 圆形时) */
  strokeWidth?: number | string
  /** 是否开启动画 */
  animated?: boolean
}
