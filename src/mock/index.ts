/**
 * Mock 入口 — 仅在开发环境下启用
 *
 * 原理：拦截 uni.addInterceptor('request') 匹配已注册的 mock 路由，
 * 若命中则直接返回模拟数据，不发真实请求。
 */
import { delay, type MockResponse } from './helpers'
import { userMocks } from './modules/user'

/** 合并所有模块的 mock 路由 */
const mockRoutes: Record<string, (options: any) => MockResponse> = {
  ...userMocks,
}

/** 从请求配置中提取 mock key，如 "GET /user/info" */
function getMockKey(options: UniApp.RequestOptions): string {
  const method = (options.method || 'GET').toUpperCase()
  const url = new URL(options.url, 'http://localhost')
  return `${method} ${url.pathname}`
}

/** 安装 Mock 拦截器 */
export function setupMock() {
  if (!import.meta.env.DEV) return

  console.log('[Mock] 🎭 开发环境 Mock 拦截器已启用')

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

        console.log(`[Mock] ✅ ${key}`, mockData)

        // 通过 success 回调返回数据，阻止真实请求
        if (typeof options.success === 'function') {
          options.success({
            data: mockData,
            statusCode: mockData.code === 200 ? 200 : mockData.code,
            header: { 'content-type': 'application/json' },
            cookies: [],
          } as UniApp.RequestSuccessCallbackResult)
        }

        // 返回 false 阻止真实请求发送
        return false
      }

      // 未匹配的请求正常发送
      return options
    },
  })
}
