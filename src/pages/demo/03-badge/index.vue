<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Badge 徽标"
          subtitle="消息提示与数字标记"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-bell-badge"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 基础用法 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础用法"
            subtitle="数字徽标"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-numeric"
            :show-decoration="true"
          />
          <view
            class="flex justify-center items-center gap-8 my-6 p-4 bg-gray-50 rounded-lg"
          >
            <C_Badge :value="5">
              <view
                class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-email text-xl text-blue-500"></text>
              </view>
            </C_Badge>
            <C_Badge :value="12">
              <view
                class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-bell text-xl text-green-500"></text>
              </view>
            </C_Badge>
            <C_Badge :value="99">
              <view
                class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-chat text-xl text-orange-500"></text>
              </view>
            </C_Badge>
          </view>
        </view>

        <!-- 最大值 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="最大值"
            subtitle="超出显示 max+"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-counter"
            :show-decoration="true"
          />
          <view
            class="flex justify-center items-center gap-8 my-6 p-4 bg-gray-50 rounded-lg"
          >
            <C_Badge
              :value="120"
              :max="99"
            >
              <view
                class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-email text-xl text-red-500"></text>
              </view>
            </C_Badge>
            <C_Badge
              :value="25"
              :max="20"
            >
              <view
                class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-bell text-xl text-purple-500"></text>
              </view>
            </C_Badge>
            <C_Badge
              :value="999"
              :max="99"
            >
              <view
                class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-chat text-xl text-amber-600"></text>
              </view>
            </C_Badge>
          </view>
        </view>

        <!-- 圆点模式 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="小圆点模式"
            subtitle="dot 属性"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-circle-small"
            :show-decoration="true"
          />
          <view
            class="flex justify-center items-center gap-8 my-6 p-4 bg-gray-50 rounded-lg"
          >
            <C_Badge dot>
              <view
                class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-email text-xl text-blue-500"></text>
              </view>
            </C_Badge>
            <C_Badge
              dot
              color="#67c23a"
            >
              <view
                class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-bell text-xl text-green-500"></text>
              </view>
            </C_Badge>
            <C_Badge
              dot
              color="#e6a23c"
            >
              <view
                class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-chat text-xl text-orange-500"></text>
              </view>
            </C_Badge>
          </view>
        </view>

        <!-- 自定义颜色 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="自定义颜色"
            subtitle="color 属性"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-palette"
            :show-decoration="true"
          />
          <view
            class="flex justify-center items-center gap-8 my-6 p-4 bg-gray-50 rounded-lg"
          >
            <C_Badge
              :value="8"
              color="#409eff"
            >
              <view
                class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-heart text-xl text-gray-500"></text>
              </view>
            </C_Badge>
            <C_Badge
              :value="8"
              color="#67c23a"
            >
              <view
                class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-heart text-xl text-gray-500"></text>
              </view>
            </C_Badge>
            <C_Badge
              :value="8"
              color="#e6a23c"
            >
              <view
                class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <text class="i-mdi-heart text-xl text-gray-500"></text>
              </view>
            </C_Badge>
          </view>
        </view>

        <!-- 动态交互 -->
        <view class="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <C_Title
            title="动态交互"
            subtitle="点击增减徽标数值"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-gesture-tap"
            :show-decoration="true"
          />
          <view
            class="flex justify-center items-center gap-6 my-6 p-4 bg-gray-50 rounded-lg"
          >
            <view
              class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
              @click="badgeCount > 0 && badgeCount--"
            >
              <text class="text-white text-lg font-bold">-</text>
            </view>
            <C_Badge
              :value="badgeCount"
              :max="99"
            >
              <view
                class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <text class="i-mdi-email text-2xl text-white"></text>
              </view>
            </C_Badge>
            <view
              class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
              @click="badgeCount++"
            >
              <text class="text-white text-lg font-bold">+</text>
            </view>
          </view>
          <view class="text-center">
            <text class="text-sm text-gray-500">当前值：{{ badgeCount }}</text>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="消息提醒，一目了然"
          subtitle="数字 · 圆点 · 最大值 · 自定义颜色"
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
  const badgeCount = ref(5)
</script>
