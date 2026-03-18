/** C_Signature 签名板 - 类型定义 */

export interface SignatureProps {
  /** 画笔颜色 */
  penColor?: string
  /** 画笔粗细 */
  lineWidth?: number
  /** 背景色 */
  backgroundColor?: string
  /** 画布宽度(rpx) */
  width?: string
  /** 画布高度(rpx) */
  height?: string
  /** 导出图片类型 */
  exportType?: 'png' | 'jpg'
  /** 是否禁用 */
  disabled?: boolean
}

export interface SignatureExportResult {
  /** 临时文件路径 */
  tempFilePath: string
  /** 是否为空签名 */
  isEmpty: boolean
}
