/**
 * 全局渐变色配置
 *
 * 统一管理项目中所有渐变色，避免分散硬编码
 */

export const GRADIENT = {
  /** 紫色主题 — 品牌主色 */
  purple: 'linear-gradient(135deg, #667eea, #764ba2)',
  /** 粉红 */
  pink: 'linear-gradient(135deg, #f093fb, #f5576c)',
  /** 青蓝 */
  blue: 'linear-gradient(135deg, #4facfe, #00f2fe)',
  /** 翠绿 */
  green: 'linear-gradient(135deg, #43e97b, #38f9d7)',
  /** 橙粉 */
  coral: 'linear-gradient(135deg, #fa709a, #fee140)',
  /** 蜜桃 */
  peach: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
  /** 薄荷 */
  mint: 'linear-gradient(135deg, #a8edea, #fed6e3)',
  /** 柠檬 */
  lemon: 'linear-gradient(135deg, #96e6a1, #d4fc79)',
  /** 薰衣草 */
  lavender: 'linear-gradient(135deg, #fccb90, #d57eeb)',
} as const

export type GradientKey = keyof typeof GRADIENT
