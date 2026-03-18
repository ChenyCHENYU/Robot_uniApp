<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Timeline 时间轴"
          subtitle="按时间展示流程记录"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-timeline-outline"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 基础用法 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="物流跟踪"
            subtitle="基础时间轴"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-truck-delivery"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Timeline
              :items="orderItems"
              :current="2"
            />
          </view>
        </view>

        <!-- 自定义颜色 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="审批流程"
            subtitle="自定义节点颜色"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-check-decagram"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Timeline
              :items="approvalItems"
              finishedColor="#07c160"
              pendingColor="#dcdfe6"
            />
          </view>
        </view>

        <!-- 倒序显示 -->
        <view class="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <C_Title
            title="倒序显示"
            subtitle="reverse 属性"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-sort-descending"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <C_Timeline
              :items="orderItems"
              :current="2"
              reverse
            />
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="时间可视，流程清晰"
          subtitle="物流跟踪 · 审批流程 · 倒序显示 · 自定义颜色"
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
  const orderItems = [
    {
      title: '提交订单',
      content: '订单号: 2024010100001',
      time: '2024-01-01 10:00',
    },
    {
      title: '商家接单',
      content: '商家已确认并开始备货',
      time: '2024-01-01 10:15',
    },
    {
      title: '配送中',
      content: '骑手已取货，正在配送',
      time: '2024-01-01 10:45',
    },
    { title: '已送达', content: '请确认收货', time: '2024-01-01 11:20' },
  ]

  const approvalItems = [
    { title: '审批发起', time: '09:00', color: '#07c160' },
    { title: '部门经理审批', time: '10:30', color: '#07c160' },
    { title: 'HR审批中', time: '14:00', color: '#ff976a' },
    { title: '总经理审批', time: '待处理', color: '#dcdfe6' },
  ]
</script>
