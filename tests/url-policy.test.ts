import { describe, it, expect } from 'vitest'
import {
  isUrlAllowed,
  matchHost,
  WEBVIEW_ALLOWED_HOSTS,
} from '@/utils/url-policy'

describe('url-policy（WebView 白名单）', () => {
  it('默认白名单包含 github.com', () => {
    expect(WEBVIEW_ALLOWED_HOSTS).toContain('github.com')
  })

  describe('isUrlAllowed', () => {
    it('允许白名单内的 https 地址', () => {
      expect(isUrlAllowed('https://github.com/ChenyCHENYU/Robot_uniApp')).toBe(
        true
      )
    })

    it('拒绝 http（即使域名在白名单）', () => {
      expect(isUrlAllowed('http://github.com/evil')).toBe(false)
    })

    it('拒绝白名单外域名', () => {
      expect(isUrlAllowed('https://evil.com/phish')).toBe(false)
    })

    it('拒绝仿冒域名（前缀拼接）', () => {
      expect(isUrlAllowed('https://github.com.evil.com')).toBe(false)
      expect(isUrlAllowed('https://fakegithub.com')).toBe(false)
    })

    it('拒绝空值与非法输入', () => {
      expect(isUrlAllowed('')).toBe(false)
      expect(isUrlAllowed(undefined as unknown as string)).toBe(false)
    })

    it('拒绝无 host 的相对路径', () => {
      expect(isUrlAllowed('https:///path')).toBe(false)
    })

    it('带端口时仍按域名判定', () => {
      expect(isUrlAllowed('https://github.com:8443/x')).toBe(true)
    })
  })

  describe('matchHost 通配规则', () => {
    it('精确域名匹配', () => {
      expect(matchHost('a.example.com', 'a.example.com')).toBe(true)
      expect(matchHost('b.example.com', 'a.example.com')).toBe(false)
    })

    it('*.example.com 匹配自身与任意子域', () => {
      expect(matchHost('example.com', '*.example.com')).toBe(true)
      expect(matchHost('a.example.com', '*.example.com')).toBe(true)
      expect(matchHost('a.b.example.com', '*.example.com')).toBe(true)
      // 恶意后缀不匹配
      expect(matchHost('example.com.evil.io', '*.example.com')).toBe(false)
    })
  })
})
