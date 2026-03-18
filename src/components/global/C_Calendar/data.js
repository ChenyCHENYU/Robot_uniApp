/**
 * C_Calendar - 日历组件数据逻辑
 */

export const defaultProps = {
  /** 是否显示 */
  visible: false,
  /** 选择模式：single / multiple / range */
  mode: 'single',
  /** 默认选中日期 */
  defaultDate: null,
  /** 可选最小日期 */
  minDate: null,
  /** 可选最大日期 */
  maxDate: null,
  /** 标题 */
  title: '选择日期',
  /** 是否显示确认按钮 */
  showConfirm: true,
  /** 确认按钮文字 */
  confirmText: '确定',
  /** 一周第一天：0=周日, 1=周一 */
  firstDayOfWeek: 1,
  /** 日期标记 [{date: '2026-03-18', type: 'dot', color: '#ff0000'}] */
  marks: [],
  /** range 模式最大可选天数 */
  maxRange: 0,
}

/** 星期标题 */
export const WEEK_DAYS_MON = ['一', '二', '三', '四', '五', '六', '日']
export const WEEK_DAYS_SUN = ['日', '一', '二', '三', '四', '五', '六']

/**
 * 格式化日期为 YYYY-MM-DD
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * 获取某月天数
 * @param {number} year
 * @param {number} month - 1~12
 * @returns {number}
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}
