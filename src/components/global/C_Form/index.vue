<template>
  <view class="c-form">
    <slot />
    <view v-if="$slots.footer" class="c-form__footer">
      <slot name="footer" />
    </view>
  </view>
</template>

<script setup>
import { provide, reactive, ref } from "vue";
import { defaultProps } from "./data.js";

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
});

const errors = reactive({});
const fields = ref([]);

/** 注册表单项 */
const addField = (field) => {
  fields.value.push(field);
};
const removeField = (field) => {
  fields.value = fields.value.filter((f) => f !== field);
};

/** 校验单个字段 */
const validateField = (prop) => {
  const rules = props.rules[prop];
  if (!rules) return true;
  const value = props.model[prop];

  for (const rule of Array.isArray(rules) ? rules : [rules]) {
    if (
      rule.required &&
      (value === "" || value === null || value === undefined)
    ) {
      errors[prop] = rule.message || "此项为必填";
      return false;
    }
    if (rule.pattern && !rule.pattern.test(String(value))) {
      errors[prop] = rule.message || "格式不正确";
      return false;
    }
    if (rule.validator) {
      const msg = rule.validator(value, props.model);
      if (msg) {
        errors[prop] = msg;
        return false;
      }
    }
  }
  errors[prop] = "";
  return true;
};

/** 校验全部 */
const validate = () => {
  let valid = true;
  for (const prop in props.rules) {
    if (!validateField(prop)) valid = false;
  }
  return valid;
};

/** 重置校验 */
const resetValidation = () => {
  for (const key in errors) {
    errors[key] = "";
  }
};

provide("c-form", {
  props,
  errors,
  validateField,
  addField,
  removeField,
});

defineExpose({ validate, resetValidation, errors });
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
