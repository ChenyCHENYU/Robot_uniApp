import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

/**
 * http 层行为测试：通过桩替换 uni.request，验证协议判定/重试/401/去重。
 * http 为模块级单例，配置在 import 时读取（env/stub 均在 setup 就绪）。
 */

// 可编程的 uni.request 桩
let requestImpl: (options: any) => void

vi.stubGlobal('uni', {
  ...uni,
  request: (options: any) => {
    requestImpl(options)
    return { abort: () => {} }
  },
  showLoading: () => {},
  hideLoading: () => {},
  showToast: vi.fn(),
  reLaunch: vi.fn((options: any) =>
    options.complete?.({ errMsg: 'reLaunch:ok' })
  ),
  setStorageSync: uni.setStorageSync,
  getStorageSync: uni.getStorageSync,
})

import http from '@/utils/http'
import { useUserStore } from '@/stores/modules/user'

/** 以指定响应一次性/多次 resolve 请求桩 */
function respondWith(responses: any[]) {
  let call = 0
  requestImpl = (options: any) => {
    const res = responses[Math.min(call, responses.length - 1)]
    call++
    setTimeout(() => {
      if (res instanceof Error) {
        options.fail?.({ errMsg: res.message })
      } else {
        options.success?.(res)
      }
    }, 0)
  }
}

