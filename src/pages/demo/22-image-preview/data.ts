/** ImagePreview 图片预览：仅在当前页面维护演示状态，不调用业务接口。 */
import { ref } from 'vue'

export const PAGE_META = {
  name: 'image-preview',
  title: '图片预览',
  component: 'C_ImagePreview',
  summary: '全屏图片预览与缩放',
  category: '媒体',
  instruction: '点击缩略图查看大图；左右切换图片，点击关闭退出预览。',
  number: '22',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const images = [
    '/static/images/demo/preview-workspace.png',
    '/static/images/demo/preview-insights.png',
    '/static/images/demo/preview-team.png',
  ]

  const showPreview = ref(false)
  const previewIndex = ref(0)

  function previewImage(index: number) {
    uni.previewImage({ urls: images, current: index })
  }
  return { images, showPreview, previewIndex, previewImage }
}
