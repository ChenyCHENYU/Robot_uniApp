/** C_ActionSheet 动作面板 - 类型定义 */

export interface ActionSheetAction {
  /** 选项名称 */
  name: string
  /** 副标题 */
  subname?: string
  /** 文字颜色 */
  color?: string
  /** 是否为加载状态 */
  loading?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  className?: string
}

export interface ActionSheetProps {
  /** 是否显示 */
  visible?: boolean
  /** 面板选项列表 */
  actions?: ActionSheetAction[]
  /** 顶部标题 */
  title?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 描述信息 */
  description?: string
  /** 是否显示取消按钮 */
  showCancel?: boolean
  /** 点击遮罩层是否关闭 */
  closeOnClickOverlay?: boolean
  /** 是否圆角 */
  round?: boolean
}
