<!--
 * @Description: 非生产环境标识，跟随导航标题占位。
-->
<template>
  <view
    v-if="visible"
    class="c-env-badge"
    :class="`c-env-badge--${env}`"
    role="button"
    tabindex="0"
    :aria-label="`环境 ${badgeText}，查看详情`"
    @keydown.enter="toggleDetail"
    @keydown.space.prevent="toggleDetail"
    @click="toggleDetail"
  >
    <text class="c-env-badge__text">{{ badgeText }}</text>
    <view
      v-if="showDetail"
      class="c-env-badge__detail"
    >
      <text class="c-env-badge__row">env: {{ env }}</text>
      <text class="c-env-badge__row">ver: {{ version }}</text>
      <text class="c-env-badge__row">api: {{ apiBase }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import config from '@/config/env'
  import { APP_VERSION } from '@/constants'

  const showDetail = ref(false)

  /** 生产环境隐藏；其余环境常显 */
  const visible = computed(() => !config.IS_PROD)

  const env = computed(() => config.CURRENT_ENV)
  const version = APP_VERSION
  const apiBase = computed(() => {
    const base = config.API_BASE_URL
    return base.length > 28 ? `${base.slice(0, 28)}…` : base
  })

  const badgeText = computed(() => {
    switch (config.CURRENT_ENV) {
      case 'development':
        return 'DEV'
      case 'test':
        return 'TEST'
      case 'staging':
        return 'STAGING'
      default:
        return config.CURRENT_ENV.toUpperCase()
    }
  })

  const toggleDetail = () => {
    showDetail.value = !showDetail.value
  }
</script>

<style lang="scss" scoped>
  .c-env-badge {
    position: relative;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    z-index: var(--r-z-popup, 100);
    padding: 2rpx 8rpx;
    border-radius: 8rpx;
    background: var(--r-color-warning-soft);
    color: var(--r-color-warning);

    &--test {
      background: var(--r-color-primary-soft);
      color: var(--r-color-primary);
    }

    &--staging {
      background: var(--r-color-primary-soft);
      color: var(--r-color-primary);
    }

    &__text {
      font-size: 16rpx;
      font-weight: 700;
      color: inherit;
      letter-spacing: 1rpx;
    }

    &__detail {
      position: absolute;
      top: calc(100% + 8rpx);
      right: 0;
      min-width: 240rpx;
      padding: 12rpx 16rpx;
      border-radius: var(--r-radius-md, 16rpx);
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      flex-direction: column;
      gap: 4rpx;
    }

    &__row {
      font-size: 20rpx;
      color: #ffffff;
      word-break: break-all;
    }
  }
</style>
