/**
 * @description C_Cascader 级联选择器 - 数据配置
 */

/** 默认属性 */
export const defaultProps = {
  /** 是否显示 */
  visible: false,
  /** 标题 */
  title: '请选择',
  /** 选项数据 */
  options: [],
  /** 默认选中值 */
  defaultValue: [],
  /** 值字段名 */
  valueKey: 'value',
  /** 文本字段名 */
  labelKey: 'label',
  /** 子级字段名 */
  childrenKey: 'children',
  /** 是否可搜索 */
  filterable: false,
  /** 搜索占位文字 */
  placeholder: '搜索',
  /** 关闭后是否重置 */
  resetOnClose: false,
}

/**
 * 根据值路径获取标签路径
 * @param {Array} options - 选项数据
 * @param {Array} values - 值数组
 * @param {Object} keys - 字段配置
 * @returns {Array} 标签数组
 */
export function getLabelsFromValues(options, values, keys = {}) {
  const {
    valueKey = 'value',
    labelKey = 'label',
    childrenKey = 'children',
  } = keys
  const labels = []
  let currentOptions = options

  for (const val of values) {
    const item = currentOptions.find(opt => opt[valueKey] === val)
    if (!item) break
    labels.push(item[labelKey])
    currentOptions = item[childrenKey] || []
  }

  return labels
}

/**
 * 扁平化搜索选项树
 * @param {Array} options - 选项树
 * @param {Object} keys - 字段配置
 * @param {Array} path - 当前路径
 * @returns {Array} 扁平化结果 [{ label, valuePath, labelPath }]
 */
export function flattenOptions(options, keys = {}, path = []) {
  const {
    valueKey = 'value',
    labelKey = 'label',
    childrenKey = 'children',
  } = keys
  const result = []

  for (const item of options) {
    const currentPath = [
      ...path,
      { value: item[valueKey], label: item[labelKey] },
    ]
    const children = item[childrenKey]

    if (children && children.length > 0) {
      result.push(...flattenOptions(children, keys, currentPath))
    } else {
      result.push({
        label: currentPath.map(p => p.label).join(' / '),
        valuePath: currentPath.map(p => p.value),
        labelPath: currentPath.map(p => p.label),
      })
    }
  }

  return result
}
