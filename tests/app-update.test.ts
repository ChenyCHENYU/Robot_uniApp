import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createHash } from 'node:crypto'
import manifest from '@/manifest.json'

interface MemoryFile {
  size: number
  bytes: Uint8Array
  slice: (start: number, end: number) => MemoryFile
  close: () => void
}

const createdFiles: MemoryFile[] = []
const createFile = (bytes: Uint8Array): MemoryFile => {
  const file = {
    size: bytes.byteLength,
    bytes,
    slice: vi.fn((start: number, end: number) =>
      createFile(bytes.subarray(start, end))
    ),
    close: vi.fn(),
  }
  createdFiles.push(file)
  return file
}

/** 模拟官方 FileReader 成功事件，只读取内存中的测试字节。 */
class MemoryReader {
  result = ''
  onload?: (event: unknown) => void
  onerror?: (event: unknown) => void
  onabort?: (event: unknown) => void

  /** 以 DataURL 回调模拟字节，不调用设备文件 API。 */
  readAsDataURL(file: MemoryFile): void {
    this.result = `data:application/octet-stream;base64,${Buffer.from(file.bytes).toString('base64')}`
    this.onload?.({ target: this })
  }
}

const request = vi.fn()
const downloadFile = vi.fn()
const base64ToArrayBuffer = vi.fn()
let plusMock: {
  runtime: {
    versionCode: string
    version: string
    install: ReturnType<typeof vi.fn>
    restart: ReturnType<typeof vi.fn>
  }
  io: {
    resolveLocalFileSystemURL: ReturnType<typeof vi.fn>
    FileReader: typeof MemoryReader
  }
}
const makeManifest = (overrides: Record<string, unknown> = {}) => ({
  versionCode: 999,
  versionName: '9.9.9',
  forceUpdate: false,
  sha256: createHash('sha256').update('abc').digest('hex'),
  wgtUrl: 'https://example.test/update.wgt',
  ...overrides,
})

