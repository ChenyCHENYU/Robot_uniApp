import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import {
  getCrudList,
  createCrudItem,
  updateCrudItem,
  deleteCrudItem,
  type CrudItem,
} from '@/api'
import { CRUD_STATUS_TEXT, CRUD_STATUS } from '@/constants/status'

/** 页面状态、加载与交互。 */
export function useCrudListPage() {
  const getStatusText = (status: number) =>
    CRUD_STATUS_TEXT[status] || CRUD_STATUS_TEXT[CRUD_STATUS.PENDING]
  const keyword = ref('')
  const showFilter = ref(false)
  /** '' 全部 | 0 待处理 | 1 已完成 */
  const filterStatus = ref<number | ''>('')
  const sortBy = ref('time')

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
      list.sort((a, b) =>
        (b.createTime || '').localeCompare(a.createTime || '')
      )
    }
    return list
  })

  // ==================== 服务端数据（分页） ====================

  const PAGE_SIZE = 10
  const dataList = ref<CrudItem[]>([])
  const total = ref(0)
  const page = ref(1)
  const loading = ref(false)
  const errorText = ref('')
  const acting = ref(false)
  let refreshQueued = false
  const finished = computed(() => dataList.value.length >= total.value)

  /** 构建列表查询参数（关键词/状态筛选） */
  const buildQuery = (pageNum: number) => ({
    page: pageNum,
    pageSize: PAGE_SIZE,
    keyword: keyword.value.trim() || undefined,
    status: filterStatus.value === '' ? undefined : filterStatus.value,
  })

  const commitList = (
    result: { list: CrudItem[]; total: number },
    nextPage: number,
    refresh: boolean
  ) => {
    const list = result.list || []
    dataList.value = refresh ? list : [...dataList.value, ...list]
    total.value = result.total || 0
    page.value = nextPage
  }

  const loadList = async (refresh = false) => {
    if (loading.value) {
      if (refresh) refreshQueued = true
      return
    }
    if (!refresh && finished.value) return
    loading.value = true
    errorText.value = ''
    try {
      const nextPage = refresh ? 1 : page.value + 1
      const res = await getCrudList(buildQuery(nextPage))
      commitList(res, nextPage, refresh)
    } catch {
      errorText.value = '数据加载失败，请重试'
    } finally {
      loading.value = false
      if (refreshQueued) {
        refreshQueued = false
        void loadList(true)
      }
    }
  }

  onShow(() => {
    loadList(true)
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
    if (acting.value) return
    const title = await promptTitle('新增数据', '')
    if (!title || !title.trim()) return
    if (acting.value) return
    acting.value = true
    try {
      await createCrudItem({
        title: title.trim(),
        description: `${title.trim()} - 通过新增操作创建`,
        status: 0,
      })
      uni.showToast({ title: '新增成功', icon: 'success' })
      loadList(true)
    } catch {
      // 请求层已提示，保留现有列表。
    } finally {
      acting.value = false
    }
  }

  const handleDetail = (item: CrudItem) => {
    uni.navigateTo({
      url: `/pages/detail/index?id=${encodeURIComponent(item.id)}`,
    })
  }

  const handleEdit = async (item: CrudItem) => {
    if (acting.value) return
    const title = await promptTitle('编辑标题', item.title)
    if (!title || !title.trim()) return
    if (acting.value) return
    acting.value = true
    try {
      await updateCrudItem({ id: item.id, title: title.trim() })
      uni.showToast({ title: '保存成功', icon: 'success' })
      loadList(true)
    } catch {
      // 请求层已提示，保留现有列表。
    } finally {
      acting.value = false
    }
  }

  const handleDelete = (item: CrudItem) => {
    uni.showModal({
      title: '确认删除',
      content: `确定删除「${item.title}」？`,
      success: async res => {
        if (!res.confirm || acting.value) return
        acting.value = true
        try {
          await deleteCrudItem({ id: item.id })
          uni.showToast({ title: '删除成功', icon: 'success' })
          loadList(true)
        } catch {
          // 请求层已提示。
        } finally {
          acting.value = false
        }
      },
    })
  }

  const refreshing = ref(false)
  const handleRefresh = async () => {
    if (refreshing.value) return
    refreshing.value = true
    try {
      await loadList(true)
    } finally {
      refreshing.value = false
    }
  }

  return {
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
  }
}
