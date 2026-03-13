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

<script setup>
import { onLaunch, onShow } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores/modules/app'
import { useUserStore } from '@/stores/modules/user'

const appStore = useAppStore()
const userStore = useUserStore()

// 应用启动
onLaunch(() => {
  initApp()
})

onShow(() => {
})

// 初始化应用
const initApp = async () => {
  // 初始化系统信息
  await appStore.initSystemInfo()
  
  // 如果已登录，尝试获取最新用户信息
  if (userStore.isLoggedIn && userStore.token) {
    try {
      await userStore.fetchUserInfo()
    } catch (error) {
      // 获取用户信息失败，可能 token 已过期
      console.warn('获取用户信息失败:', error)
    }
  }
}
</script>

<!-- 注意：uni-app 的应用生命周期需要用 Options API -->
<script>
export default {
  // uni-app 应用级生命周期
  onLaunch() {
  },
  
  onShow() {
  },
  
  onHide() {
  }
}
</script>

<style lang="scss">
/* 全局样式 */
page {
  background-color: #ffffff;
}

.app {
  height: 100vh;
}
</style>