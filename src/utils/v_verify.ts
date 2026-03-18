/**
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-09
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-09-09
 * @FilePath: \Robot_uniApp\src\utils\v_verify.js
 * @Description: uni-app 表单校验规则封装
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
 */

import { REGEX } from '@/constants/regex'

// 常用正则表达式（基于 constants/regex 扩展，避免重复定义）
const REGEX_PATTERNS = {
  MOBILE: REGEX.PHONE,
  ID_CARD: REGEX.ID_CARD,
  EMAIL: REGEX.EMAIL,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD: REGEX.PASSWORD,
  SIMPLE_PASSWORD: /^.{6,20}$/, // 简单密码规则，只验证长度
  URL: REGEX.URL,
  IP: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  CHINESE: /^[\u4e00-\u9fa5]+$/,
  NUMBER: /^\d+$/,
  DECIMAL: /^\d+(\.\d+)?$/,
}

/**
 * @description: 核心生成器，生成uni-app校验规则
 * @param validateFn 验证函数
 * @param message 错误消息
 * @param trigger 触发方式
 * @return {Object} uni-app规则对象
 */
function createRule(validateFn, message, trigger = 'blur') {
  return {
    required: false,
    message,
    trigger,
    validator: (rule, value, callback) => {
      if (validateFn(value)) {
        callback()
      } else {
        callback(new Error(message))
      }
    },
  }
}

/**
 * @description: 必填验证
 * @param field 字段名
 * @param trigger 触发方式
 */
export function required(field, trigger = 'blur') {
  return {
    required: true,
    message: `${field}不能为空`,
    trigger,
  }
}

/**
 * @description: 长度验证
 * @param field 字段名
 * @param min 最小长度
 * @param max 最大长度
 */
export function length(field, min, max) {
  return createRule(
    value => {
      if (!value) return true // 空值不验证长度
      const len = String(value).length
      if (max !== undefined) {
        return len >= min && len <= max
      }
      return len >= min
    },
    max ? `${field}长度需在${min}-${max}位之间` : `${field}长度至少${min}位`
  )
}

/**
 * @description: 数字范围验证
 * @param field 字段名
 * @param min 最小值
 * @param max 最大值
 */
export function range(field, min, max) {
  return createRule(value => {
    if (!value && value !== 0) return true
    const num = Number(value)
    if (isNaN(num)) return false
    return num >= min && num <= max
  }, `${field}必须在${min}-${max}之间`)
}

/**
 * @description: 手机号验证
 * @param field 字段名，默认为"手机号"
 */
export function mobile(field = '手机号') {
  return createRule(
    value => !value || REGEX_PATTERNS.MOBILE.test(value),
    `${field}格式错误`
  )
}

/**
 * @description: 身份证验证
 * @param field 字段名，默认为"身份证号"
 */
export function idCard(field = '身份证号') {
  return createRule(
    value => !value || REGEX_PATTERNS.ID_CARD.test(value),
    `${field}格式错误`
  )
}

/**
 * @description: 邮箱验证
 * @param field 字段名，默认为"邮箱"
 */
export function email(field = '邮箱') {
  return createRule(
    value => !value || REGEX_PATTERNS.EMAIL.test(value),
    `${field}格式错误`
  )
}

/**
 * @description: 用户名验证（字母数字下划线，3-20位）
 * @param field 字段名，默认为"用户名"
 */
export function username(field = '用户名') {
  return createRule(
    value => !value || REGEX_PATTERNS.USERNAME.test(value),
    `${field}只能包含字母、数字、下划线，长度3-20位`
  )
}

/**
 * @description: 简单密码验证（6-20位）
 * @param field 字段名，默认为"密码"
 */
export function password(field = '密码') {
  return createRule(
    value => !value || REGEX_PATTERNS.SIMPLE_PASSWORD.test(value),
    `${field}长度为6-20位`
  )
}

/**
 * @description: 强密码验证（包含大小写字母和数字，6-20位）
 * @param field 字段名，默认为"密码"
 */
export function strongPassword(field = '密码') {
  return createRule(
    value => !value || REGEX_PATTERNS.PASSWORD.test(value),
    `${field}必须包含大小写字母和数字，长度6-20位`
  )
}

/**
 * @description: URL验证
 * @param field 字段名，默认为"链接"
 */
export function url(field = '链接') {
  return createRule(
    value => !value || REGEX_PATTERNS.URL.test(value),
    `${field}格式错误`
  )
}

/**
 * @description: IP地址验证
 * @param field 字段名，默认为"IP地址"
 */
export function ip(field = 'IP地址') {
  return createRule(
    value => !value || REGEX_PATTERNS.IP.test(value),
    `${field}格式错误`
  )
}

/**
 * @description: 中文验证
 * @param field 字段名
 */
export function chinese(field) {
  return createRule(
    value => !value || REGEX_PATTERNS.CHINESE.test(value),
    `${field}只能输入中文`
  )
}

