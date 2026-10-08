<template>
  <view
    :class="['c-tab-nav', sticky && 'c-tab-nav--sticky']"
    :style="stickyStyle"
  >
    <scroll-view
      class="c-tab-nav__scroll"
      :scroll-x="scrollable"
      :scroll-left="scrollLeft"
      scroll-with-animation
    >
      <view
        :class="[
          'c-tab-nav__list',
          (equalWidth || !scrollable) && 'c-tab-nav__list--equal',
        ]"
      >
        <view
          v-for="tab in tabs"
          :key="tab.value"
          :class="[
            'c-tab-nav__item',
            modelValue === tab.value && 'c-tab-nav__item--active',
            tab.disabled && 'c-tab-nav__item--disabled',
          ]"
          @click="onTabClick(tab)"
        >
          <view
            v-if="showLine && modelValue === tab.value"
            class="c-tab-nav__line"
            :style="{ width: lineWidth + 'rpx' }"
          />
          <text class="c-tab-nav__label">{{ tab.label }}</text>
          <view
            v-if="tab.badge"
            class="c-tab-nav__badge"
          >
            <text class="c-tab-nav__badge-text">{{ tab.badge }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
  import {
    ref,
    computed,
    watch,
    nextTick,
    onMounted,
    getCurrentInstance,
    type PropType,
  } from 'vue'
  import { defaultProps } from './data'

  interface TabNavItem {
    label: string
    value: string | number
    badge?: string | number
    disabled?: boolean
  }

  const props = defineProps({
    /** 标签列表 */
    tabs: {
      type: Array as PropType<TabNavItem[]>,
      default: () => defaultProps.tabs,
    },
    /** 当前激活值 */
    modelValue: { type: [String, Number], default: defaultProps.modelValue },
    /** 是否可滚动 */
    scrollable: { type: Boolean, default: defaultProps.scrollable },
    /** 是否显示下划线 */
    showLine: { type: Boolean, default: defaultProps.showLine },
    /** 下划线宽度 */
    lineWidth: { type: Number, default: defaultProps.lineWidth },
    /** 是否等分 */
    equalWidth: { type: Boolean, default: defaultProps.equalWidth },
    /** 是否吸顶 */
    sticky: { type: Boolean, default: defaultProps.sticky },
    /** 吸顶偏移量 */
    stickyOffset: { type: Number, default: defaultProps.stickyOffset },
  })

  const emit = defineEmits(['update:modelValue', 'change'])

  const scrollLeft = ref(0)

  const instance = getCurrentInstance()

  const stickyStyle = computed(() => {
    if (!props.sticky) return {}
    return { top: `${props.stickyOffset}px` }
  })

  const activeIndex = computed(() =>
    props.tabs.findIndex(t => t.value === props.modelValue)
  )

  /**
   *
   */
  function onTabClick(tab: TabNavItem) {
    if (tab.disabled) return
    emit('update:modelValue', tab.value)
    emit('change', tab.value)
  }

  /** 以列表内容坐标计算滚动位置，避免已滚动后坐标累加错误。 */
  async function calcLine() {
    if (!props.scrollable || activeIndex.value < 0) return
    await nextTick()
    if (!instance?.proxy) return
    const query = uni.createSelectorQuery().in(instance.proxy)
    query.selectAll('.c-tab-nav__item').boundingClientRect()
    query.select('.c-tab-nav__list').boundingClientRect()
    query.select('.c-tab-nav__scroll').boundingClientRect()
    query.exec(results => {
      const items = results[0] as UniApp.NodeInfo[]
      const list = results[1] as UniApp.NodeInfo
      const container = results[2] as UniApp.NodeInfo
      const active = items?.[activeIndex.value]
      if (!active || !list || !container) return
      scrollLeft.value = Math.max(
        0,
        (active.left ?? 0) -
          (list.left ?? 0) +
          (active.width ?? 0) / 2 -
          (container.width ?? 0) / 2
      )
    })
  }

  onMounted(calcLine)
  watch(() => [props.modelValue, props.tabs, props.scrollable], calcLine, {
    deep: true,
  })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
