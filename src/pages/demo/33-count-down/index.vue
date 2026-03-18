<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_CountDown 倒计时"
          subtitle="实时倒计时展示组件"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-timer-sand"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 基础用法 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础倒计时"
            subtitle="默认格式"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-timer"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <C_CountDown :time="30 * 60 * 60 * 1000" />
          </view>
        </view>

        <!-- 自定义格式 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="自定义格式"
            subtitle="format 属性"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-clock-edit-outline"
            :show-decoration="true"
          />
          <view class="my-6 space-y-4">
            <view class="p-3 bg-gray-50 rounded-lg text-center">
              <text class="text-xs text-gray-400 block mb-1"
                >DD 天 HH 时 mm 分 ss 秒</text
              >
              <C_CountDown
                :time="24 * 60 * 60 * 1000"
                format="DD 天 HH 时 mm 分 ss 秒"
              />
            </view>
            <view class="p-3 bg-gray-50 rounded-lg text-center">
              <text class="text-xs text-gray-400 block mb-1">ss 秒</text>
              <C_CountDown
                :time="60 * 1000"
                format="ss 秒"
              />
            </view>
          </view>
        </view>

        <!-- 毫秒级 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="毫秒级精度"
            subtitle="millisecond 属性"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-speedometer"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <C_CountDown
              :time="30 * 60 * 60 * 1000"
              millisecond
              format="HH:mm:ss:SSS"
            />
          </view>
        </view>

        <!-- 自定义样式 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="自定义样式"
            subtitle="颜色 & 大小"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-palette"
            :show-decoration="true"
          />
          <view class="my-6 space-y-4">
            <view class="p-3 bg-gray-50 rounded-lg text-center">
              <C_CountDown
                :time="24 * 60 * 60 * 1000"
                color="#ee0a24"
                fontSize="40rpx"
              />
            </view>
            <view class="p-3 bg-gray-50 rounded-lg text-center">
              <C_CountDown
                :time="24 * 60 * 60 * 1000"
                color="#07c160"
                fontSize="32rpx"
              />
            </view>
          </view>
        </view>

        <!-- 手动控制 -->
        <view class="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <C_Title
            title="手动控制"
            subtitle="开始 / 暂停 / 重置"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-play-pause"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <view class="text-center mb-4">
              <C_CountDown
                ref="countdownRef"
                :time="10000"
                :autoStart="false"
                format="ss:SSS"
                millisecond
              />
            </view>
            <view class="flex justify-center gap-3">
              <text
                class="text-sm text-white bg-green-500 px-5 py-2 rounded-full"
                @click="handleStart"
                >开始</text
              >
              <text
                class="text-sm text-white bg-amber-500 px-5 py-2 rounded-full"
                @click="handlePause"
                >暂停</text
              >
              <text
                class="text-sm text-white bg-gray-500 px-5 py-2 rounded-full"
                @click="handleReset"
                >重置</text
              >
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="精准计时，灵活控制"
          subtitle="格式化 · 毫秒级 · 自定义样式 · 手动控制"
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

  const countdownRef = ref()

  /**
   *
   */
  function handleStart() {
    countdownRef.value?.start()
  }
  /**
   *
   */
  function handlePause() {
    countdownRef.value?.pause()
  }
  /**
   *
   */
  function handleReset() {
    countdownRef.value?.reset()
  }
</script>
