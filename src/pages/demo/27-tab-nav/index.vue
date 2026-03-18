<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_TabNav 标签导航"
          subtitle="顶部标签页切换组件"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-tab"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 基础用法 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础用法"
            subtitle="点击切换标签"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-tab-unselected"
            :show-decoration="true"
          />
          <view class="my-6 bg-gray-50 rounded-lg overflow-hidden">
            <C_TabNav
              v-model="activeTab"
              :tabs="basicTabs"
            />
            <view class="p-4 text-center">
              <text class="text-sm text-gray-500"
                >当前选中：{{
                  basicTabs.find(t => t.value === activeTab)?.label
                }}</text
              >
            </view>
          </view>
        </view>

        <!-- 可滚动 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="可滚动标签"
            subtitle="scrollable 属性"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-arrow-left-right"
            :show-decoration="true"
          />
          <view class="my-6 bg-gray-50 rounded-lg overflow-hidden">
            <C_TabNav
              v-model="scrollTab"
              :tabs="scrollTabs"
              scrollable
            />
            <view class="p-4 text-center">
              <text class="text-sm text-gray-500"
                >选中：{{
                  scrollTabs.find(t => t.value === scrollTab)?.label
                }}</text
              >
            </view>
          </view>
        </view>

        <!-- 卡片类型 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="卡片类型"
            subtitle="type=card"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-card-outline"
            :show-decoration="true"
          />
          <view class="my-6 bg-gray-50 rounded-lg overflow-hidden p-4">
            <C_TabNav
              v-model="cardTab"
              :tabs="basicTabs"
              type="card"
            />
          </view>
        </view>

        <!-- 带徽标 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="带徽标"
            subtitle="badge / dot 属性"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-numeric-1-circle"
            :show-decoration="true"
          />
          <view class="my-6 bg-gray-50 rounded-lg overflow-hidden">
            <C_TabNav
              v-model="badgeTab"
              :tabs="badgeTabs"
            />
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="灵活导航，多种形态"
          subtitle="基础 · 滚动 · 卡片 · 徽标 · 吸顶"
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

  const activeTab = ref('all')
  const scrollTab = ref('recommend')
  const cardTab = ref('all')
  const badgeTab = ref('msg')

  const basicTabs = [
    { label: '全部', value: 'all' },
    { label: '进行中', value: 'doing' },
    { label: '已完成', value: 'done' },
  ]
  const scrollTabs = [
    { label: '推荐', value: 'recommend' },
    { label: '热榜', value: 'hot' },
    { label: '科技', value: 'tech' },
    { label: '财经', value: 'finance' },
    { label: '体育', value: 'sport' },
    { label: '娱乐', value: 'entertainment' },
    { label: '游戏', value: 'game' },
    { label: '教育', value: 'edu' },
  ]
  const badgeTabs = [
    { label: '消息', value: 'msg', badge: 5 },
    { label: '通知', value: 'notice', badge: '' },
    { label: '设置', value: 'settings' },
  ]
</script>
