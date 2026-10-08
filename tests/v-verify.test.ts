import { describe, it, expect } from 'vitest'
import {
  required,
  length,
  mobile,
  email,
  username,
  password,
  strongPassword,
  confirmPassword,
  pattern,
  quickValidate,
  validateForm,
  RULE_COMBOS,
} from '@/utils/v_verify'

describe('v_verify 规则构造器', () => {
  it('required：空值失败/非空通过', () => {
    const rule = required('用户名')
    expect(rule.required).toBe(true)
    expect(quickValidate('', [rule]).valid).toBe(false)
    expect(quickValidate('  ', [rule]).valid).toBe(false) // 纯空白视为空
    expect(quickValidate('abc', [rule]).valid).toBe(true)
  })

  it('mobile：合法/非法手机号', () => {
    expect(quickValidate('13800138000', [mobile()]).valid).toBe(true)
    expect(quickValidate('12345', [mobile()]).valid).toBe(false)
    expect(quickValidate('', [mobile()]).valid).toBe(true) // 空值跳过
  })

  it('email：合法/非法邮箱', () => {
    expect(quickValidate('a@b.com', [email()]).valid).toBe(true)
    expect(quickValidate('a@b', [email()]).valid).toBe(false)
  })

  it('username：字母数字下划线 3-20 位', () => {
    expect(quickValidate('abc_123', [username()]).valid).toBe(true)
    expect(quickValidate('ab', [username()]).valid).toBe(false)
    expect(quickValidate('a b', [username()]).valid).toBe(false)
  })

  it('password（简单）与 strongPassword（强度）', () => {
    expect(quickValidate('123456', [password()]).valid).toBe(true)
    expect(quickValidate('123', [password()]).valid).toBe(false)
    expect(quickValidate('Abc123', [strongPassword()]).valid).toBe(true)
    expect(quickValidate('abc123', [strongPassword()]).valid).toBe(true) // 字母+数字即通过
    expect(quickValidate('abcdef', [strongPassword()]).valid).toBe(false) // 缺数字
    expect(quickValidate('123456', [strongPassword()]).valid).toBe(false) // 缺字母
  })

  it('confirmPassword：与原值比对', () => {
    const rule = confirmPassword('确认密码', () => 'Abc123')
    expect(quickValidate('Abc123', [rule]).valid).toBe(true)
    expect(quickValidate('Xyz789', [rule]).valid).toBe(false)
  })

  it('length：min/max 区间', () => {
    expect(quickValidate('abcde', [length('字段', 3, 5)]).valid).toBe(true)
    expect(quickValidate('abcdef', [length('字段', 3, 5)]).valid).toBe(false)
    expect(quickValidate('ab', [length('字段', 3)]).valid).toBe(false)
  })

  it('pattern：自定义正则', () => {
    const rule = pattern('编码', /^[A-Z]{2}\d{4}$/, '编码格式：两位字母+四位数字')
    expect(quickValidate('AB1234', [rule]).valid).toBe(true)
    const fail = quickValidate('ab1234', [rule])
    expect(fail.valid).toBe(false)
    expect(fail.message).toBe('编码格式：两位字母+四位数字')
  })

  it('RULE_COMBOS：必填 + 格式组合', () => {
    expect(quickValidate('13800138000', RULE_COMBOS.mobile()).valid).toBe(true)
    // 空值先撞必填
    const empty = quickValidate('', RULE_COMBOS.email())
    expect(empty.valid).toBe(false)
    expect(empty.message).toBe('邮箱不能为空')
  })
})

describe('quickValidate 执行语义', () => {
  it('无规则直接通过', () => {
    expect(quickValidate('', []).valid).toBe(true)
    expect(quickValidate('x', undefined as never).valid).toBe(true)
  })

  it('返回第一个错误（短路）', () => {
    const rules = [required('账号'), username('账号')]
    const result = quickValidate('', rules)
    expect(result.valid).toBe(false)
    expect(result.message).toBe('账号不能为空')
  })

  it('原生 min/max/pattern 规则对象', () => {
    const result = quickValidate('ab', [{ min: 3, message: '至少3位' }])
    expect(result.valid).toBe(false)
    expect(result.message).toBe('至少3位')

    expect(
      quickValidate('abc', [{ pattern: /^\d+$/, message: '仅数字' }]).valid
    ).toBe(false)
    expect(
      quickValidate('123', [{ pattern: /^\d+$/, message: '仅数字' }]).valid
    ).toBe(true)
  })
})

describe('validateForm 批量校验', () => {
  const rulesConfig = {
    username: RULE_COMBOS.username(),
    email: RULE_COMBOS.email(),
  }

  it('全部通过', () => {
    const result = validateForm({ username: 'cheny', email: 'a@b.com' }, rulesConfig)
    expect(result.valid).toBe(true)
    expect(result.field).toBe('')
  })

  it('返回首个错误字段', () => {
    const result = validateForm({ username: '', email: 'bad' }, rulesConfig)
    expect(result.valid).toBe(false)
    expect(result.field).toBe('username')
  })

  it('第二个字段错误时定位正确', () => {
    const result = validateForm({ username: 'cheny', email: 'bad' }, rulesConfig)
    expect(result.field).toBe('email')
  })
})
