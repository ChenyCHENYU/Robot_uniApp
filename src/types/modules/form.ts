/** C_Form 表单 - 类型定义 */

export type FormLabelPosition = 'left' | 'top'

export interface FormRule {
  required?: boolean
  message?: string
  trigger?: string
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (
    rule: FormRule,
    value: unknown,
    callback: (error?: Error) => void
  ) => void
}

export interface FormProps {
  /** 表单数据对象 */
  model?: Record<string, unknown>
  /** 验证规则 */
  rules?: Record<string, FormRule[]>
  /** 标签位置 */
  labelPosition?: FormLabelPosition
  /** 标签宽度(rpx) */
  labelWidth?: string | number
  /** 是否在规则 required 时显示红色星号 */
  requiredMark?: boolean
  /** 是否禁用所有表单项 */
  disabled?: boolean
  /** 是否内联错误信息 */
  inlineMessage?: boolean
}
