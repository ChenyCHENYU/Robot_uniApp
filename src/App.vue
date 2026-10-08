<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-08 11:50:51
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-09-09 11:02:43
 * @FilePath: \Robot_uniApp\src\App.vue
 * @Description: 主应用组件
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎. 
-->
<template>
  <view class="app">
    <!-- 应用入口 -->
  </view>
</template>

<script setup lang="ts">
  import { onLaunch, onShow } from '@dcloudio/uni-app'
  import { onUnmounted } from 'vue'
  import { useAppStore } from '@/stores/modules/app'
  import { useUserStore } from '@/stores/modules/user'
  import { initLocale } from '@/composables/locale'
  import { initTheme } from '@/composables/useTheme'
  import { installH5FrameShell } from '@/utils/h5-frameshell'
  import { logger } from '@/utils/logger'
  import { feedback } from '@/utils/feedback'

  const appStore = useAppStore()
  const userStore = useUserStore()

  // 应用启动
  onLaunch(async () => {
    // #ifndef H5
    feedback.showLoading({ title: '正在准备工作空间', mask: true }, 'startup')
    const startupTimer = setTimeout(
      () => feedback.hideLoading({}, 'startup'),
      20000
    )
    // #endif
    try {
      await initApp()
    } finally {
      // #ifndef H5
      clearTimeout(startupTimer)
      feedback.hideLoading({}, 'startup')
      // #endif
    }
  })

  onShow(() => {})
  onUnmounted(() => appStore.stopNetworkMonitoring())

  // 初始化应用
  const initApp = async () => {
    // 初始化系统信息
    await appStore.initSystemInfo()

    // 恢复语言偏好（简/繁）与主题（亮/暗/跟随系统）
    initLocale()
    initTheme()

    // H5 桌面端虚拟状态栏（手机外框点缀）
    // #ifdef H5
    installH5FrameShell()
    // #endif

    appStore.startNetworkMonitoring()

    // 首次启动进入引导页（未完成引导且未登录）
    const guided = uni.getStorageSync('guide_completed')
    if (!guided && !userStore.isLoggedIn) {
      uni.reLaunch({ url: '/pages/guide/index' })
      return
    }

    // 如果已登录，尝试获取最新用户信息
    if (userStore.isLoggedIn && userStore.token) {
      try {
        await userStore.fetchUserInfo()
      } catch (error) {
        // 获取用户信息失败，可能 token 已过期（401 已由 http 层统一处理）
        logger.warn('获取用户信息失败:', error)
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/index.scss';

  .app {
    height: 100vh;
  }
</style>
