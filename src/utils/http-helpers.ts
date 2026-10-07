/**
 * HTTP 协议判定与文案工具（供 http.ts 消费，保持核心类收敛）
 */
import { RESPONSE_CODE } from '@/constants/business'
import type { HttpError } from './http-types'

/** HTTP 状态码 → 用户可读文案 */
const STATUS_MESSAGES: Record<number, string> = {
  400: '请求参数错误',
  401: '未授权，请重新登录',
  403: '权限不足',
  404: '请求的资源不存在',
  408: '请求超时',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
}

/** 构造统一请求错误 */
export function httpError(
  code: number,
  message: string,
  retryable = false
): HttpError {
  return { code, message, retryable }
}

/** 状态码文案 */
export function getStatusMessage(code: number): string {
  return STATUS_MESSAGES[code] || `网络错误(${code})`
}

/** 判断业务响应是否成功（协议：code === 0 或 success === true） */
export function isBusinessSuccess(data: Record<string, any>): boolean {
  return data.code === RESPONSE_CODE.SUCCESS || data.success === true
}

/** 提取业务数据体（无 data 字段时回退整包） */
export function extractBusinessData(data: Record<string, any>): any {
  return data.data !== undefined ? data.data : data
}

/** 解析响应体（字符串时 JSON.parse；解析失败抛协议错误） */
export function parseResponseBody(rawData: unknown): Record<string, any> {
  if (typeof rawData !== 'string') return rawData as Record<string, any>
  try {
    return JSON.parse(rawData) as Record<string, any>
  } catch {
    throw httpError(-2, '响应格式错误')
  }
}

/** 是否为取消请求错误 */
export function isCancelledError(error: HttpError): boolean {
  return error.code === -1 && error.message === '请求已取消'
}
