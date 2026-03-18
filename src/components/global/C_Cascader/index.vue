<template>
  <view
    v-if="visible"
    class="c-cascader"
  >
    <view
      class="c-cascader__overlay"
      @click="onClose"
    />
    <view class="c-cascader__panel">
      <!-- 标题 -->
      <view class="c-cascader__header">
        <text class="c-cascader__title">{{ title }}</text>
        <view
          class="c-cascader__close"
          @click="onClose"
        >
          <wd-icon
            name="close"
            size="18px"
          />
        </view>
      </view>

      <!-- 搜索 -->
      <view
        v-if="filterable"
        class="c-cascader__search"
      >
        <wd-icon
          name="search"
          size="16px"
        />
        <input
          class="c-cascader__search-input"
          :value="keyword"
          :placeholder="placeholder"
          @input="onSearch"
        />
      </view>

      <!-- 搜索结果列表 -->
      <scroll-view
        v-if="keyword"
        class="c-cascader__search-result"
        scroll-y
      >
        <view
          v-for="item in searchList"
          :key="item.valuePath.join('-')"
          class="c-cascader__search-item"
          @click="onSelectSearch(item)"
        >
          <text class="c-cascader__search-text">{{ item.label }}</text>
        </view>
        <view
          v-if="searchList.length === 0"
          class="c-cascader__search-empty"
        >
          <text>无匹配结果</text>
        </view>
      </scroll-view>

      <!-- 已选面包屑 -->
      <view
        v-if="!keyword"
        class="c-cascader__tabs"
      >
        <view
          v-for="(tab, index) in tabs"
          :key="index"
          :class="[
            'c-cascader__tab',
            activeTab === index && 'c-cascader__tab--active',
          ]"
          @click="onTabClick(index)"
        >
          <text class="c-cascader__tab-text">{{ tab.label || '请选择' }}</text>
        </view>
      </view>

      <!-- 选项列表 -->
      <scroll-view
        v-if="!keyword"
        class="c-cascader__options"
        scroll-y
      >
        <view
          v-for="item in currentOptions"
          :key="item[valueKey]"
          :class="[
            'c-cascader__option',
            isOptionSelected(item) && 'c-cascader__option--selected',
          ]"
          @click="onSelect(item)"
        >
          <text class="c-cascader__option-text">{{ item[labelKey] }}</text>
          <wd-icon
            v-if="isOptionSelected(item)"
            name="check"
            size="16px"
            color="var(--r-color-primary, #2b6bff)"
          />
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref, computed, watch, type PropType } from 'vue'
  import { defaultProps, flattenOptions } from './data'

  interface CascaderOption {
    [key: string]: any
  }

  interface CascaderTab {
    value: any
    label: string
  }

  const props = defineProps({
    /** 是否显示 */
    visible: { type: Boolean, default: defaultProps.visible },
    /** 标题 */
    title: { type: String, default: defaultProps.title },
    /** 选项数据 */
    options: {
      type: Array as PropType<CascaderOption[]>,
      default: () => defaultProps.options,
    },
    /** 默认选中值 */
    defaultValue: {
      type: Array as PropType<any[]>,
      default: () => defaultProps.defaultValue,
    },
    /** 值字段名 */
    valueKey: { type: String, default: defaultProps.valueKey },
    /** 文本字段名 */
    labelKey: { type: String, default: defaultProps.labelKey },
    /** 子级字段名 */
    childrenKey: { type: String, default: defaultProps.childrenKey },
    /** 是否可搜索 */
    filterable: { type: Boolean, default: defaultProps.filterable },
    /** 搜索占位文字 */
    placeholder: { type: String, default: defaultProps.placeholder },
    /** 关闭后是否重置 */
    resetOnClose: { type: Boolean, default: defaultProps.resetOnClose },
  })

  const emit = defineEmits(['update:visible', 'confirm', 'change', 'close'])

  // Tab 数据 [{ value, label }]
  const tabs = ref<CascaderTab[]>([{ value: null, label: '' }])
  const activeTab = ref(0)
  const keyword = ref('')

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
    const kw = keyword.value.toLowerCase()
    return flatList.value.filter(item => item.label.toLowerCase().includes(kw))
  })

  // 初始化
  watch(
    () => props.visible,
    val => {
      if (val) {
        keyword.value = ''
        initFromDefault()
      } else if (props.resetOnClose) {
        tabs.value = [{ value: null, label: '' }]
        activeTab.value = 0
      }
    }
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

    tabs.value = newTabs
    activeTab.value = newTabs.length - 1
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
    tabs.value = newTabs
    activeTab.value = newTabs.length - 1
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
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
