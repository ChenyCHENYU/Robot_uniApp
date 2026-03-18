/** C_Calendar 日历 - 类型定义 */

export interface CalendarMark {
  /** 日期 YYYY-MM-DD */
  date: string
  /** 标记颜色 */
  color?: string
  /** 标记文案 */
  text?: string
}

export type CalendarMode = 'single' | 'multiple' | 'range'

export interface CalendarProps {
  /** 是否显示 */
  visible?: boolean
  /** 选择模式 */
  mode?: CalendarMode
  /** 当前选中日期 */
  modelValue?: string | string[]
  /** 最小可选日期 */
  minDate?: string
  /** 最大可选日期 */
  maxDate?: string
  /** 是否显示标记 */
  showMark?: boolean
  /** 日期标记 */
  marks?: CalendarMark[]
  /** 是否显示农历 */
  showLunar?: boolean
  /** 周起始日: 0 = 周日, 1 = 周一 */
  startOfWeek?: 0 | 1
  /** 主题色 */
  color?: string
}
