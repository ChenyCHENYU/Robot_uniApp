/** C_CountDown 倒计时 - 类型定义 */

export interface CountDownTimeData {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export interface CountDownProps {
  /** 倒计时时长(ms) */
  time?: number
  /** 时间格式 */
  format?: string
  /** 是否自动开始 */
  autoStart?: boolean
  /** 是否开启毫秒级渲染 */
  millisecond?: boolean
  /** 文字颜色 */
  color?: string
  /** 文字大小(rpx) */
  fontSize?: number | string
}
