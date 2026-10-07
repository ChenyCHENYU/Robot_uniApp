/**
 * App 热更新服务（wgt 资源包）
 *
 * 流程：
 * 1. 拉取 manifest（env 配置 VITE_APP_UPDATE_MANIFEST，或运行时传入）
 * 2. 比较 versionCode / 强更标记
 * 3. 下载 wgt（进度回调）+ sha256 完整性校验（@noble/hashes）
 * 4. plus.runtime.install 安装，按需重启
 *
 * manifest 格式（JSON）：
 * {
 *   "versionName": "1.1.0",
 *   "versionCode": 101,
 *   "forceUpdate": false,
 *   "sha256": "<wgt 文件 sha256 hex>",
 *   "wgtUrl": "https://cdn.example.com/app/1.1.0.wgt",
 *   "releaseNotes": "修复若干问题"
 * }
 *
 * 仅 App 端可用；其它端调用 checkForUpdate 返回 null。
 */
import { sha256 } from '@noble/hashes/sha2'
import { bytesToHex } from '@noble/hashes/utils'
import { logger } from '@/utils/logger'

declare const __VERSION_CODE__: number

export interface AppUpdateManifest {
  versionName: string
  versionCode: number
  forceUpdate: boolean
  sha256: string
  wgtUrl: string
  releaseNotes?: string
}

export interface AppUpdateDownloadProgress {
  received: number
  total: number
  percent: number
}

export interface AvailableAppUpdate {
  manifest: AppUpdateManifest
  currentVersionCode: number
}

/** App 更新错误（code 机器可读，message 用户安全） */
export class AppUpdateError extends Error {
  /** 构造带机器可读错误码的更新异常 */
  constructor(
    public readonly code: string,
    message: string
  ) {
    super(message)
    this.name = 'AppUpdateError'
  }
}

const CHUNK_SIZE = 1024 * 1024

/** 断言 App 运行时可用 */
function requirePlus(): void {
  // #ifndef APP-PLUS
  throw new AppUpdateError('platform_unsupported', '热更新仅支持 App 端')
  // #endif
}

/** 读取 manifest 地址（env 配置） */
function getManifestUrl(): string {
  const url = (import.meta.env.VITE_APP_UPDATE_MANIFEST || '').trim()
  if (!url) {
    throw new AppUpdateError(
      'manifest_unconfigured',
      '未配置 VITE_APP_UPDATE_MANIFEST，请在 env/ 中设置更新清单地址'
    )
  }
  return url
}

/** 拉取远端 manifest（走 uni.request，失败抛错） */
export function fetchUpdateManifest(
  manifestUrl?: string
): Promise<AppUpdateManifest> {
  const url = manifestUrl || getManifestUrl()
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method: 'GET',
      timeout: 15000,
      success: res => {
        if (res.statusCode !== 200) {
          reject(
            new AppUpdateError(
              'manifest_http',
              `manifest 请求失败: ${res.statusCode}`
            )
          )
          return
        }
        const data = res.data as AppUpdateManifest
        if (!data || typeof data.versionCode !== 'number' || !data.wgtUrl) {
          reject(new AppUpdateError('manifest_invalid', 'manifest 结构不合法'))
          return
        }
        resolve(data)
      },
      fail: err =>
        reject(
          new AppUpdateError(
            'manifest_network',
            err.errMsg || 'manifest 网络失败'
          )
        ),
    })
  })
}

/** 当前 App 运行版本信息 */
export function getAppRuntimeVersion(): {
  versionCode: number
  versionName: string
} {
  requirePlus()
  const plusRuntime = (plus as any).runtime
  return {
    versionCode: Number(plusRuntime?.versionCode || __VERSION_CODE__),
    versionName: String(plusRuntime?.version || '0.0.0'),
  }
}

/** 检查更新（无更新或非 App 端返回 null） */
export async function checkForUpdate(
  manifestUrl?: string
): Promise<AvailableAppUpdate | null> {
  // #ifdef APP-PLUS
  const manifest = await fetchUpdateManifest(manifestUrl)
  const current = getAppRuntimeVersion()
  if (manifest.versionCode <= current.versionCode) return null
  return { manifest, currentVersionCode: current.versionCode }
  // #endif
  // #ifndef APP-PLUS
  void manifestUrl
  return null
  // #endif
}

/** 分块读取本地文件并计算 sha256（hex） */
/** 分块读取本地文件并计算 sha256（hex） */
function hashLocalFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fsm = uni.getFileSystemManager()
    fsm.stat({
      path: filePath,
      success: statRes => {
        const total = (statRes.stats as { size: number }).size
        let offset = 0
        const hash = sha256.create()
        const readNext = () => {
          if (offset >= total) {
            resolve(bytesToHex(hash.digest()))
            return
          }
          fsm.readFile({
            filePath,
            position: offset,
            length: Math.min(CHUNK_SIZE, total - offset),
            success: chunkRes => {
              hash.update(new Uint8Array(chunkRes.data as ArrayBuffer))
              offset += CHUNK_SIZE
              readNext()
            },
            fail: err =>
              reject(new AppUpdateError('hash_read', err.errMsg || '读取失败')),
          })
        }
        readNext()
      },
      fail: err =>
        reject(new AppUpdateError('hash_stat', err.errMsg || 'stat 失败')),
    })
  })
}

/** 下载 wgt 安装包（进度回调），返回临时文件路径 */
export function downloadUpdatePackage(
  manifest: AppUpdateManifest,
  onProgress?: (progress: AppUpdateDownloadProgress) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const task = uni.downloadFile({
      url: manifest.wgtUrl,
      timeout: 120000,
      success: async res => {
        if (res.statusCode !== 200) {
          reject(
            new AppUpdateError('download_http', `下载失败: ${res.statusCode}`)
          )
          return
        }
        // sha256 完整性校验
        if (manifest.sha256) {
          try {
            const actual = await hashLocalFile(res.tempFilePath)
            if (actual.toLowerCase() !== manifest.sha256.toLowerCase()) {
              reject(
                new AppUpdateError(
                  'hash_mismatch',
                  '安装包校验失败（sha256 不匹配）'
                )
              )
              return
            }
          } catch (error) {
            reject(error)
            return
          }
        } else {
          logger.warn('[app-update] manifest 未提供 sha256，跳过完整性校验')
        }
        resolve(res.tempFilePath)
      },
      fail: err =>
        reject(
          new AppUpdateError('download_network', err.errMsg || '下载失败')
        ),
    })
    if (onProgress && task) {
      task.onProgressUpdate(res => {
        onProgress({
          received: res.totalBytesWritten,
          total: res.totalBytesExpectedToWrite,
          percent: res.progress,
        })
      })
    }
  })
}

/** 安装更新（forceUpdate=true 时安装后立即重启） */
export function installUpdate(wgtPath: string, restart = false): Promise<void> {
  return new Promise((resolve, reject) => {
    requirePlus()
    ;(plus as any).runtime.install(
      wgtPath,
      { force: false },
      () => {
        if (restart) {
          uni.showToast({ title: '更新完成，即将重启', icon: 'none' })
          setTimeout(() => (plus as any).runtime.restart(), 800)
        } else {
          uni.showToast({ title: '更新将在下次启动生效', icon: 'none' })
        }
        resolve()
      },
      err => reject(new AppUpdateError('install_failed', JSON.stringify(err)))
    )
  })
}
