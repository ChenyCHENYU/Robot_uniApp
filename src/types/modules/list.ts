/** C_List 列表 - 类型定义 */

export interface ListProps {
  /** 是否加载中 */
  loading?: boolean
  /** 是否已全部加载 */
  finished?: boolean
  /** 加载中提示文案 */
  loadingText?: string
  /** 加载完成文案 */
  finishedText?: string
  /** 错误文案 */
  errorText?: string
  /** 是否加载失败 */
  error?: boolean
  /** 滚动条距底部距离触发加载(rpx) */
  offset?: number
  /** 是否在初始时立即执行滚动位置检查 */
  immediateCheck?: boolean
}
