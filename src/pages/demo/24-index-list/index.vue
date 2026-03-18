<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_IndexList 索引列表"
          subtitle="通讯录样式快速导航"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-format-list-group"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 gap-6">
        <!-- 通讯录 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="通讯录列表"
            subtitle="右侧字母快速定位"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-account-box-multiple"
            :show-decoration="true"
          />
          <view
            class="my-6 bg-gray-50 rounded-lg overflow-hidden"
            style="height: 400px"
          >
            <C_IndexList :list="contactList" />
          </view>
        </view>

        <!-- 自定义高亮色 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="自定义高亮色"
            subtitle="activeColor 属性"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-palette"
            :show-decoration="true"
          />
          <view
            class="my-6 bg-gray-50 rounded-lg overflow-hidden"
            style="height: 250px"
          >
            <C_IndexList
              :list="techList"
              activeColor="#ee0a24"
            />
          </view>
        </view>

        <!-- 特性说明 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="组件特点"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-star-outline"
            :show-decoration="true"
          />
          <view class="my-6 grid grid-cols-3 gap-4">
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">📇</text>
              <text class="text-sm font-bold block">字母索引</text>
              <text class="text-xs text-gray-500">A-Z 快速定位</text>
            </view>
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">📌</text>
              <text class="text-sm font-bold block">吸顶分组</text>
              <text class="text-xs text-gray-500">sticky 标题</text>
            </view>
            <view class="p-4 bg-gray-50 rounded-lg text-center">
              <text class="text-2xl block mb-2">🎨</text>
              <text class="text-sm font-bold block">自定义色</text>
              <text class="text-xs text-gray-500">自由配色</text>
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="快速检索，一触即达"
          subtitle="字母导航 · 吸顶分组 · 自定义颜色"
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
  const contactList = [
    { title: 'A', items: [{ name: '阿里巴巴' }, { name: '安踏' }] },
    {
      title: 'B',
      items: [{ name: '百度' }, { name: '比亚迪' }, { name: '北京银行' }],
    },
    { title: 'C', items: [{ name: '长城汽车' }, { name: '创维' }] },
    { title: 'D', items: [{ name: '大疆' }, { name: '滴滴出行' }] },
    {
      title: 'H',
      items: [{ name: '华为' }, { name: '海尔' }, { name: '好未来' }],
    },
    { title: 'J', items: [{ name: '京东' }, { name: '极氪' }] },
    { title: 'M', items: [{ name: '美团' }, { name: '蚂蚁集团' }] },
    { title: 'T', items: [{ name: '腾讯' }, { name: '头条' }] },
    { title: 'X', items: [{ name: '小米' }, { name: '携程' }] },
    { title: 'Z', items: [{ name: '字节跳动' }, { name: '中兴' }] },
  ]

  const techList = [
    { title: 'A', items: [{ name: 'Apple' }, { name: 'Amazon' }] },
    { title: 'G', items: [{ name: 'Google' }, { name: 'GitHub' }] },
    { title: 'M', items: [{ name: 'Microsoft' }, { name: 'Meta' }] },
    { title: 'T', items: [{ name: 'Tesla' }, { name: 'Twitter' }] },
  ]
</script>
