<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_FloatButton 悬浮按钮"
          subtitle="页面快捷操作入口"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-plus-circle"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 基础用法 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础用法"
            subtitle="右下角默认位置"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-cursor-default-click"
            :show-decoration="true"
          />
          <view
            class="relative my-6 bg-gray-50 rounded-lg overflow-hidden"
            style="height: 300rpx"
          >
            <view class="flex items-center justify-center h-full">
              <text class="text-sm text-gray-400">模拟页面区域</text>
            </view>
            <C_FloatButton @click="handleClick('基础按钮')" />
          </view>
        </view>

        <!-- 自定义图标 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="自定义图标"
            subtitle="替换默认加号图标"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-pencil"
            :show-decoration="true"
          />
          <view
            class="relative my-6 bg-gray-50 rounded-lg overflow-hidden"
            style="height: 300rpx"
          >
            <view class="flex items-center justify-center h-full">
              <text class="text-sm text-gray-400">自定义图标样式</text>
            </view>
            <C_FloatButton
              icon="edit"
              @click="handleClick('编辑按钮')"
            />
          </view>
        </view>

        <!-- 位置控制 -->
        <view class="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <C_Title
            title="使用说明"
            subtitle="悬浮按钮的配置能力"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-information"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-map-marker text-xl text-blue-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >位置控制</text
                >
                <text class="text-xs text-gray-500"
                  >position: right-bottom / left-bottom</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-gesture-swipe text-xl text-green-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >支持拖拽</text
                >
                <text class="text-xs text-gray-500">可自由拖动到任意位置</text>
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-resize text-xl text-orange-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >尺寸设置</text
                >
                <text class="text-xs text-gray-500"
                  >size 属性控制按钮大小（rpx）</text
                >
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="一键触达，快捷操作"
          subtitle="位置自定义 · 拖拽交互 · 图标可配"
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
  const handleClick = (name: string) => {
    uni.showToast({ title: `${name}被点击`, icon: 'none' })
  }
</script>
