import { ref, computed } from 'vue'
/** Empty 空状态：仅在当前页面维护演示状态，不调用业务接口。 */

export const PAGE_META = {
  name: 'empty',
  title: '空状态',
  component: 'C_Empty',
  summary: '多场景缺省状态展示',
  category: '反馈',
  instruction: '对比不同空状态的提示与操作；点击行动按钮查看反馈。',
  number: '14',
} as const

/** 管理当前演示交互状态。 */
export function useDemo() {
  const emptyScenes = [
    {
      value: 'default',
      label: '暂无数据',
      description: '清楚告知当前没有内容',
      action: '',
    },
    {
      value: 'network',
      label: '网络异常',
      description: '提供重试入口，帮助用户恢复',
      action: '重新加载',
    },
    {
      value: 'search',
      label: '搜索为空',
      description: '换一个关键词，再试一次',
      action: '',
    },
    {
      value: 'permission',
      label: '暂无权限',
      description: '解释无法访问的原因',
      action: '申请权限',
    },
    {
      value: 'error',
      label: '系统异常',
      description: '给出可以继续的路径',
      action: '返回首页',
    },
    {
      value: 'cart',
      label: '购物车为空',
      description: '提供探索商品的下一步',
      action: '去购物',
    },
    {
      value: 'message',
      label: '暂无消息',
      description: '保持安静，等待新的消息',
      action: '',
    },
    {
      value: 'collect',
      label: '暂无收藏',
      description: '引导发现值得关注的内容',
      action: '去发现',
    },
  ]
  const selectedScene = ref('default')
  const currentScene = computed(
    () =>
      emptyScenes.find(scene => scene.value === selectedScene.value) ??
      emptyScenes[0]
  )
  const actionResult = ref('等待选择场景')
  function selectScene(value: string) {
    selectedScene.value = value
    actionResult.value = '当前场景已切换'
  }
  function onEmptyAction() {
    actionResult.value = `已触发「${currentScene.value.action}」演示操作`
    uni.showToast({ title: '操作事件已响应', icon: 'none' })
  }
  return {
    emptyScenes,
    selectedScene,
    currentScene,
    selectScene,
    onEmptyAction,
    actionResult,
  }
}
