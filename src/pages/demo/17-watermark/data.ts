/** Watermark 水印：仅在当前页面维护演示状态，不调用业务接口。 */

export const PAGE_META = {
  name: 'watermark',
  title: '水印',
  component: 'C_Watermark',
  summary: '页面安全水印组件',
  category: '安全',
  instruction: '对比水印颜色、角度和密度，内容区域仍可正常阅读。',
  number: '17',
} as const
