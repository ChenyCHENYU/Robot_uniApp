import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getApprovalDetail, approveItem, type ApprovalItem } from '@/api'

/** 页面状态、加载与交互。 */
export function useApprovalPage() {
  interface FlowNode {
    title: string
    user: string
    status: string
    time?: string
    remark?: string
  }

  interface ApprovalDetail extends ApprovalItem {
    content?: string
    department?: string
    type?: string
    flowNodes?: FlowNode[]
  }

  const statusConfig: Record<
    string,
    { label: string; icon: string; bg: string }
  > = {
    pending: {
      label: '审批中',
      icon: 'time',
      bg: 'var(--r-bg-card)',
    },
    approved: {
      label: '已通过',
      icon: 'check',
      bg: 'var(--r-bg-card)',
    },
    rejected: {
      label: '已驳回',
      icon: 'close',
      bg: 'var(--r-bg-card)',
    },
  }

  const nodeStatusMap: Record<string, string> = {
    approved: '已通过',
    rejected: '已驳回',
    pending: '待审批',
    waiting: '等待中',
  }

  const detail = ref<ApprovalDetail | null>(null)
  const loading = ref(true)
  const acting = ref(false)
  const errorText = ref('')
  const currentId = ref('ap_001')
  const approvalState = computed(
    () =>
      statusConfig[detail.value?.status || 'pending'] || {
        label: '未知状态',
        icon: 'info-circle',
        bg: 'var(--r-bg-card)',
      }
  )
  const retry = () => loadDetail(currentId.value)

  const flowNodes = computed<FlowNode[]>(() => detail.value?.flowNodes || [])

  const infoFields = computed(() => {
    const d = detail.value
    if (!d) return []
    return [
      { label: '申请人', value: d.applicant || '-' },
      { label: '申请部门', value: d.department || '-' },
      { label: '申请时间', value: d.createTime || '-' },
      { label: '审批编号', value: d.id || '-' },
      { label: '审批类型', value: d.type ? `${d.type}审批` : '-' },
    ]
  })

  const loadDetail = async (id: string) => {
    loading.value = true
    errorText.value = ''
    currentId.value = id
    try {
      const res = await getApprovalDetail({ id })
      detail.value = res
      if (!res) errorText.value = '审批单不存在或已被删除'
    } catch {
      errorText.value = '加载失败，请重试'
    } finally {
      loading.value = false
    }
  }

  onLoad(query => {
    if (query?.id) {
      loadDetail(String(query.id))
    } else {
      // 兼容直接打开（无 id）：默认取第一条演示数据
      loadDetail('ap_001')
    }
  })

  /** 审批操作（通过/驳回），成功后刷新详情 */
  const doAction = async (action: 'approve' | 'reject') => {
    if (!detail.value || acting.value) return
    acting.value = true
    try {
      await approveItem({ id: detail.value.id, action })
      uni.showToast({
        title: action === 'approve' ? '审批通过' : '已驳回',
        icon: action === 'approve' ? 'success' : 'none',
      })
      await loadDetail(detail.value.id)
    } catch {
      // http 层已提示
    } finally {
      acting.value = false
    }
  }

  const handleApprove = () => {
    if (acting.value) return
    uni.showModal({
      title: '确认通过',
      content: '确定通过该审批？',
      success: res => {
        if (res.confirm) doAction('approve')
      },
    })
  }

  const handleReject = () => {
    if (acting.value) return
    uni.showModal({
      title: '确认驳回',
      content: '确定驳回该审批？',
      success: res => {
        if (res.confirm) doAction('reject')
      },
    })
  }

  const refreshing = ref(false)
  const handleRefresh = async () => {
    if (refreshing.value) return
    refreshing.value = true
    try {
      await retry()
    } finally {
      refreshing.value = false
    }
  }

  return {
    nodeStatusMap,
    detail,
    loading,
    acting,
    errorText,
    approvalState,
    retry,
    flowNodes,
    infoFields,
    handleApprove,
    handleReject,
    refreshing,
    handleRefresh,
  }
}
