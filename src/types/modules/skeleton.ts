/** C_Skeleton 骨架屏 - 类型定义 */

export type SkeletonAnimationType = 'pulse' | 'wave' | 'none'

export interface SkeletonProps {
  /** 是否显示骨架屏 */
  loading?: boolean
  /** 段落行数 */
  rows?: number
  /** 是否显示标题 */
  showTitle?: boolean
  /** 是否显示头像 */
  showAvatar?: boolean
  /** 头像形状 */
  avatarShape?: 'round' | 'square'
  /** 头像大小(rpx) */
  avatarSize?: string | number
  /** 标题宽度 */
  titleWidth?: string
  /** 动画效果 */
  animate?: SkeletonAnimationType
  /** 是否圆角 */
  round?: boolean
}
