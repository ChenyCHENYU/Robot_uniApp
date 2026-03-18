<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Modal 模态框"
          subtitle="信息确认与交互弹窗"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-card-text-outline"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 确认弹窗 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="确认弹窗"
            subtitle="双按钮模式"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-help-circle-outline"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-blue-500 px-6 py-2.5 rounded-full"
              @click="showConfirm = true"
              >打开确认弹窗</text
            >
          </view>
          <C_Modal
            v-model:visible="showConfirm"
            title="确认操作"
            confirmText="确定"
            cancelText="取消"
            :showCancel="true"
            @confirm="onConfirm"
            @cancel="showConfirm = false"
          >
            <text class="text-sm text-gray-600"
              >确定要执行此操作吗？此操作不可撤销。</text
            >
          </C_Modal>
        </view>

        <!-- 提示弹窗 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="提示弹窗"
            subtitle="单按钮模式"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-information-outline"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-green-500 px-6 py-2.5 rounded-full"
              @click="showAlert = true"
              >打开提示弹窗</text
            >
          </view>
          <C_Modal
            v-model:visible="showAlert"
            title="操作成功"
            confirmText="我知道了"
            :showCancel="false"
            @confirm="showAlert = false"
          >
            <text class="text-sm text-gray-600"
              >您的数据已成功保存到服务器。</text
            >
          </C_Modal>
        </view>

        <!-- 自定义内容 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="自定义内容"
            subtitle="丰富的弹窗内容"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-pencil-box-outline"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-amber-500 px-6 py-2.5 rounded-full"
              @click="showCustom = true"
              >自定义内容弹窗</text
            >
          </view>
          <C_Modal
            v-model:visible="showCustom"
            title="系统更新"
            :showCancel="true"
            confirmText="立即更新"
            cancelText="稍后再说"
          >
            <view class="space-y-3">
              <view class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <text class="text-2xl">🚀</text>
                <view>
                  <text class="text-sm font-bold block">v2.0.0 新版本</text>
                  <text class="text-xs text-gray-500">包含多项功能改进</text>
                </view>
              </view>
              <view class="text-sm text-gray-600 space-y-1">
                <text class="block">• 全新界面设计</text>
                <text class="block">• 性能优化提升 50%</text>
                <text class="block">• 修复已知问题</text>
              </view>
            </view>
          </C_Modal>
        </view>

        <!-- 关闭按钮 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="关闭按钮"
            subtitle="showClose 属性"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-close-circle-outline"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-red-500 px-6 py-2.5 rounded-full"
              @click="showClose = true"
              >带关闭按钮</text
            >
          </view>
          <C_Modal
            v-model:visible="showClose"
            title="通知"
            :showClose="true"
            :showCancel="false"
            confirmText="好的"
            @confirm="showClose = false"
          >
            <text class="text-sm text-gray-600"
              >您有一条新的系统通知，请查看并处理。</text
            >
          </C_Modal>
        </view>
      </view>

      <!-- 交互结果 -->
      <view
        v-if="actionResult"
        class="mt-6 bg-white rounded-lg shadow-md p-4"
      >
        <view class="flex items-center gap-2 justify-center">
          <text class="text-green-500">✓</text>
          <text class="text-sm text-gray-600">{{ actionResult }}</text>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="灵活弹窗，交互清晰"
          subtitle="确认 · 提示 · 自定义内容 · 关闭按钮 · 遮罩控制"
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
  const showConfirm = ref(false)
  const showAlert = ref(false)
  const showCustom = ref(false)
  const showClose = ref(false)
  const actionResult = ref('')

  /**
   *
   */
  function onConfirm() {
    showConfirm.value = false
    actionResult.value = '您点击了确认按钮'
    setTimeout(() => {
      actionResult.value = ''
    }, 2000)
  }
</script>
