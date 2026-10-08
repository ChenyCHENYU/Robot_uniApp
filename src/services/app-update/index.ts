/**
 * App 热更新服务（wgt 资源包）
 *
 * 流程：
 * 1. 拉取 manifest（env 配置 VITE_APP_UPDATE_MANIFEST，或运行时传入）
 * 2. 比较 versionCode / 强更标记
 * 3. 下载 wgt（进度回调）+ 必需的 sha256 完整性校验（@noble/hashes）
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
 * 仅具备 HTML5+ runtime/io 的 App 可用；其它端检查返回 null，写操作明确拒绝。
 * 代码和模拟测试不代表完成真机升级验收；发布前仍需配置更新源与签名。
 */
import { sha256 } from '@noble/hashes/sha2'
import { bytesToHex } from '@noble/hashes/utils'
import appManifest from '@/manifest.json'

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
const FILE_READ_TIMEOUT_MS = 10000

/** 断言 App 运行时可用 */
function requirePlus(): void {
  if (typeof plus === 'undefined' || !plus.runtime) {
    throw new AppUpdateError(
      'platform_unsupported',
      '当前环境不支持 App 资源更新'
    )
  }
}

/** 摘要为必填；没有校验值的远端文件不能进入下载或安装流程。 */
function requireSha256(value: unknown): string {
  if (typeof value !== 'string' || !/^[a-f0-9]{64}$/i.test(value.trim())) {
    throw new AppUpdateError(
      'manifest_hash_invalid',
      '升级清单必须提供有效的 SHA-256（64 位十六进制）'
    )
  }
  return value.trim().toLowerCase()
}

/** 不信任远端清单的 TypeScript 断言，先验证再形成更新对象。 */
function requireWgtUrl(value: unknown): string {
  if (
    typeof value !== 'string' ||
    !/^https?:\/\/[^\s/]+(?:\/[^\s]*)?$/i.test(value)
  ) {
    throw new AppUpdateError(
      'manifest_invalid',
      '升级包必须使用有效的 HTTP(S) 地址'
    )
  }
  return value
}

/** 清单只在字段有效且包含摘要时进入下载流程。 */
function parseUpdateManifest(input: unknown): AppUpdateManifest {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new AppUpdateError('manifest_invalid', '升级清单结构不合法')
  }
  const value = input as Record<string, unknown>
  if (
    !Number.isSafeInteger(value.versionCode) ||
    Number(value.versionCode) <= 0 ||
    typeof value.versionName !== 'string' ||
    !value.versionName.trim()
  ) {
    throw new AppUpdateError('manifest_invalid', '升级清单版本信息不合法')
  }
  return {
    versionName: value.versionName.trim(),
    versionCode: Number(value.versionCode),
    forceUpdate: value.forceUpdate === true,
    sha256: requireSha256(value.sha256),
    wgtUrl: requireWgtUrl(value.wgtUrl),
    releaseNotes:
      typeof value.releaseNotes === 'string' ? value.releaseNotes : undefined,
  }
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
        try {
          resolve(parseUpdateManifest(res.data))
        } catch (error) {
          reject(error)
        }
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
  const plusRuntime = plus.runtime
  const runtimeCode = Number(plusRuntime.versionCode)
  const versionCode =
    Number.isSafeInteger(runtimeCode) && runtimeCode > 0
      ? runtimeCode
      : Number(appManifest.versionCode)
  if (!Number.isSafeInteger(versionCode) || versionCode <= 0) {
    throw new AppUpdateError(
      'runtime_version_invalid',
      '无法获取当前应用的有效版本号'
    )
  }
  return {
    versionCode,
    versionName: String(plusRuntime.version || appManifest.versionName),
  }
}

/** 检查更新（无更新或非 App 端返回 null） */
export async function checkForUpdate(
  manifestUrl?: string
): Promise<AvailableAppUpdate | null> {
  if (typeof plus === 'undefined' || !plus.runtime) return null
  const manifest = await fetchUpdateManifest(manifestUrl)
  const current = getAppRuntimeVersion()
  if (manifest.versionCode <= current.versionCode) return null
  return { manifest, currentVersionCode: current.versionCode }
}

/** JS 引擎 App 使用 HTML5+ 文件 API，缺少能力时不能跳过完整性验证。 */
function requireNativeFileIo(): void {
  requirePlus()
  if (
    !plus.io ||
    typeof plus.io.resolveLocalFileSystemURL !== 'function' ||
    typeof plus.io.FileReader !== 'function' ||
    typeof uni === 'undefined' ||
    typeof uni.base64ToArrayBuffer !== 'function'
  ) {
    throw new AppUpdateError(
      'hash_unsupported',
      '当前 App 缺少升级包校验所需的文件读取能力'
    )
  }
}

/** 原生回调设置等待上限，缺失回调不得让升级流程一直挂起。 */
function waitForNative<T>(
  operation: (
    resolve: (value: T) => void,
    reject: (error: AppUpdateError) => void
  ) => void
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () =>
        reject(new AppUpdateError('hash_timeout', '读取升级包超时，请重试')),
      FILE_READ_TIMEOUT_MS
    )
    try {
      operation(
        value => {
          clearTimeout(timer)
          resolve(value)
        },
        error => {
          clearTimeout(timer)
          reject(error)
        }
      )
    } catch (error) {
      clearTimeout(timer)
      reject(
        error instanceof AppUpdateError
          ? error
          : new AppUpdateError('hash_read', '读取升级包失败')
      )
    }
  })
}

