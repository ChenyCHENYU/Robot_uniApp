<!--
 * @Description: 虚拟状态栏 — 仅 H5 桌面端显示（手机外框的时间/信号/电池点缀）
-->
<template>
  <view class="c-vstatusbar">
    <view class="c-vstatusbar__left">
      <text class="c-vstatusbar__time">{{ time }}</text>
    </view>
    <view class="c-vstatusbar__right">
      <!-- 信号 -->
      <view class="c-vstatusbar__signal">
        <view
          v-for="i in 4"
          :key="i"
          class="c-vstatusbar__bar"
          :class="{ active: i <= 3 }"
          :style="{ height: 3 + i * 2 + 'px' }"
        />
      </view>
      <!-- 电池 -->
      <view class="c-vstatusbar__battery">
        <view class="c-vstatusbar__shell">
          <view class="c-vstatusbar__fill" />
        </view>
        <view class="c-vstatusbar__tip" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'

  const time = ref('')
  let timer: ReturnType<typeof setInterval> | null = null

  const updateTime = () => {
    const now = new Date()
    time.value = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`
  }

  onMounted(() => {
    updateTime()
    timer = setInterval(updateTime, 30000)
  })

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  })
</script>

<style lang="scss" scoped>
  // 移动端隐藏，仅桌面外框形态展示
  .c-vstatusbar {
    display: none;
  }

  // #ifdef H5
  @media screen and (min-width: 600px) {
    .c-vstatusbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 44px;
      padding: 0 28px;
      position: relative;
      z-index: 10000;

      &__time {
        font-size: 14px;
        font-weight: 600;
        color: var(--r-text-primary);
        font-variant-numeric: tabular-nums;
      }

      &__right {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      &__signal {
        display: flex;
        align-items: flex-end;
        gap: 2px;
      }

      &__bar {
        width: 3px;
        border-radius: 1px;
        background: var(--r-text-disabled);

        &.active {
          background: var(--r-text-primary);
        }
      }

      &__battery {
        display: flex;
        align-items: center;
      }

      &__shell {
        width: 22px;
        height: 11px;
        border: 1.5px solid var(--r-text-secondary);
        border-radius: 3px;
        padding: 1.5px;
      }

      &__fill {
        width: 80%;
        height: 100%;
        border-radius: 1px;
        background: var(--r-text-primary);
      }

      &__tip {
        width: 1.5px;
        height: 4px;
        border-radius: 0 1px 1px 0;
        background: var(--r-text-secondary);
        margin-left: 1px;
      }
    }
  }
  // #endif
</style>
