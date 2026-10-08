/** 宿主识别只提供诊断信息；PDA/企业宿主的设备能力必须显式注入。 */
export interface PlatformEnvironment {
  runtime: 'h5' | 'app' | 'mp-weixin' | 'mini-program' | 'unknown'
  host: 'browser' | 'dingtalk' | 'wechat' | 'wecom' | 'native' | 'unknown'
  uniPlatform: string
  os: string
  deviceType: string
}

interface EnvironmentInfo {
  uniPlatform?: string
  osName?: string
  platform?: string
  deviceType?: string
}

/** uniPlatform 描述实际运行端，与设备操作系统分开判断。 */
function detectRuntime(uniPlatform: string): PlatformEnvironment['runtime'] {
  if (uniPlatform === 'web' || uniPlatform === 'h5') return 'h5'
  if (/^app(?:-|$)/.test(uniPlatform)) return 'app'
  if (uniPlatform === 'mp-weixin') return 'mp-weixin'
  if (uniPlatform.startsWith('mp-')) return 'mini-program'
  return 'unknown'
}

/** H5 才通过 UA 描述容器，其他运行端保留其实际宿主。 */
function detectHost(
  runtime: PlatformEnvironment['runtime'],
  userAgent: string
): PlatformEnvironment['host'] {
  if (runtime === 'app') return 'native'
  if (runtime === 'mp-weixin') return 'wechat'
  if (runtime !== 'h5') return 'unknown'
  if (/dingtalk/i.test(userAgent)) return 'dingtalk'
  if (/wxwork/i.test(userAgent)) return 'wecom'
  if (/micromessenger/i.test(userAgent)) return 'wechat'
  return 'browser'
}

/** 先判断 uni 运行端，避免小程序中的 UA 被误识别为 H5 宿主。 */
export function detectPlatformEnvironment(
  info: EnvironmentInfo,
  userAgent = ''
): PlatformEnvironment {
  const uniPlatform = String(info.uniPlatform || '').toLowerCase()
  const runtime = detectRuntime(uniPlatform)
  const host = detectHost(runtime, userAgent)
  return {
    runtime,
    host,
    uniPlatform,
    os: String(info.osName || info.platform || 'unknown'),
    deviceType: String(info.deviceType || 'unknown'),
  }
}

/** 安全读取运行环境；浏览器对象仅参与 H5 编译。 */
export function getPlatformEnvironment(): PlatformEnvironment {
  let info: EnvironmentInfo = {}
  try {
    if (typeof uni !== 'undefined') info = uni.getSystemInfoSync()
  } catch {
    // 部分宿主初始化期间尚未提供系统信息，使用真实编译端兜底。
  }
  let compiledPlatform = ''
  // #ifdef H5
  compiledPlatform = 'web'
  // #endif
  // #ifdef APP-PLUS
  compiledPlatform = 'app'
  // #endif
  // #ifdef MP-WEIXIN
  compiledPlatform = 'mp-weixin'
  // #endif
  let userAgent = ''
  // #ifdef H5
  if (typeof navigator !== 'undefined') {
    const { userAgent: browserAgent } = navigator
    userAgent = browserAgent
  }
  // #endif
  return detectPlatformEnvironment(
    { ...info, uniPlatform: info.uniPlatform || compiledPlatform },
    userAgent
  )
}
