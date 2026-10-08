<template>
  <C_Layout>
    <view class="demo-page demo-number-keyboard">
      <view class="demo-hero">
        <view class="demo-hero__eyebrow"
          ><text>{{ PAGE_META.category }}</text
          ><text>{{ PAGE_META.component }}</text></view
        >
        <text class="demo-hero__title">{{ PAGE_META.title }}</text>
        <text class="demo-hero__desc">{{ PAGE_META.summary }}</text>
      </view>
      <view class="demo-tip"
        ><C_Icon
          name="i-mdi-gesture-tap"
          :size="16"
        /><text>{{ PAGE_META.instruction }}</text></view
      >

      <view class="demo-grid">
        <!-- 基础键盘 -->
        <view class="demo-section">
          <text class="section-title">基础数字键盘</text>
          <text class="section-desc">点击输入框弹出</text>
          <view class="demo-preview">
            <button
              class="keyboard-input"
              @click="showKeyboard = true"
            >
              <text
                v-if="inputValue"
                class="text-lg font-mono tracking-widest"
                >{{ inputValue }}</text
              >
              <text
                v-else
                class="text-sm demo-muted"
                >点击此处输入数字</text
              >
            </button>
          </view>
          <C_NumberKeyboard
            v-model:visible="showKeyboard"
            v-model="inputValue"
          />
        </view>

        <!-- 带小数点 -->
        <view class="demo-section">
          <text class="section-title">小数点键盘</text>
          <text class="section-desc">showDot 属性</text>
          <view class="demo-preview">
            <button
              class="keyboard-input"
              @click="showDotKeyboard = true"
            >
              <text
                v-if="dotValue"
                class="text-lg font-mono"
                >¥ {{ dotValue }}</text
              >
              <text
                v-else
                class="text-sm demo-muted"
                >输入金额</text
              >
            </button>
          </view>
          <C_NumberKeyboard
            v-model:visible="showDotKeyboard"
            v-model="dotValue"
            :showDot="true"
          />
        </view>

        <!-- 限制长度 -->
        <view class="demo-section">
          <text class="section-title">长度限制</text>
          <text class="section-desc">maxLength=6</text>
          <view class="demo-preview">
            <view class="flex justify-center gap-2">
              <button
                v-for="i in 6"
                :key="i"
                class="keyboard-pin"
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
              </button>
            </view>
            <text class="text-xs demo-muted text-center block mt-3"
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
        <view class="demo-section">
          <text class="section-title">随机排列</text>
          <text class="section-desc">randomOrder 属性</text>
          <view class="demo-preview">
            <button
              class="keyboard-input"
              @click="showRandomKeyboard = true"
            >
              <text
                v-if="randomValue"
                class="text-lg font-mono tracking-widest"
                >{{ randomValue }}</text
              >
              <text
                v-else
                class="text-sm demo-muted"
                >安全键盘（随机排列）</text
              >
            </button>
          </view>
          <C_NumberKeyboard
            v-model:visible="showRandomKeyboard"
            v-model="randomValue"
            :randomOrder="true"
          />
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const {
    inputValue,
    dotValue,
    pinValue,
    randomValue,
    showKeyboard,
    showDotKeyboard,
    showPinKeyboard,
    showRandomKeyboard,
  } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
