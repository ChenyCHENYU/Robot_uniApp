/**
 * 应用级常量
 */

/** 应用版本号 — 从 vite define 注入的 __VERSION__ 读取 */
declare const __VERSION__: string
export const APP_VERSION: string =
  typeof __VERSION__ !== 'undefined' ? __VERSION__ : '1.0.0'

/** 应用名称 */
export const APP_NAME = 'Robot UniApp'
