<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Form 表单"
          subtitle="数据收集与校验"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-form-textbox"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 基础表单 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础表单"
            subtitle="常见输入项组合"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-pencil"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Form
              ref="formRef"
              :model="formData"
              :rules="rules"
            >
              <C_Form
                label="用户名"
                prop="username"
              >
                <input
                  v-model="formData.username"
                  placeholder="请输入用户名"
                  class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </C_Form>
              <C_Form
                label="密码"
                prop="password"
              >
                <input
                  v-model="formData.password"
                  type="password"
                  placeholder="请输入密码"
                  class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </C_Form>
              <C_Form label="备注">
                <textarea
                  v-model="formData.remark"
                  placeholder="请输入备注"
                  class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  style="height: 80px"
                />
              </C_Form>
            </C_Form>
            <view class="flex justify-center gap-3 mt-4">
              <text
                class="text-sm bg-gray-200 text-gray-600 px-5 py-2 rounded-full"
                @click="onReset"
                >重置</text
              >
              <text
                class="text-sm text-white bg-blue-500 px-5 py-2 rounded-full"
                @click="onSubmit"
                >提交校验</text
              >
            </view>
            <view
              v-if="validateResult !== ''"
              class="mt-3 text-center"
            >
              <text
                class="text-sm"
                :class="
                  validateResult === '校验通过'
                    ? 'text-green-500'
                    : 'text-red-500'
                "
                >{{ validateResult }}</text
              >
            </view>
          </view>
        </view>

        <!-- 校验规则 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="表单校验"
            subtitle="必填 / 格式 / 长度"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-check-circle"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg space-y-3">
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-asterisk text-lg text-red-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >必填校验</text
                >
                <text class="text-xs text-gray-500">required: true</text>
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-regex text-lg text-blue-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >正则校验</text
                >
                <text class="text-xs text-gray-500"
                  >pattern: /^[a-zA-Z0-9]+$/</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text class="i-mdi-counter text-lg text-green-500"></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >长度限制</text
                >
                <text class="text-xs text-gray-500">min / max 属性</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 标签位置 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="标签位置"
            subtitle="labelPosition 属性"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-format-horizontal-align-left"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg space-y-3">
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text
                class="i-mdi-format-align-left text-lg text-blue-500"
              ></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >左侧标签（默认）</text
                >
                <text class="text-xs text-gray-500">labelPosition="left"</text>
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-white rounded-lg">
              <text
                class="i-mdi-format-align-center text-lg text-green-500"
              ></text>
              <view>
                <text class="text-sm font-medium text-gray-700 block"
                  >顶部标签</text
                >
                <text class="text-xs text-gray-500">labelPosition="top"</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="灵活采集，安全校验"
          subtitle="表单布局 · 校验规则 · 标签定位"
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

  const formRef = ref()
  const formData = ref({ username: '', password: '', remark: '' })
  const validateResult = ref('')
  const rules = {
    username: [{ required: true, message: '请输入用户名' }],
    password: [{ required: true, message: '请输入密码' }],
  }

  /**
   *
   */
  function onSubmit() {
    const valid = formRef.value?.validate()
    if (valid) {
      validateResult.value = '校验通过'
      uni.showToast({ title: '提交成功', icon: 'success' })
    } else {
      validateResult.value = '校验失败，请检查必填项'
    }
  }

  /**
   *
   */
  function onReset() {
    formData.value = { username: '', password: '', remark: '' }
    formRef.value?.resetValidation()
    validateResult.value = ''
  }
</script>
