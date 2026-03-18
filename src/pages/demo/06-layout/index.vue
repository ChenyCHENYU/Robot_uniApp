<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Layout 布局"
          subtitle="统一页面结构与导航容器"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-page-layout-body"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 布局结构 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="布局结构"
            subtitle="Header + Content + Tabbar"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-view-dashboard"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <view
              class="border-2 border-dashed border-blue-300 rounded-lg overflow-hidden"
            >
              <view
                class="bg-blue-500 text-white text-center py-3 text-sm font-medium"
                >Header 区域</view
              >
              <view class="bg-blue-50 text-center py-10 text-sm text-gray-500"
                >Content 内容区域（自动填充）</view
              >
              <view
                class="bg-blue-500 text-white text-center py-3 text-sm font-medium"
                >Tabbar 区域</view
              >
            </view>
          </view>
        </view>

        <!-- 布局类型 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="布局类型"
            subtitle="自动识别 / 手动配置"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-auto-fix"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg grid grid-cols-1 gap-3">
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-auto-mode text-xl text-blue-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >auto 自动布局</text
                >
                <text class="text-xs text-gray-500"
                  >根据路由自动判断是否显示 Header/Tabbar</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-dock-top text-xl text-green-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >header-only 仅页头</text
                >
                <text class="text-xs text-gray-500"
                  >只显示 Header，隐藏 Tabbar</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-dock-bottom text-xl text-orange-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >tabbar-only 仅标签栏</text
                >
                <text class="text-xs text-gray-500"
                  >只显示 Tabbar，隐藏 Header</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-fullscreen text-xl text-purple-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >full 完整布局</text
                >
                <text class="text-xs text-gray-500"
                  >同时显示 Header 和 Tabbar</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-crop-free text-xl text-red-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >none 纯内容</text
                >
                <text class="text-xs text-gray-500">无 Header 无 Tabbar</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 当前页面即示例 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="当前即示例"
            subtitle="本页面就使用了 C_Layout"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-eye"
            :show-decoration="true"
          />
          <view
            class="my-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-center"
          >
            <text
              class="i-mdi-check-decagram text-4xl text-green-500 block mb-3"
            ></text>
            <text class="text-sm text-gray-600 block"
              >当前页面的 Header 返回按钮、内容区滚动、安全区适配</text
            >
            <text class="text-sm text-gray-600 block mt-1"
              >全部由 C_Layout 自动管理</text
            >
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="统一管理，智能适配"
          subtitle="自动布局 · 安全区 · 返回控制 · 多种模式"
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

<script setup lang="ts"></script>