/** 解析下载返回的本地文件路径；目录或缺失文件明确拒绝。 */
function resolveNativeFile(filePath: string): Promise<PlusIoFile> {
  return waitForNative((resolve, reject) => {
    plus.io.resolveLocalFileSystemURL(
      filePath,
      entry => {
        // SDK 把回调声明成 DirectoryEntry；运行时先收窄实际 FileEntry.file 方法。
        if (!entry || !('file' in entry) || typeof entry.file !== 'function') {
          reject(new AppUpdateError('hash_read', '升级包路径不是有效文件'))
          return
        }
        const readFile = entry.file as PlusIoFileEntry['file']
        readFile.call(entry, resolve, () =>
          reject(new AppUpdateError('hash_read', '读取升级包文件失败'))
        )
      },
      () => reject(new AppUpdateError('hash_read', '下载的升级包文件不存在'))
    )
  })
}

/** 只处理成功读取事件，校验实际字节数，防止空回调成为假成功。 */
function readNativeChunk(
  file: PlusIoFile,
  expectedSize: number
): Promise<Uint8Array> {
  return waitForNative((resolve, reject) => {
    const reader = new plus.io.FileReader()
    reader.onload = () => {
      try {
        const dataUrl = String(reader.result || '')
        const encoded = /^data:[^,]*;base64,([a-z0-9+/]*={0,2})$/i.exec(
          dataUrl
        )?.[1]
        if (!encoded)
          throw new AppUpdateError('hash_read', '升级包文件读取结果无效')
        const bytes = new Uint8Array(uni.base64ToArrayBuffer(encoded))
        if (bytes.byteLength !== expectedSize)
          throw new AppUpdateError('hash_read', '升级包文件读取不完整')
        resolve(bytes)
      } catch (error) {
        reject(
          error instanceof AppUpdateError
            ? error
            : new AppUpdateError('hash_read', '升级包文件解码失败')
        )
      }
    }
    reader.onerror = () =>
      reject(new AppUpdateError('hash_read', '读取升级包失败'))
    reader.onabort = () =>
      reject(new AppUpdateError('hash_read', '升级包读取已取消'))
    reader.readAsDataURL(file)
  })
}

/** 释放 IO 对象不覆盖原来的下载/校验错误。 */
function closeNativeFile(file: PlusIoFile): void {
  try {
    if (typeof file.close === 'function') file.close()
  } catch {
    // 清理失败不能将原有摘要校验失败改写为另一种结果。
  }
}

/** 按官方 plus.io File.slice/FileReader 分块读取；尚未进行设备升级验收。 */
async function hashLocalFile(filePath: string): Promise<string> {
  requireNativeFileIo()
  const file = await resolveNativeFile(filePath)
  try {
    const total = Number(file.size)
    if (
      !Number.isSafeInteger(total) ||
      total <= 0 ||
      typeof file.slice !== 'function'
    ) {
      throw new AppUpdateError('hash_read', '升级包为空或不支持完整读取')
    }
    const hash = sha256.create()
    for (let offset = 0; offset < total; offset += CHUNK_SIZE) {
      const end = Math.min(total, offset + CHUNK_SIZE)
      const chunk = file.slice(offset, end)
      try {
        // SHA-256 必须按文件顺序读取分片，不能并行打乱顺序。
        // eslint-disable-next-line no-await-in-loop
        hash.update(await readNativeChunk(chunk, end - offset))
      } finally {
        closeNativeFile(chunk)
      }
    }
    return bytesToHex(hash.digest())
  } finally {
    closeNativeFile(file)
  }
}

/** 下载 wgt 安装包（进度回调），返回临时文件路径 */
export async function downloadUpdatePackage(
  manifest: AppUpdateManifest,
  onProgress?: (progress: AppUpdateDownloadProgress) => void
): Promise<string> {
  requireNativeFileIo()
  const verifiedManifest = parseUpdateManifest(manifest)
  return new Promise((resolve, reject) => {
    const task = uni.downloadFile({
      url: verifiedManifest.wgtUrl,
      timeout: 120000,
      success: async res => {
        if (res.statusCode !== 200) {
          reject(
            new AppUpdateError('download_http', `下载失败: ${res.statusCode}`)
          )
          return
        }
        try {
          const actual = await hashLocalFile(res.tempFilePath)
          if (actual !== verifiedManifest.sha256) {
            throw new AppUpdateError(
              'hash_mismatch',
              '安装包校验失败（SHA-256 不匹配）'
            )
          }
          resolve(res.tempFilePath)
        } catch (error) {
          reject(error)
        }
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

/** 安装 downloadUpdatePackage 校验成功的资源包，restart=true 时重启。 */
export function installUpdate(wgtPath: string, restart = false): Promise<void> {
  return new Promise((resolve, reject) => {
    requirePlus()
    plus.runtime.install(
      wgtPath,
      { force: false },
      () => {
        if (restart) {
          uni.showToast({ title: '更新完成，即将重启', icon: 'none' })
          setTimeout(() => plus.runtime.restart(), 800)
        } else {
          uni.showToast({ title: '更新将在下次启动生效', icon: 'none' })
        }
        resolve()
      },
      err => reject(new AppUpdateError('install_failed', JSON.stringify(err)))
    )
  })
}
