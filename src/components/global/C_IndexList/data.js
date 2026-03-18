/**
 * C_IndexList - 索引列表组件数据逻辑
 */

export const defaultProps = {
  /** 列表数据 [{letter: 'A', items: [...]}] */
  data: [],
  /** 索引字段名 */
  indexKey: 'letter',
  /** 是否吸顶 */
  sticky: true,
  /** 索引栏高亮颜色 */
  activeColor: '',
}

/** 默认字母索引 */
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('')
