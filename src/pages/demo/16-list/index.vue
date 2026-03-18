<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_List 列表"
          subtitle="滚动加载列表组件"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-format-list-bulleted"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 基础列表 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础用法"
            subtitle="下拉触底加载更多"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-arrow-down"
            :show-decoration="true"
          />
          <view
            class="my-6 bg-gray-50 rounded-lg overflow-hidden"
            style="height: 300px"
          >
            <C_List
              :loading="loading"
              :finished="finished"
              finishedText="没有更多了"
              @load="onLoad"
            >
              <view
                v-for="item in list"
                :key="item"
                class="px-4 py-3 bg-white border-b border-gray-100"
              >
                <text class="text-sm">列表项 {{ item }}</text>
              </view>
            </C_List>
          </view>
          <view class="flex justify-center gap-3 mt-4">
            <text
              class="text-sm text-white bg-blue-500 px-4 py-2 rounded-full"
              @click="resetList"
              >重置列表</text
            >
          </view>
        </view>

        <!-- 加载状态展示 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="状态演示"
            subtitle="不同加载状态"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-state-machine"
            :show-decoration="true"
          />
          <view class="my-6 space-y-4">
            <view class="p-4 bg-gray-50 rounded-lg">
              <view class="flex items-center gap-3">
                <view
                  class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                ></view>
                <text class="text-sm text-gray-600"
                  >loading=true：显示加载中提示</text
                >
              </view>
            </view>
            <view class="p-4 bg-gray-50 rounded-lg">
              <view class="flex items-center gap-3">
                <view class="w-2 h-2 bg-green-500 rounded-full"></view>
                <text class="text-sm text-gray-600"
                  >finished=true：显示"没有更多了"</text
                >
              </view>
            </view>
            <view class="p-4 bg-gray-50 rounded-lg">
              <view class="flex items-center gap-3">
                <view class="w-2 h-2 bg-red-500 rounded-full"></view>
                <text class="text-sm text-gray-600"
                  >error=true：显示加载失败，点击重试</text
                >
              </view>
            </view>
            <view class="p-4 bg-gray-50 rounded-lg">
              <view class="flex items-center gap-3">
                <view class="w-2 h-2 bg-gray-400 rounded-full"></view>
                <text class="text-sm text-gray-600"
                  >emptyType：列表为空时展示空状态</text
                >
              </view>
            </view>
          </view>
        </view>

        <!-- 空列表 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="空列表"
            subtitle="配合 C_Empty"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-inbox-outline"
            :show-decoration="true"
          />
          <view
            class="my-6 bg-gray-50 rounded-lg overflow-hidden"
            style="height: 200px"
          >
            <C_List
              :loading="false"
              :finished="true"
              emptyType="search"
            >
            </C_List>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="滚动加载，体验流畅"
          subtitle="加载中 · 加载完成 · 加载失败 · 空状态"
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

  const list = ref<number[]>([])
  const loading = ref(false)
  const finished = ref(false)
  let page = 0

  /**
   *
   */
  function onLoad() {
    loading.value = true
    setTimeout(() => {
      page++
      for (let i = 0; i < 10; i++) {
        list.value.push(list.value.length + 1)
      }
      loading.value = false
      if (page >= 3) {
        finished.value = true
      }
    }, 800)
  }

  /**
   *
   */
  function resetList() {
    list.value = []
    page = 0
    loading.value = false
    finished.value = false
    onLoad()
  }
</script>
