/**
 * 通用格式化工具
 */

/** 千分位数字（>=1000 时按 en-US 分组） */
export function formatNumber(n: number): string {
  return n >= 1000 ? n.toLocaleString('en-US') : String(n)
}

/** 手机号打码（138****8000） */
export function maskPhone(phone: string): string {
  return phone ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : ''
}

/** 百分比（保留一位小数，去掉尾随 0） */
export function formatPercent(value: number): string {
  return `${Math.round(value * 10) / 10}%`
}
