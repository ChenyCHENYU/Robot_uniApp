/**
 * C_Empty - 空状态组件数据逻辑
 */

// 内置空状态类型及默认文案
export const EMPTY_TYPES: Record<
  string,
  { icon: string; text: string; subText?: string; color: string }
> = {
  default: {
    icon: 'content',
    text: '暂无数据',
    subText: '稍后再来看看吧',
    color: '#a0aec0',
  },
  network: {
    icon: 'wifi-off',
    text: '网络异常',
    subText: '请检查网络连接后重试',
    color: '#f56c6c',
  },
  search: {
    icon: 'search',
    text: '未找到结果',
    subText: '换个关键词试试吧',
    color: '#409eff',
  },
  permission: {
    icon: 'warning',
    text: '暂无权限',
    subText: '请联系管理员开启权限',
    color: '#e6a23c',
  },
  error: {
    icon: 'close-circle',
    text: '加载失败',
    subText: '服务异常，请稍后重试',
    color: '#f56c6c',
  },
  cart: {
    icon: 'goods',
    text: '购物车空空如也',
    subText: '去逛逛发现好物',
    color: '#67c23a',
  },
  message: {
    icon: 'chat',
    text: '暂无消息',
    subText: '新消息会在这里显示',
    color: '#409eff',
  },
  collect: {
    icon: 'star',
    text: '暂无收藏',
    subText: '收藏的内容都会出现在这里',
    color: '#e6a23c',
  },
}

// Props 默认值
export const defaultProps = {
  type: 'default',
  text: '',
  icon: '',
  iconSize: 48,
  showAction: false,
  actionText: '重新加载',
}
