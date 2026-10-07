import { describe, it, expect } from 'vitest'
import { generateKeys } from '@/components/global/C_NumberKeyboard/data'

describe('C_NumberKeyboard.generateKeys（随机键盘历史 bug 防护）', () => {
  it('标准模式布局：9 数字 + 功能键 + 0 + 退格', () => {
    const keys = generateKeys(true, '', false)
    expect(keys).toHaveLength(12)
    // 前 9 个为 1-9 顺序
    expect(keys.slice(0, 9).map(k => k.text)).toEqual([
      '1', '2', '3', '4', '5', '6', '7', '8', '9',
    ])
    // 左下功能键
    expect(keys[9]).toEqual({ text: '.', type: 'dot' })
    // 0 键位置
    expect(keys[10]).toEqual({ text: '0', type: 'number' })
    // 退格
    expect(keys[11]).toEqual({ text: 'delete', type: 'delete' })
  })

  it('随机模式：0-9 每个数字恰好出现一次（不丢 0、不重复）', () => {
    for (let i = 0; i < 50; i++) {
      const keys = generateKeys(false, '', true)
      const digits = keys
        .filter(k => k.type === 'number')
        .map(k => Number(k.text))
        .sort((a, b) => a - b)
      expect(digits).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    }
  })

  it('extraKey 优先于小数点', () => {
    const keys = generateKeys(false, 'X', false)
    expect(keys[9]).toEqual({ text: 'X', type: 'extra' })
  })

  it('showDot=false 且无 extraKey 时左下角为占位', () => {
    const keys = generateKeys(false, '', false)
    expect(keys[9]).toEqual({ text: '', type: 'empty' })
  })
})
