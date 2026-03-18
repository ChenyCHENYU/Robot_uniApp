/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2026-03-18 09:26:32
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2026-03-18 09:30:50
 * @FilePath: \Robot_uniApp\src\components\global\C_CountDown\data.js
 * @Description:
 * Copyright (c) 2026 by CHENY, All Rights Reserved 😎.
 */
/**
 * @description C_CountDown 倒计时 - 数据配置
 */

/** 默认属性 */
export const defaultProps = {
  /** 倒计时时长 ms */
  time: 0,
  /** 格式化模板 */
  format: 'HH:mm:ss',
  /** 是否自动开始 */
  autoStart: true,
  /** 是否开启毫秒级渲染 */
  millisecond: false,
}

/**
 * 解析倒计时毫秒为时间对象
 * @param {number} ms - 剩余毫秒数
 * @returns {{ days: number, hours: number, minutes: number, seconds: number, milliseconds: number }}
 */
export function parseTime(ms) {
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const milliseconds = ms % 1000
  return { days, hours, minutes, seconds, milliseconds }
}

/**
 * 根据模板格式化时间
 * @param {string} fmt - 格式模板
 * @param {{ days, hours, minutes, seconds, milliseconds }} t - 时间对象
 * @returns {string}
 */
export function formatTime(fmt, t) {
  let str = fmt

  if (str.includes('DD')) {
    str = str.replace('DD', padZero(t.days))
  } else {
    // 天数合并到小时
    t.hours += t.days * 24
  }

  str = str.replace('HH', padZero(t.hours))
  str = str.replace('mm', padZero(t.minutes))
  str = str.replace('ss', padZero(t.seconds))
  str = str.replace('SSS', padZero(t.milliseconds, 3))

  return str
}

/**
 *
 */
function padZero(num, len = 2) {
  return String(num).padStart(len, '0')
}
