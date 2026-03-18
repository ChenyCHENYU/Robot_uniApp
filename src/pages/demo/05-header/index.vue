<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Header 页头"
          subtitle="智能页头导航组件"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-page-layout-header"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 用户模式 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="用户模式"
            subtitle="展示用户头像、昵称与问候语"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-account-circle"
            :show-decoration="true"
          />
          <view class="my-6 rounded-lg overflow-hidden shadow-inner">
            <C_Header
              :showBack="false"
              :showStatus="true"
              :notificationCount="8"
              @userClick="handleEvent('用户头像')"
              @notification="handleEvent('通知')"
              @settings="handleEvent('设置')"
            />
          </view>
        </view>

        <!-- 返回按钮模式 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="返回模式"
            subtitle="显示返回按钮与页面标题"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-arrow-left"
            :show-decoration="true"
          />
          <view class="my-6 rounded-lg overflow-hidden shadow-inner">
            <C_Header
              :showBack="true"
              title="详情页"
              :notificationCount="3"
              @back="handleEvent('返回')"
              @notification="handleEvent('通知')"
              @settings="handleEvent('设置')"
            />
          </view>
        </view>

        <!-- 功能说明 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="核心能力"
            subtitle="Header 组件特性一览"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-star-four-points"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg grid grid-cols-1 gap-3">
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-shield-account text-xl text-blue-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >安全区适配</text
                >
                <text class="text-xs text-gray-500">自动适配状态栏高度</text>
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-robot text-xl text-green-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >AI 状态指示</text
                >
                <text class="text-xs text-gray-500"
                  >在线 / 忙碌 / 离线三种状态</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-bell-ring text-xl text-orange-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >消息角标</text
                >
                <text class="text-xs text-gray-500">右上角通知数量提示</text>
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-view-compact text-xl text-purple-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >紧凑模式</text
                >
                <text class="text-xs text-gray-500"
                  >isCompactMode 缩小尺寸</text
                >
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="智能导航，场景自适"
          subtitle="用户模式 · 返回模式 · AI状态 · 安全区适配"
          :level="5"
          type="info"
          align="center"
          :show-divider="true"
          divider-position="top"
        />
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  const handleEvent = (action: string) => {
    uni.showToast({ title: `点击了：${action}`, icon: 'none' })
  }
</script>
