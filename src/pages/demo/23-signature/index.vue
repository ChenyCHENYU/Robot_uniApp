<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Signature 签名板"
          subtitle="手写电子签名组件"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-draw-pen"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 基础签名 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础签名"
            subtitle="在画布上手写签名"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-pencil"
            :show-decoration="true"
          />
          <view class="my-6 bg-gray-50 rounded-lg overflow-hidden">
            <C_Signature
              ref="signatureRef"
              height="400rpx"
            />
          </view>
          <view class="flex justify-center gap-3">
            <text
              class="text-sm bg-gray-200 text-gray-600 px-5 py-2 rounded-full"
              @click="handleClear"
              >清除</text
            >
            <text
              class="text-sm text-white bg-blue-500 px-5 py-2 rounded-full"
              @click="handleConfirm"
              >确认签名</text
            >
          </view>
        </view>

        <!-- 自定义画笔 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="自定义画笔"
            subtitle="红色画笔 · 粗细调整"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-brush"
            :show-decoration="true"
          />
          <view class="my-6 bg-gray-50 rounded-lg overflow-hidden">
            <C_Signature
              penColor="#ee0a24"
              :lineWidth="4"
              height="300rpx"
            />
          </view>
        </view>

        <!-- 签名结果 -->
        <view
          v-if="signResult"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <C_Title
            title="签名结果"
            subtitle="签名已保存"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-check-circle"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <image
              :src="signResult"
              mode="widthFix"
              class="w-full rounded-lg"
            />
          </view>
        </view>

        <!-- 特性 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="组件特性"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-information-outline"
            :show-decoration="true"
          />
          <view class="my-6 grid grid-cols-2 gap-4">
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">✏️</text>
              <text class="text-sm font-bold block">自定义画笔</text>
              <text class="text-xs text-gray-500">颜色 · 粗细</text>
            </view>
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">📸</text>
              <text class="text-sm font-bold block">导出图片</text>
              <text class="text-xs text-gray-500">PNG / JPEG</text>
            </view>
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">🔄</text>
              <text class="text-sm font-bold block">撤销重做</text>
              <text class="text-xs text-gray-500">灵活操作</text>
            </view>
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">📱</text>
              <text class="text-sm font-bold block">触控优化</text>
              <text class="text-xs text-gray-500">流畅书写</text>
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="电子签名，便捷高效"
          subtitle="手写 · 自定义画笔 · 导出图片 · 触控优化"
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

  const signatureRef = ref()
  const signResult = ref('')

  /**
   *
   */
  function handleClear() {
    signatureRef.value?.clear()
    signResult.value = ''
  }

  /**
   *
   */
  async function handleConfirm() {
    const result = await signatureRef.value?.confirm()
    if (result && !result.isEmpty) {
      signResult.value = result.tempFilePath
      uni.showToast({ title: '签名已保存', icon: 'success' })
    } else {
      uni.showToast({ title: '请先签名', icon: 'none' })
    }
  }
</script>
