<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_NumberKeyboard 数字键盘"
          subtitle="安全数字输入组件"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-dialpad"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 基础键盘 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础数字键盘"
            subtitle="点击输入框弹出"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-numeric"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <view
              class="bg-white border border-gray-200 rounded-lg px-4 py-3 text-center min-h-10"
              @click="showKeyboard = true"
            >
              <text
                v-if="inputValue"
                class="text-lg font-mono tracking-widest"
                >{{ inputValue }}</text
              >
              <text
                v-else
                class="text-sm text-gray-400"
                >点击此处输入数字</text
              >
            </view>
          </view>
          <C_NumberKeyboard
            v-model:visible="showKeyboard"
            v-model="inputValue"
          />
        </view>

        <!-- 带小数点 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="小数点键盘"
            subtitle="showDot 属性"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-decimal-increase"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <view
              class="bg-white border border-gray-200 rounded-lg px-4 py-3 text-center min-h-10"
              @click="showDotKeyboard = true"
            >
              <text
                v-if="dotValue"
                class="text-lg font-mono"
                >¥ {{ dotValue }}</text
              >
              <text
                v-else
                class="text-sm text-gray-400"
                >输入金额</text
              >
            </view>
          </view>
          <C_NumberKeyboard
            v-model:visible="showDotKeyboard"
            v-model="dotValue"
            :showDot="true"
          />
        </view>

        <!-- 限制长度 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="长度限制"
            subtitle="maxLength=6"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-ruler"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <view class="flex justify-center gap-2">
              <view
                v-for="i in 6"
                :key="i"
                class="w-10 h-12 bg-white border-2 rounded-lg flex items-center justify-center"
                :class="
                  pinValue.length >= i ? 'border-blue-500' : 'border-gray-200'
                "
                @click="showPinKeyboard = true"
              >
                <text
                  v-if="pinValue.length >= i"
                  class="text-lg font-bold"
                  >●</text
                >
              </view>
            </view>
            <text class="text-xs text-gray-400 text-center block mt-3"
              >密码输入框效果</text
            >
          </view>
          <C_NumberKeyboard
            v-model:visible="showPinKeyboard"
            v-model="pinValue"
            :maxLength="6"
            :showDot="false"
          />
        </view>

        <!-- 随机排列 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="随机排列"
            subtitle="randomOrder 属性"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-shuffle-variant"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <view
              class="bg-white border border-gray-200 rounded-lg px-4 py-3 text-center min-h-10"
              @click="showRandomKeyboard = true"
            >
              <text
                v-if="randomValue"
                class="text-lg font-mono tracking-widest"
                >{{ randomValue }}</text
              >
              <text
                v-else
                class="text-sm text-gray-400"
                >安全键盘（随机排列）</text
              >
            </view>
          </view>
          <C_NumberKeyboard
            v-model:visible="showRandomKeyboard"
            v-model="randomValue"
            :randomOrder="true"
          />
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="安全输入，场景丰富"
          subtitle="小数点 · 长度限制 · 随机排列 · 密码模式"
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
  const inputValue = ref('')
  const dotValue = ref('')
  const pinValue = ref('')
  const randomValue = ref('')
  const showKeyboard = ref(false)
  const showDotKeyboard = ref(false)
  const showPinKeyboard = ref(false)
  const showRandomKeyboard = ref(false)
</script>
