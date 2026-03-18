<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_ImagePreview 图片预览"
          subtitle="全屏图片预览与缩放"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-image-search-outline"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 基础用法-点击缩略图 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="点击预览"
            subtitle="点击图片全屏查看"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-gesture-tap"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <view class="flex gap-3 flex-wrap justify-center">
              <image
                v-for="(img, idx) in images"
                :key="idx"
                :src="img"
                class="w-20 h-20 rounded-lg"
                mode="aspectFill"
                @click="previewImage(idx)"
              />
            </view>
            <text class="text-xs text-gray-400 text-center block mt-3"
              >点击图片可预览</text
            >
          </view>
        </view>

        <!-- 组件方式 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="组件弹出"
            subtitle="visible 控制显隐"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-fullscreen"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-green-500 px-6 py-2.5 rounded-full"
              @click="showPreview = true"
              >打开图片预览</text
            >
          </view>
          <C_ImagePreview
            :visible="showPreview"
            :images="images"
            :startPosition="0"
            @close="showPreview = false"
          />
        </view>

        <!-- 功能特性 -->
        <view class="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <C_Title
            title="功能特性"
            subtitle="丰富的预览能力"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-star-outline"
            :show-decoration="true"
          />
          <view class="my-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">🔍</text>
              <text class="text-sm font-bold block">手势缩放</text>
              <text class="text-xs text-gray-500">双指缩放查看</text>
            </view>
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">👆</text>
              <text class="text-sm font-bold block">滑动翻页</text>
              <text class="text-xs text-gray-500">左右滑动切换</text>
            </view>
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">💾</text>
              <text class="text-sm font-bold block">保存图片</text>
              <text class="text-xs text-gray-500">长按保存到相册</text>
            </view>
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">📍</text>
              <text class="text-sm font-bold block">指示器</text>
              <text class="text-xs text-gray-500">显示当前位置</text>
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="全屏预览，体验流畅"
          subtitle="缩放 · 翻页 · 保存 · 指示器"
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

  const images = [
    'https://picsum.photos/id/10/800/600',
    'https://picsum.photos/id/20/800/600',
    'https://picsum.photos/id/30/800/600',
  ]
  const showPreview = ref(false)

  /**
   *
   */
  function previewImage(index: number) {
    uni.previewImage({ urls: images, current: index })
  }
</script>
