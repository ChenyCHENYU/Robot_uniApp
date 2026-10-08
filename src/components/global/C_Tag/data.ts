/**
 * C_Tag - 状态标签组件数据逻辑
 */

export const TAG_COLORS = {
  primary: {
    bg: 'rgba(53, 99, 233, 0.08)',
    text: 'var(--r-color-primary)',
    border: 'rgba(53, 99, 233, 0.18)',
  },
  success: {
    bg: 'rgba(76, 217, 100, 0.1)',
    text: 'var(--r-color-success)',
    border: 'rgba(76, 217, 100, 0.3)',
  },
  warning: {
    bg: 'rgba(240, 173, 78, 0.1)',
    text: 'var(--r-color-warning)',
    border: 'rgba(240, 173, 78, 0.3)',
  },
  error: {
    bg: 'rgba(221, 82, 77, 0.1)',
    text: 'var(--r-color-error)',
    border: 'rgba(221, 82, 77, 0.3)',
  },
  info: {
    bg: 'rgba(144, 147, 153, 0.1)',
    text: 'var(--r-text-secondary)',
    border: 'rgba(144, 147, 153, 0.3)',
  },
}

export const defaultProps = {
  type: 'primary',
  plain: true, // 朴素模式（浅色背景）
  round: false,
  closeable: false,
  size: 'default', // small / default / large
}
