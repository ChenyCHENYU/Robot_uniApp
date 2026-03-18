/** C_Steps 步骤条 - 类型定义 */

export interface StepItem {
  /** 标题 */
  title: string
  /** 描述 */
  description?: string
  /** 自定义图标 */
  icon?: string
}

export type StepsDirection = 'horizontal' | 'vertical'

export interface StepsProps {
  /** 步骤列表 */
  steps?: StepItem[]
  /** 当前步骤索引 */
  current?: number
  /** 排列方向 */
  direction?: StepsDirection
  /** 激活颜色 */
  activeColor?: string
  /** 未激活颜色 */
  inactiveColor?: string
  /** 是否可点击 */
  clickable?: boolean
}
