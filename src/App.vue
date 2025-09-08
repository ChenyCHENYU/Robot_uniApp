<template>
  <view class="app">
    <!-- 应用入口 -->
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 响应式数据
const isReady = ref(false)

// 页面加载完成
onMounted(() => {
  console.log('App mounted')
  
  // 检查 uview-plus 是否正确加载
  if (uni.$u) {
    console.log('uview-plus版本:', uni.$u.config?.version || '3.5.39')
    console.log('uview-plus 加载成功')
  } else {
    console.warn('uview-plus 未正确加载')
  }
  
  isReady.value = true
})
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
  background-color: #f5f7fa;
}

.app {
  height: 100vh;
}
</style>