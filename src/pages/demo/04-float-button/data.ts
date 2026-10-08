/** FloatButton 悬浮按钮：仅在当前页面维护演示状态，不调用业务接口。 */

export const PAGE_META = {
  name: 'float-button',
  title: '悬浮按钮',
  component: 'C_FloatButton',
  summary: '页面快捷操作入口',
  category: '导航',
  instruction: '点击预览区中的悬浮按钮，体验快捷入口；按钮只在各自样本内展示。',
  number: '04',
} as const

/** 创建独立的演示状态，避免跨页面实例共享。 */
export function useDemo() {
  const handleClick = (name: string) => {
    uni.showToast({ title: `${name}被点击`, icon: 'none' })
  }
  return { handleClick }
}
