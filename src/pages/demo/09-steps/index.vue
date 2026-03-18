<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Steps 步骤条"
          subtitle="引导用户按步骤完成任务"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-shoe-print"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 基础用法 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础步骤条"
            subtitle="水平方向三步骤"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-ray-start-arrow"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Steps
              :current="currentStep"
              :steps="steps"
            />
          </view>
          <view class="flex justify-center gap-4 mt-4">
            <view
              class="px-4 py-2 bg-gray-200 rounded-lg text-sm"
              @click="currentStep > 0 && currentStep--"
            >
              <text>上一步</text>
            </view>
            <view
              class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
              @click="currentStep < 2 && currentStep++"
            >
              <text>下一步</text>
            </view>
          </view>
          <view class="text-center mt-3">
            <text class="text-xs text-gray-400"
              >当前步骤：{{ currentStep + 1 }} / {{ steps.length }}</text
            >
          </view>
        </view>

        <!-- 竖向步骤条 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="竖向步骤条"
            subtitle="direction=vertical"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-arrow-down-bold"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Steps
              :current="1"
              direction="vertical"
              :steps="verticalSteps"
            />
          </view>
        </view>

        <!-- 自定义颜色 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="自定义颜色"
            subtitle="activeColor 属性"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-palette"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg space-y-6">
            <C_Steps
              :current="1"
              :steps="steps"
              activeColor="#67c23a"
            />
            <C_Steps
              :current="2"
              :steps="steps"
              activeColor="#e6a23c"
            />
            <C_Steps
              :current="2"
              :steps="steps"
              activeColor="#f56c6c"
            />
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="步步清晰，流程可控"
          subtitle="水平 · 竖向 · 自定义颜色 · 交互式"
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
  const currentStep = ref(1)
  const steps = [
    { title: '填写信息', description: '基本资料' },
    { title: '身份验证', description: '实名认证' },
    { title: '完成注册', description: '开始使用' },
  ]
  const verticalSteps = [
    { title: '提交申请', description: '2026-03-15 10:00' },
    { title: '审核中', description: '预计 1-3 个工作日' },
    { title: '审核完成', description: '等待处理' },
    { title: '已发放', description: '等待完成' },
  ]
</script>
