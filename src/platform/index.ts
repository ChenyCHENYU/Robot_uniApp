/**
 * 平台能力注册表 — 按端条件编译挑选实现
 *
 * 当前内置：uni-app 原生实现（小程序/App 完整，H5 降级）。
 * 接入新宿主（钉钉/企业微信容器等）时，在宿主初始化处调用
 * setPlatformCapabilities(impl) 覆盖即可，业务代码零改动。
 */
import {
  PlatformError,
  normalizeUniError,
  type PlatformCapabilities,
} from './types'

export { PlatformError, normalizeUniError }
export type {
  PlatformCapabilities,
  ScanResult,
  LocationResult,
  PhotoResult,
} from './types'

/** uni 原生能力实现（小程序/App） */
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

// 按端挑选默认实现（条件编译；声明唯一，赋值按端保留其一）
let current: PlatformCapabilities
// #ifdef H5
current = h5Capabilities
// #endif
// #ifndef H5
current = uniCapabilities
// #endif

/** 覆盖能力实现（宿主初始化时调用，如钉钉容器） */
/** 覆盖能力实现（宿主初始化时调用，如钉钉容器） */
export function setPlatformCapabilities(impl: PlatformCapabilities) {
  current = impl
}

/** 获取当前能力实现 */
/** 获取当前能力实现 */
export function getPlatformCapabilities(): PlatformCapabilities {
  return current
}

/** 便捷访问：platform.scanCode() / platform.getLocation() / platform.takePhoto() */
/** 便捷访问：platform.scanCode() / platform.getLocation() / platform.takePhoto() */
export const platform: PlatformCapabilities = {
  scanCode: (...args) => current.scanCode(...args),
  getLocation: () => current.getLocation(),
  takePhoto: (...args) => current.takePhoto(...args),
}
