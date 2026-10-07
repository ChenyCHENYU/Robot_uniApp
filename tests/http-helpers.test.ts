import { describe, it, expect } from 'vitest'
import {
  httpError,
  getStatusMessage,
  isBusinessSuccess,
  extractBusinessData,
  parseResponseBody,
  isCancelledError,
} from '@/utils/http-helpers'
import { RESPONSE_CODE } from '@/constants/business'

describe('http-helpers（协议判定）', () => {
  it('成功协议：code === 0', () => {
    expect(isBusinessSuccess({ code: 0, message: 'ok', data: 1 })).toBe(true)
  })

  it('成功协议：success === true 兼容', () => {
    expect(isBusinessSuccess({ success: true, data: 1 })).toBe(true)
  })

  it('失败协议：code 200 不再是成功（历史回归防护）', () => {
    expect(isBusinessSuccess({ code: 200 })).toBe(false)
    expect(isBusinessSuccess({ code: 1 })).toBe(false)
  })

  it('RESPONSE_CODE 常量与协议一致', () => {
    expect(RESPONSE_CODE.SUCCESS).toBe(0)
    expect(RESPONSE_CODE.UNAUTHORIZED).toBe(401)
  })

  it('extractBusinessData：有 data 取 data，无 data 回退整包', () => {
    expect(extractBusinessData({ code: 0, data: { a: 1 } })).toEqual({ a: 1 })
    expect(extractBusinessData({ code: 0 })).toEqual({ code: 0 })
  })

  it('parseResponseBody：字符串 JSON 解析 / 对象透传 / 非法 JSON 抛协议错误', () => {
    expect(parseResponseBody('{"code":0}')).toEqual({ code: 0 })
    expect(parseResponseBody({ code: 0 })).toEqual({ code: 0 })
    expect(() => parseResponseBody('<html>')).toThrowError('响应格式错误')
  })

  it('getStatusMessage：已知码给文案，未知码带码号', () => {
    expect(getStatusMessage(401)).toBe('未授权，请重新登录')
    expect(getStatusMessage(599)).toBe('网络错误(599)')
  })

  it('httpError 工厂与取消判定', () => {
    const cancel = httpError(-1, '请求已取消')
    expect(isCancelledError(cancel)).toBe(true)
    expect(isCancelledError(httpError(-1, '网络连接失败'))).toBe(false)
    expect(httpError(500, 'x', true).retryable).toBe(true)
  })
})
