import { describe, it, expect } from 'vitest'
import { formatNumber, maskPhone, formatPercent } from '@/utils/format'

describe('format 工具', () => {
  it('formatNumber：千分位分组', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(999)).toBe('999')
    expect(formatNumber(1000)).toBe('1,000')
    expect(formatNumber(12486)).toBe('12,486')
  })

  it('maskPhone：手机号打码', () => {
    expect(maskPhone('13800138000')).toBe('138****8000')
    expect(maskPhone('')).toBe('')
    expect(maskPhone('12345')).toBe('12345')
  })

  it('formatPercent：保留一位小数去尾零', () => {
    expect(formatPercent(94.6)).toBe('94.6%')
    expect(formatPercent(100)).toBe('100%')
    expect(formatPercent(33.34)).toBe('33.3%')
  })
})
