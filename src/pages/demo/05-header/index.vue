<template>
  <C_Layout>
    <view class="demo-page demo-header">
      <view class="demo-hero">
        <view class="demo-hero__eyebrow"
          ><text>{{ PAGE_META.category }}</text
          ><text>{{ PAGE_META.component }}</text></view
        >
        <text class="demo-hero__title">{{ PAGE_META.title }}</text>
        <text class="demo-hero__desc">{{ PAGE_META.summary }}</text>
      </view>
      <view class="demo-tip"
        ><C_Icon
          name="i-mdi-gesture-tap"
          :size="16"
        /><text>{{ PAGE_META.instruction }}</text></view
      >

      <view class="demo-grid">
        <view class="demo-section">
          <text class="section-title">工作台页头</text>
          <text class="section-desc">头像、标题与未读消息</text>
          <view class="header-sample demo-preview">
            <C_Header
              title="我的工作台"
              subtitle="事项有序，进度清晰"
              :notificationCount="8"
              @user-click="onHeaderAction('用户资料')"
              @notification-click="onHeaderAction('通知')"
              @settings-click="onHeaderAction('设置')"
            />
          </view>
        </view>
        <view class="demo-section">
          <text class="section-title">详情页头</text>
          <text class="section-desc">返回入口与紧凑导航</text>
          <view class="header-sample demo-preview">
            <C_Header
              title="审批详情"
              subtitle="查看流程与处理结果"
              showBack
              :showUser="false"
              isCompactMode
              :notificationCount="3"
              @back-click="onHeaderAction('返回')"
              @notification-click="onHeaderAction('通知')"
              @settings-click="onHeaderAction('设置')"
            />
          </view>
        </view>
        <view class="demo-section">
          <text class="section-title">当前交互</text>
          <text class="demo-status">{{ headerAction }}</text>
          <text class="section-desc"
            >样本内的操作仅反馈点击事件。实际页面的返回与入口由布局容器连接。</text
          >
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const { headerAction, onHeaderAction } = useDemo()
</script>
<style lang="scss" scoped>
  @import './index.scss';
</style>
