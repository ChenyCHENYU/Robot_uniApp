<!--
 * @Description: 搜索结果页 - 全局搜索结果展示
-->
<template>
  <C_Layout>
    <view class="search-result-page"
      ><view class="page-heading"
        ><text class="page-eyebrow">WORKSPACE</text
        ><text class="page-title">发现与搜索</text
        ><text class="page-description"
          >查找业务页面、组件与使用文档</text
        ></view
      >
      <!-- 搜索框 -->
      <view class="search-header">
        <view class="search-bar">
          <wd-icon
            name="search"
            size="16px"
            color="#999"
          />
          <input
            v-model="keyword"
            placeholder="搜索..."
            class="search-input"
            confirm-type="search"
            @confirm="handleSearch"
          />
          <view
            v-if="keyword"
            class="clear-btn"
            @click="clearKeyword"
          >
            <wd-icon
              name="close"
              size="14px"
              color="#ccc"
            />
          </view> </view
        ><button
          class="search-submit"
          @click="handleSearch"
          >搜索</button
        >
      </view>

      <!-- 搜索历史 -->
      <view
        v-if="!keyword && !hasSearched"
        class="history-section"
      >
        <view class="section-header">
          <text class="section-title">搜索历史</text>
          <text
            class="section-action"
            @click="clearHistory"
            >清除</text
          >
        </view>
        <text
          v-if="searchHistory.length === 0"
          class="section-empty"
          >暂无搜索历史</text
        ><view class="history-tags">
          <view
            v-for="item in searchHistory"
            :key="item"
            class="history-tag"
            @click="quickSearch(item)"
          >
            <text class="tag-text">{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 热门搜索 -->
      <view
        v-if="!keyword && !hasSearched"
        class="hot-section"
      >
        <view class="section-header">
          <text class="section-title">热门搜索</text>
        </view>
        <view class="hot-list">
          <view
            v-for="(item, index) in hotSearches"
            :key="item"
            class="hot-item"
            @click="quickSearch(item)"
          >
            <text
              class="hot-rank"
              :class="{ top: index < 3 }"
              >{{ index + 1 }}</text
            >
            <text class="hot-text">{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 搜索结果分类 -->
      <view
        v-if="hasSearched"
        class="result-tabs"
      >
        <view
          v-for="tab in resultTabs"
          :key="tab.key"
          class="result-tab"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <text class="tab-text">{{ tab.label }}</text>
          <text
            v-if="tab.count > 0"
            class="tab-count"
            >{{ tab.count }}</text
          >
        </view>
      </view>

      <!-- 搜索结果列表 -->
      <view
        v-if="hasSearched"
        class="result-list"
      >
        <view
          v-for="item in currentResults"
          :key="item.id"
          class="result-item"
          @click="handleResultClick(item)"
        >
          <view class="result-icon">
            <C_Icon
              :name="item.icon"
              :size="22"
              color="var(--r-color-primary)"
            />
          </view>
          <view class="result-content">
            <text class="result-title">{{ item.title }}</text>
            <text class="result-desc">{{ item.desc }}</text>
            <text class="result-extra">{{ item.extra }}</text>
          </view>
          <wd-icon
            name="arrow-right"
            size="14px"
            color="#ccc"
          />
        </view>
      </view>

      <!-- 空结果 -->
      <view
        v-if="hasSearched && currentResults.length === 0"
        class="empty-state"
      >
        <wd-icon
          name="search"
          size="64px"
          color="#ddd"
        />
        <text class="empty-text">未找到相关结果</text>
        <text class="empty-desc">换个关键词试试</text>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { useSearchResultPage } from './data'

  const {
    keyword,
    hasSearched,
    activeTab,
    searchHistory,
    hotSearches,
    resultTabs,
    currentResults,
    handleSearch,
    clearKeyword,
    clearHistory,
    quickSearch,
    handleResultClick,
  } = useSearchResultPage()
</script>

<style lang="scss" scoped src="./index.scss"></style>
