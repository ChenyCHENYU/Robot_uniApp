<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Skeleton 骨架屏"
          subtitle="内容加载占位组件"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-blur-linear"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 基础骨架屏 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础骨架屏"
            subtitle="默认行数"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-text-short"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Skeleton
              :loading="true"
              :rows="3"
            />
          </view>
        </view>

        <!-- 带头像 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="头像骨架屏"
            subtitle="avatar 属性"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-account-circle"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Skeleton
              :loading="true"
              :rows="3"
              :avatar="true"
            />
          </view>
        </view>

        <!-- 预设模式 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="预设模式"
            subtitle="preset 属性"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-view-module"
            :show-decoration="true"
          />
          <view class="my-6 space-y-6">
            <view class="p-4 bg-gray-50 rounded-lg">
              <text class="text-xs text-gray-500 mb-2 block"
                >preset="list"</text
              >
              <C_Skeleton
                :loading="true"
                preset="list"
              />
            </view>
            <view class="p-4 bg-gray-50 rounded-lg">
              <text class="text-xs text-gray-500 mb-2 block"
                >preset="card"</text
              >
              <C_Skeleton
                :loading="true"
                preset="card"
              />
            </view>
            <view class="p-4 bg-gray-50 rounded-lg">
              <text class="text-xs text-gray-500 mb-2 block"
                >preset="profile"</text
              >
              <C_Skeleton
                :loading="true"
                preset="profile"
              />
            </view>
          </view>
        </view>

        <!-- 动画切换 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="动画效果"
            subtitle="点击切换 loading 状态"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-animation-play"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Skeleton
              :loading="isLoading"
              :rows="3"
              :avatar="true"
              :animate="true"
            >
              <view class="flex items-center gap-4">
                <view
                  class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <text class="text-xl">🤖</text>
                </view>
                <view>
                  <text class="font-bold block">机器人助手</text>
                  <text class="text-sm text-gray-500"
                    >已加载完成的真实内容</text
                  >
                </view>
              </view>
            </C_Skeleton>
            <view class="mt-4 text-center">
              <text
                class="text-sm text-white bg-blue-500 px-4 py-2 rounded-full"
                @click="toggleLoading"
              >
                {{ isLoading ? '显示内容' : '切换为骨架屏' }}
              </text>
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="优雅加载，提升体验"
          subtitle="多行 · 头像 · 预设模式 · 动画效果"
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
  const isLoading = ref(true)
  /**
   *
   */
  function toggleLoading() {
    isLoading.value = !isLoading.value
  }
</script>
