<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Search 搜索"
          subtitle="搜索栏与历史记录"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-magnify"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 基础搜索 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础用法"
            subtitle="输入并搜索"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-text-search"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Search
              v-model="keyword"
              placeholder="搜索组件..."
              @search="handleSearch"
              @clear="handleClear"
            />
          </view>
          <view
            v-if="searchResult"
            class="text-center"
          >
            <text class="text-sm text-gray-500"
              >搜索了：「{{ searchResult }}」</text
            >
          </view>
        </view>

        <!-- 搜索历史 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="搜索历史"
            subtitle="自动记录最近搜索"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-history"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Search
              v-model="keyword2"
              :showHistory="true"
              placeholder="搜索并查看历史..."
              @search="handleSearch2"
            />
          </view>
        </view>

        <!-- 功能特性 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="核心能力"
            subtitle="搜索组件特性"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-star-four-points"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg grid grid-cols-1 gap-3">
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-timer-sand text-xl text-blue-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >防抖搜索</text
                >
                <text class="text-xs text-gray-500"
                  >debounceTime 默认 300ms</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-database-clock text-xl text-green-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >本地历史</text
                >
                <text class="text-xs text-gray-500"
                  >基于 Storage 自动持久化</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text
                class="i-mdi-text-box-remove text-xl text-orange-500"
              ></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >一键清除</text
                >
                <text class="text-xs text-gray-500">输入框清空 + 历史清空</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="即搜即达，历史可追"
          subtitle="防抖 · 历史记录 · 一键清除"
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
  const keyword = ref('')
  const keyword2 = ref('')
  const searchResult = ref('')
  const handleSearch = (val: string) => {
    searchResult.value = val
  }
  const handleClear = () => {
    searchResult.value = ''
  }
  const handleSearch2 = (val: string) => {
    uni.showToast({ title: `搜索：${val}`, icon: 'none' })
  }
</script>
