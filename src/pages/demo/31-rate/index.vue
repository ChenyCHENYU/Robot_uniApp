<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Rate 评分"
          subtitle="星级评分交互组件"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-star"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 基础评分 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础评分"
            subtitle="点击选择分数"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-star-outline"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <C_Rate v-model="basicRate" />
            <text class="text-sm text-gray-500 block mt-3"
              >当前：{{ basicRate }} 分</text
            >
          </view>
        </view>

        <!-- 半选模式 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="半选模式"
            subtitle="allowHalf 属性"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-star-half-full"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <C_Rate
              v-model="halfRate"
              allowHalf
            />
            <text class="text-sm text-gray-500 block mt-3"
              >当前：{{ halfRate }} 分</text
            >
          </view>
        </view>

        <!-- 自定义样式 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="自定义样式"
            subtitle="颜色 / 数量 / 大小"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-palette"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <C_Rate
              v-model="customRate"
              :count="6"
              color="#ee0a24"
              voidColor="#eee"
              size="48rpx"
            />
            <text class="text-xs text-gray-400 block mt-3"
              >6颗星 · 红色 · 大尺寸</text
            >
          </view>
        </view>

        <!-- 只读模式 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="只读模式"
            subtitle="readonly 属性"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-lock"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <C_Rate
              :modelValue="4.5"
              readonly
              allowHalf
            />
            <text class="text-sm text-gray-500 block mt-3">综合评分：4.5</text>
          </view>
        </view>

        <!-- 业务场景 -->
        <view class="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <C_Title
            title="业务场景"
            subtitle="评价卡片示例"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-message-star-outline"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <view class="bg-white rounded-lg p-4 shadow-sm">
              <view class="flex items-center gap-3 mb-3">
                <view
                  class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <text class="text-lg">👤</text>
                </view>
                <view>
                  <text class="text-sm font-bold block">用户评价</text>
                  <text class="text-xs text-gray-400">2024-01-15</text>
                </view>
              </view>
              <C_Rate
                :modelValue="5"
                readonly
                size="32rpx"
              />
              <text class="text-sm text-gray-600 block mt-2"
                >非常好用的组件库，开发效率提升很多！</text
              >
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="星级评分，直观表达"
          subtitle="基础 · 半选 · 自定义 · 只读 · 业务场景"
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

  const basicRate = ref(3)
  const halfRate = ref(2.5)
  const customRate = ref(4)
</script>
