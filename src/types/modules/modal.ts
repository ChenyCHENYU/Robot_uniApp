/** C_Modal 弹窗 - 类型定义 */

export interface ModalProps {
  /** 是否显示 */
  visible?: boolean
  /** 标题 */
  title?: string
  /** 内容 */
  content?: string
  /** 是否显示取消按钮 */
  showCancel?: boolean
  /** 确认按钮文字 */
  confirmText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 确认按钮颜色 */
  confirmColor?: string
  /** 点击遮罩层是否关闭 */
  closeOnClickOverlay?: boolean
  /** 弹窗宽度(rpx) */
  width?: string | number
  /** 是否显示关闭图标 */
  closeable?: boolean
  /** z-index */
  zIndex?: number
}
