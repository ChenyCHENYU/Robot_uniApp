import { describe, it, expect, beforeEach, vi } from 'vitest'
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
  reLaunch: vi.fn(),
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
    await expect(http.get('/forbidden', undefined, { retryDelay: 1 })).rejects.toMatchObject(
      { code: 403 }
    )
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

    const [a, b] = await Promise.all([
      http.get('/dedupe'),
      http.get('/dedupe'),
    ])
    expect(calls).toBe(1)
    expect(a).toBe(b)
  })

})
