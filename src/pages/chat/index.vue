<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-08 
 * @Description: AI对话页面
-->
<template>
  <C_Layout
    :notification-count="notificationCount"
    @user-click="handleUserClick"
    @notification-click="handleNotificationClick"
    @settings-click="handleSettingsClick"
    @tab-change="handleTabChange"
  >
    <view class="chat-content">
      <text>AI对话页面 - 开发中</text>
    </view>
  </C_Layout>
</template>

<script setup>
import { ref } from "vue";

const notificationCount = ref(0);

// 事件处理
const handleUserClick = (user) => {
  uni.showToast({
    title: '查看用户资料',
    icon: 'none'
  })
}

const handleNotificationClick = (count) => {
  uni.showToast({
    title: `有${count}条新通知`,
    icon: 'none'
  })
}

const handleSettingsClick = () => {
  uni.showToast({
    title: '打开设置',
    icon: 'none'
  })
}

const handleTabChange = ({ item, index }) => {
  console.log('切换到:', item.text, '索引:', index)
}
</script>

<style lang="scss" scoped>
.chat-content {
  padding: 40rpx;
  min-height: calc(100vh - 200rpx);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
