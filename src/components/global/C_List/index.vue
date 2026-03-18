<template>
  <scroll-view
    class="c-list"
    scroll-y
    :style="{ height: '100%' }"
    @scrolltolower="onScrollToLower"
    @refresherrefresh="onRefresh"
    :refresher-enabled="refresherEnabled"
    :refresher-triggered="refreshing"
  >
    <!-- 列表内容 -->
    <slot />

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
  import { ref } from 'vue'
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
  })

  const emit = defineEmits(['load', 'refresh'])

  const refreshing = ref(false)

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
