/** C_ImagePreview 图片预览 - 类型定义 */

export interface ImagePreviewProps {
  /** 是否显示 */
  visible?: boolean
  /** 图片列表 */
  images?: string[]
  /** 起始位置 */
  startPosition?: number
  /** 是否可缩放 */
  zoomable?: boolean
  /** 是否显示页码 */
  showIndex?: boolean
  /** 是否循环播放 */
  loop?: boolean
  /** 关闭图标位置 */
  closeable?: boolean
  /** 切换动画时长(ms) */
  swipeDuration?: number
  /** 最大缩放比例 */
  maxZoom?: number
  /** 最小缩放比例 */
  minZoom?: number
}
