<template>
  <scroll-view
    class="c-list"
    scroll-y
    :style="{ height: '100%' }"
    :scroll-top="scrollTop"
    :lower-threshold="offset"
    @scrolltolower="onScrollToLower"
    @refresherrefresh="onRefresh"
    @scroll="onScroll"
    :refresher-enabled="refresherEnabled"
    :refresher-triggered="refreshing"
  >
    <!-- 虚拟滚动模式 -->
    <template v-if="virtual && items.length">
      <view :style="{ height: totalHeight + 'px' }">
        <view :style="{ transform: `translateY(${offsetY}px)` }">
          <view
            v-for="item in visibleItems"
            :key="item._vid"
            :style="{ height: safeItemHeight + 'px' }"
          >
            <slot
              name="item"
              :item="item"
              :index="item._vid"
            />
          </view>
        </view>
      </view>
    </template>

    <!-- 普通模式 -->
    <template v-else>
      <slot />
    </template>

    <!-- 空状态 -->
    <C_Empty
      v-if="displayEmpty"
      :type="emptyType"
      :text="emptyText"
    />

    <!-- 加载中 -->
    <view
      v-if="loading"
      class="c-list__status"
      role="status"
      aria-live="polite"
    >
      <C_LoadingIndicator
        class="c-list__loading-icon"
        size="small"
      />
      <text>{{ loadingText }}</text>
    </view>

    <!-- 加载失败 -->
    <view
      v-if="error && !loading"
      class="c-list__status c-list__error"
      @click="$emit('load')"
    >
      {{ errorText }}
    </view>

    <!-- 全部加载完毕 -->
    <view
      v-if="finished && !displayEmpty && !error && !loading"
      class="c-list__finished"
    >
      {{ finishedText }}
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
  import {
    ref,
    computed,
    onMounted,
    onBeforeUnmount,
    nextTick,
    watch,
    getCurrentInstance,
  } from 'vue'
  import { defaultProps } from './data'
  import C_LoadingIndicator from '../C_LoadingIndicator/index.vue'

  const props = defineProps({
    /** 是否处于加载状态 */
    loading: { type: Boolean, default: defaultProps.loading },
    /** 是否已加载完全部数据 */
    finished: { type: Boolean, default: defaultProps.finished },
    /** 全部加载完毕的提示文案 */
    finishedText: { type: String, default: defaultProps.finishedText },
    /** 加载中的提示文案 */
    loadingText: { type: String, default: defaultProps.loadingText },
    /** 加载失败的提示文案 */
    errorText: { type: String, default: defaultProps.errorText },
    /** 是否加载失败 */
    error: { type: Boolean, default: defaultProps.error },
    /** 是否展示空状态 */
    showEmpty: { type: Boolean, default: false },
    /** 空状态类型 */
    emptyType: { type: String, default: defaultProps.emptyType },
    /** 空状态文案 */
    emptyText: { type: String, default: defaultProps.emptyText },
    /** 是否启用下拉刷新 */
    refresherEnabled: { type: Boolean, default: true },
    /** 是否启用虚拟滚动 */
    virtual: { type: Boolean, default: false },
    /** 虚拟滚动数据源 */
    items: { type: Array, default: () => [] },
    /** 虚拟滚动每项高度(px) */
    itemHeight: { type: Number, default: 80 },
    /** 虚拟滚动缓冲区数量 */
    buffer: { type: Number, default: 10 },
    /** 触底加载提前量(px) */
    offset: { type: Number, default: 100 },
  })

  const emit = defineEmits(['load', 'refresh'])

  const instance = getCurrentInstance()
  const refreshing = ref(false)
  const scrollTop = ref(0)
  const currentScrollTop = ref(0)
  /** 容器实测可视高度（虚拟滚动窗口依据；回退 600px） */
  const viewportHeight = ref(600)

  /** 容器高度变化后重新计算虚拟窗口。 */
  async function measureViewport() {
    if (!props.virtual) return
    await nextTick()
    // #ifdef H5
    const element = instance?.proxy?.$el as HTMLElement | undefined
    if (element?.offsetHeight) {
      viewportHeight.value = element.offsetHeight
      return
    }
    // #endif
    uni
      .createSelectorQuery()
      .in(instance?.proxy)
      .select('.c-list')
      .boundingClientRect(rect => {
        const height = (rect as { height?: number } | null)?.height
        if (height && height > 0) viewportHeight.value = height
      })
      .exec()
  }

  onMounted(() => {
    measureViewport()
    uni.onWindowResize(measureViewport)
  })
  onBeforeUnmount(() => uni.offWindowResize(measureViewport))
  watch(() => props.virtual, measureViewport)
  const displayEmpty = computed(
    () => props.showEmpty && !props.loading && !props.error
  )
  const safeItemHeight = computed(() => Math.max(1, props.itemHeight))

  // 虚拟滚动计算
  const totalHeight = computed(() => props.items.length * safeItemHeight.value)

  const startIndex = computed(() => {
    const idx =
      Math.floor(currentScrollTop.value / safeItemHeight.value) - props.buffer
    return Math.max(0, Math.min(idx, props.items.length - 1))
  })

  const endIndex = computed(() => {
    const viewCount = Math.ceil(viewportHeight.value / safeItemHeight.value)
    const idx = startIndex.value + viewCount + props.buffer * 2
    return Math.min(props.items.length, idx)
  })

  const offsetY = computed(() => startIndex.value * safeItemHeight.value)

  const visibleItems = computed(() =>
    props.items.slice(startIndex.value, endIndex.value).map((item, i) => ({
      ...(typeof item === 'object' ? item : { value: item }),
      _vid: startIndex.value + i,
    }))
  )

  const onScroll = (e: any) => {
    currentScrollTop.value = e.detail?.scrollTop || 0
  }

  const onScrollToLower = () => {
    if (!props.loading && !props.finished && !props.error) {
      emit('load')
    }
  }

  const onRefresh = () => {
    if (refreshing.value) return
    refreshing.value = true
    emit('refresh', () => {
      refreshing.value = false
    })
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
