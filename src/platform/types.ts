/**
 * 平台能力接口 — 跨端能力的统一抽象与降级链
 *
 * 目标：业务代码不直接触碰 uni.scanCode/uni.getLocation 等平台差异 API，
 * 统一走 platform 能力接口；宿主（H5/小程序/App/未来钉钉等）在运行时注入实现。
 *
 * 约定：
 * - 每个能力返回 Promise，失败统一 reject PlatformError（带 code/message）
 * - 实现按条件编译挑选，未实现端抛 capability_unsupported
 */

/** 平台能力错误 */
export class PlatformError extends Error {
  /** 构造带能力错误码的错误 */
  constructor(
    public readonly code:
      | 'capability_unsupported'
      | 'permission_denied'
      | 'user_cancel'
      | 'platform_error',
    message: string
  ) {
    super(message)
    this.name = 'PlatformError'
  }
}

/** 扫码结果 */
export interface ScanResult {
  /** 扫码原始内容 */
  result: string
  /** 码类型（QR_CODE 等，端能力支持时返回） */
  scanType?: string
  /** 来源路径（相册识别时返回） */
  path?: string
}

/** 位置信息 */
export interface LocationResult {
  latitude: number
  longitude: number
  accuracy?: number
  address?: string
}

/** 拍照/相册图片 */
export interface PhotoResult {
  tempFilePath: string
  size?: number
}

/** 平台能力接口（宿主实现） */
export interface PlatformCapabilities {
  /** 扫码（支持从相册识别时 source='album'） */
  scanCode(source?: 'camera' | 'album'): Promise<ScanResult>
  /** 获取定位 */
  getLocation(): Promise<LocationResult>
  /** 拍照或从相册选图（单张） */
  takePhoto(source?: 'camera' | 'album'): Promise<PhotoResult>
}

/** 将 uni.* 回调错误归一化为 PlatformError */
export function normalizeUniError(
  err: { errMsg?: string } | undefined,
  fallback: string
): PlatformError {
  const msg = String(err?.errMsg || '')
  if (msg.includes('auth') || msg.includes('deny')) {
    return new PlatformError(
      'permission_denied',
      '权限被拒绝，请在系统设置中开启'
    )
  }
  if (msg.includes('cancel')) {
    return new PlatformError('user_cancel', '用户取消操作')
  }
  return new PlatformError('platform_error', msg || fallback)
}
