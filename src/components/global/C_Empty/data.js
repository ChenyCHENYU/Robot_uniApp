/**
 * C_Empty - 空状态组件数据逻辑
 */

// 内置空状态类型及默认文案
export const EMPTY_TYPES = {
  default: { icon: "content", text: "暂无数据" },
  network: { icon: "wifi-off", text: "网络异常，请检查网络设置" },
  search: { icon: "search", text: "未找到相关结果" },
  permission: { icon: "warning", text: "暂无权限查看" },
  error: { icon: "close-circle", text: "加载失败，请重试" },
  cart: { icon: "goods", text: "购物车是空的" },
  message: { icon: "chat", text: "暂无消息" },
  collect: { icon: "star", text: "暂无收藏" },
};

// Props 默认值
export const defaultProps = {
  type: "default",
  text: "",
  icon: "",
  iconSize: 160,
  showAction: false,
  actionText: "重新加载",
};
