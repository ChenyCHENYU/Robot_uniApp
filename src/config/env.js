/**
 * 环境配置管理
 * 
 * 用途：
 * - 管理不同环境下的应用配置
 * - 提供类型安全的配置访问
 * - 支持配置验证和错误处理
 * 
 * 支持的环境：
 * - development: 开发环境
 * - staging: 测试环境  
 * - production: 生产环境
 * 
 * 使用方式：
 * import config from '@/config/env.js'
 * console.log(config.API_BASE_URL)
 */

// 支持的环境类型
const SUPPORTED_ENVIRONMENTS = ['development', 'staging', 'production']

// 日志级别枚举
const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info', 
  WARN: 'warn',
  ERROR: 'error'
}

/**
 * 获取当前运行环境
 * @returns {string} 环境名称
 */
const getEnv = () => {
  // 优先级：命令行参数 > 环境变量 > 默认值
  let env = process.env.NODE_ENV || 'development'
  
  // UniApp 编译时环境检测
  // #ifdef MP-WEIXIN
  env = process.env.NODE_ENV || 'production'
  // #endif
  
  // #ifdef H5
  // H5端可以通过URL参数强制切换环境（仅开发时使用）
  if (typeof window !== 'undefined' && window.location) {
    const urlParams = new URLSearchParams(window.location.search)
    const envParam = urlParams.get('env')
    if (envParam && SUPPORTED_ENVIRONMENTS.includes(envParam)) {
      console.warn(`🔧 通过URL参数强制切换到 ${envParam} 环境`)
      env = envParam
    }
  }
  // #endif
  
  // 环境验证
  if (!SUPPORTED_ENVIRONMENTS.includes(env)) {
    console.warn(`⚠️  不支持的环境: ${env}，回退到 development`)
    env = 'development'
  }
  
  return env
}

/**
 * 环境配置定义
 * 每个环境都包含完整的配置项，避免运行时缺失
 */
const envConfig = {
  // 开发环境配置
  development: {
    // API相关配置
    API_BASE_URL: "https://dev-api.example.com",
    API_TIMEOUT: 30000, // 请求超时时间(ms)
    API_VERSION: "v1",
    
    // WebSocket配置
    WS_URL: "wss://dev-ws.example.com",
    WS_RECONNECT_INTERVAL: 5000, // 重连间隔(ms)
    WS_MAX_RECONNECT_ATTEMPTS: 5,
    
    // CDN和静态资源
    CDN_URL: "https://dev-cdn.example.com",
    STATIC_URL: "https://dev-static.example.com",
    
    // 应用信息
    APP_NAME: "企业应用框架-开发版",
    APP_VERSION: "1.0.0-dev",
    BUILD_TIME: new Date().toISOString(),
    
    // 调试和日志
    DEBUG: true,
    LOG_LEVEL: LOG_LEVELS.DEBUG,
    ENABLE_VCONSOLE: true, // 移动端调试工具
    ENABLE_PERFORMANCE_MONITOR: true,
    
    // 功能开关
    FEATURES: {
      enablePush: false,
      enableShare: true,
      enablePayment: false,
      enableAnalytics: false
    },
    
    // 第三方服务配置
    SERVICES: {
      sentry: {
        dsn: "",
        enabled: false
      },
      analytics: {
        enabled: false,
        trackingId: ""
      }
    }
  },

  // 测试环境配置
  staging: {
    // API相关配置
    API_BASE_URL: "https://staging-api.example.com",
    API_TIMEOUT: 20000,
    API_VERSION: "v1",
    
    // WebSocket配置
    WS_URL: "wss://staging-ws.example.com",
    WS_RECONNECT_INTERVAL: 3000,
    WS_MAX_RECONNECT_ATTEMPTS: 10,
    
    // CDN和静态资源
    CDN_URL: "https://staging-cdn.example.com",
    STATIC_URL: "https://staging-static.example.com",
    
    // 应用信息
    APP_NAME: "企业应用框架-测试版",
    APP_VERSION: "1.0.0-staging",
    BUILD_TIME: new Date().toISOString(),
    
    // 调试和日志
    DEBUG: true,
    LOG_LEVEL: LOG_LEVELS.INFO,
    ENABLE_VCONSOLE: false,
    ENABLE_PERFORMANCE_MONITOR: true,
    
    // 功能开关
    FEATURES: {
      enablePush: true,
      enableShare: true,
      enablePayment: true,
      enableAnalytics: true
    },
    
    // 第三方服务配置
    SERVICES: {
      sentry: {
        dsn: "https://your-staging-sentry-dsn",
        enabled: true
      },
      analytics: {
        enabled: true,
        trackingId: "GA-STAGING-ID"
      }
    }
  },

  // 生产环境配置
  production: {
    // API相关配置
    API_BASE_URL: "https://api.example.com",
    API_TIMEOUT: 15000,
    API_VERSION: "v1",
    
    // WebSocket配置
    WS_URL: "wss://ws.example.com",
    WS_RECONNECT_INTERVAL: 3000,
    WS_MAX_RECONNECT_ATTEMPTS: 10,
    
    // CDN和静态资源
    CDN_URL: "https://cdn.example.com",
    STATIC_URL: "https://static.example.com",
    
    // 应用信息
    APP_NAME: "企业应用框架",
    APP_VERSION: "1.0.0",
    BUILD_TIME: new Date().toISOString(),
    
    // 调试和日志
    DEBUG: false,
    LOG_LEVEL: LOG_LEVELS.ERROR,
    ENABLE_VCONSOLE: false,
    ENABLE_PERFORMANCE_MONITOR: false,
    
    // 功能开关
    FEATURES: {
      enablePush: true,
      enableShare: true,
      enablePayment: true,
      enableAnalytics: true
    },
    
    // 第三方服务配置
    SERVICES: {
      sentry: {
        dsn: "https://your-production-sentry-dsn",
        enabled: true
      },
      analytics: {
        enabled: true,
        trackingId: "GA-PRODUCTION-ID"
      }
    }
  }
}

