/**
 * 平台能力接口 — 跨端能力的统一抽象与降级链
 *
 * 目标：业务代码不直接触碰 uni.scanCode/uni.getLocation 等平台差异 API，
 * 统一走 platform 能力接口；宿主（H5/小程序/App/未来钉钉等）在运行时注入实现。
 *
 * 约定：
 * - 每个能力返回 Promise，失败统一 reject PlatformError（带 code/message）
 * - 按真实运行端/API 选择实现，未实现端抛 capability_unsupported
 */

/** 平台能力错误 */
export class PlatformError extends Error {
  /** 构造带能力错误码的错误 */
  constructor(
    public readonly code:
      | 'capability_unsupported'
      | 'permission_denied'
      | 'user_cancel'
      | 'bridge_timeout'
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
  /** 实际返回的坐标系；能力层不隐式换算坐标。 */
  coordinateSystem?: 'gcj02' | 'wgs84' | 'unknown'
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

/** 可用状态描述的是实现能力，宿主 UA 不构成支持声明。 */
export interface PlatformCapabilitySupport {
  scanCode: boolean
  scanFromAlbum: boolean
  getLocation: boolean
  takePhoto: boolean
}

export type PlatformReadiness = 'idle' | 'pending' | 'ready' | 'failed'

export interface PlatformCapabilityStatus extends PlatformCapabilitySupport {
  provider: string
  readiness: PlatformReadiness
}

/** 宿主仅覆盖已接入的能力，其余能力保持原来的实现。 */
export interface PlatformAdapter {
  provider: string
  capabilities: Partial<PlatformCapabilities>
  /** 扫描器默认只支持相机；相册识别必须由宿主显式声明。 */
  capabilitiesSupport?: Partial<PlatformCapabilitySupport>
  ready?: () => Promise<void>
  /** 就绪超时，默认 8 秒。失败不会静默改用其他权限或宿主。 */
  readyTimeoutMs?: number
}

/** 第三方回调对象集中在能力边界解析，业务不依赖 SDK 字段名称。 */
function readCapabilityError(
  err: unknown,
  fallback: string
): { message: string; code: string } {
  const value =
    err && typeof err === 'object' ? (err as Record<string, unknown>) : {}
  const fields = [value.errMsg, value.errorMessage, value.message, err]
  const msg = fields.find(field => typeof field === 'string' && field.trim())
  const message = typeof msg === 'string' ? msg.trim() : fallback
  const code = String(value.code ?? value.errCode ?? value.errorCode ?? '')
  return { message, code }
}

/** 从 uni/宿主 SDK 的不同错误对象中提取说明，避免把取消当权限错误。 */
export function normalizeUniError(
  err: unknown,
  fallback: string
): PlatformError {
  if (err instanceof PlatformError) return err
  const { message, code } = readCapabilityError(err, fallback)
  const classification = `${message} ${code}`
  if (/cancel|取消|用户.*关闭/i.test(classification)) {
    return new PlatformError('user_cancel', '用户取消操作')
  }
  if (
    /deny|denied|permission|authorize|auth.*(?:fail|reject)|权限|未授权/i.test(
      classification
    )
  ) {
    return new PlatformError(
      'permission_denied',
      '权限被拒绝，请在系统设置中开启'
    )
  }
  if (
    /unsupported|not[\s_-]*support|not[\s_-]*implemented|不支持|方法不存在/i.test(
      classification
    )
  ) {
    return new PlatformError('capability_unsupported', message)
  }
  return new PlatformError('platform_error', message)
}
