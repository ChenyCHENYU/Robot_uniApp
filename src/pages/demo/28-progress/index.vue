<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Progress 进度条"
          subtitle="展示操作进度的组件"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-progress-check"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 基础用法 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础进度条"
            subtitle="不同百分比"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-chart-line"
            :show-decoration="true"
          />
          <view class="my-6 space-y-5 p-4 bg-gray-50 rounded-lg">
            <C_Progress :percentage="30" />
            <C_Progress :percentage="60" />
            <C_Progress :percentage="100" />
          </view>
        </view>

        <!-- 交互控制 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="动态控制"
            subtitle="点击按钮调整进度"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-tune"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Progress
              :percentage="progress"
              showText
            />
            <view class="flex justify-center gap-3 mt-4">
              <text
                class="text-sm bg-gray-200 text-gray-600 px-4 py-2 rounded-full"
                @click="decrease"
                >- 10</text
              >
              <text
                class="text-sm text-white bg-blue-500 px-4 py-2 rounded-full"
                @click="increase"
                >+ 10</text
              >
            </view>
          </view>
        </view>

        <!-- 自定义颜色 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="自定义颜色"
            subtitle="color 属性"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-palette"
            :show-decoration="true"
          />
          <view class="my-6 space-y-5 p-4 bg-gray-50 rounded-lg">
            <view>
              <text class="text-xs text-gray-500 mb-1 block">绿色</text>
              <C_Progress
                :percentage="40"
                color="#07c160"
              />
            </view>
            <view>
              <text class="text-xs text-gray-500 mb-1 block">红色</text>
              <C_Progress
                :percentage="70"
                color="#ee0a24"
              />
            </view>
            <view>
              <text class="text-xs text-gray-500 mb-1 block">橙色</text>
              <C_Progress
                :percentage="50"
                color="#ff976a"
              />
            </view>
          </view>
        </view>

        <!-- 文字内显 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="文字内显"
            subtitle="textInside 属性"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-format-text"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Progress
              :percentage="60"
              showText
              textInside
              strokeHeight="36rpx"
            />
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="进度可视，一目了然"
          subtitle="基础 · 动态控制 · 自定义颜色 · 文字内显"
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
  import { ref } from 'vue'

  const progress = ref(50)

  /**
   *
   */
  function increase() {
    progress.value = Math.min(100, progress.value + 10)
  }

  /**
   *
   */
  function decrease() {
    progress.value = Math.max(0, progress.value - 10)
  }
</script>