/**
 * @description: 纯数字验证
 * @param field 字段名
 */
export function number(field) {
  return createRule(
    value => !value || REGEX_PATTERNS.NUMBER.test(value),
    `${field}只能输入数字`
  )
}

/**
 * @description: 小数验证
 * @param field 字段名
 */
export function decimal(field) {
  return createRule(
    value => !value || REGEX_PATTERNS.DECIMAL.test(value),
    `${field}只能输入数字或小数`
  )
}

/**
 * @description: 确认密码验证
 * @param field 字段名
 * @param getOriginalValue 获取原密码的函数
 */
export function confirmPassword(field, getOriginalValue) {
  return createRule(
    value => !value || value === getOriginalValue(),
    `${field}不一致`
  )
}

/**
 * @description: 自定义正则验证
 * @param field 字段名
 * @param pattern 正则表达式
 * @param message 自定义错误消息
 */
export function pattern(field, pattern, message) {
  return createRule(
    value => !value || pattern.test(value),
    message || `${field}格式错误`
  )
}

/**
 * @description: 自定义验证函数
 * @param validateFn 验证函数，返回 true 表示通过
 * @param message 错误消息
 * @param trigger 触发方式
 */
export function custom(validateFn, message, trigger = 'blur') {
  return createRule(validateFn, message, trigger)
}

/**
 * @description: 常用规则组合
 */
export const RULE_COMBOS = {
  /**
   * 用户名规则组合
   */
  username: (field = '用户名') => [required(field), username(field)],

  /**
   * 密码规则组合
   */
  password: (field = '密码') => [required(field), password(field)],

  /**
   * 强密码规则组合
   */
  strongPassword: (field = '密码') => [required(field), strongPassword(field)],

  /**
   * 邮箱规则组合
   */
  email: (field = '邮箱') => [required(field), email(field)],

  /**
   * 手机号规则组合
   */
  mobile: (field = '手机号') => [required(field), mobile(field)],

  /**
   * 确认密码规则组合
   */
  confirmPassword: (field, getOriginalValue) => [
    required(field),
    confirmPassword(field, getOriginalValue),
  ],
}

// 导出正则表达式常量，供外部使用
export { REGEX_PATTERNS }

/**
 * @description: 快速验证方法 - 直接返回验证结果
 * @param value 要验证的值
 * @param rules 验证规则数组
 * @param field 字段名
 * @returns {Object} { valid: boolean, message: string }
 */
export function quickValidate(value, rules, field = '字段') {
  if (!rules || rules.length === 0) {
    return { valid: true, message: '' }
  }

  for (const rule of rules) {
    // 必填验证
    if (rule.required && (!value || String(value).trim() === '')) {
      return { valid: false, message: rule.message || `${field}不能为空` }
    }

    // 如果值为空且不是必填，跳过后续验证
    if (!value && !rule.required) {
      continue
    }

    // 自定义验证器
    if (rule.validator && typeof rule.validator === 'function') {
      let errorMsg = ''
      try {
        rule.validator(rule, value, error => {
          if (error) {
            errorMsg = error.message || error
          }
        })
        if (errorMsg) {
          return { valid: false, message: errorMsg }
        }
      } catch (err: any) {
        return { valid: false, message: err.message || '验证失败' }
      }
    }

    // 长度验证
    if (value && rule.min !== undefined) {
      const len = String(value).length
      if (len < rule.min || (rule.max !== undefined && len > rule.max)) {
        const message =
          rule.message ||
          (rule.max
            ? `${field}长度需在${rule.min}-${rule.max}位之间`
            : `${field}长度至少${rule.min}位`)
        return { valid: false, message }
      }
    }

    // 正则验证
    if (value && rule.pattern && !rule.pattern.test(value)) {
      return { valid: false, message: rule.message || `${field}格式错误` }
    }
  }

  return { valid: true, message: '' }
}

/**
 * @description: 表单批量验证 - 返回第一个错误
 * @param formData 表单数据对象
 * @param rulesConfig 验证规则配置
 * @returns {Object} { valid: boolean, message: string, field: string }
 */
export function validateForm(formData, rulesConfig) {
  // 按字段顺序验证，返回第一个错误
  for (const field in rulesConfig) {
    const value = formData[field]
    const rules = rulesConfig[field]
    const result = quickValidate(value, rules, field)

    if (!result.valid) {
      return {
        valid: false,
        message: result.message,
        field: field,
      }
    }
  }

  return { valid: true, message: '', field: '' }
}

/**
 * @description: 弹框提示验证结果
 * @param formData 表单数据
 * @param rulesConfig 验证规则
 * @param options 选项配置
 */
export function validateWithToast(
  formData: any,
  rulesConfig: any,
  options: { duration?: number } = {}
) {
  const result = validateForm(formData, rulesConfig)

  if (!result.valid) {
    uni.showToast({
      title: result.message,
      icon: 'none',
      duration: options.duration || 2000,
    })
    return false
  }

  return true
}
