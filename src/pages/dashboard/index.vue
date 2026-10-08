<!--
 * @Description: 数据看板模板页 - 数据分析展示
-->
<template>
  <C_Layout
    :refresher-enabled="true"
    :refresher-triggered="refreshing"
    @refresh="handleRefresh"
  >
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
            @click="handlePeriodChange(p)"
          >
            <text class="tab-text">{{ p.label }}</text>
          </view>
        </view>
      </view>

      <view class="refresh-row"
        ><text>{{ loading ? '正在更新数据…' : '核心指标与访问趋势' }}</text
        ><button
          class="refresh-btn"
          :disabled="loading"
          @click="loadData"
          >刷新</button
        ></view
      >
      <!-- 核心指标卡片 -->
      <C_Skeleton
        v-if="statsLoading && kpiCards.length === 0"
        :rows="3"
      /><view
        v-if="!statsLoading && kpiCards.length === 0"
        class="empty-panel"
        ><text>暂无指标数据</text
        ><button
          class="retry-btn"
          @click="loadData"
          >重新加载</button
        ></view
      ><view class="kpi-grid">
        <view
          v-for="kpi in kpiCards"
          :key="kpi.label"
          class="kpi-card"
        >
          <view class="kpi-icon">
            <C_Icon
              :name="kpiIcons[kpi.label]"
              :size="24"
              color="var(--r-color-primary)"
            />
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
          <text class="chart-subtitle">{{ chartSubtitle }}</text>
        </view>
        <text
          v-if="chartData.length === 0"
          class="section-empty"
          >{{ loading ? '正在加载趋势…' : '暂无趋势数据' }}</text
        ><view class="bar-chart">
          <view
            v-for="bar in chartData"
            :key="bar.label"
            class="bar-item"
          >
            <text class="bar-value">{{ bar.value }}</text
            ><view class="bar-track">
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
          <text class="chart-title">访问量排行</text>
        </view>
        <text
          v-if="rankList.length === 0"
          class="section-empty"
          >暂无排行数据</text
        ><view class="rank-list">
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
            <view class="action-icon">
              <C_Icon
                :name="action.icon"
                :size="22"
                color="var(--r-color-primary)"
              />
            </view>
            <text class="action-label">{{ action.label }}</text>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { useDashboardPage } from './data'

  const {
    today,
    period,
    periods,
    kpiCards,
    chartData,
    rankList,
    statsLoading,
    loading,
    chartSubtitle,
    kpiIcons,
    loadData,
    handlePeriodChange,
    quickActions,
    handleAction,
    refreshing,
    handleRefresh,
  } = useDashboardPage()
</script>

<style lang="scss" scoped src="./index.scss"></style>
