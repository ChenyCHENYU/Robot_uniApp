<!--
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-08 
 * @Description: 个人中心页面
-->
<template>
  <view class="profile-page">
    <C_Header default-nickname="个人中心" :show-status="false" />
    <view class="main-content">
      <text>个人中心页面 - 开发中</text>
    </view>
    <C_Tabbar v-model="currentTab" :tab-list="tabList" :fixed="true" />
  </view>
</template>

<script setup>
import { ref } from "vue";

const currentTab = ref(3);
const tabList = ref([
  {
    id: "home",
    text: "首页",
    icon: "home",
    activeIcon: "home-fill",
    path: "/pages/index/index",
    badge: 0,
  },
  {
    id: "chat",
    text: "AI对话",
    icon: "chat",
    activeIcon: "chat-fill",
    path: "/pages/chat/index",
    badge: 0,
  },
  {
    id: "robot",
    text: "机器人",
    icon: "robot",
    activeIcon: "robot",
    path: "/pages/robot/index",
    badge: 0,
  },
  {
    id: "profile",
    text: "我的",
    icon: "account",
    activeIcon: "account-fill",
    path: "/pages/profile/index",
    badge: 0,
  },
]);
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 40rpx;
  padding-bottom: 160rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
