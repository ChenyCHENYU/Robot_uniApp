<!--
 * @Description: CRUD列表模板 - 数据管理列表页
-->
<template>
  <C_Layout>
    <view class="crud-page">
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
            @click="
              keyword = ''
              handleSearch()
            "
          />
        </view>
        <view
          class="filter-btn"
          @click="showFilter = !showFilter"
        >
          <wd-icon
            name="filter"
            size="18px"
            :color="hasFilter ? '#667eea' : '#666'"
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
              @click="filterStatus = filterStatus === s.value ? '' : s.value"
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
          <text class="total-text">共 {{ filteredList.length }} 条</text>
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

      <!-- 数据列表 -->
      <view class="data-list">
        <view
          v-for="item in filteredList"
          :key="item.id"
          class="data-card"
          @click="handleDetail(item)"
        >
          <view class="card-header">
            <text class="card-title">{{ item.title }}</text>
            <view
              class="status-badge"
              :class="item.status"
            >
              <text class="status-text">{{ statusMap[item.status] }}</text>
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
                  color="#667eea"
                />
              </view>
              <view
                class="card-action"
                @click.stop="handleDelete(item)"
              >
                <wd-icon
                  name="delete"
                  size="14px"
                  color="#f56c6c"
                />
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view
        v-if="filteredList.length === 0"
        class="empty-state"
      >
        <wd-icon
          name="search"
          size="64px"
          color="#ddd"
        />
        <text class="empty-text">暂无数据</text>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'

  const keyword = ref('')
  const showFilter = ref(false)
  const filterStatus = ref('')
  const sortBy = ref('time')

  interface DataItem {
    id: number
    title: string
    description: string
    status: string
    createTime: string
  }

  const statusMap: Record<string, string> = {
    active: '进行中',
    done: '已完成',
    pending: '待处理',
    closed: '已关闭',
  }

  const statusOptions = [
    { label: '全部', value: '' },
    { label: '进行中', value: 'active' },
    { label: '已完成', value: 'done' },
    { label: '待处理', value: 'pending' },
    { label: '已关闭', value: 'closed' },
  ]

  const sortOptions = [
    { label: '时间排序', value: 'time' },
    { label: '名称排序', value: 'name' },
  ]

  const hasFilter = computed(
    () => filterStatus.value !== '' || sortBy.value !== 'time'
  )

  const dataList = ref<DataItem[]>([
    {
      id: 1,
      title: '项目需求评审',
      description: '完成产品需求文档评审，确认功能范围和优先级',
      status: 'active',
      createTime: '2025-01-15',
    },
    {
      id: 2,
      title: 'UI设计稿交付',
      description: '移动端首页和详情页设计稿输出',
      status: 'done',
      createTime: '2025-01-14',
    },
    {
      id: 3,
      title: 'API接口联调',
      description: '完成用户模块和数据模块的接口联调测试',
      status: 'pending',
      createTime: '2025-01-13',
    },
    {
      id: 4,
      title: '性能优化方案',
      description: '首屏加载时间优化至1.5s以内',
      status: 'active',
      createTime: '2025-01-12',
    },
    {
      id: 5,
      title: '旧系统迁移',
      description: 'v1.0数据迁移至新架构，保证数据完整性',
      status: 'closed',
      createTime: '2025-01-10',
    },
    {
      id: 6,
      title: '自动化测试用例',
      description: '编写核心业务模块的E2E测试用例',
      status: 'pending',
      createTime: '2025-01-11',
    },
  ])

  const filteredList = computed(() => {
    let list = dataList.value
    if (keyword.value) {
      const kw = keyword.value.toLowerCase()
      list = list.filter(
        i =>
          i.title.toLowerCase().includes(kw) ||
          i.description.toLowerCase().includes(kw)
      )
    }
    if (filterStatus.value) {
      list = list.filter(i => i.status === filterStatus.value)
    }
    if (sortBy.value === 'name') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    } else {
      list = [...list].sort((a, b) => b.createTime.localeCompare(a.createTime))
    }
    return list
  })

  const handleSearch = () => {}
  const handleAdd = () => uni.showToast({ title: '新增数据', icon: 'none' })
  const handleDetail = (item: DataItem) =>
    uni.showToast({ title: `查看: ${item.title}`, icon: 'none' })
  const handleEdit = (item: DataItem) =>
    uni.showToast({ title: `编辑: ${item.title}`, icon: 'none' })
  const handleDelete = (item: DataItem) => {
    uni.showModal({
      title: '确认删除',
      content: `确定删除「${item.title}」？`,
      success: res => {
        if (res.confirm) {
          dataList.value = dataList.value.filter(i => i.id !== item.id)
          uni.showToast({ title: '删除成功', icon: 'success' })
        }
      },
    })
  }
