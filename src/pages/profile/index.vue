<!--
 * @Description: 个人中心页面
-->
<template>
  <C_Layout>
    <view class="profile-page">
      <!-- 用户信息卡片 -->
      <view class="user-card">
        <view class="card-content">
          <view class="avatar-section">
            <view class="avatar-ring">
              <image
                v-if="hasCustomAvatar"
                class="avatar-img"
                :src="userAvatar"
                mode="aspectFill"
                @error="handleAvatarError"
              />
              <view
                v-else
                class="avatar-initial"
                >{{ userInitial }}</view
              >
            </view>
          </view>
          <view class="user-info-section">
            <text class="user-name">{{ userName }}</text>
            <text class="user-role">{{ userRole }}</text>
            <view class="user-id">
              <text class="id-label">ID: </text>
              <text class="id-value">{{ userId }}</text>
            </view>
          </view>
          <view
            class="edit-btn"
            @click="goToSettings"
          >
            <wd-icon
              name="edit-outline"
              size="16px"
              color="var(--r-color-primary)"
            />
          </view>
        </view>
      </view>

      <text class="resource-label">开发资源</text>
      <!-- 数据统计 -->
      <view class="stats-section">
        <view
          class="stat-item"
          v-for="stat in userStatsRef"
          :key="stat.label"
        >
          <text class="stat-value">{{ stat.value }}</text>
          <text class="stat-label">{{ stat.label }}</text>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view
        class="menu-section"
        v-for="group in menuGroups"
        :key="group.title"
      >
        <text class="menu-group-title">{{ group.title }}</text>
        <view class="menu-list">
          <view
            v-for="item in group.items"
            :key="item.id"
            class="menu-item"
            hover-class="menu-item--hover"
            :hover-stay-time="80"
            @click="handleMenuClick(item)"
          >
            <view class="menu-left">
              <view
                class="menu-icon-wrap"
                :style="{ background: item.iconBg }"
              >
                <C_Icon
                  :name="item.icon"
                  :size="18"
                  color="var(--r-color-primary)"
                />
              </view>
              <text class="menu-label">{{ item.label }}</text>
            </view>
            <view class="menu-right">
              <text
                v-if="item.extra"
                class="menu-extra"
                >{{ item.extra }}</text
              >
              <view
                v-if="item.badge"
                class="menu-badge"
              >
                <text class="badge-num">{{ item.badge }}</text>
              </view>
              <wd-icon
                name="arrow-right"
                size="14px"
                color="#ccc"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="logout-section">
        <view
          class="logout-btn"
          @click="handleLogout"
        >
          <wd-icon
            name="poweroff"
            size="18px"
            color="#f5576c"
          />
          <text class="logout-text">退出登录</text>
        </view>
      </view>

      <!-- 底部版本 -->
      <view class="footer-info">
        <text class="version-text">Robot UniApp v{{ appVersion }}</text>
        <text class="copyright-text">CHENY · 企业移动工作台</text>
      </view>
    </view>
    <!-- 登出过渡 -->
    <C_LogoutTransition :visible="logoutting" />
  </C_Layout>
</template>

<script setup lang="ts">
  import C_LogoutTransition from '@/components/global/C_LogoutTransition/index.vue'
  import { useProfilePage } from './data'

  const {
    appVersion,
    userAvatar,
    hasCustomAvatar,
    userInitial,
    handleAvatarError,
    userName,
    userRole,
    userId,
    menuGroups,
    userStatsRef,
    goToSettings,
    handleMenuClick,
    logoutting,
    handleLogout,
  } = useProfilePage()
</script>

<style lang="scss" scoped src="./index.scss"></style>