beforeEach(() => {
  vi.resetModules()
  vi.resetAllMocks()
  createdFiles.length = 0
  base64ToArrayBuffer.mockImplementation((value: string) => {
    const bytes = Buffer.from(value, 'base64')
    return bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength
    )
  })
  const file = createFile(new TextEncoder().encode('abc'))
  plusMock = {
    runtime: {
      versionCode: '200',
      version: '2.0.0',
      install: vi.fn(),
      restart: vi.fn(),
    },
    io: {
      FileReader: MemoryReader,
      resolveLocalFileSystemURL: vi.fn((_path, success) =>
        success({ file: (done: (file: MemoryFile) => void) => done(file) })
      ),
    },
  }
  vi.stubGlobal('plus', plusMock)
  vi.stubGlobal('uni', {
    request,
    downloadFile,
    base64ToArrayBuffer,
    showToast: vi.fn(),
  })
  downloadFile.mockImplementation(options => {
    void options.success({
      statusCode: 200,
      tempFilePath: '_downloads/test.wgt',
    })
    return { onProgressUpdate: vi.fn() }
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('当前 App 版本与跨端降级', () => {
  it('优先使用有效原生版本，缺失版本号时复用当前 manifest', async () => {
    const { getAppRuntimeVersion } = await import('@/services/app-update')
    expect(getAppRuntimeVersion()).toEqual({
      versionCode: 200,
      versionName: '2.0.0',
    })
    plusMock.runtime.versionCode = ''
    plusMock.runtime.version = ''
    expect(getAppRuntimeVersion()).toEqual({
      versionCode: Number(manifest.versionCode),
      versionName: manifest.versionName,
    })
    plusMock.runtime.versionCode = 'NaN'
    expect(getAppRuntimeVersion().versionCode).toBe(
      Number(manifest.versionCode)
    )
  })

  it('不存在 plus 时检查返回 null，下载/安装拒绝且不调用网络或设备', async () => {
    vi.stubGlobal('plus', undefined)
    const {
      checkForUpdate,
      getAppRuntimeVersion,
      downloadUpdatePackage,
      installUpdate,
    } = await import('@/services/app-update')
    await expect(
      checkForUpdate('https://example.test/manifest.json')
    ).resolves.toBeNull()
    expect(() => getAppRuntimeVersion()).toThrow('当前环境不支持 App 资源更新')
    await expect(downloadUpdatePackage(makeManifest())).rejects.toMatchObject({
      code: 'platform_unsupported',
    })
    await expect(installUpdate('_downloads/test.wgt')).rejects.toMatchObject({
      code: 'platform_unsupported',
    })
    expect(request).not.toHaveBeenCalled()
    expect(downloadFile).not.toHaveBeenCalled()
  })
})

describe('远程清单校验', () => {
  it.each([undefined, '', 'a'.repeat(63), 'z'.repeat(64)])(
    '缺失/无效 SHA-256 不允许检查通过 %#',
    async hash => {
      request.mockImplementation(options =>
        options.success({
          statusCode: 200,
          data: makeManifest({ sha256: hash }),
        })
      )
      const { fetchUpdateManifest } = await import('@/services/app-update')
      await expect(
        fetchUpdateManifest('https://example.test/manifest.json')
      ).rejects.toMatchObject({ code: 'manifest_hash_invalid' })
    }
  )

  it('允许有效大小写摘要并归一化；低版本没有更新', async () => {
    const remote = makeManifest({ versionCode: 199, sha256: 'A'.repeat(64) })
    request.mockImplementation(options =>
      options.success({ statusCode: 200, data: remote })
    )
    const { fetchUpdateManifest, checkForUpdate } =
      await import('@/services/app-update')
    expect(
      (await fetchUpdateManifest('https://example.test/manifest.json')).sha256
    ).toBe('a'.repeat(64))
    await expect(
      checkForUpdate('https://example.test/manifest.json')
    ).resolves.toBeNull()
  })

  it('远端版本号和下载协议非法时拒绝', async () => {
    const { fetchUpdateManifest } = await import('@/services/app-update')
    request.mockImplementation(options =>
      options.success({
        statusCode: 200,
        data: makeManifest({ versionCode: 1.5 }),
      })
    )
    await expect(
      fetchUpdateManifest('https://example.test/manifest.json')
    ).rejects.toMatchObject({ code: 'manifest_invalid' })
    request.mockImplementation(options =>
      options.success({
        statusCode: 200,
        data: makeManifest({ wgtUrl: 'javascript:alert(1)' }),
      })
    )
    await expect(
      fetchUpdateManifest('https://example.test/manifest.json')
    ).rejects.toMatchObject({ code: 'manifest_invalid' })
  })
})

describe('App 文件摘要校验', () => {
  it('没有 IO 读取能力时下载前拒绝', async () => {
    vi.stubGlobal('plus', { runtime: plusMock.runtime })
    const { downloadUpdatePackage } = await import('@/services/app-update')
    await expect(downloadUpdatePackage(makeManifest())).rejects.toMatchObject({
      code: 'hash_unsupported',
    })
    expect(downloadFile).not.toHaveBeenCalled()
  })

  it('没有字节解码能力时下载前拒绝', async () => {
    vi.stubGlobal('uni', { request, downloadFile })
    const { downloadUpdatePackage } = await import('@/services/app-update')
    await expect(downloadUpdatePackage(makeManifest())).rejects.toMatchObject({
      code: 'hash_unsupported',
    })
    expect(downloadFile).not.toHaveBeenCalled()
  })

  it('直接调用下载仍必须提供有效 SHA-256', async () => {
    const { downloadUpdatePackage } = await import('@/services/app-update')
    await expect(
      downloadUpdatePackage(makeManifest({ sha256: '' }))
    ).rejects.toMatchObject({ code: 'manifest_hash_invalid' })
    expect(downloadFile).not.toHaveBeenCalled()
  })

  it('通过真实 SHA-256 计算验证跨分片二进制数据，只返回校验成功的路径', async () => {
    const bytes = Uint8Array.from(
      { length: 1024 * 1024 + 13 },
      (_, index) => index % 256
    )
    const file = createFile(bytes)
    plusMock.io.resolveLocalFileSystemURL.mockImplementation((_path, success) =>
      success({ file: (done: (file: MemoryFile) => void) => done(file) })
    )
    const { downloadUpdatePackage } = await import('@/services/app-update')
    const hash = createHash('sha256').update(bytes).digest('hex')
    await expect(
      downloadUpdatePackage(makeManifest({ sha256: hash }))
    ).resolves.toBe('_downloads/test.wgt')
    expect(file.slice).toHaveBeenNthCalledWith(1, 0, 1024 * 1024)
    expect(file.slice).toHaveBeenNthCalledWith(2, 1024 * 1024, bytes.byteLength)
    expect(file.close).toHaveBeenCalledOnce()
    expect(plusMock.runtime.install).not.toHaveBeenCalled()
  })

  it('摘要不匹配时拒绝，不会安装', async () => {
    const { downloadUpdatePackage } = await import('@/services/app-update')
    await expect(
      downloadUpdatePackage(makeManifest({ sha256: 'a'.repeat(64) }))
    ).rejects.toMatchObject({ code: 'hash_mismatch' })
    expect(plusMock.runtime.install).not.toHaveBeenCalled()
  })

  it('空文件不能因匹配空摘要而通过', async () => {
    plusMock.io.resolveLocalFileSystemURL.mockImplementation((_path, success) =>
      success({
        file: (done: (file: MemoryFile) => void) =>
          done(createFile(new Uint8Array())),
      })
    )
    const { downloadUpdatePackage } = await import('@/services/app-update')
    await expect(
      downloadUpdatePackage(
        makeManifest({ sha256: createHash('sha256').update('').digest('hex') })
      )
    ).rejects.toMatchObject({ code: 'hash_read' })
  })

  it('实际返回字节数量不完整时拒绝', async () => {
    base64ToArrayBuffer.mockReturnValue(new ArrayBuffer(1))
    const { downloadUpdatePackage } = await import('@/services/app-update')
    await expect(downloadUpdatePackage(makeManifest())).rejects.toMatchObject({
      code: 'hash_read',
      message: '升级包文件读取不完整',
    })
  })

  it('文件不存在时拒绝，不假装校验完成', async () => {
    plusMock.io.resolveLocalFileSystemURL.mockImplementation(
      (_path, _success, fail) => fail({ message: 'missing' })
    )
    const { downloadUpdatePackage } = await import('@/services/app-update')
    await expect(downloadUpdatePackage(makeManifest())).rejects.toMatchObject({
      code: 'hash_read',
      message: '下载的升级包文件不存在',
    })
  })

  it('原生 IO 未回调时超时，不返回成功路径', async () => {
    vi.useFakeTimers()
    plusMock.io.resolveLocalFileSystemURL.mockImplementation(() => undefined)
    const { downloadUpdatePackage } = await import('@/services/app-update')
    const outcome = expect(
      downloadUpdatePackage(makeManifest())
    ).rejects.toMatchObject({ code: 'hash_timeout' })
    await vi.advanceTimersByTimeAsync(10000)
    await outcome
    expect(plusMock.runtime.install).not.toHaveBeenCalled()
  })

  it('读取失败不会通过 onloadend 当成成功', async () => {
    /** 模拟原生只返回失败事件。 */
    class FailedReader extends MemoryReader {
      /** 返回读取失败，不读取真实文件。 */
      readAsDataURL(_file: MemoryFile): void {
        this.onerror?.({ target: this })
      }
    }
    plusMock.io.FileReader = FailedReader
    const { downloadUpdatePackage } = await import('@/services/app-update')
    await expect(downloadUpdatePackage(makeManifest())).rejects.toMatchObject({
      code: 'hash_read',
      message: '读取升级包失败',
    })
  })
})
