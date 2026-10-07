/**
 * Mock 入口 — 仅在开发环境下启用
 *
 * 原理：拦截 uni.addInterceptor('request') 匹配已注册的 mock 路由，
 * 若命中则直接返回模拟数据，不发真实请求。
 */
import config from '@/config/env'
import { delay, type MockResponse } from './helpers'
import { userMocks } from './modules/user'
import { messageMocks } from './modules/message'
import { approvalMocks } from './modules/approval'
import { dashboardMocks } from './modules/dashboard'
import { crudMocks } from './modules/crud'
import { uploadMocks } from './modules/upload'
import { logger } from '@/utils/logger'

/** 合并所有模块的 mock 路由 */
const mockRoutes: Record<string, (options: any) => MockResponse> = {
  ...userMocks,
  ...messageMocks,
  ...approvalMocks,
  ...dashboardMocks,
  ...crudMocks,
  ...uploadMocks,
}

/** 从 baseURL 中提取路径前缀（如 '/api'），避免依赖 URL 构造器（小程序端不存在） */
function getBasePath(): string {
  let base = config.API_BASE_URL || ''
  const schemeIdx = base.indexOf('://')
  if (schemeIdx > -1) {
    const slashIdx = base.indexOf('/', schemeIdx + 3)
    base = slashIdx > -1 ? base.slice(slashIdx) : '/'
  }
  const qIdx = base.indexOf('?')
  if (qIdx > -1) base = base.slice(0, qIdx)
  return base.endsWith('/') ? base.slice(0, -1) : base
}

/** 从请求配置中提取 mock key，如 "GET /user/info"（剥离域名/baseURL 前缀/查询参数） */
function getMockKey(options: UniApp.RequestOptions): string {
  const method = (options.method || 'GET').toUpperCase()
  let path: string = options.url || ''

  // 剥离协议与域名
  const schemeIdx = path.indexOf('://')
  if (schemeIdx > -1) {
    const slashIdx = path.indexOf('/', schemeIdx + 3)
    path = slashIdx > -1 ? path.slice(slashIdx) : '/'
  }

  // 剥离查询参数
  const qIdx = path.indexOf('?')
  if (qIdx > -1) path = path.slice(0, qIdx)

  // 剥离 baseURL 路径前缀（如 '/api/auth/login' → '/auth/login'）
  const basePath = getBasePath()
  if (basePath && basePath !== '/' && path.startsWith(basePath)) {
    path = path.slice(basePath.length) || '/'
  }

  return `${method} ${path}`
}

/** 安装 Mock 拦截器 */
export function setupMock() {
  if (!import.meta.env.DEV) return

  logger.log('[Mock] 🎭 开发环境 Mock 拦截器已启用')

  uni.addInterceptor('request', {
    /** 拦截请求并匹配 mock 路由 */
    async invoke(options: UniApp.RequestOptions) {
      const key = getMockKey(options)
      const handler = mockRoutes[key]

      if (handler) {
        // 模拟网络延迟
        await delay(200 + Math.random() * 300)

        const mockData = handler({
          data:
            typeof options.data === 'string'
              ? JSON.parse(options.data)
              : options.data,
          url: options.url,
        })

        logger.log(`[Mock] ✅ ${key}`, mockData)

        // 通过 success 回调返回数据，阻止真实请求
        if (typeof options.success === 'function') {
          options.success({
            data: mockData,
            statusCode: 200, // HTTP 层恒为 200，业务码在 body 中（0 = 成功）
            header: { 'content-type': 'application/json' },
            cookies: [],
          } as UniApp.RequestSuccessCallbackResult)
        }
        // 调用 complete 回调
        if (typeof options.complete === 'function') {
          options.complete({} as any)
        }

        // 将请求重定向到一个空的内联 data URI 以阻止真实网络请求
        // uni-h5 的 invoke 返回值会被当作 options，返回 false 会导致
        // "Cannot create property 'method' on boolean 'false'" 错误
        options.url = 'data:application/json,{}'
        return options
      }

      // 未匹配的请求正常发送
      return options
    },
  })

  // 暴露 mock 路由数便于调试
  logger.log(`[Mock] 已注册 ${Object.keys(mockRoutes).length} 个路由`)
}
