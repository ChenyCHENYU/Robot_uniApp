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
            :visible="showArea"
            :options="areaOptions"
            title="选择地区"
            @confirm="onAreaConfirm"
            @close="showArea = false"
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
            :visible="showCategory"
            :options="categoryOptions"
            title="选择分类"
            activeColor="#07c160"
            @confirm="onCategoryConfirm"
            @close="showCategory = false"
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

  const showArea = ref(false)
  const showCategory = ref(false)
  const areaText = ref('')
  const categoryText = ref('')

  const areaOptions = [
    {
      text: '北京市',
      value: '110000',
      children: [
        { text: '朝阳区', value: '110105' },
        { text: '海淀区', value: '110108' },
        { text: '西城区', value: '110102' },
      ],
    },
    {
      text: '上海市',
      value: '310000',
      children: [
        { text: '浦东新区', value: '310115' },
        { text: '徐汇区', value: '310104' },
      ],
    },
    {
      text: '广东省',
      value: '440000',
      children: [
        {
          text: '广州市',
          value: '440100',
          children: [
            { text: '天河区', value: '440106' },
            { text: '越秀区', value: '440104' },
          ],
        },
        {
          text: '深圳市',
          value: '440300',
          children: [
            { text: '南山区', value: '440305' },
            { text: '福田区', value: '440304' },
          ],
        },
      ],
    },
  ]

  const categoryOptions = [
    {
      text: '电子产品',
      value: 'electronics',
      children: [
        { text: '手机', value: 'phone' },
        { text: '电脑', value: 'computer' },
        { text: '平板', value: 'tablet' },
      ],
    },
    {
      text: '服装',
      value: 'clothing',
      children: [
        { text: '男装', value: 'men' },
        { text: '女装', value: 'women' },
      ],
    },
  ]

  /**
   *
   */
  function onAreaConfirm(values: { selectedOptions: { text: string }[] }) {
    areaText.value = values.selectedOptions.map(o => o.text).join(' / ')
    showArea.value = false
  }

  /**
   *
   */
  function onCategoryConfirm(values: { selectedOptions: { text: string }[] }) {
    categoryText.value = values.selectedOptions.map(o => o.text).join(' > ')
    showCategory.value = false
  }
</script>