describe('http 层行为', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    uni.clearStorageSync()
    vi.stubGlobal('getCurrentPages', () => [])
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('成功协议：HTTP 200 + code 0 → 返回 data 体', async () => {
    respondWith([
      { statusCode: 200, data: { code: 0, message: 'ok', data: { id: 1 } } },
    ])
    const result = await http.get('/x')
    expect(result).toEqual({ id: 1 })
  })

  it('业务错误：code 400 → reject 且不重试（网络层仅一次调用）', async () => {
    let calls = 0
    requestImpl = (options: any) => {
      calls++
      setTimeout(() => {
        options.success?.({
          statusCode: 200,
          data: { code: 400, message: '参数错误' },
        })
      }, 0)
    }

    await expect(http.get('/biz-error')).rejects.toMatchObject({
      code: 400,
      message: '参数错误',
    })
    expect(calls).toBe(1) // 业务错误不重试
  })

  it('网络失败重试：两次失败后第三次成功（GET 默认 retry 2）', async () => {
    let calls = 0
    requestImpl = (options: any) => {
      calls++
      setTimeout(() => {
        if (calls < 3) {
          options.fail?.({ errMsg: 'request:fail timeout' })
        } else {
          options.success?.({
            statusCode: 200,
            data: { code: 0, data: 'ok' },
          })
        }
      }, 0)
    }

    const result = await http.get('/flaky', undefined, { retryDelay: 1 })
    expect(result).toBe('ok')
    expect(calls).toBe(3)
  })

  it('5xx 可重试 / 4xx 不重试', async () => {
    let calls = 0
    requestImpl = (options: any) => {
      calls++
      setTimeout(() => {
        options.success?.({ statusCode: 403, data: {} })
      }, 0)
    }
    await expect(
      http.get('/forbidden', undefined, { retryDelay: 1 })
    ).rejects.toMatchObject({ code: 403 })
    expect(calls).toBe(1)

    calls = 0
    requestImpl = (options: any) => {
      calls++
      setTimeout(() => {
        options.success?.({ statusCode: 502, data: {} })
      }, 0)
    }
    await expect(
      http.get('/gateway', undefined, { retryDelay: 1 })
    ).rejects.toMatchObject({ code: 502 })
    expect(calls).toBe(3) // 1 + 2 retries
  })

  it('响应体为非法 JSON：抛协议错误而非语法错误', async () => {
    respondWith([{ statusCode: 200, data: '<html>502</html>' }])
    await expect(http.get('/bad-json')).rejects.toMatchObject({
      code: -2,
      message: '响应格式错误',
    })
  })

  it('401：清登录态 + 保存来源页 + reLaunch 登录页', async () => {
    const store = useUserStore()
    store.token = 'expired'

    respondWith([{ statusCode: 200, data: { code: 401, message: '未授权' } }])

    await expect(http.get('/expired')).rejects.toMatchObject({ code: 401 })
    expect(store.token).toBe('')
    expect(uni.reLaunch).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/pages/login/index' })
    )
    expect(uni.getStorageSync('REDIRECT_URL')).toBe('') // 测试环境无页面栈，不写入
  })

  it('去重：并发相同 GET 仅发一次底层请求', async () => {
    let calls = 0
    requestImpl = (options: any) => {
      calls++
      setTimeout(() => {
        options.success?.({ statusCode: 200, data: { code: 0, data: calls } })
      }, 10)
    }

    const [a, b] = await Promise.all([http.get('/dedupe'), http.get('/dedupe')])
    expect(calls).toBe(1)
    expect(a).toBe(b)
  })

  it.each([
    {
      name: '业务401',
      statusCode: 200,
      data: { code: 401, message: '旧令牌过期' },
    },
    { name: 'HTTP401', statusCode: 401, data: {} },
    {
      name: '成功资料',
      statusCode: 200,
      data: { code: 0, data: { username: '旧账号' } },
    },
  ])(
    '切换账号后旧 $name 响应作为取消处理，不清新会话或回写旧结果',
    async response => {
      let oldRequest: any
      requestImpl = options => {
        oldRequest = options
      }
      const store = useUserStore()
      store.token = 'old_account_token'
      const pending = http.get('/old-response', undefined, {
        retry: 0,
        cancelable: false,
      })
      const cancelled = expect(pending).rejects.toMatchObject({
        code: -1,
        message: '请求已取消',
        retryable: false,
      })

      store.clearUserInfo()
      store.token = 'new_account_token'
      oldRequest.success(response)
      await cancelled

      expect(store.token).toBe('new_account_token')
      expect(uni.reLaunch).not.toHaveBeenCalled()
      expect(uni.showToast).not.toHaveBeenCalled()
      expect(http.loadingCount).toBe(0)
    }
  )

  it('旧GET网络退避期间切换账号，不携带新账号令牌重发旧请求', async () => {
    vi.useFakeTimers()
    const sentTokens: string[] = []
    let firstRequest: any
    requestImpl = options => {
      sentTokens.push(options.header.Authorization)
      firstRequest = options
    }
    const store = useUserStore()
    store.token = 'old_account_token'
    const pending = http.get('/retry-old-account', undefined, {
      retry: 1,
      retryDelay: 10,
      silent: true,
      cancelable: false,
    })
    const cancelled = expect(pending).rejects.toMatchObject({
      code: -1,
      message: '请求已取消',
    })
    firstRequest.fail({ errMsg: 'request:fail timeout' })
    await vi.advanceTimersByTimeAsync(0)

    store.clearUserInfo()
    store.token = 'new_account_token'
    await vi.advanceTimersByTimeAsync(10)
    await cancelled

    expect(sentTokens).toEqual(['Bearer old_account_token'])
    expect(store.token).toBe('new_account_token')
    expect(uni.reLaunch).not.toHaveBeenCalled()
    expect(uni.showToast).not.toHaveBeenCalled()
  })

  it('同一会话更新令牌仍允许合法重试使用最新令牌', async () => {
    vi.useFakeTimers()
    const sentTokens: string[] = []
    let firstRequest: any
    requestImpl = options => {
      sentTokens.push(options.header.Authorization)
      if (sentTokens.length === 1) firstRequest = options
      else
        options.success({ statusCode: 200, data: { code: 0, data: 'renewed' } })
    }
    const store = useUserStore()
    store.token = 'original_token'
    const pending = http.get('/same-session-renewal', undefined, {
      retry: 1,
      retryDelay: 10,
      silent: true,
      cancelable: false,
    })
    firstRequest.fail({ errMsg: 'request:fail timeout' })
    await vi.advanceTimersByTimeAsync(0)
    store.token = 'renewed_token'
    await vi.advanceTimersByTimeAsync(10)

    await expect(pending).resolves.toBe('renewed')
    expect(sentTokens).toEqual([
      'Bearer original_token',
      'Bearer renewed_token',
    ])
  })

  it('旧上传401与进度回调不会清新会话或覆盖新账号界面', async () => {
    let uploadOptions: any
    let progressCallback: (value: { progress: number }) => void = () => {}
    const onProgress = vi.fn()
    uni.uploadFile = vi.fn((options: any) => {
      uploadOptions = options
      return {
        onProgressUpdate: (callback: typeof progressCallback) => {
          progressCallback = callback
        },
      }
    }) as typeof uni.uploadFile
    const store = useUserStore()
    store.token = 'old_upload_token'
    const pending = http.upload(
      '/upload-old-account',
      '/local/file.png',
      {},
      { onProgress }
    )
    const cancelled = expect(pending).rejects.toMatchObject({
      code: -1,
      message: '请求已取消',
    })
    progressCallback({ progress: 25 })

    store.clearUserInfo()
    store.token = 'new_account_token'
    progressCallback({ progress: 90 })
    await uploadOptions.success({ statusCode: 401, data: '{}' })
    uploadOptions.complete()
    await cancelled

    expect(onProgress).toHaveBeenCalledTimes(1)
    expect(onProgress).toHaveBeenCalledWith(25)
    expect(store.token).toBe('new_account_token')
    expect(uni.reLaunch).not.toHaveBeenCalled()
    expect(uni.showToast).not.toHaveBeenCalled()
    expect(http.loadingCount).toBe(0)
  })

  it.each(['success', 'fail'] as const)(
    '请求 %s 后立即释放来源页面的任务引用',
    async outcome => {
      vi.stubGlobal('getCurrentPages', () => [{ route: 'pages/source/index' }])
      let options: any
      requestImpl = value => {
        options = value
      }
      const pending = http.get('/release-' + outcome, undefined, {
        retry: 0,
        silent: true,
      })
      expect(http.pageTasksMap.get('/pages/source/index')?.size).toBe(1)
      const assertion =
        outcome === 'success'
          ? expect(pending).resolves.toBe('done')
          : expect(pending).rejects.toMatchObject({ code: -1 })
      if (outcome === 'success')
        options.success({ statusCode: 200, data: { code: 0, data: 'done' } })
      else options.fail({ errMsg: 'request:fail timeout' })
      await assertion
      expect(http.pageTasksMap.has('/pages/source/index')).toBe(false)
    }
  )

  it('请求重试始终登记在来源页面，不挂到当前新页面', async () => {
    vi.useFakeTimers()
    let route = 'pages/source/index'
    vi.stubGlobal('getCurrentPages', () => [{ route }])
    const requests: any[] = []
    requestImpl = options => {
      requests.push(options)
    }
    const pending = http.get('/retry-source-page', undefined, {
      retry: 1,
      retryDelay: 10,
      silent: true,
    })
    requests[0].fail({ errMsg: 'request:fail timeout' })
    await vi.advanceTimersByTimeAsync(0)
    route = 'pages/new/index'
    await vi.advanceTimersByTimeAsync(10)
    expect(requests).toHaveLength(2)
    expect(http.pageTasksMap.get('/pages/source/index')?.size).toBe(1)
    expect(http.pageTasksMap.has('/pages/new/index')).toBe(false)
    requests[1].success({ statusCode: 200, data: { code: 0, data: 'retried' } })
    await expect(pending).resolves.toBe('retried')
    expect(http.pageTasksMap.has('/pages/source/index')).toBe(false)
  })

  it('来源页在网络退避阶段卸载，也取消尚未发出的重试', async () => {
    vi.useFakeTimers()
    let route = 'pages/source/index'
    vi.stubGlobal('getCurrentPages', () => [{ route }])
    const requests: any[] = []
    requestImpl = options => {
      requests.push(options)
    }
    const pending = http.get('/unload-during-backoff', undefined, {
      retry: 1,
      retryDelay: 10,
      silent: true,
    })
    const cancelled = expect(pending).rejects.toMatchObject({
      code: -1,
      message: '请求已取消',
    })
    requests[0].fail({ errMsg: 'request:fail timeout' })
    await vi.advanceTimersByTimeAsync(0)
    expect(http.pageTasksMap.has('/pages/source/index')).toBe(false)
    route = 'pages/new/index'
    http.cancelPageRequests('/pages/source/index')
    await vi.advanceTimersByTimeAsync(10)
    await cancelled
    expect(requests).toHaveLength(1)
    expect(uni.showToast).not.toHaveBeenCalled()
  })

  it.each([
    { statusCode: 200, data: '{"code":401,"message":"上传会话过期"}' },
    { statusCode: 401, data: '{}' },
  ])(
    '上传业务401和HTTP401共用清会话、来源回跳处理：$statusCode',
    async response => {
      vi.stubGlobal('getCurrentPages', () => [
        { route: 'pages/form-template/index', options: { id: 'record 1' } },
      ])
      const user = useUserStore()
      user.token = 'expired_upload_token'
      let options: any
      uni.uploadFile = vi.fn((value: any) => {
        options = value
        return { onProgressUpdate: () => {} }
      }) as typeof uni.uploadFile
      const pending = http.upload('/upload-current-account', '/file.png')
      const rejected = expect(pending).rejects.toMatchObject({ code: 401 })
      await options.success(response)
      options.complete()
      await rejected
      expect(user.token).toBe('')
      expect(uni.reLaunch).toHaveBeenCalledWith(
        expect.objectContaining({ url: '/pages/login/index' })
      )
      expect(uni.getStorageSync('REDIRECT_URL')).toBe(
        '/pages/form-template/index?id=record%201'
      )
      expect(http.loadingCount).toBe(0)
    }
  )
})
