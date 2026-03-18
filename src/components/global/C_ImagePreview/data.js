/**
 * C_ImagePreview - 图片预览组件数据逻辑
 */

export const defaultProps = {
  /** 是否显示 */
  visible: false,
  /** 图片列表 */
  images: [],
  /** 当前显示图片索引 */
  current: 0,
  /** 是否显示指示器 */
  showIndicator: true,
  /** 是否可保存到相册 */
  saveable: true,
  /** 是否支持长按菜单 */
  longPress: true,
}
