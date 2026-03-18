/**
 * C_Tag - 状态标签组件数据逻辑
 */

export const TAG_COLORS = {
  primary: {
    bg: 'rgba(0, 122, 255, 0.1)',
    text: '#007aff',
    border: 'rgba(0, 122, 255, 0.3)',
  },
  success: {
    bg: 'rgba(76, 217, 100, 0.1)',
    text: '#4cd964',
    border: 'rgba(76, 217, 100, 0.3)',
  },
  warning: {
    bg: 'rgba(240, 173, 78, 0.1)',
    text: '#f0ad4e',
    border: 'rgba(240, 173, 78, 0.3)',
  },
  error: {
    bg: 'rgba(221, 82, 77, 0.1)',
    text: '#dd524d',
    border: 'rgba(221, 82, 77, 0.3)',
  },
  info: {
    bg: 'rgba(144, 147, 153, 0.1)',
    text: '#909399',
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
