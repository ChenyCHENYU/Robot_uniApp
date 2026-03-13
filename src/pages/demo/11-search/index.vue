<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Search 搜索</text>
        <text class="demo-subtitle">带搜索历史记录的搜索栏组件，支持防抖</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <C_Search @search="onSearch" @input="onInput" />
          <view v-if="searchResult" class="search-result">
            <text>搜索结果：{{ searchResult }}</text>
          </view>
          <view class="code-block mt-3">
            &lt;C_Search @search="onSearch" /&gt;
          </view>
        </view>
      </view>

      <!-- 自定义占位文案 -->
      <view class="demo-section">
        <text class="section-title">自定义 placeholder</text>
        <view class="demo-card">
          <C_Search placeholder="搜索机器人型号..." @search="onSearch" />
          <view class="code-block mt-3">
            &lt;C_Search placeholder="搜索机器人型号..." /&gt;
          </view>
        </view>
      </view>

      <!-- 搜索历史 -->
      <view class="demo-section">
        <text class="section-title">搜索历史</text>
        <view class="demo-card">
          <text class="demo-desc">默认开启搜索历史，点击搜索栏输入框即可看到。支持通过 maxHistory 设置最大记录数。</text>
          <view class="code-block">
            &lt;C_Search :showHistory="true" :maxHistory="10" /&gt;
          </view>
        </view>
      </view>

      <!-- 防抖 -->
      <view class="demo-section">
        <text class="section-title">防抖</text>
        <view class="demo-card">
          <text class="demo-desc">通过 debounceTime 设置输入防抖时间（毫秒），默认 300ms</text>
          <view class="code-block">
            &lt;C_Search :debounceTime="500" @input="onInput" /&gt;
          </view>
        </view>
      </view>

      <!-- Props -->
      <view class="demo-section">
        <text class="section-title">Props 一览</text>
        <view class="demo-card">
          <view class="prop-list">
            <view class="prop-item">
              <text class="prop-name">placeholder</text>
              <text class="prop-desc">占位文本，默认"搜索"</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">showHistory</text>
              <text class="prop-desc">是否显示搜索历史，默认 true</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">maxHistory</text>
              <text class="prop-desc">最大历史记录数，默认 10</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">debounceTime</text>
              <text class="prop-desc">防抖时间(ms)，默认 300</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">showAction</text>
              <text class="prop-desc">是否显示搜索按钮</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
import { ref } from 'vue'

const searchResult = ref('')

const onSearch = (keyword) => {
  searchResult.value = keyword
  console.log('搜索：', keyword)
}

const onInput = (val) => {
  console.log('输入：', val)
}
</script>

<style lang="scss" scoped>
.demo-page {
  min-height: 100%;
  background: #f5f7fa;
  padding: 24rpx 32rpx;
}
.demo-header {
  margin-bottom: 40rpx;
  .demo-title { display: block; font-size: 44rpx; font-weight: 700; color: #1f2937; margin-bottom: 8rpx; }
  .demo-subtitle { display: block; font-size: 26rpx; color: #666; }
}
.demo-section {
  margin-bottom: 40rpx;
  .section-title { display: block; font-size: 30rpx; font-weight: 600; color: #1f2937; margin-bottom: 20rpx; padding-left: 16rpx; border-left: 6rpx solid #667eea; }
}
.demo-card {
  background: #fff; border-radius: 20rpx; padding: 32rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04); border: 1rpx solid rgba(0,0,0,0.04);
}
.demo-desc {
  display: block; font-size: 26rpx; color: #666; margin-bottom: 16rpx;
}
.search-result {
  margin-top: 16rpx; padding: 16rpx; background: #f0f9ff; border-radius: 8rpx; font-size: 26rpx; color: #007aff;
}
.mt-3 { margin-top: 20rpx; }
.code-block {
  background: #f5f5f5; border-radius: 8rpx; padding: 16rpx 20rpx; font-size: 22rpx; color: #555; font-family: monospace; white-space: pre-wrap;
}
.prop-list {
  .prop-item { display: flex; justify-content: space-between; padding: 12rpx 0; border-bottom: 1rpx solid #f0f0f0; }
  .prop-name { font-size: 24rpx; color: #007aff; font-weight: 600; font-family: monospace; }
  .prop-desc { font-size: 24rpx; color: #666; }
}
</style>
