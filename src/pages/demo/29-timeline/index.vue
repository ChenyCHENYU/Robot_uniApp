<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Timeline 时间轴</text>
        <text class="demo-subtitle">按时间顺序展示活动记录或流程节点</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <C_Timeline
            :items="basicItems"
            :current="2"
          />
          <view class="code-block">
            &lt;C_Timeline :items="items" :current="2" /&gt;
          </view>
        </view>
      </view>

      <!-- 自定义颜色 -->
      <view class="demo-section">
        <text class="section-title">自定义颜色</text>
        <view class="demo-card">
          <C_Timeline
            :items="colorItems"
            finishedColor="#07c160"
            pendingColor="#dcdfe6"
          />
        </view>
      </view>

      <!-- 倒序显示 -->
      <view class="demo-section">
        <text class="section-title">倒序显示</text>
        <view class="demo-card">
          <C_Timeline
            :items="basicItems"
            :current="2"
            reverse
          />
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  const basicItems = [
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

  const colorItems = [
    { title: '审批发起', time: '09:00', color: '#07c160' },
    { title: '部门经理审批', time: '10:30', color: '#07c160' },
    { title: 'HR审批中', time: '14:00', color: '#ff976a' },
    { title: '总经理审批', time: '待处理', color: '#dcdfe6' },
  ]
</script>

<style lang="scss" scoped>
  .demo-page {
    min-height: 100%;
    background: #f5f7fa;
    padding: 24rpx 32rpx;
  }
  .demo-header {
    margin-bottom: 40rpx;
    .demo-title {
      display: block;
      font-size: 44rpx;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8rpx;
    }
    .demo-subtitle {
      display: block;
      font-size: 26rpx;
      color: #666;
    }
  }
  .demo-section {
    margin-bottom: 40rpx;
    .section-title {
      display: block;
      font-size: 30rpx;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 20rpx;
      padding-left: 16rpx;
      border-left: 6rpx solid #667eea;
    }
  }
  .demo-card {
    background: #fff;
    border-radius: 20rpx;
    padding: 32rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    border: 1rpx solid rgba(0, 0, 0, 0.04);
  }
  .code-block {
    background: #f5f5f5;
    border-radius: 8rpx;
    padding: 16rpx 20rpx;
    font-size: 22rpx;
    color: #555;
    font-family: monospace;
    margin-top: 16rpx;
  }
</style>
