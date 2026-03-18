<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Divider 分割线"
          subtitle="内容分隔展示组件"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-minus"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 基础分割线 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="基础用法"
            subtitle="默认实线分割"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-format-horizontal-align-center"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <text class="text-sm text-gray-600 block">上方内容区域</text>
            <C_Divider />
            <text class="text-sm text-gray-600 block">下方内容区域</text>
          </view>
        </view>

        <!-- 带文字 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="展示文字"
            subtitle="text & contentPosition"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-text"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <C_Divider text="居中文字" />
            <C_Divider
              text="左侧文字"
              contentPosition="left"
            />
            <C_Divider
              text="右侧文字"
              contentPosition="right"
            />
          </view>
        </view>

        <!-- 虚线 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="虚线样式"
            subtitle="dashed 属性"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-dots-horizontal"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <C_Divider dashed />
            <C_Divider
              dashed
              text="虚线分割"
            />
          </view>
        </view>

        <!-- 自定义颜色 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="自定义颜色"
            subtitle="color 属性"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-palette"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <C_Divider
              color="#1989fa"
              text="蓝色分割线"
            />
            <C_Divider
              color="#07c160"
              text="绿色分割线"
            />
            <C_Divider
              color="#ee0a24"
              text="红色分割线"
            />
          </view>
        </view>

        <!-- 细线模式 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="细线模式"
            subtitle="hairline 属性"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-water-minus-outline"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Divider
              hairline
              text="超细分割线"
            />
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="简洁分隔，层次分明"
          subtitle="实线 · 虚线 · 文字 · 位置 · 颜色 · 细线"
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

<script setup lang="ts"></script>
