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

/** H5 图片通过 Blob 下载；跨域图片须允许 CORS，失败时由组件提示。 */
export async function downloadPreviewImage(imgUrl: string) {
  // #ifdef H5
  const response = await fetch(imgUrl)
  if (!response.ok) throw new Error('图片下载失败')
  const blob = await response.blob()
  if (!blob.size || !blob.type.startsWith('image/')) {
    throw new Error('图片内容无效')
  }
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const name = new URL(imgUrl, window.location.href).pathname.split('/').pop()
  anchor.href = objectUrl
  anchor.download = name || 'preview-image.png'
  document.body.appendChild(anchor)
  try {
    anchor.click()
  } finally {
    anchor.remove()
    // 浏览器需要在点击后读取 Blob，稍后再释放。
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  }
  // #endif
}
