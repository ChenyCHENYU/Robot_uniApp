<!--
 * @Description: CRUD列表模板 - 数据管理列表页
-->
<template>
  <C_Layout
    :refresher-enabled="true"
    :refresher-triggered="refreshing"
    @refresh="handleRefresh"
    @reach-bottom="loadList()"
  >
    <view class="crud-page"
      ><view class="page-heading"
        ><text class="page-eyebrow">WORKSPACE</text
        ><text class="page-title">数据管理</text
        ><text class="page-description"
          >快速查询、筛选和维护工作记录</text
        ></view
      >
      <!-- 搜索栏 -->
      <view class="search-bar">
        <view class="search-input-wrap">
          <wd-icon
            name="search"
            size="16px"
            color="#999"
          />
          <input
            v-model="keyword"
            placeholder="搜索数据..."
            class="search-input"
            confirm-type="search"
            @confirm="handleSearch"
          />
          <wd-icon
            v-if="keyword"
            name="close"
            size="14px"
            color="#ccc"
            @click="clearAndSearch"
          />
        </view>
        <view
          class="filter-btn"
          @click="showFilter = !showFilter"
        >
          <wd-icon
            name="filter"
            size="18px"
            :color="
              hasFilter ? 'var(--r-color-primary)' : 'var(--r-text-secondary)'
            "
          />
        </view>
      </view>

      <!-- 筛选面板 -->
      <view
        v-if="showFilter"
        class="filter-panel"
      >
        <view class="filter-row">
          <text class="filter-label">状态</text>
          <view class="filter-tags">
            <view
              v-for="s in statusOptions"
              :key="s.value"
              class="filter-tag"
              :class="{ active: filterStatus === s.value }"
              @click="handleFilterSelect(s.value)"
            >
              <text class="tag-text">{{ s.label }}</text>
            </view>
          </view>
        </view>
        <view class="filter-row">
          <text class="filter-label">排序</text>
          <view class="filter-tags">
            <view
              v-for="s in sortOptions"
              :key="s.value"
              class="filter-tag"
              :class="{ active: sortBy === s.value }"
              @click="sortBy = s.value"
            >
              <text class="tag-text">{{ s.label }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 操作栏 -->
      <view class="action-bar">
        <view class="action-left">
          <text class="total-text">共 {{ total }} 条</text>
        </view>
        <view class="action-right">
          <view
            class="add-btn"
            @click="handleAdd"
          >
            <wd-icon
              name="add"
              size="16px"
              color="#fff"
            />
            <text class="add-text">新增</text>
          </view>
        </view>
      </view>

      <!-- 首刷骨架屏 -->
      <C_Skeleton
        v-if="loading && dataList.length === 0"
        :rows="4"
      />

      <!-- 数据列表 -->
      <view class="data-list">
        <view
          v-for="item in sortedList"
          :key="item.id"
          class="data-card"
          @click="handleDetail(item)"
        >
          <view class="card-header">
            <text class="card-title">{{ item.title }}</text>
            <view
              class="status-badge"
              :class="item.status === 0 ? 'pending' : 'done'"
            >
              <text class="status-text">{{ getStatusText(item.status) }}</text>
            </view>
          </view>
          <text class="card-desc">{{ item.description }}</text>
          <view class="card-footer">
            <text class="card-time">{{ item.createTime }}</text>
            <view class="card-actions">
              <view
                class="card-action"
                @click.stop="handleEdit(item)"
              >
                <wd-icon
                  name="edit-outline"
                  size="14px"
                  color="var(--r-color-primary)"
                />
                <text>编辑</text>
              </view>
              <view
                class="card-action"
                @click.stop="handleDelete(item)"
              >
                <wd-icon
                  name="delete"
                  size="14px"
                  color="var(--r-color-error)"
                /><text>删除</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view
        v-if="dataList.length === 0 && !loading"
        class="empty-state"
      >
        <wd-icon
          name="search"
          size="64px"
          color="#ddd"
        />
        <text class="empty-text">{{ errorText || '暂无匹配的记录' }}</text
        ><button
          class="retry-btn"
          @click="handleSearch"
          >重新查询</button
        >
      </view>

      <!-- 加载更多 -->
      <view
        v-if="dataList.length > 0"
        class="load-more"
        @click="loadList()"
      >
        <text class="load-more-text">{{
          loading ? '加载中...' : finished ? '没有更多了' : '点击加载更多'
        }}</text>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { useCrudListPage } from './data'

  const {
    getStatusText,
    keyword,
    showFilter,
    filterStatus,
    sortBy,
    statusOptions,
    sortOptions,
    hasFilter,
    sortedList,
    dataList,
    total,
    loading,
    errorText,
    finished,
    loadList,
    handleSearch,
    clearAndSearch,
    handleFilterSelect,
    handleAdd,
    handleDetail,
    handleEdit,
    handleDelete,
    refreshing,
    handleRefresh,
  } = useCrudListPage()
</script>

<style lang="scss" scoped src="./index.scss"></style>
