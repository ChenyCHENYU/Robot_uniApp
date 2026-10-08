/** Upload 上传：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'

export const PAGE_META = {
  name: 'upload',
  title: '上传',
  component: 'C_Upload',
  summary: '图片与文件上传组件',
  category: '表单',
  instruction: '选择本地图片，体验预览、删除、数量限制与禁用状态。',
  number: '12',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const fileList1 = ref([])

  const fileList2 = ref([])

  const disabledList = ref([
    {
      url: '/static/images/demo/preview-workspace.png',
    },
    {
      url: '/static/images/demo/preview-insights.png',
    },
  ])
  return { fileList1, fileList2, disabledList }
}
