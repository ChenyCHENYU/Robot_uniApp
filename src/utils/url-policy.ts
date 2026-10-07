/**
 * URL 安全策略
 *
 * WebView 页面只允许加载白名单内的 https 地址，
 * 防止恶意二维码/外部深链把用户带向钓鱼页面。
 *
 * 项目使用时请在下方维护白名单（支持精确域名与其所有子域名）：
 * - 'github.com'        → 仅 github.com
 * - '*.example.com'     → example.com 及其所有子域名
 */

/** 允许在内置 WebView 中打开的域名白名单 */
export const WEBVIEW_ALLOWED_HOSTS: string[] = [
  'github.com',
  'www.github.com',
  'uniapp.dcloud.net.cn',
  // 项目接入时替换为业务域名，例如：
  // 'www.your-company.com',
]

/** 判断主机名是否命中白名单条目（支持 *.example.com 通配） */
export function matchHost(host: string, pattern: string): boolean {
  if (pattern.startsWith('*.')) {
    const base = pattern.slice(2)
    return host === base || host.endsWith(`.${base}`)
  }
  return host === pattern
}

/**
 * 校验 URL 是否允许在内置 WebView 打开
 * 规则：必须 https + 域名命中白名单
 */
export function isUrlAllowed(url: string): boolean {
  if (!url || typeof url !== 'string') return false

  // 仅允许 https（App 离线包等场景如需 http，请显式放开并自行评估风险）
  if (!/^https:\/\//i.test(url)) return false

  const host = url
    .replace(/^https:\/\//i, '')
    .split('/')[0]
    .split(':')[0]
  if (!host) return false

  return WEBVIEW_ALLOWED_HOSTS.some(pattern => matchHost(host, pattern))
}
