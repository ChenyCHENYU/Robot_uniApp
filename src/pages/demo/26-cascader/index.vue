<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Cascader 级联选择"
          subtitle="多级联动选择器"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-file-tree-outline"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 地区选择 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="地区选择"
            subtitle="省/市/区 三级联动"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-map-marker"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-blue-500 px-6 py-2.5 rounded-full"
              @click="showArea = true"
            >
              {{ areaText || '请选择地区' }}
            </text>
          </view>
          <C_Cascader
            v-model:visible="showArea"
            :options="areaOptions"
            title="选择地区"
            valueKey="code"
            labelKey="name"
            @confirm="onAreaConfirm"
          />
        </view>

        <!-- 分类选择 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="分类选择"
            subtitle="自定义高亮颜色"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-tag-multiple"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-green-500 px-6 py-2.5 rounded-full"
              @click="showCategory = true"
              >选择分类</text
            >
            <text
              v-if="categoryText"
              class="text-xs text-gray-500 block mt-3"
              >{{ categoryText }}</text
            >
          </view>
          <C_Cascader
            v-model:visible="showCategory"
            :options="categoryOptions"
            title="选择分类"
            activeColor="#07c160"
            @confirm="onCategoryConfirm"
          />
        </view>

        <!-- 应用场景 -->
        <view class="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <C_Title
            title="应用场景"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-lightbulb-outline"
            :show-decoration="true"
          />
          <view class="my-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">📍</text>
              <text class="text-sm font-bold block">地区选择</text>
              <text class="text-xs text-gray-500">省市区联动</text>
            </view>
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">📂</text>
              <text class="text-sm font-bold block">分类导航</text>
              <text class="text-xs text-gray-500">多层级分类</text>
            </view>
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">🏢</text>
              <text class="text-sm font-bold block">组织架构</text>
              <text class="text-xs text-gray-500">部门/组/人</text>
            </view>
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">🔍</text>
              <text class="text-sm font-bold block">搜索过滤</text>
              <text class="text-xs text-gray-500">filterable</text>
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="层级选择，直观高效"
          subtitle="地区 · 分类 · 组织架构 · 搜索过滤"
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
  import pcaData from '@/data/pca-code.json'

  const showArea = ref(false)
  const showCategory = ref(false)
  const areaText = ref('')
  const categoryText = ref('')

  const areaOptions = pcaData

  const categoryOptions = [
    {
      label: '电子产品',
      value: 'electronics',
      children: [
        { label: '手机', value: 'phone' },
        { label: '电脑', value: 'computer' },
        { label: '平板', value: 'tablet' },
      ],
    },
    {
      label: '服装',
      value: 'clothing',
      children: [
        { label: '男装', value: 'men' },
        { label: '女装', value: 'women' },
      ],
    },
  ]

  /**
   *
   */
  function onAreaConfirm(result: { values: string[]; labels: string[] }) {
    areaText.value = result.labels.join(' / ')
  }

  /**
   *
   */
  function onCategoryConfirm(result: { values: string[]; labels: string[] }) {
    categoryText.value = result.labels.join(' > ')
  }
</script>
