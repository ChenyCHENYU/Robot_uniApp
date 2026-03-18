/** C_Cascader 级联选择 - 类型定义 */

export interface CascaderOption {
  /** 选项文本 */
  text: string
  /** 选项值 */
  value: string | number
  /** 子选项 */
  children?: CascaderOption[]
  /** 是否禁用 */
  disabled?: boolean
}

export interface CascaderProps {
  /** 是否显示 */
  visible?: boolean
  /** 当前选中值 */
  modelValue?: (string | number)[]
  /** 选项数据 */
  options?: CascaderOption[]
  /** 标题 */
  title?: string
  /** 占位文本 */
  placeholder?: string
  /** 主题色 */
  activeColor?: string
  /** 是否点击遮罩关闭 */
  closeOnClickOverlay?: boolean
}
