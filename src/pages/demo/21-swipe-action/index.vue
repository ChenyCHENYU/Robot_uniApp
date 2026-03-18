<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_SwipeAction 滑动操作"
          subtitle="列表项左右滑动交互"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-gesture-swipe-horizontal"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 右滑删除 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="右滑删除"
            subtitle="基础用法"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-delete-sweep"
            :show-decoration="true"
          />
          <view class="my-6 bg-gray-50 rounded-lg overflow-hidden">
            <C_SwipeAction
              :rightActions="[{ text: '删除', bgColor: '#ee0a24' }]"
              @action="onAction"
            >
              <view class="px-4 py-4 bg-white">
                <text class="text-sm">← 向左滑动试试</text>
              </view>
            </C_SwipeAction>
          </view>
        </view>

        <!-- 左右都有 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="左右操作按钮"
            subtitle="双向滑动"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-swap-horizontal"
            :show-decoration="true"
          />
          <view class="my-6 bg-gray-50 rounded-lg overflow-hidden">
            <C_SwipeAction
              :leftActions="[{ text: '收藏', bgColor: '#07c160' }]"
              :rightActions="[
                { text: '标记', bgColor: '#ff976a' },
                { text: '删除', bgColor: '#ee0a24' },
              ]"
              @action="onAction"
            >
              <view class="px-4 py-4 bg-white">
                <text class="text-sm">左右都可以滑动</text>
              </view>
            </C_SwipeAction>
          </view>
        </view>

        <!-- 列表场景 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="列表场景"
            subtitle="实际业务示例"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-format-list-bulleted"
            :show-decoration="true"
          />
          <view class="my-6 bg-gray-50 rounded-lg overflow-hidden">
            <view
              v-for="(item, idx) in listItems"
              :key="idx"
            >
              <C_SwipeAction
                :rightActions="[
                  { text: '置顶', bgColor: '#1989fa' },
                  { text: '删除', bgColor: '#ee0a24' },
                ]"
                @action="onAction"
              >
                <view
                  class="px-4 py-3 bg-white flex items-center gap-3 border-b border-gray-100"
                >
                  <view
                    class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
                    :class="item.color"
                  >
                    {{ item.avatar }}
                  </view>
                  <view>
                    <text class="text-sm font-bold block">{{ item.name }}</text>
                    <text class="text-xs text-gray-400">{{ item.msg }}</text>
                  </view>
                </view>
              </C_SwipeAction>
            </view>
          </view>
        </view>

        <!-- 禁用状态 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="禁用状态"
            subtitle="disabled 属性"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-lock"
            :show-decoration="true"
          />
          <view class="my-6 bg-gray-50 rounded-lg overflow-hidden">
            <C_SwipeAction
              disabled
              :rightActions="[{ text: '删除', bgColor: '#ee0a24' }]"
            >
              <view class="px-4 py-4 bg-white">
                <text class="text-sm text-gray-400">禁用状态，无法滑动</text>
              </view>
            </C_SwipeAction>
          </view>
        </view>
      </view>

      <!-- 操作结果 -->
      <view
        v-if="actionText"
        class="mt-6 bg-white rounded-lg shadow-md p-4 text-center"
      >
        <text class="text-sm text-blue-500">点击了：{{ actionText }}</text>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="滑动交互，操作便捷"
          subtitle="右滑删除 · 左右操作 · 列表场景 · 禁用状态"
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

  const actionText = ref('')
  const listItems = [
    { name: '张三', avatar: '张', msg: '你好，在吗？', color: 'bg-blue-500' },
    {
      name: '李四',
      avatar: '李',
      msg: '项目进展如何？',
      color: 'bg-green-500',
    },
    { name: '王五', avatar: '王', msg: '明天开会', color: 'bg-purple-500' },
  ]

  /**
   *
   */
  function onAction(action: { text: string }) {
    actionText.value = action.text
    setTimeout(() => {
      actionText.value = ''
    }, 2000)
  }
</script>
