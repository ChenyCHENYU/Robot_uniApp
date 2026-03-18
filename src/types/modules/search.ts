/** C_Search 搜索 - 类型定义 */

export interface SearchProps {
  /** 搜索关键词 */
  modelValue?: string
  /** 占位文本 */
  placeholder?: string
  /** 是否显示取消按钮 */
  showCancel?: boolean
  /** 取消按钮文字 */
  cancelText?: string
  /** 是否自动聚焦 */
  autofocus?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 最大历史记录数 */
  maxHistory?: number
  /** 是否显示搜索历史 */
  showHistory?: boolean
  /** 搜索历史存储 key */
  historyKey?: string
  /** 输入框左侧图标 */
  leftIcon?: string
}
