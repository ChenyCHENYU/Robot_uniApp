<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Watermark 水印"
          subtitle="页面安全水印组件"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-water-outline"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 基础水印 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础水印"
            subtitle="默认文字水印"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-text"
            :show-decoration="true"
          />
          <view class="my-6 rounded-lg overflow-hidden">
            <C_Watermark text="机器人助手">
              <view
                class="flex items-center justify-center"
                style="height: 200px"
              >
                <text class="text-gray-400 text-sm">内容区域</text>
              </view>
            </C_Watermark>
          </view>
        </view>

        <!-- 自定义颜色 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="自定义颜色"
            subtitle="color 属性"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-palette"
            :show-decoration="true"
          />
          <view class="my-6 rounded-lg overflow-hidden">
            <C_Watermark
              text="Robot App"
              color="rgba(22, 119, 255, 0.12)"
            >
              <view
                class="flex items-center justify-center"
                style="height: 200px"
              >
                <text class="text-gray-400 text-sm">蓝色水印</text>
              </view>
            </C_Watermark>
          </view>
        </view>

        <!-- 旋转角度 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="旋转角度"
            subtitle="rotate 属性"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-rotate-right"
            :show-decoration="true"
          />
          <view class="my-6 rounded-lg overflow-hidden">
            <C_Watermark
              text="自定义角度"
              :rotate="-15"
            >
              <view
                class="flex items-center justify-center"
                style="height: 200px"
              >
                <text class="text-gray-400 text-sm">rotate = -15°</text>
              </view>
            </C_Watermark>
          </view>
        </view>

        <!-- 自定义间距 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="密集水印"
            subtitle="gap 属性"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-grid-large"
            :show-decoration="true"
          />
          <view class="my-6 rounded-lg overflow-hidden">
            <C_Watermark
              text="CONFIDENTIAL"
              :gap="[60, 60]"
              :fontSize="12"
            >
              <view
                class="flex items-center justify-center"
                style="height: 200px"
              >
                <text class="text-gray-400 text-sm">密集排列效果</text>
              </view>
            </C_Watermark>
          </view>
        </view>

        <!-- 全页水印 -->
        <view class="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <C_Title
            title="功能特性"
            subtitle="安全、灵活、可配置"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-shield-check-outline"
            :show-decoration="true"
          />
          <view class="my-6 grid grid-cols-2 gap-4">
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">🔒</text>
              <text class="text-sm font-bold block">安全防护</text>
              <text class="text-xs text-gray-500">防止截图泄露</text>
            </view>
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">🎨</text>
              <text class="text-sm font-bold block">自定义样式</text>
              <text class="text-xs text-gray-500">颜色、大小、间距</text>
            </view>
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">📐</text>
              <text class="text-sm font-bold block">旋转角度</text>
              <text class="text-xs text-gray-500">自由设置倾斜度</text>
            </view>
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">📄</text>
              <text class="text-sm font-bold block">全页覆盖</text>
              <text class="text-xs text-gray-500">fullPage 模式</text>
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="安全水印，防止泄露"
          subtitle="文字 · 颜色 · 旋转 · 间距 · 全页覆盖"
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
