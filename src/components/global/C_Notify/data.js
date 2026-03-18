/**
 * @description C_Notify 消息通知 - 数据配置
 */

/** 默认属性 */
export const defaultProps = {
  /** 是否显示 */
  visible: false,
  /** 通知类型 */
  type: 'primary',
  /** 通知内容 */
  message: '',
  /** 显示时长 ms，0=不自动关闭 */
  duration: 3000,
  /** 背景色 */
  background: '',
  /** 文字颜色 */
  color: '',
  /** 位置 */
  position: 'top',
  /** 是否允许滑动关闭 */
  swipeable: true,
}

/** 类型背景色映射 */
export const TYPE_COLORS = {
  primary: { bg: 'var(--r-color-primary, #2b6bff)', color: '#fff' },
  success: { bg: 'var(--r-color-success, #34c759)', color: '#fff' },
  warning: { bg: 'var(--r-color-warning, #ff9f0a)', color: '#fff' },
  danger: { bg: 'var(--r-color-danger, #ff4d4f)', color: '#fff' },
  info: {
    bg: 'var(--r-bg-color-secondary, #f5f5f5)',
    color: 'var(--r-text-color-primary, #1a1a1a)',
  },
}
