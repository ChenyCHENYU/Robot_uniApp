/**
 * 环境配置管理（单一配置源：env/ 目录的 VITE_* 变量）
 *
 * 环境文件位于项目 `env/` 目录（vite.config.js 已配置 envDir），
 * 本模块负责把它们收敛为类型安全的运行时配置。
 *
 * 支持的环境：development / test / staging / production
 * 环境判定优先级：VITE_ENV（构建模式注入） > MODE
 *
 * 使用方式：
 * import config from '@/config/env'
 * config.API_BASE_URL
 */

/** 支持的环境类型 */
export type AppEnv = 'development' | 'test' | 'staging' | 'production'

const SUPPORTED_ENVIRONMENTS: AppEnv[] = [
  'development',
  'test',
  'staging',
  'production',
]

/** 日志级别 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

/** 应用配置 */
export interface EnvConfig {
  /** 当前环境 */
  CURRENT_ENV: AppEnv
  IS_DEV: boolean
  IS_TEST: boolean
  IS_STAGING: boolean
  IS_PROD: boolean
  /** 接口基础地址（非 H5 端保证为绝对地址） */
  API_BASE_URL: string
  /** 接口版本前缀（如 'v1'），拼接到 API 路径 */
  API_VERSION: string
  /** 请求超时（ms） */
  API_TIMEOUT: number
  /** WebSocket 地址 */
  WS_URL: string
  /** 静态资源 CDN */
  CDN_URL: string
  STATIC_URL: string
  /** 应用信息 */
  APP_NAME: string
  APP_VERSION: string
  /** 调试 */
  DEBUG: boolean
  LOG_LEVEL: LogLevel
  ENABLE_VCONSOLE: boolean
  /** 功能开关 */
  FEATURES: Record<string, boolean>
}

const viteEnv = import.meta.env

/** 读取 VITE_* 字符串变量（去空白，缺省回退） */
function readStr(key: string, fallback = ''): string {
  const val = viteEnv[key]
  if (typeof val !== 'string') return fallback
  const trimmed = val.trim()
  return trimmed.length > 0 ? trimmed : fallback
}

/** 读取 VITE_* 布尔变量 */
function readBool(key: string, fallback = false): boolean {
  const val = viteEnv[key]
  if (typeof val !== 'string') return fallback
  if (['true', '1', 'yes'].includes(val.trim().toLowerCase())) return true
  if (['false', '0', 'no'].includes(val.trim().toLowerCase())) return false
  return fallback
}

/** 读取 VITE_* 数字变量 */
function readNum(key: string, fallback: number): number {
  const num = Number(readStr(key, ''))
  return Number.isFinite(num) && num > 0 ? num : fallback
}

/**
 * 获取当前运行环境
 * 优先级：URL ?env=（仅开发） > VITE_ENV > MODE
 */
function getEnv(): AppEnv {
  let env = (readStr('VITE_ENV') || readStr('MODE', 'development')) as AppEnv

  // 开发环境下允许通过 URL 参数临时切换环境（生产构建中 DEV 为 false，整段被摇树移除）
  if (import.meta.env.DEV) {
    // #ifdef H5
    if (typeof window !== 'undefined' && window.location) {
      const match = window.location.search.match(/[?&]env=([\w-]+)/)
      const envParam = match?.[1]
      if (envParam && (SUPPORTED_ENVIRONMENTS as string[]).includes(envParam)) {
        console.warn(`🔧 通过URL参数强制切换到 ${envParam} 环境（仅开发）`)
        env = envParam as AppEnv
      }
    }
    // #endif
  }

  return (SUPPORTED_ENVIRONMENTS as string[]).includes(env)
    ? (env as AppEnv)
    : 'development'
}

/** 解析 API 基础地址：H5 走相对路径（dev proxy），其它端要求绝对地址 */
function resolveApiBaseUrl(): string {
  const raw = readStr('VITE_API_BASE_URL', '/api')
  const isAbsolute = /^https?:\/\//i.test(raw)

  // #ifdef H5
  return raw
  // #endif

  // #ifndef H5
  // 小程序/App 无开发代理，相对路径时回退到代理目标地址
  if (isAbsolute) return raw
  const proxyTarget = readStr('VITE_API_PROXY_TARGET')
  return proxyTarget || raw
  // #endif
}

const currentEnv = getEnv()

const config: EnvConfig = {
  CURRENT_ENV: currentEnv,
  IS_DEV: currentEnv === 'development',
  IS_TEST: currentEnv === 'test',
  IS_STAGING: currentEnv === 'staging',
  IS_PROD: currentEnv === 'production',

  API_BASE_URL: resolveApiBaseUrl(),
  API_VERSION: readStr('VITE_API_VERSION', ''),
  API_TIMEOUT: readNum('VITE_API_TIMEOUT', 15000),
  WS_URL: readStr('VITE_WS_URL'),
  CDN_URL: readStr('VITE_CDN_URL'),
  STATIC_URL: readStr('VITE_STATIC_URL'),

  APP_NAME: readStr('VITE_APP_TITLE', 'Robot App'),
  APP_VERSION: readStr('VITE_APP_VERSION', '1.0.0'),

  DEBUG: readBool('VITE_DEBUG', currentEnv === 'development'),
  LOG_LEVEL: readStr(
    'VITE_LOG_LEVEL',
    currentEnv === 'production' ? 'error' : 'debug'
  ) as LogLevel,
  ENABLE_VCONSOLE: readBool('VITE_ENABLE_VCONSOLE', false),

  FEATURES: {
    enablePush: readBool('VITE_FEATURE_PUSH', false),
    enableShare: readBool('VITE_FEATURE_SHARE', true),
    enableAnalytics: readBool('VITE_FEATURE_ANALYTICS', false),
    /** 简繁转换（opencc-js 字典约 1.1MB 懒加载 chunk，按需开启） */
    enableTraditionalChinese: readBool('VITE_FEATURE_TW', false),
  },
}

/** 是否启用某功能开关 */
export function isFeatureEnabled(name: string): boolean {
  return config.FEATURES[name] === true
}

// 开发环境打印一次当前配置摘要
if (config.DEBUG) {
  console.log(
    `[Env] ${config.CURRENT_ENV} | API: ${config.API_BASE_URL} | v${config.APP_VERSION}`
  )
}

export default config
