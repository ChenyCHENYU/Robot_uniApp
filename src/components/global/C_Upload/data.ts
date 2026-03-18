/**
 * C_Upload - 文件上传组件数据逻辑
 */

export const defaultProps = {
  maxCount: 9,
  maxSize: 10 * 1024 * 1024,
  accept: 'image',
  multiple: true,
  deletable: true,
  previewSize: '160rpx',
  disabled: false,
}

export const ACCEPT_MAP = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  video: ['mp4', 'avi', 'mov'],
  all: [],
}
