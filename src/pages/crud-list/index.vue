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
              <text class="status-text">{{
                item.status === 0 ? statusMap.pending : statusMap.done
              }}</text>
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
        v-if="dataList.length === 0 && !loading"
        class="empty-state"
      >
        <wd-icon
          name="search"
          size="64px"
          color="#ddd"
        />
        <text class="empty-text">暂无数据</text>
      </view>

      <!-- 加载更多 -->
      <view
        v-if="dataList.length > 0"
        class="load-more"
      >
        <text class="load-more-text">{{
          loading ? '加载中...' : finished ? '没有更多了' : '上拉加载更多'
        }}</text>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
  import {
    getCrudList,
    createCrudItem,
    updateCrudItem,
    deleteCrudItem,
    type CrudItem,
  } from '@/api'

  const keyword = ref('')
  const showFilter = ref(false)
  /** '' 全部 | 0 待处理 | 1 已完成 */
  const filterStatus = ref<number | ''>('')
  const sortBy = ref('time')

  const statusMap: Record<string, string> = {
    pending: '待处理',
    done: '已完成',
  }

  const statusOptions = [
    { label: '全部', value: '' as const },
    { label: '待处理', value: 0 },
    { label: '已完成', value: 1 },
  ]

  const sortOptions = [
    { label: '时间排序', value: 'time' },
    { label: '名称排序', value: 'name' },
  ]

  const hasFilter = computed(
    () => filterStatus.value !== '' || sortBy.value !== 'time'
  )

  /** 客户端排序（当前页内） */
  const sortedList = computed(() => {
    const list = [...dataList.value]
    if (sortBy.value === 'name') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    } else {
      list.sort((a, b) => (b.createTime || '').localeCompare(a.createTime || ''))
    }
    return list
  })

  // ==================== 服务端数据（分页） ====================

  const PAGE_SIZE = 10
  const dataList = ref<CrudItem[]>([])
  const total = ref(0)
  const page = ref(1)
  const loading = ref(false)
  const finished = computed(() => dataList.value.length >= total.value)

  /** 服务端状态码 → 页面语义 */
  const normalizeItem = (item: CrudItem): CrudItem => ({
    ...item,
    status: item.status,
  })

  const loadList = async (refresh = false) => {
    if (loading.value) return
    loading.value = true
    try {
      const nextPage = refresh ? 1 : page.value + 1
      const res = await getCrudList({
        page: refresh ? 1 : nextPage,
        pageSize: PAGE_SIZE,
        keyword: keyword.value || undefined,
        status: filterStatus.value === '' ? undefined : filterStatus.value,
      })
      const list = (res.list || []).map(normalizeItem)
      dataList.value = refresh ? list : [...dataList.value, ...list]
      total.value = res.total || 0
      page.value = refresh ? 1 : nextPage
    } catch {
      // 错误提示由 http 层处理
    } finally {
      loading.value = false
    }
  }

  onLoad(() => {
    loadList(true)
  })

  onPullDownRefresh(async () => {
    await loadList(true).catch(() => {})
    uni.stopPullDownRefresh()
  })

  onReachBottom(() => {
    if (!finished.value) loadList()
  })

  // ==================== 搜索与筛选 ====================

  const handleSearch = () => {
    loadList(true)
  }
  const clearAndSearch = () => {
    keyword.value = ''
    loadList(true)
  }

  const handleFilterSelect = (value: number | '') => {
    filterStatus.value = filterStatus.value === value ? '' : value
    loadList(true)
  }

  // ==================== CRUD 操作 ====================

  /** 弹窗输入式编辑（H5/小程序通用） */
  const promptTitle = (
    title: string,
    initial: string
  ): Promise<string | null> => {
    return new Promise(resolve => {
      // #ifdef MP-WEIXIN
      uni.showModal({
        title,
        editable: true,
        placeholderText: '请输入标题',
        content: initial,
        success: res => resolve(res.confirm ? String(res.content || '') : null),
        fail: () => resolve(null),
      })
      // #endif
      // #ifndef MP-WEIXIN
      uni.showModal({
        title,
        content: initial ? `编辑为：${initial}` : '演示环境请输入有效标题',
        editable: true,
        placeholderText: '请输入标题',
        success: res => resolve(res.confirm ? String(res.content || '') : null),
        fail: () => resolve(null),
      })
      // #endif
    })
  }

  const handleAdd = async () => {
    const title = await promptTitle('新增数据', '')
    if (!title || !title.trim()) return
    try {
      await createCrudItem({
        title: title.trim(),
        description: `${title.trim()} - 通过新增操作创建`,
        status: 0,
      })
      uni.showToast({ title: '新增成功', icon: 'success' })
      loadList(true)
    } catch {
      // http 层已提示
    }
  }

  const handleDetail = (item: CrudItem) => {
    uni.navigateTo({ url: `/pages/detail/index?id=${encodeURIComponent(item.id)}` })
  }

  const handleEdit = async (item: CrudItem) => {
    const title = await promptTitle('编辑标题', item.title)
    if (!title || !title.trim()) return
    try {
      await updateCrudItem({ id: item.id, title: title.trim() })
      uni.showToast({ title: '保存成功', icon: 'success' })
      loadList(true)
    } catch {
      // http 层已提示
    }
  }

  const handleDelete = (item: CrudItem) => {
    uni.showModal({
      title: '确认删除',
      content: `确定删除「${item.title}」？`,
      success: async res => {
        if (!res.confirm) return
        try {
          await deleteCrudItem({ id: item.id })
          uni.showToast({ title: '删除成功', icon: 'success' })
          loadList(true)
        } catch {
          // http 层已提示
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

  .load-more {
    padding: 24rpx 0 40rpx;
    text-align: center;

    .load-more-text {
      font-size: 24rpx;
      color: var(--r-text-placeholder);
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
