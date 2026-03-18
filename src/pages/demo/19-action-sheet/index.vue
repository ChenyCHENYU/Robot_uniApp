<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_ActionSheet 操作面板"
          subtitle="底部弹出的操作菜单"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-menu"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 基础用法 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础操作面板"
            subtitle="常用操作选项"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-gesture-tap"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-blue-500 px-6 py-2.5 rounded-full"
              @click="showBasic = true"
              >打开基础面板</text
            >
          </view>
          <C_ActionSheet
            v-model:visible="showBasic"
            :items="basicItems"
            @select="onSelect"
          />
        </view>

        <!-- 带标题 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="带标题面板"
            subtitle="title 属性"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-format-title"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-green-500 px-6 py-2.5 rounded-full"
              @click="showTitle = true"
              >带标题面板</text
            >
          </view>
          <C_ActionSheet
            v-model:visible="showTitle"
            title="请选择分享方式"
            :items="shareItems"
            @select="onSelect"
          />
        </view>

        <!-- 带图标 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="带图标选项"
            subtitle="item.icon 属性"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-emoticon-outline"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-amber-500 px-6 py-2.5 rounded-full"
              @click="showIcon = true"
              >带图标面板</text
            >
          </view>
          <C_ActionSheet
            v-model:visible="showIcon"
            title="文件操作"
            :items="iconItems"
            @select="onSelect"
          />
        </view>

        <!-- 危险操作 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="危险操作"
            subtitle="item.danger 样式"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-alert-outline"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-red-500 px-6 py-2.5 rounded-full"
              @click="showDanger = true"
              >危险操作面板</text
            >
          </view>
          <C_ActionSheet
            v-model:visible="showDanger"
            :items="dangerItems"
            :showCancel="true"
            cancelText="取消"
            @select="onSelect"
          />
        </view>
      </view>

      <!-- 选择结果 -->
      <view
        v-if="selectedAction"
        class="mt-6 bg-white rounded-lg shadow-md p-4"
      >
        <view class="flex items-center gap-2 justify-center">
          <text class="text-blue-500">→</text>
          <text class="text-sm text-gray-600"
            >您选择了：{{ selectedAction }}</text
          >
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="底部弹出，操作便捷"
          subtitle="基础 · 标题 · 图标 · 危险操作 · 取消按钮"
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

  const showBasic = ref(false)
  const showTitle = ref(false)
  const showIcon = ref(false)
  const showDanger = ref(false)
  const selectedAction = ref('')

  const basicItems = [
    { text: '选项一' },
    { text: '选项二' },
    { text: '选项三' },
  ]

  const shareItems = [
    { text: '微信好友', icon: 'i-mdi-wechat' },
    { text: '朋友圈', icon: 'i-mdi-account-group' },
    { text: '复制链接', icon: 'i-mdi-link-variant' },
    { text: '保存图片', icon: 'i-mdi-download' },
  ]

  const iconItems = [
    { text: '编辑', icon: 'i-mdi-pencil' },
    { text: '复制', icon: 'i-mdi-content-copy' },
    { text: '移动', icon: 'i-mdi-folder-move' },
    { text: '重命名', icon: 'i-mdi-rename-box' },
  ]

  const dangerItems = [
    { text: '置顶聊天' },
    { text: '标为已读' },
    { text: '删除聊天', danger: true },
    { text: '举报', danger: true },
  ]

  /**
   *
   */
  function onSelect(item: { text: string }) {
    selectedAction.value = item.text
    setTimeout(() => {
      selectedAction.value = ''
    }, 2000)
  }
</script>
