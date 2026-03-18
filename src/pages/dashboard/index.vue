<!--
 * @Description: 数据看板模板页 - 数据分析展示
-->
<template>
  <C_Layout>
    <view class="dashboard-page">
      <!-- 顶部概览 -->
      <view class="overview-header">
        <view class="greeting">
          <text class="greeting-text">数据概览</text>
          <text class="greeting-date">{{ today }}</text>
        </view>
        <view class="period-tabs">
          <view
            v-for="p in periods"
            :key="p.value"
            class="period-tab"
            :class="{ active: period === p.value }"
            @click="period = p.value"
          >
            <text class="tab-text">{{ p.label }}</text>
          </view>
        </view>
      </view>

      <!-- 核心指标卡片 -->
      <view class="kpi-grid">
        <view
          v-for="kpi in kpiCards"
          :key="kpi.label"
          class="kpi-card"
          :style="{ background: kpi.bg }"
        >
          <view class="kpi-icon">
            <text>{{ kpi.icon }}</text>
          </view>
          <text class="kpi-value">{{ kpi.value }}</text>
          <text class="kpi-label">{{ kpi.label }}</text>
          <view
            class="kpi-trend"
            :class="kpi.trend > 0 ? 'up' : 'down'"
          >
            <text class="trend-text"
              >{{ kpi.trend > 0 ? '+' : '' }}{{ kpi.trend }}%</text
            >
          </view>
        </view>
      </view>

      <!-- 趋势图（模拟柱形图） -->
      <view class="chart-card">
        <view class="chart-header">
          <text class="chart-title">访问趋势</text>
          <text class="chart-subtitle">近7天数据</text>
        </view>
        <view class="bar-chart">
          <view
            v-for="bar in chartData"
            :key="bar.label"
            class="bar-item"
          >
            <view class="bar-track">
              <view
                class="bar-fill"
                :style="{ height: bar.percent + '%' }"
              ></view>
            </view>
            <text class="bar-label">{{ bar.label }}</text>
          </view>
        </view>
      </view>

      <!-- 数据排行 -->
      <view class="rank-card">
        <view class="chart-header">
          <text class="chart-title">模块访问排行</text>
        </view>
        <view class="rank-list">
          <view
            v-for="(item, index) in rankList"
            :key="item.name"
            class="rank-item"
          >
            <text
              class="rank-num"
              :class="{ top: index < 3 }"
              >{{ index + 1 }}</text
            >
            <text class="rank-name">{{ item.name }}</text>
            <view class="rank-bar-wrap">
              <view
                class="rank-bar"
                :style="{ width: item.percent + '%' }"
              ></view>
            </view>
            <text class="rank-value">{{ item.value }}</text>
          </view>
        </view>
      </view>

      <!-- 快捷操作 -->
      <view class="quick-actions">
        <text class="actions-title">快捷操作</text>
        <view class="actions-grid">
          <view
            v-for="action in quickActions"
            :key="action.label"
            class="action-item"
            @click="handleAction(action)"
          >
            <view
              class="action-icon"
              :style="{ background: action.bg }"
            >
              <text class="icon-text">{{ action.icon }}</text>
            </view>
            <text class="action-label">{{ action.label }}</text>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const today = new Date().toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
  const period = ref('week')

  const periods = [
    { label: '日', value: 'day' },
    { label: '周', value: 'week' },
    { label: '月', value: 'month' },
  ]

  const kpiCards = ref([
    {
      label: '活跃用户',
      value: '12,486',
      icon: '👥',
      trend: 12.5,
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      label: '总访问量',
      value: '86,429',
      icon: '📊',
      trend: 8.3,
      bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      label: '新增用户',
      value: '1,253',
      icon: '🆕',
      trend: -2.1,
      bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      label: '转化率',
      value: '23.8%',
      icon: '🎯',
      trend: 5.7,
      bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
  ])

  const chartData = ref([
    { label: '周一', value: 320, percent: 64 },
    { label: '周二', value: 450, percent: 90 },
    { label: '周三', value: 380, percent: 76 },
    { label: '周四', value: 500, percent: 100 },
    { label: '周五', value: 420, percent: 84 },
    { label: '周六', value: 280, percent: 56 },
    { label: '周日', value: 350, percent: 70 },
  ])

  const rankList = ref([
    { name: '首页', value: '23,486', percent: 100 },
    { name: '消息中心', value: '18,232', percent: 78 },
    { name: '个人中心', value: '15,108', percent: 64 },
    { name: '组件库', value: '12,467', percent: 53 },
    { name: '设置页', value: '8,921', percent: 38 },
  ])

  const quickActions = ref([
    {
      label: '导出报告',
      icon: '📋',
      bg: 'linear-gradient(135deg, #667eea, #764ba2)',
    },
    {
      label: '用户分析',
      icon: '👤',
      bg: 'linear-gradient(135deg, #f093fb, #f5576c)',
    },
    {
      label: '系统日志',
      icon: '📝',
      bg: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    },
    {
      label: '性能监控',
      icon: '⚡',
      bg: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    },
  ])

  const handleAction = (action: { label: string }) => {
    uni.showToast({ title: action.label, icon: 'none' })
  }
</script>

<style lang="scss" scoped>
  .dashboard-page {
    padding: 24rpx;
    background: var(--r-bg-page);
    min-height: 100vh;
  }

  .overview-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 24rpx;
    padding: 8rpx;

    .greeting-text {
      display: block;
      font-size: 36rpx;
      font-weight: 700;
      color: var(--r-text-primary);
    }

    .greeting-date {
      font-size: 24rpx;
      color: var(--r-text-secondary);
    }

    .period-tabs {
      display: flex;
      gap: 4rpx;
      background: var(--r-bg-card);
      padding: 4rpx;
      border-radius: 12rpx;

      .period-tab {
        padding: 8rpx 20rpx;
        border-radius: 8rpx;

        &.active {
          background: #667eea;
          .tab-text {
            color: #fff;
          }
        }

        .tab-text {
          font-size: 22rpx;
          color: var(--r-text-secondary);
        }
      }
    }
  }

  .kpi-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16rpx;
    margin-bottom: 24rpx;

    .kpi-card {
      padding: 24rpx;
      border-radius: 20rpx;
      position: relative;
      overflow: hidden;

      .kpi-icon {
        font-size: 36rpx;
        margin-bottom: 12rpx;
      }

      .kpi-value {
        display: block;
        font-size: 36rpx;
        font-weight: 700;
        color: #fff;
      }

      .kpi-label {
        display: block;
        font-size: 22rpx;
        color: rgba(255, 255, 255, 0.8);
        margin-top: 4rpx;
      }

      .kpi-trend {
        position: absolute;
        top: 24rpx;
        right: 24rpx;
        padding: 4rpx 12rpx;
        border-radius: 8rpx;

        &.up {
          background: rgba(255, 255, 255, 0.2);
        }
        &.down {
          background: rgba(245, 108, 108, 0.3);
        }

        .trend-text {
          font-size: 20rpx;
          color: #fff;
          font-weight: 600;
        }
      }
    }
  }

  .chart-card,
  .rank-card {
    padding: 28rpx;
    background: var(--r-bg-card);
    border-radius: 20rpx;
    box-shadow: var(--r-shadow-sm);
    margin-bottom: 24rpx;

    .chart-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 24rpx;

      .chart-title {
        font-size: 30rpx;
        font-weight: 600;
        color: var(--r-text-primary);
      }

      .chart-subtitle {
        font-size: 22rpx;
        color: var(--r-text-secondary);
      }
    }
  }

  .bar-chart {
    display: flex;
    align-items: flex-end;
    gap: 16rpx;
    height: 280rpx;

    .bar-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;

      .bar-track {
        flex: 1;
        width: 100%;
        display: flex;
        align-items: flex-end;

        .bar-fill {
          width: 100%;
          background: linear-gradient(180deg, #667eea, #764ba2);
          border-radius: 8rpx 8rpx 0 0;
          min-height: 8rpx;
          transition: height 0.5s ease;
        }
      }

      .bar-label {
        font-size: 20rpx;
        color: var(--r-text-placeholder);
        margin-top: 8rpx;
      }
    }
  }

  .rank-list {
    .rank-item {
      display: flex;
      align-items: center;
      gap: 16rpx;
      padding: 14rpx 0;

      .rank-num {
        width: 40rpx;
        font-size: 24rpx;
        font-weight: 700;
        color: var(--r-text-placeholder);
        text-align: center;

        &.top {
          color: #667eea;
        }
      }

      .rank-name {
        width: 140rpx;
        font-size: 26rpx;
        color: var(--r-text-primary);
      }

      .rank-bar-wrap {
        flex: 1;
        height: 12rpx;
        background: var(--r-bg-page);
        border-radius: 6rpx;
        overflow: hidden;

        .rank-bar {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 6rpx;
          transition: width 0.5s ease;
        }
      }

      .rank-value {
        width: 120rpx;
        text-align: right;
        font-size: 24rpx;
        color: var(--r-text-secondary);
        font-weight: 500;
      }
    }
  }

  .quick-actions {
    margin-bottom: 24rpx;

    .actions-title {
      display: block;
      font-size: 30rpx;
      font-weight: 600;
      color: var(--r-text-primary);
      margin-bottom: 16rpx;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16rpx;

      .action-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10rpx;
        padding: 24rpx 0;
        background: var(--r-bg-card);
        border-radius: 16rpx;
        box-shadow: var(--r-shadow-sm);

        .action-icon {
          width: 72rpx;
          height: 72rpx;
          border-radius: 18rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          .icon-text {
            font-size: 32rpx;
          }
        }

        .action-label {
          font-size: 22rpx;
          color: var(--r-text-secondary);
        }
      }
    }
  }
</style>
