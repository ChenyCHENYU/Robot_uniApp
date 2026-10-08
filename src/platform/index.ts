/**
 * 平台能力注册表 — 按运行端选择内置实现，宿主覆盖已接入能力
 *
 * 当前内置：uni API 实现和 H5 降级，实际能力仍受设备与权限约束。
 * 钉钉/PDA 等宿主需提供真实适配器并完成就绪初始化，再注册覆盖。
 * 此层仅收敛扫码、定位、选图，不代表已接入登录、通知或原生插件。
 */
import {
  PlatformError,
  normalizeUniError,
  type PlatformCapabilities,
  type PlatformAdapter,
  type PlatformCapabilitySupport,
  type PlatformCapabilityStatus,
  type PlatformReadiness,
} from './types'
import { getPlatformEnvironment } from './environment'

export { PlatformError, normalizeUniError }
export {
  getPlatformEnvironment,
  detectPlatformEnvironment,
} from './environment'
export type { PlatformEnvironment } from './environment'
export type {
  PlatformCapabilities,
  ScanResult,
  LocationResult,
  PhotoResult,
  PlatformAdapter,
  PlatformCapabilitySupport,
  PlatformCapabilityStatus,
  PlatformReadiness,
} from './types'

/** uni 原生能力实现（小程序/App） */
const uniCapabilities: PlatformCapabilities = {
  /** 扫码 */
  scanCode(source = 'camera') {
    return new Promise((resolve, reject) => {
      uni.scanCode({
        onlyFromCamera: source === 'camera',
        scanType: ['qrCode', 'barCode'],
        success: res =>
          resolve({
            result: res.result,
            scanType: res.scanType,
            path: res.path,
          }),
        fail: err => reject(normalizeUniError(err, '扫码失败')),
      })
    })
  },

  /** 获取定位 */
  getLocation() {
    return new Promise((resolve, reject) => {
      uni.getLocation({
        type: 'gcj02',
        isHighAccuracy: true,
        success: res =>
          resolve({
            latitude: res.latitude,
            longitude: res.longitude,
            accuracy: res.accuracy,
            coordinateSystem: 'gcj02',
          }),
        fail: err => reject(normalizeUniError(err, '定位失败')),
      })
    })
  },

  /** 拍照或从相册选图 */
  takePhoto(source = 'camera') {
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: [source],
        success: res => {
          const file = res.tempFiles?.[0]
          if (!res.tempFilePaths?.[0]) {
            reject(new PlatformError('platform_error', '未获取到有效图片'))
            return
          }
          resolve({
            tempFilePath: res.tempFilePaths[0],
            size: file?.size,
          })
        },
        fail: err => reject(normalizeUniError(err, '获取图片失败')),
      })
    })
  },
}

/** H5 降级实现：扫码不可用，定位走浏览器 Geolocation */
const h5Capabilities: PlatformCapabilities = {
  /** H5 不支持扫码 */
  scanCode() {
    return Promise.reject(
      new PlatformError(
        'capability_unsupported',
        '当前环境不支持扫码，请使用小程序或 App'
      )
    )
  },
  /** 浏览器 Geolocation 定位 */
  getLocation() {
    return new Promise((resolve, reject) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        reject(
          new PlatformError('capability_unsupported', '当前环境不支持定位')
        )
        return
      }
      navigator.geolocation.getCurrentPosition(
        position =>
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            coordinateSystem: 'wgs84',
          }),
        err => {
          if (err.code === err.PERMISSION_DENIED) {
            reject(new PlatformError('permission_denied', '定位权限被拒绝'))
          } else {
            reject(
              new PlatformError('platform_error', err.message || '定位失败')
            )
          }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  },
  /** H5 文件选择器选图 */
  takePhoto(source = 'album') {
    return new Promise((resolve, reject) => {
      // H5 的 uni.chooseImage 走 input[type=file]，单张可用
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: [source],
        success: res => {
          const file = res.tempFiles?.[0]
          if (!res.tempFilePaths?.[0]) {
            reject(new PlatformError('platform_error', '未获取到有效图片'))
            return
          }
          resolve({
            tempFilePath: res.tempFilePaths[0],
            size: file?.size,
          })
        },
        fail: err => reject(normalizeUniError(err, '获取图片失败')),
      })
    })
  },
}

interface AdapterEntry {
  adapter: PlatformAdapter
  readiness: PlatformReadiness
  readyPromise?: Promise<void>
}

const adapters: AdapterEntry[] = []
type CapabilityName = keyof PlatformCapabilities

/** UA 仅描述宿主；可用性来自运行端和实际 API/适配器。 */
function getBuiltinSupport(): PlatformCapabilitySupport {
  const isH5 = getPlatformEnvironment().runtime === 'h5'
  const nativeScan =
    !isH5 && typeof uni !== 'undefined' && typeof uni.scanCode === 'function'
  let browserLocation = false
  // #ifdef H5
  browserLocation = typeof navigator !== 'undefined' && !!navigator.geolocation
  // #endif
  return {
    scanCode: nativeScan,
    scanFromAlbum: nativeScan,
    getLocation: isH5
      ? browserLocation
      : typeof uni !== 'undefined' && typeof uni.getLocation === 'function',
    takePhoto:
      typeof uni !== 'undefined' && typeof uni.chooseImage === 'function',
  }
}

