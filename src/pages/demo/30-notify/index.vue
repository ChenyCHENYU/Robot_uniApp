<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Notify 消息通知"
          subtitle="顶部弹出消息提示"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-bell-ring-outline"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 基础通知 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础通知"
            subtitle="默认样式"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-bell"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-blue-500 px-6 py-2.5 rounded-full"
              @click="showNotify('primary')"
              >主要通知</text
            >
          </view>
        </view>

        <!-- 成功通知 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="成功通知"
            subtitle="type=success"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-check-circle"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-green-500 px-6 py-2.5 rounded-full"
              @click="showNotify('success')"
              >成功通知</text
            >
          </view>
        </view>

        <!-- 警告通知 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="警告通知"
            subtitle="type=warning"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-alert"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-amber-500 px-6 py-2.5 rounded-full"
              @click="showNotify('warning')"
              >警告通知</text
            >
          </view>
        </view>

        <!-- 危险通知 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="危险通知"
            subtitle="type=danger"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-close-circle"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-red-500 px-6 py-2.5 rounded-full"
              @click="showNotify('danger')"
              >危险通知</text
            >
          </view>
        </view>

        <!-- 自定义时长 -->
        <view class="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <C_Title
            title="自定义时长"
            subtitle="duration 属性"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-timer-outline"
            :show-decoration="true"
          />
          <view
            class="my-6 flex justify-center gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <text
              class="text-sm text-white bg-indigo-500 px-5 py-2.5 rounded-full"
              @click="showLong"
              >展示 5 秒</text
            >
            <text
              class="text-sm text-white bg-gray-500 px-5 py-2.5 rounded-full"
              @click="showShort"
              >展示 1 秒</text
            >
          </view>
        </view>
      </view>

      <C_Notify
        :visible="notifyVisible"
        :type="notifyType"
        :message="notifyMessage"
        :duration="notifyDuration"
        @close="notifyVisible = false"
      />

      <view class="mt-8 text-center">
        <C_Title
          title="即时反馈，清晰醒目"
          subtitle="主要 · 成功 · 警告 · 危险 · 自定义时长"
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

  const notifyVisible = ref(false)
  const notifyType = ref<string>('primary')
  const notifyMessage = ref('')
  const notifyDuration = ref(3000)

  const messages: Record<string, string> = {
    primary: '这是一条主要通知',
    success: '操作成功',
    warning: '请注意操作安全',
    danger: '操作失败，请重试',
  }

  /**
   *
   */
  function showNotify(type: string) {
    notifyType.value = type
    notifyMessage.value = messages[type]
    notifyDuration.value = 3000
    notifyVisible.value = true
  }

  /**
   *
   */
  function showLong() {
    notifyType.value = 'primary'
    notifyMessage.value = '这条通知将展示 5 秒钟'
    notifyDuration.value = 5000
    notifyVisible.value = true
  }

  /**
   *
   */
  function showShort() {
    notifyType.value = 'primary'
    notifyMessage.value = '这条通知只展示 1 秒'
    notifyDuration.value = 1000
    notifyVisible.value = true
  }
</script>
