import { ref, computed, watch } from 'vue'

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
export function getLabelsFromValues(
  options: any[],
  values: any[],
  keys: Record<string, string> = {}
) {
  const {
    valueKey = 'value',
    labelKey = 'label',
    childrenKey = 'children',
  } = keys
  const labels: string[] = []
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
export function flattenOptions(
  options: any[],
  keys: Record<string, string> = {},
  path: any[] = []
): any[] {
  const {
    valueKey = 'value',
    labelKey = 'label',
    childrenKey = 'children',
  } = keys
  const result: any[] = []

  for (const item of options) {
    if (item.disabled) continue
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

export interface CascaderOption {
  [key: string]: any
}
interface CascaderTab {
  value: any
  label: string
}

interface CascaderProps {
  visible: boolean
  options: CascaderOption[]
  defaultValue: any[]
  valueKey: string
  labelKey: string
  childrenKey: string
  filterable: boolean
  resetOnClose: boolean
}

/** C_Cascader 交互状态，每次组件挂载独立创建。 */
export function useCascader(
  props: CascaderProps,
  emit: (
    event: 'update:visible' | 'confirm' | 'change' | 'close',
    ...args: unknown[]
  ) => void
) {
  // Tab 数据 [{ value, label }]
  const tabs = ref<CascaderTab[]>([{ value: null, label: '' }])
  const activeTab = ref(0)
  const keyword = ref('')
  let initialized = false

  // 当前层级选项
  const currentOptions = computed(() => {
    let list = props.options
    for (let i = 0; i < activeTab.value; i++) {
      const selected = list.find(
        item => item[props.valueKey] === tabs.value[i].value
      )
      if (!selected) break
      list = selected[props.childrenKey] || []
    }
    return list
  })

  // 搜索结果
  const flatList = computed(() =>
    flattenOptions(props.options, {
      valueKey: props.valueKey,
      labelKey: props.labelKey,
      childrenKey: props.childrenKey,
    })
  )

  const searchList = computed(() => {
    if (!keyword.value) return []
    const kw = keyword.value.trim().toLowerCase()
    return flatList.value.filter(item => item.label.toLowerCase().includes(kw))
  })

  // 初始化
  watch(
    () => props.visible,
    val => {
      if (val) {
        keyword.value = ''
        if (!initialized || props.resetOnClose || props.defaultValue.length) {
          initFromDefault()
          initialized = true
        }
      } else if (props.resetOnClose) {
        tabs.value = [{ value: null, label: '' }]
        activeTab.value = 0
      }
    },
    { immediate: true }
  )

  /**
   *
   */
  function initFromDefault() {
    if (!props.defaultValue || props.defaultValue.length === 0) {
      tabs.value = [{ value: null, label: '' }]
      activeTab.value = 0
      return
    }

    const newTabs: CascaderTab[] = []
    let currentList = props.options

    for (const val of props.defaultValue) {
      const item = currentList.find(opt => opt[props.valueKey] === val)
      if (!item) break
      newTabs.push({ value: item[props.valueKey], label: item[props.labelKey] })
      currentList = item[props.childrenKey] || []
    }

    if (currentList.length > 0) {
      newTabs.push({ value: null, label: '' })
    }

    tabs.value = newTabs.length ? newTabs : [{ value: null, label: '' }]
    activeTab.value = Math.max(0, tabs.value.length - 1)
  }

  /**
   *
   */
  function isOptionSelected(item) {
    return tabs.value[activeTab.value]?.value === item[props.valueKey]
  }

  /**
   *
   */
  function onTabClick(index) {
    activeTab.value = index
  }

  /**
   *
   */
  function onSelect(item) {
    if (item.disabled) return
    const children = item[props.childrenKey] || []

    // 更新当前 tab
    tabs.value[activeTab.value] = {
      value: item[props.valueKey],
      label: item[props.labelKey],
    }

    // 清除后续 tab
    tabs.value = tabs.value.slice(0, activeTab.value + 1)

    if (children.length > 0) {
      // 有子级 — 新增一个 tab
      tabs.value.push({ value: null, label: '' })
      activeTab.value = tabs.value.length - 1
      emitChange()
    } else {
      // 叶子节点 — 完成选择
      emitChange()
      emitConfirm()
    }
  }

  /**
   *
   */
  function onSelectSearch(item) {
    // 搜索模式直接选中叶子
    const newTabs = item.labelPath.map((label, i) => ({
      value: item.valuePath[i],
      label,
    }))
    tabs.value = newTabs.length ? newTabs : [{ value: null, label: '' }]
    activeTab.value = Math.max(0, tabs.value.length - 1)
    keyword.value = ''
    emitChange()
    emitConfirm()
  }

  /**
   *
   */
  function onSearch(e) {
    keyword.value = e.detail.value
  }

  /**
   *
   */
  function emitChange() {
    const values = tabs.value.filter(t => t.value !== null).map(t => t.value)
    const labels = tabs.value.filter(t => t.value !== null).map(t => t.label)
    emit('change', { values, labels })
  }

  /**
   *
   */
  function emitConfirm() {
    const values = tabs.value.filter(t => t.value !== null).map(t => t.value)
    const labels = tabs.value.filter(t => t.value !== null).map(t => t.label)
    emit('confirm', { values, labels })
    onClose()
  }

  /**
   *
   */
  function onClose() {
    emit('close')
    emit('update:visible', false)
  }
  return {
    tabs,
    activeTab,
    keyword,
    currentOptions,
    searchList,
    onClose,
    onSearch,
    onSelectSearch,
    onTabClick,
    isOptionSelected,
    onSelect,
  }
}
