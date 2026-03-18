<template>
  <scroll-view
    class="c-list"
    scroll-y
    :style="{ height: '100%' }"
    :scroll-top="scrollTop"
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
            :style="{ height: itemHeight + 'px' }"
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
      v-if="showEmpty"
      :type="emptyType"
      :text="emptyText"
    />

    <!-- 加载中 -->
    <view
      v-if="loading && !showEmpty"
      class="c-list__status"
    >
      <wd-loading
        class="c-list__loading-icon"
        :size="16"
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
      v-if="finished && !showEmpty && !error"
      class="c-list__finished"
    >
      {{ finishedText }}
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { defaultProps } from './data'

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
  })

  const emit = defineEmits(['load', 'refresh'])

  const refreshing = ref(false)
  const scrollTop = ref(0)
  const currentScrollTop = ref(0)

  // 虚拟滚动计算
  const totalHeight = computed(() => props.items.length * props.itemHeight)

  const startIndex = computed(() => {
    const idx =
      Math.floor(currentScrollTop.value / props.itemHeight) - props.buffer
    return Math.max(0, idx)
  })

  const endIndex = computed(() => {
    const viewCount = Math.ceil(600 / props.itemHeight) // 约600px可视区域
    const idx = startIndex.value + viewCount + props.buffer * 2
    return Math.min(props.items.length, idx)
  })

  const offsetY = computed(() => startIndex.value * props.itemHeight)

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
    refreshing.value = true
    emit('refresh', () => {
      refreshing.value = false
    })
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
