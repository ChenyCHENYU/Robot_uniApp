import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getCrudDetail, updateCrudItem, type CrudItem } from '@/api'
import { useUserStore } from '@/stores/modules/user'
import { CRUD_STATUS_TEXT, CRUD_STATUS } from '@/constants/status'

/** 通用记录详情，编辑沿用原有 CRUD 接口。 */
export function useDetailPage() {
  const userStore = useUserStore()
  const detail = ref<CrudItem | null>(null)
  const loading = ref(true)
  const acting = ref(false)
  const errorText = ref('')
  const currentId = ref('item_001')
  const statusText = computed(
    () =>
      CRUD_STATUS_TEXT[detail.value?.status ?? CRUD_STATUS.PENDING] ||
      '未知状态'
  )
  const basicFields = computed(() =>
    detail.value
      ? [
          { label: '编号', value: detail.value.id },
          { label: '状态', value: statusText.value },
          { label: '当前查看人', value: userStore.nickname },
          { label: '创建时间', value: detail.value.createTime || '—' },
          { label: '更新时间', value: detail.value.updatedTime || '—' },
        ]
      : []
  )
  // 现有详情接口不返回附件/审计记录，保留展示区与准确的空状态。
  const attachments: { name: string; ext: string; size: string }[] = []
  const logs = computed(() => {
    const record = detail.value
    if (!record) return []
    const result = [{ action: '创建记录', user: '', time: record.createTime }]
    if (record.updatedTime && record.updatedTime !== record.createTime)
      result.unshift({
        action: '最近更新时间',
        user: '',
        time: record.updatedTime,
      })
    return result
  })
  const loadDetail = async () => {
    if (loading.value && detail.value) return
    loading.value = true
    errorText.value = ''
    try {
      detail.value = await getCrudDetail({ id: currentId.value })
      if (!detail.value) errorText.value = '该记录不存在或已被删除'
    } catch {
      errorText.value = '加载失败，请重试'
    } finally {
      loading.value = false
    }
  }
  onLoad(query => {
    currentId.value = String(query?.id || 'item_001')
    void loadDetail()
  })

  const handleShare = () => {
    if (!detail.value) return
    const record = detail.value
    uni.setClipboardData({
      data: `${record.title}\n编号：${record.id}\n状态：${statusText.value}\n${record.description || ''}`,
      success: () =>
        uni.showToast({ title: '详情已复制，可粘贴分享', icon: 'none' }),
    })
  }
  const handleEdit = () => {
    if (!detail.value || acting.value) return
    uni.showModal({
      title: '编辑标题',
      editable: true,
      content: detail.value.title,
      placeholderText: '请输入标题',
      success: async ({ confirm, content }) => {
        const title = content?.trim()
        if (!confirm || !title || !detail.value || acting.value) return
        acting.value = true
        try {
          await updateCrudItem({ id: detail.value.id, title })
          await loadDetail()
          uni.showToast({ title: '保存成功', icon: 'success' })
        } catch {
          /* 请求层提供业务错误。 */
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
      await loadDetail()
    } finally {
      refreshing.value = false
    }
  }
  return {
    refreshing,
    handleRefresh,
    detail,
    loading,
    acting,
    errorText,
    statusText,
    basicFields,
    attachments,
    logs,
    loadDetail,
    handleShare,
    handleEdit,
  }
}
