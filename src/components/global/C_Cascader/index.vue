<template>
  <view
    v-if="visible"
    class="c-cascader"
  >
    <view
      class="c-cascader__overlay"
      @touchmove.stop.prevent
      @wheel.stop.prevent
      @click="onClose"
    />
    <view
      class="c-cascader__panel"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
    >
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
            item.disabled && 'c-cascader__option--disabled',
          ]"
          :aria-disabled="!!item.disabled"
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
  import type { PropType } from 'vue'
  import { defaultProps, useCascader, type CascaderOption } from './data'

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

  const {
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
  } = useCascader(props, emit)
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
