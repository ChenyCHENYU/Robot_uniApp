<!--
 * @Description: 登出过渡遮罩 — 登出期间展示过渡动画，缓解"突然被踢回登录页"的生硬感
 * 用法：<C_LogoutTransition :visible="logoutting" text="正在退出..." />
-->
<template>
  <view
    v-if="visible"
    class="c-logout-mask"
  >
    <view class="c-logout-mask__panel">
      <view class="c-logout-mask__ring">
        <wd-loading
          :size="44"
          color="var(--r-color-primary, #007aff)"
        />
      </view>
      <text class="c-logout-mask__text">{{ text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      visible?: boolean
      text?: string
    }>(),
    {
      visible: false,
      text: '正在退出登录...',
    }
  )
</script>

<style lang="scss" scoped>
  .c-logout-mask {
    position: fixed;
    inset: 0;
    z-index: var(--r-z-modal, 300);
    background: var(--r-bg-mask, rgba(0, 0, 0, 0.4));
    display: flex;
    align-items: center;
    justify-content: center;
    animation: c-logout-fade 0.2s ease;

    &__panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24rpx;
      padding: 56rpx 72rpx;
      border-radius: var(--r-radius-lg, 24rpx);
      background: var(--r-bg-card, #ffffff);
      box-shadow: var(--r-shadow-lg);
    }

    &__ring {
      width: 96rpx;
      height: 96rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__text {
      font-size: 26rpx;
      color: var(--r-text-regular);
    }
  }

  @keyframes c-logout-fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
