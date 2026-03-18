<!--
 * @Description: 搜索结果页 - 全局搜索结果展示
-->
<template>
  <C_Layout>
    <view class="search-result-page">
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
            :focus="true"
            confirm-type="search"
            @confirm="handleSearch"
          />
          <view
            v-if="keyword"
            class="clear-btn"
            @click="keyword = ''"
          >
            <wd-icon
              name="close"
              size="14px"
              color="#ccc"
            />
          </view>
        </view>
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
        <view class="history-tags">
          <view
            v-for="item in searchHistory"
            :key="item"
            class="history-tag"
            @click="
              keyword = item
              handleSearch()
            "
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
            @click="
              keyword = item
              handleSearch()
            "
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
          <view
            class="result-icon"
            :style="{ background: item.iconBg }"
          >
            <text class="icon-text">{{ item.icon }}</text>
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
  import { ref, computed } from 'vue'

  const keyword = ref('')
  const hasSearched = ref(false)
  const activeTab = ref('all')

  const searchHistory = ref(['表单组件', '数据看板', 'UniApp', '虚拟滚动'])

  const hotSearches = ref([
    'Robot框架',
    '跨平台开发',
    '组件库',
    'Vue3',
    'TypeScript',
    '小程序',
    'H5适配',
    '状态管理',
  ])

  interface SearchResult {
    id: number
    title: string
    desc: string
    extra: string
    icon: string
    iconBg: string
    type: string
  }

  const allResults = ref<SearchResult[]>([
    {
      id: 1,
      title: '表单模板',
      desc: '复杂表单提交模板页面',
      extra: '业务模板',
      icon: '📝',
      iconBg: 'linear-gradient(135deg, #667eea, #764ba2)',
      type: 'page',
    },
    {
      id: 2,
      title: '数据看板',
      desc: '数据分析可视化看板',
      extra: '业务模板',
      icon: '📊',
      iconBg: 'linear-gradient(135deg, #f093fb, #f5576c)',
      type: 'page',
    },
    {
      id: 3,
      title: 'C_Form 表单组件',
      desc: '支持多种表单控件和校验',
      extra: '组件',
      icon: '🧩',
      iconBg: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      type: 'component',
    },
    {
      id: 4,
      title: 'C_List 列表组件',
      desc: '高性能列表，支持虚拟滚动',
      extra: '组件',
      icon: '📋',
      iconBg: 'linear-gradient(135deg, #43e97b, #38f9d7)',
      type: 'component',
    },
    {
      id: 5,
      title: '使用文档',
      desc: '框架使用指南和API文档',
      extra: '文档',
      icon: '📖',
      iconBg: 'linear-gradient(135deg, #fa709a, #fee140)',
      type: 'doc',
    },
  ])

  const resultTabs = computed(() => [
    { key: 'all', label: '全部', count: allResults.value.length },
    {
      key: 'page',
      label: '页面',
      count: allResults.value.filter(i => i.type === 'page').length,
    },
    {
      key: 'component',
      label: '组件',
      count: allResults.value.filter(i => i.type === 'component').length,
    },
    {
      key: 'doc',
      label: '文档',
      count: allResults.value.filter(i => i.type === 'doc').length,
    },
  ])

  const currentResults = computed(() => {
    if (activeTab.value === 'all') return allResults.value
    return allResults.value.filter(i => i.type === activeTab.value)
  })

  const handleSearch = () => {
    if (keyword.value.trim()) {
      hasSearched.value = true
      if (!searchHistory.value.includes(keyword.value)) {
        searchHistory.value.unshift(keyword.value)
        if (searchHistory.value.length > 10) searchHistory.value.pop()
      }
    }
  }

  const clearHistory = () => {
    searchHistory.value = []
  }

  const handleResultClick = (item: SearchResult) => {
    uni.showToast({ title: `打开: ${item.title}`, icon: 'none' })
  }
</script>

<style lang="scss" scoped>
  .search-result-page {
    padding: 24rpx;
    background: var(--r-bg-page);
    min-height: 100vh;
  }

  .search-header {
    margin-bottom: 24rpx;

    .search-bar {
      display: flex;
      align-items: center;
      gap: 12rpx;
      padding: 0 24rpx;
      height: 84rpx;
      background: var(--r-bg-card);
      border-radius: 16rpx;
      box-shadow: var(--r-shadow-sm);

      .search-input {
        flex: 1;
        font-size: 28rpx;
        color: var(--r-text-primary);
      }

      .clear-btn {
        padding: 8rpx;
      }
    }
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;

    .section-title {
      font-size: 28rpx;
      font-weight: 600;
      color: var(--r-text-primary);
    }

    .section-action {
      font-size: 24rpx;
      color: var(--r-text-secondary);
    }
  }

  .history-section {
    margin-bottom: 32rpx;

    .history-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 12rpx;

      .history-tag {
        padding: 10rpx 24rpx;
        background: var(--r-bg-card);
        border-radius: 24rpx;

        .tag-text {
          font-size: 24rpx;
          color: var(--r-text-secondary);
        }
      }
    }
  }

  .hot-section {
    .hot-list {
      .hot-item {
        display: flex;
        align-items: center;
        gap: 16rpx;
        padding: 20rpx 0;
        border-bottom: 1rpx solid var(--r-border-light);

        &:last-child {
          border-bottom: none;
        }

        .hot-rank {
          width: 40rpx;
          font-size: 28rpx;
          font-weight: 700;
          color: var(--r-text-placeholder);
          text-align: center;

          &.top {
            color: #f56c6c;
          }
        }

        .hot-text {
          font-size: 28rpx;
          color: var(--r-text-primary);
        }
      }
    }
  }

  .result-tabs {
    display: flex;
    gap: 8rpx;
    margin-bottom: 24rpx;
    padding-bottom: 16rpx;
    border-bottom: 1rpx solid var(--r-border-light);

    .result-tab {
      display: flex;
      align-items: center;
      gap: 6rpx;
      padding: 10rpx 24rpx;
      border-radius: 24rpx;
      background: var(--r-bg-card);

      &.active {
        background: rgba(102, 126, 234, 0.1);

        .tab-text {
          color: #667eea;
          font-weight: 600;
        }
        .tab-count {
          color: #667eea;
        }
      }

      .tab-text {
        font-size: 24rpx;
        color: var(--r-text-secondary);
      }

      .tab-count {
        font-size: 20rpx;
        color: var(--r-text-placeholder);
      }
    }
  }

  .result-list {
    .result-item {
      display: flex;
      align-items: center;
      gap: 16rpx;
      padding: 24rpx;
      background: var(--r-bg-card);
      border-radius: 16rpx;
      margin-bottom: 12rpx;
      box-shadow: var(--r-shadow-sm);

      .result-icon {
        width: 72rpx;
        height: 72rpx;
        border-radius: 18rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        .icon-text {
          font-size: 30rpx;
        }
      }

      .result-content {
        flex: 1;
        overflow: hidden;

        .result-title {
          display: block;
          font-size: 28rpx;
          font-weight: 600;
          color: var(--r-text-primary);
        }

        .result-desc {
          display: block;
          font-size: 24rpx;
          color: var(--r-text-secondary);
          margin-top: 4rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .result-extra {
          font-size: 22rpx;
          color: var(--r-text-placeholder);
          margin-top: 4rpx;
        }
      }
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 120rpx 0;

    .empty-text {
      font-size: 28rpx;
      color: var(--r-text-placeholder);
      margin-top: 20rpx;
    }

    .empty-desc {
      font-size: 24rpx;
      color: var(--r-text-placeholder);
      margin-top: 8rpx;
    }
  }
</style>
