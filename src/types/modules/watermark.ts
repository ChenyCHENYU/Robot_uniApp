/** C_Watermark 水印 - 类型定义 */

export interface WatermarkProps {
  /** 水印文字 */
  text?: string
  /** 字号(px) */
  fontSize?: number
  /** 文字颜色 */
  color?: string
  /** 旋转角度 */
  rotate?: number
  /** 间距 [x,y] */
  gap?: [number, number]
  /** 是否覆盖全页 */
  fullPage?: boolean
}
