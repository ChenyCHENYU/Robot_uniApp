<template>
  <view
    :class="['c-tab-nav', sticky && 'c-tab-nav--sticky']"
    :style="stickyStyle"
  >
    <ScrollView
      class="c-tab-nav__scroll"
      scroll-x
      :scroll-left="scrollLeft"
      scroll-with-animation
    >
      <view
        :class="['c-tab-nav__list', equalWidth && 'c-tab-nav__list--equal']"
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
          <text class="c-tab-nav__label">{{ tab.label }}</text>
          <view
            v-if="tab.badge"
            class="c-tab-nav__badge"
          >
            <text class="c-tab-nav__badge-text">{{ tab.badge }}</text>
          </view>
        </view>

        <!-- 下划线 -->
        <view
          v-if="showLine"
          class="c-tab-nav__line"
          :style="lineStyle"
        />
      </view>
    </ScrollView>
  </view>
</template>

<script setup>
  import { ref, computed, watch, nextTick, getCurrentInstance } from 'vue'
  import { defaultProps } from './data.js'

  const props = defineProps({
    /** 标签列表 */
    tabs: { type: Array, default: () => defaultProps.tabs },
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
  const lineOffset = ref(0)
  const lineWidthPx = ref(0)

  const instance = getCurrentInstance()

  const stickyStyle = computed(() => {
    if (!props.sticky) return {}
    return { top: `${props.stickyOffset}px` }
  })

  const lineStyle = computed(() => ({
    width: `${lineWidthPx.value || props.lineWidth}rpx`,
    transform: `translateX(${lineOffset.value}px)`,
  }))

  const activeIndex = computed(() =>
    props.tabs.findIndex(t => t.value === props.modelValue)
  )

  /**
   *
   */
  function onTabClick(tab) {
    if (tab.disabled) return
    emit('update:modelValue', tab.value)
    emit('change', tab.value)
  }

  /** 计算下划线位置 */
  function calcLine() {
    if (!props.showLine || activeIndex.value < 0) return

    nextTick(() => {
      const query = uni.createSelectorQuery().in(instance.proxy)
      query
        .selectAll('.c-tab-nav__item')
        .boundingClientRect(rects => {
          if (!rects || !rects[activeIndex.value]) return
          const rect = rects[activeIndex.value]
          const containerQuery = uni.createSelectorQuery().in(instance.proxy)
          containerQuery
            .select('.c-tab-nav__scroll')
            .boundingClientRect(containerRect => {
              if (!containerRect) return
              const itemCenter = rect.left - containerRect.left + rect.width / 2
              // 转换下划线宽度 rpx -> px
              const sysInfo = uni.getSystemInfoSync()
              const linePx = (props.lineWidth / 750) * sysInfo.windowWidth
              lineWidthPx.value = props.lineWidth
              lineOffset.value = itemCenter - linePx / 2

              // 滚动居中
              if (props.scrollable) {
                scrollLeft.value =
                  rect.left -
                  containerRect.left -
                  containerRect.width / 2 +
                  rect.width / 2
              }
            })
            .exec()
        })
        .exec()
    })
  }

  watch(() => props.modelValue, calcLine, { immediate: true })
  watch(() => props.tabs, calcLine)
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