/** 从最新仍生效的覆盖查找方法；撤销早期注册不影响后来宿主。 */
function findCapabilityEntry(name: CapabilityName): AdapterEntry | undefined {
  return [...adapters]
    .reverse()
    .find(entry => typeof entry.adapter.capabilities[name] === 'function')
}

/** 返回具体方法所属宿主的声明，未覆盖的方法保留内置降级。 */
function isCapabilitySupported(name: CapabilityName, album = false): boolean {
  const entry = findCapabilityEntry(name)
  const supportKey = album ? 'scanFromAlbum' : name
  if (!entry) return getBuiltinSupport()[supportKey]
  const explicit = entry.adapter.capabilitiesSupport?.[supportKey]
  return explicit ?? !album
}

/** 并发调用共用一次初始化；失败保留错误，重新注册才重试。 */
function ensureReady(entry: AdapterEntry): Promise<void> {
  if (entry.readyPromise) return entry.readyPromise
  if (!entry.adapter.ready) return Promise.resolve()
  entry.readiness = 'pending'
  const configuredTimeout = entry.adapter.readyTimeoutMs
  const timeoutMs =
    configuredTimeout &&
    Number.isFinite(configuredTimeout) &&
    configuredTimeout > 0
      ? configuredTimeout
      : 8000
  entry.readyPromise = new Promise<void>((resolve, reject) => {
    const timer = setTimeout(
      () =>
        reject(
          new PlatformError(
            'bridge_timeout',
            '宿主能力初始化超时，请重新进入应用'
          )
        ),
      timeoutMs
    )
    Promise.resolve()
      .then(() => entry.adapter.ready?.())
      .then(
        () => {
          clearTimeout(timer)
          resolve()
        },
        error => {
          clearTimeout(timer)
          reject(normalizeUniError(error, '宿主能力初始化失败'))
        }
      )
  }).then(
    () => {
      entry.readiness = 'ready'
    },
    error => {
      entry.readiness = 'failed'
      throw error
    }
  )
  return entry.readyPromise
}

/** 调用前固定此次宿主，避免初始化等待期间被另一注册重定向。 */
async function invokeCapability<K extends CapabilityName>(
  name: K,
  run: (
    capabilities: PlatformCapabilities
  ) => ReturnType<PlatformCapabilities[K]>,
  album = false
): Promise<Awaited<ReturnType<PlatformCapabilities[K]>>> {
  if (!isCapabilitySupported(name, album)) {
    throw new PlatformError('capability_unsupported', '当前环境不支持此能力')
  }
  const entry = findCapabilityEntry(name)
  const builtin =
    getPlatformEnvironment().runtime === 'h5' ? h5Capabilities : uniCapabilities
  const capabilities = { ...builtin, ...entry?.adapter.capabilities }
  try {
    if (entry) await ensureReady(entry)
    return await run(capabilities)
  } catch (error) {
    throw normalizeUniError(error, '平台能力调用失败')
  }
}

/** 覆盖已有接口的兼容入口；新宿主建议使用可撤销的 registerPlatformAdapter。 */
export function setPlatformCapabilities(impl: PlatformCapabilities): void {
  adapters.splice(0)
  registerPlatformAdapter({
    provider: 'custom',
    capabilities: impl,
    capabilitiesSupport: { scanFromAlbum: true },
  })
}

/** 只注册已实现的宿主能力；清理函数可重复调用，不会撤销其他实例。 */
export function registerPlatformAdapter(adapter: PlatformAdapter): () => void {
  if (!adapter.provider.trim()) throw new Error('宿主 provider 不能为空')
  const entry: AdapterEntry = {
    adapter,
    readiness: adapter.ready ? 'idle' : 'ready',
  }
  adapters.push(entry)
  return () => {
    const index = adapters.indexOf(entry)
    if (index >= 0) adapters.splice(index, 1)
  }
}

/** 页面按能力控制操作入口，不以编译端或宿主名称硬编码可用状态。 */
export function getPlatformCapabilityStatus(): PlatformCapabilityStatus {
  const active = adapters[adapters.length - 1]
  return {
    provider:
      active?.adapter.provider ||
      (getPlatformEnvironment().runtime === 'h5' ? 'browser' : 'uni'),
    readiness: active?.readiness || 'ready',
    scanCode: isCapabilitySupported('scanCode'),
    scanFromAlbum: isCapabilitySupported('scanCode', true),
    getLocation: isCapabilitySupported('getLocation'),
    takePhoto: isCapabilitySupported('takePhoto'),
  }
}

/** 获取统一入口；跟随最新注册，不能用其对象身份判断宿主或保存实现快照。 */
export function getPlatformCapabilities(): PlatformCapabilities {
  return platform
}

/** 业务仅调用统一能力入口；钉钉/PDA 等必须由项目实际注入实现。 */
export const platform: PlatformCapabilities = {
  scanCode: (source = 'camera') =>
    invokeCapability(
      'scanCode',
      capabilities => capabilities.scanCode(source),
      source === 'album'
    ),
  getLocation: () =>
    invokeCapability('getLocation', capabilities => capabilities.getLocation()),
  takePhoto: source =>
    invokeCapability('takePhoto', capabilities =>
      capabilities.takePhoto(source)
    ),
}
