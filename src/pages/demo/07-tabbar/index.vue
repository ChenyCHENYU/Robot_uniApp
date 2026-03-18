<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Tabbar 标签栏"
          subtitle="底部导航标签栏组件"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-dock-bottom"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 基础用法 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础展示"
            subtitle="默认五个标签"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-tab"
            :show-decoration="true"
          />
          <view class="my-6 bg-gray-50 rounded-lg overflow-hidden">
            <view class="text-center py-8 text-sm text-gray-500"
              >Tabbar 固定在主页面底部</view
            >
            <view class="border-t border-gray-200 bg-white py-4">
              <view class="flex justify-around">
                <view
                  v-for="tab in tabs"
                  :key="tab.name"
                  class="flex flex-col items-center gap-1"
                  :class="tab.active ? 'text-blue-500' : 'text-gray-400'"
                >
                  <text
                    :class="tab.icon"
                    class="text-xl"
                  ></text>
                  <text class="text-xs">{{ tab.name }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 角标提示 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="角标提示"
            subtitle="搭配 Badge 徽标"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-bell-badge"
            :show-decoration="true"
          />
          <view class="my-6 bg-gray-50 rounded-lg overflow-hidden">
            <view class="text-center py-8 text-sm text-gray-500"
              >Tab 项可配角标数量与圆点</view
            >
            <view class="border-t border-gray-200 bg-white py-4">
              <view class="flex justify-around">
                <view
                  v-for="tab in badgeTabs"
                  :key="tab.name"
                  class="flex flex-col items-center gap-1 relative"
                >
                  <C_Badge
                    v-if="tab.badge"
                    :value="tab.badge"
                    :dot="tab.dot"
                  >
                    <text
                      :class="[
                        tab.icon,
                        tab.active ? 'text-blue-500' : 'text-gray-400',
                      ]"
                      class="text-xl"
                    ></text>
                  </C_Badge>
                  <text
                    v-else
                    :class="[
                      tab.icon,
                      tab.active ? 'text-blue-500' : 'text-gray-400',
                    ]"
                    class="text-xl"
                  ></text>
                  <text
                    class="text-xs"
                    :class="tab.active ? 'text-blue-500' : 'text-gray-400'"
                    >{{ tab.name }}</text
                  >
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 功能特性 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="核心能力"
            subtitle="Tabbar 组件特性"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-star-four-points"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg grid grid-cols-1 gap-3">
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-shield-check text-xl text-blue-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >安全区适配</text
                >
                <text class="text-xs text-gray-500"
                  >自动适配 iPhone 底部安全距离</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-badge-account text-xl text-green-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >Badge 集成</text
                >
                <text class="text-xs text-gray-500"
                  >通过 setBadge(index, value) 动态设置角标</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text
                class="i-mdi-swap-horizontal text-xl text-orange-500"
              ></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >路由联动</text
                >
                <text class="text-xs text-gray-500"
                  >切换标签自动跳转路由，与 uni-app 深度集成</text
                >
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="一栏导航，全局可达"
          subtitle="安全区 · 角标 · 路由联动 · 自定义图标"
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
  const tabs = [
    { name: '首页', icon: 'i-mdi-home', active: true },
    { name: '消息', icon: 'i-mdi-chat', active: false },
    { name: '机器人', icon: 'i-mdi-robot', active: false },
    { name: '我的', icon: 'i-mdi-account', active: false },
    { name: '设置', icon: 'i-mdi-cog', active: false },
  ]
  const badgeTabs = [
    { name: '首页', icon: 'i-mdi-home', active: true, badge: 0, dot: false },
    { name: '消息', icon: 'i-mdi-chat', active: false, badge: 12, dot: false },
    { name: '机器人', icon: 'i-mdi-robot', active: false, badge: 0, dot: true },
    {
      name: '我的',
      icon: 'i-mdi-account',
      active: false,
      badge: 0,
      dot: false,
    },
    { name: '设置', icon: 'i-mdi-cog', active: false, badge: 99, dot: false },
  ]
</script>
