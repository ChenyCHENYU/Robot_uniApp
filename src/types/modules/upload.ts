/** C_Upload 上传 - 类型定义 */

export type UploadAccept = 'image' | 'video' | 'all'
export type UploadFileStatus = 'pending' | 'uploading' | 'success' | 'error'

export interface UploadFileItem {
  /** 文件地址 */
  url: string
  /** 文件名 */
  name?: string
  /** 文件大小(byte) */
  size?: number
  /** 上传状态 */
  status: UploadFileStatus
  /** 上传进度 */
  progress?: number
  /** 服务端返回数据 */
  response?: unknown
}

export interface UploadProps {
  /** 最大文件数 */
  maxCount?: number
  /** 文件大小限制(byte) */
  maxSize?: number
  /** 接受的文件类型 */
  accept?: UploadAccept
  /** 是否多选 */
  multiple?: boolean
  /** 是否展示删除按钮 */
  deletable?: boolean
  /** 预览图尺寸 */
  previewSize?: string
  /** 是否禁用 */
  disabled?: boolean
}

export interface UploadAcceptMap {
  image: string[]
  video: string[]
  all: string[]
}
