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
  console.log('App Launch')
  initApp()
})

onShow(() => {
  console.log('App Show')
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
    console.log('App Launch')
  },
  
  onShow() {
    console.log('App Show')
  },
  
  onHide() {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import 'uview-plus/index.scss';

/* 全局样式 */
page {
  background-color: #ffffff;
}

.app {
  height: 100vh;
}
</style>