import { ref } from 'vue'
/** Header 页头：仅在当前页面维护演示状态，不调用业务接口。 */

export const PAGE_META = {
  name: 'header',
  title: '页头',
  component: 'C_Header',
  summary: '智能页头导航组件',
  category: '导航',
  instruction: '对比用户页头与返回页头，体验通知和设置入口的点击反馈。',
  number: '05',
} as const

/** 管理当前演示交互状态。 */
export function useDemo() {
  const headerAction = ref('等待点击页头操作')
  const onHeaderAction = (action: string) => {
    headerAction.value = `已点击：${action}`
  }
  return { headerAction, onHeaderAction }
}
