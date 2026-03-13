/**
 * C_Skeleton - 骨架屏组件数据逻辑
 */

// 预设行配置
export const PRESETS = {
  /** 列表项 */
  list: [
    { type: "rect", width: "80rpx", height: "80rpx" },
    { type: "text", rows: 2 },
  ],
  /** 卡片 */
  card: [
    { type: "rect", width: "100%", height: "300rpx" },
    { type: "text", rows: 3 },
  ],
  /** 详情页 */
  detail: [
    { type: "rect", width: "100%", height: "400rpx" },
    { type: "text", rows: 5 },
  ],
  /** 个人资料 */
  profile: [
    { type: "circle", size: "120rpx" },
    { type: "text", rows: 3 },
  ],
};

export const defaultProps = {
  loading: true,
  rows: 3,
  animate: true,
  preset: "",
  avatar: false,
  title: true,
};
