<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_List 列表</text>
        <text class="demo-subtitle">滚动列表容器，支持下拉刷新和触底加载更多</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card list-container">
          <C_List
            :loading="loading"
            :finished="finished"
            :showEmpty="list.length === 0 && !loading"
            @load="onLoad"
            @refresh="onRefresh"
          >
            <view v-for="item in list" :key="item.id" class="list-item">
              <view class="item-avatar">{{ item.id }}</view>
              <view class="item-content">
                <text class="item-title">{{ item.title }}</text>
                <text class="item-desc">{{ item.desc }}</text>
              </view>
            </view>
          </C_List>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="demo-section">
        <text class="section-title">操作</text>
        <view class="demo-card">
          <view class="action-row">
            <view class="step-btn step-btn--primary" @click="resetList">重置列表</view>
            <view class="step-btn" @click="clearList">清空列表</view>
          </view>
        </view>
      </view>

      <!-- 代码示例 -->
      <view class="demo-section">
        <text class="section-title">代码示例</text>
        <view class="demo-card">
          <view class="code-block">
            &lt;C_List
              :loading="loading"
              :finished="finished"
              @load="onLoad"
              @refresh="onRefresh"
            &gt;
              &lt;view v-for="item in list"&gt;...&lt;/view&gt;
            &lt;/C_List&gt;
          </view>
        </view>
      </view>

      <!-- Props -->
      <view class="demo-section">
        <text class="section-title">Props 一览</text>
        <view class="demo-card">
          <view class="prop-list">
            <view class="prop-item">
              <text class="prop-name">loading</text>
              <text class="prop-desc">是否加载中</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">finished</text>
              <text class="prop-desc">是否已全部加载</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">finishedText</text>
              <text class="prop-desc">加载完毕文案</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">error</text>
              <text class="prop-desc">是否加载失败</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">refresherEnabled</text>
              <text class="prop-desc">是否启用下拉刷新</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
import { ref } from 'vue'

const list = ref([])
const loading = ref(false)
const finished = ref(false)
let page = 0

const generateItems = (pageNum) => {
  const items = []
  for (let i = 1; i <= 10; i++) {
    const id = (pageNum - 1) * 10 + i
    items.push({
      id,
      title: `列表项 ${id}`,
      desc: `这是第 ${id} 条数据的描述信息`,
    })
  }
  return items
}

const onLoad = () => {
  if (loading.value || finished.value) return
  loading.value = true
  setTimeout(() => {
    page++
    const newItems = generateItems(page)
    list.value.push(...newItems)
    loading.value = false
    if (page >= 3) finished.value = true
  }, 1000)
}

const onRefresh = (done) => {
  page = 0
  finished.value = false
  list.value = []
  setTimeout(() => {
    page = 1
    list.value = generateItems(1)
    done?.()
  }, 1000)
}

const resetList = () => {
  page = 0
  finished.value = false
  list.value = []
  onLoad()
}

const clearList = () => {
  page = 0
  finished.value = false
  list.value = []
  loading.value = false
}

// 初始加载
onLoad()
</script>

<style lang="scss" scoped>
.demo-page {
  min-height: 100vh;
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
.list-container {
  height: 600rpx; padding: 0; overflow: hidden;
}
.list-item {
  display: flex; align-items: center; padding: 24rpx 32rpx; border-bottom: 1rpx solid #f0f0f0;
  .item-avatar { width: 64rpx; height: 64rpx; border-radius: 50%; background: #e8f0fe; display: flex; align-items: center; justify-content: center; font-size: 24rpx; color: #007aff; font-weight: 600; margin-right: 20rpx; flex-shrink: 0; }
  .item-content { flex: 1; }
  .item-title { display: block; font-size: 28rpx; color: #333; font-weight: 500; }
  .item-desc { display: block; font-size: 24rpx; color: #999; margin-top: 4rpx; }
}
.action-row {
  display: flex; justify-content: center; gap: 20rpx;
  .step-btn {
    padding: 12rpx 32rpx; border-radius: 8rpx; font-size: 26rpx; border: 1rpx solid #dcdfe6; color: #606266;
    &--primary { background: #007aff; color: #fff; border-color: #007aff; }
  }
}
.code-block {
  background: #f5f5f5; border-radius: 8rpx; padding: 16rpx 20rpx; font-size: 22rpx; color: #555; font-family: monospace; white-space: pre-wrap;
}
.prop-list {
  .prop-item { display: flex; justify-content: space-between; padding: 12rpx 0; border-bottom: 1rpx solid #f0f0f0; }
  .prop-name { font-size: 24rpx; color: #007aff; font-weight: 600; font-family: monospace; }
  .prop-desc { font-size: 24rpx; color: #666; }
}
</style>
