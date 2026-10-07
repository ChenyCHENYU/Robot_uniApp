import { describe, it, expect } from 'vitest'
import { success, fail, randomId, delay } from '@/mock/helpers'

describe('mock helpers（协议对齐）', () => {
  it('success 返回 code:0（与 http 层成功判定一致）', () => {
    const res = success({ list: [] })
    expect(res.code).toBe(0)
    expect(res.data).toEqual({ list: [] })
    expect(res.message).toBe('ok')
  })

  it('fail 默认业务错误码且 message 可定制', () => {
    const res = fail('用户名或密码错误')
    expect(res.code).not.toBe(0)
    expect(res.message).toBe('用户名或密码错误')
  })

  it('randomId 唯一性', () => {
    const ids = new Set(Array.from({ length: 1000 }, randomId))
    expect(ids.size).toBeGreaterThan(990)
  })

  it('delay 可等待', async () => {
    await delay(1)
    expect(true).toBe(true)
  })
})
