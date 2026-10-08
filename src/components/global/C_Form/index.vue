<template>
  <view class="c-form">
    <slot />
    <view
      v-if="$slots.footer"
      class="c-form__footer"
    >
      <slot name="footer" />
    </view>
  </view>
</template>

<script setup lang="ts">
  import { provide, reactive, ref } from 'vue'
  import { defaultProps } from './data'

  const props = defineProps({
    /** 表单数据对象 */
    model: { type: Object, required: true },
    /** 校验规则 */
    rules: { type: Object, default: () => ({}) },
    /** 标签宽度 */
    labelWidth: { type: String, default: defaultProps.labelWidth },
    /** 标签位置 left / top */
    labelPosition: { type: String, default: defaultProps.labelPosition },
    /** 是否禁用 */
    disabled: { type: Boolean, default: defaultProps.disabled },
    /** 标签后是否显示冒号 */
    colon: { type: Boolean, default: defaultProps.colon },
  })

  const fields = ref<any[]>([])
  const errors = reactive<Record<string, string>>({})

  /** 注册表单项 */
  const addField = field => {
    fields.value.push(field)
  }
  const removeField = field => {
    fields.value = fields.value.filter(f => f !== field)
  }

  /** 值是否为空（required 判定用） */
  const isEmptyValue = value =>
    value === '' || value === null || value === undefined

  /** 正则规则是否不匹配 */
  const isPatternFail = (rule, value) =>
    Boolean(rule.pattern) && !rule.pattern.test(String(value))

  /** 单条规则检查：返回错误文案，通过返回 null */
  const checkRule = (rule, value, model) => {
    if (rule.required && isEmptyValue(value)) {
      return rule.message || '此项为必填'
    }
    if (isPatternFail(rule, value)) {
      return rule.message || '格式不正确'
    }
    if (rule.validator) {
      return rule.validator(value, model) || null
    }
    return null
  }

  /** 校验单个字段 */
  const validateField = prop => {
    const rules = props.rules[prop]
    if (!rules) return true
    const value = props.model[prop]

    for (const rule of Array.isArray(rules) ? rules : [rules]) {
      const error = checkRule(rule, value, props.model)
      if (error) {
        errors[prop] = error
        return false
      }
    }
    errors[prop] = ''
    return true
  }

  /** 校验全部 */
  const validate = () => {
    let valid = true
    for (const prop in props.rules) {
      if (!validateField(prop)) valid = false
    }
    return valid
  }

  /** 重置校验 */
  const resetValidation = () => {
    for (const key in errors) {
      errors[key] = ''
    }
  }

  provide('c-form', {
    props,
    errors,
    validateField,
    addField,
    removeField,
  })

  defineExpose({ validate, resetValidation, errors })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
