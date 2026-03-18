<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Card 卡片"
          subtitle="通用内容容器组件"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-card-text"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 基础用法 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础卡片"
            subtitle="标题与内容"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-card"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Card
              title="卡片标题"
              subtitle="这是副标题描述"
            >
              <view class="text-sm text-gray-600"
                >这里是卡片主体内容区域，可以放置任意内容。</view
              >
            </C_Card>
          </view>
        </view>

        <!-- 阴影等级 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="阴影等级"
            subtitle="sm / md / lg / none"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-box-shadow"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <C_Card
              title="小阴影"
              shadow="sm"
            >
              <text class="text-xs text-gray-500">shadow="sm"</text>
            </C_Card>
            <C_Card
              title="中阴影"
              shadow="md"
            >
              <text class="text-xs text-gray-500">shadow="md"</text>
            </C_Card>
            <C_Card
              title="大阴影"
              shadow="lg"
            >
              <text class="text-xs text-gray-500">shadow="lg"</text>
            </C_Card>
          </view>
        </view>

        <!-- 可点击 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="可点击卡片"
            subtitle="clickable 属性"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-cursor-default-click"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Card
              title="点击我试试"
              subtitle="可点击卡片有悬浮反馈"
              clickable
              @click="handleClick"
            >
              <view class="flex items-center gap-2">
                <text class="i-mdi-gesture-tap text-lg text-blue-500"></text>
                <text class="text-sm text-gray-600">点击后触发 click 事件</text>
              </view>
            </C_Card>
          </view>
        </view>

        <!-- 自定义头部/底部 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="自定义插槽"
            subtitle="header / footer 插槽"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-puzzle"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Card>
              <template #header>
                <view class="flex items-center justify-between">
                  <view class="flex items-center gap-2">
                    <view
                      class="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center"
                    >
                      <text class="text-white text-xs font-bold">U</text>
                    </view>
                    <text class="text-sm font-medium text-gray-700"
                      >用户名</text
                    >
                  </view>
                  <text class="text-xs text-gray-400">3分钟前</text>
                </view>
              </template>
              <view class="text-sm text-gray-600"
                >自定义头部和底部插槽，打造个性化卡片布局。</view
              >
              <template #footer>
                <view class="flex justify-end gap-4 text-xs text-gray-400">
                  <text>❤️ 128</text>
                  <text>💬 32</text>
                  <text>⭐ 56</text>
                </view>
              </template>
            </C_Card>
          </view>
        </view>

        <!-- 无内边距 -->
        <view class="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <C_Title
            title="无内边距"
            subtitle="padding 属性"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-arrow-expand-all"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Card
              title="图片卡片"
              :padding="false"
            >
              <view
                class="bg-gradient-to-r from-blue-400 to-purple-500 py-12 text-center"
              >
                <text class="text-white text-lg font-medium">全宽内容区域</text>
                <text class="text-white text-xs block mt-2 opacity-75"
                  >:padding="false" 取消内边距</text
                >
              </view>
            </C_Card>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="万能容器，灵活简洁"
          subtitle="阴影 · 点击 · 插槽 · 无内边距"
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
  const handleClick = () => {
    uni.showToast({ title: '卡片被点击了', icon: 'none' })
  }
</script>
