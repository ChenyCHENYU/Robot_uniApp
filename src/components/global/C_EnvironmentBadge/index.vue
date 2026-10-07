<!--
 * @Description: 环境角标 — 非生产环境右上角悬浮显示环境标识（防呆：避免误把测试环境当生产）
-->
<template>
  <view
    v-if="visible"
    class="c-env-badge"
    :class="`c-env-badge--${env}`"
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
    position: fixed;
    top: calc(var(--status-bar-height, 0px) + 12rpx);
    right: 16rpx;
    z-index: var(--r-z-popup, 100);
    padding: 4rpx 14rpx;
    border-radius: var(--r-radius-round, 999rpx);
    background: rgba(255, 149, 0, 0.85);
    box-shadow: var(--r-shadow-sm);

    &--test {
      background: rgba(0, 122, 255, 0.85);
    }

    &--staging {
      background: rgba(175, 82, 222, 0.85);
    }

    &__text {
      font-size: 18rpx;
      font-weight: 700;
      color: #ffffff;
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