</script>

<style lang="scss" scoped>
  .crud-page {
    padding: 24rpx;
    background: var(--r-bg-page);
    min-height: 100vh;
  }

  .search-bar {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 20rpx;

    .search-input-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12rpx;
      padding: 0 24rpx;
      height: 80rpx;
      background: var(--r-bg-card);
      border-radius: 16rpx;
      box-shadow: var(--r-shadow-sm);

      .search-input {
        flex: 1;
        font-size: 28rpx;
        color: var(--r-text-primary);
      }
    }

    .filter-btn {
      width: 80rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--r-bg-card);
      border-radius: 16rpx;
      box-shadow: var(--r-shadow-sm);
    }
  }

  .filter-panel {
    padding: 24rpx;
    background: var(--r-bg-card);
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    box-shadow: var(--r-shadow-sm);

    .filter-row {
      margin-bottom: 20rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .filter-label {
        font-size: 24rpx;
        color: var(--r-text-secondary);
        margin-bottom: 12rpx;
        display: block;
      }

      .filter-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 12rpx;

        .filter-tag {
          padding: 8rpx 24rpx;
          border-radius: 24rpx;
          background: var(--r-bg-tag);
          border: 1rpx solid transparent;

          &.active {
            background: rgba(102, 126, 234, 0.1);
            border-color: #667eea;

            .tag-text {
              color: #667eea;
            }
          }

          .tag-text {
            font-size: 24rpx;
            color: var(--r-text-secondary);
          }
        }
      }
    }
  }

  .action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .total-text {
      font-size: 24rpx;
      color: var(--r-text-secondary);
    }

    .add-btn {
      display: flex;
      align-items: center;
      gap: 6rpx;
      padding: 12rpx 28rpx;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 24rpx;

      .add-text {
        font-size: 24rpx;
        color: #fff;
      }
    }
  }

  .data-list {
    .data-card {
      padding: 28rpx;
      background: var(--r-bg-card);
      border-radius: 20rpx;
      margin-bottom: 20rpx;
      box-shadow: var(--r-shadow-sm);

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12rpx;

        .card-title {
          font-size: 30rpx;
          font-weight: 600;
          color: var(--r-text-primary);
        }

        .status-badge {
          padding: 4rpx 16rpx;
          border-radius: 12rpx;
          font-size: 22rpx;

          &.active {
            background: rgba(102, 126, 234, 0.1);
            .status-text {
              color: #667eea;
            }
          }
          &.done {
            background: rgba(67, 233, 123, 0.1);
            .status-text {
              color: #43e97b;
            }
          }
          &.pending {
            background: rgba(250, 173, 20, 0.1);
            .status-text {
              color: #faad14;
            }
          }
          &.closed {
            background: rgba(153, 153, 153, 0.1);
            .status-text {
              color: #999;
            }
          }
        }
      }

      .card-desc {
        font-size: 26rpx;
        color: var(--r-text-secondary);
        margin-bottom: 16rpx;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .card-time {
          font-size: 22rpx;
          color: var(--r-text-placeholder);
        }

        .card-actions {
          display: flex;
          gap: 20rpx;

          .card-action {
            width: 56rpx;
            height: 56rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--r-bg-page);
            border-radius: 12rpx;
          }
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
  }
</style>
