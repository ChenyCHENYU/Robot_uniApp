/** C_NumberKeyboard 数字键盘 - 类型定义 */

export type NumberKeyboardTheme = 'default' | 'custom'

export interface NumberKeyboardKey {
  text: string | number
  type?: 'number' | 'delete' | 'extra' | 'confirm'
  wider?: boolean
}

export interface NumberKeyboardProps {
  /** 是否显示 */
  visible?: boolean
  /** 当前输入值 */
  modelValue?: string
  /** 标题 */
  title?: string
  /** 键盘主题 */
  theme?: NumberKeyboardTheme
  /** 最大输入长度 */
  maxlength?: number
  /** 额外的按键 */
  extraKey?: string | string[]
  /** 是否显示关闭按钮 */
  closeable?: boolean
  /** 是否显示删除键 */
  showDeleteKey?: boolean
  /** 是否随机排列按键 */
  randomKeyOrder?: boolean
}