/**
 * 配置项验证
 * @param {Object} config 配置对象
 * @returns {boolean} 验证结果
 */
const validateConfig = (config) => {
  const requiredFields = [
    'API_BASE_URL',
    'APP_NAME',
    'APP_VERSION',
    'LOG_LEVEL'
  ]
  
  const missingFields = requiredFields.filter(field => !config[field])
  
  if (missingFields.length > 0) {
    console.error(`❌ 配置验证失败，缺少必需字段: ${missingFields.join(', ')}`)
    return false
  }
  
  // URL格式验证
  const urlFields = ['API_BASE_URL', 'CDN_URL', 'WS_URL']
  for (const field of urlFields) {
    if (config[field] && !isValidUrl(config[field])) {
      console.error(`❌ 无效的URL格式: ${field} = ${config[field]}`)
      return false
    }
  }
  
  return true
}

/**
 * URL格式验证
 * @param {string} url URL字符串
 * @returns {boolean} 是否为有效URL
 */
const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 获取当前环境配置
 * @returns {Object} 配置对象
 */
const getCurrentConfig = () => {
  const env = getEnv()
  const config = envConfig[env]
  
  if (!config) {
    console.error(`❌ 找不到环境 ${env} 的配置`)
    return envConfig.development // 回退到开发环境
  }
  
  // 配置验证
  if (!validateConfig(config)) {
    console.error(`❌ 环境 ${env} 的配置验证失败`)
  }
  
  // 添加运行时信息
  const runtimeConfig = {
    ...config,
    CURRENT_ENV: env,
    IS_DEV: env === 'development',
    IS_STAGING: env === 'staging', 
    IS_PROD: env === 'production',
    RUNTIME_INFO: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      platform: typeof uni !== 'undefined' ? uni.getSystemInfoSync().platform : 'unknown',
      timestamp: Date.now()
    }
  }
  
  // 开发环境下打印配置信息
  if (runtimeConfig.DEBUG) {
    console.group(`🔧 当前环境配置 [${env.toUpperCase()}]`)
    console.log('API地址:', runtimeConfig.API_BASE_URL)
    console.log('应用名称:', runtimeConfig.APP_NAME)
    console.log('应用版本:', runtimeConfig.APP_VERSION)
    console.log('日志级别:', runtimeConfig.LOG_LEVEL)
    console.log('功能开关:', runtimeConfig.FEATURES)
    console.groupEnd()
  }
  
  return runtimeConfig
}

/**
 * 工具函数：检查功能是否启用
 * @param {string} featureName 功能名称
 * @returns {boolean} 是否启用
 */
const isFeatureEnabled = (featureName) => {
  const config = getCurrentConfig()
  return config.FEATURES?.[featureName] || false
}

/**
 * 工具函数：获取完整的API地址
 * @param {string} endpoint API端点
 * @returns {string} 完整URL
 */
const getApiUrl = (endpoint = '') => {
  const config = getCurrentConfig()
  const baseUrl = config.API_BASE_URL.replace(/\/$/, '') // 移除末尾斜杠
  const version = config.API_VERSION ? `/${config.API_VERSION}` : ''
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  
  return `${baseUrl}${version}${path}`
}

/**
 * 工具函数：获取静态资源地址
 * @param {string} path 资源路径
 * @returns {string} 完整URL
 */
const getStaticUrl = (path = '') => {
  const config = getCurrentConfig()
  const baseUrl = (config.STATIC_URL || config.CDN_URL).replace(/\/$/, '')
  const resourcePath = path.startsWith('/') ? path : `/${path}`
  
  return `${baseUrl}${resourcePath}`
}

// 获取并缓存当前配置
const currentConfig = getCurrentConfig()

// 导出配置和工具函数
export default currentConfig

export {
  envConfig,
  getEnv,
  getCurrentConfig,
  isFeatureEnabled,
  getApiUrl,
  getStaticUrl,
  LOG_LEVELS,
  SUPPORTED_ENVIRONMENTS
}

// 类型定义导出 (如果使用TypeScript)
/*
export interface EnvConfig {
  API_BASE_URL: string
  API_TIMEOUT: number
  API_VERSION: string
  WS_URL: string
  CDN_URL: string
  APP_NAME: string
  APP_VERSION: string
  DEBUG: boolean
  LOG_LEVEL: string
  FEATURES: Record<string, boolean>
  SERVICES: Record<string, any>
  CURRENT_ENV: string
  IS_DEV: boolean
  IS_STAGING: boolean
  IS_PROD: boolean
}
*/