# C_Form 表单容器组件

## 组件简介

表单容器，支持校验规则、错误提示，与 `v_verify` 工具整合。

**特性：**

- 声明式校验规则（required / pattern / validator）
- `validate()` 返回整体校验结果
- `resetValidation()` 重置所有错误
- provide 注入，子组件自动获取上下文

---

## 快速开始

```vue
<script setup>
import { ref } from "vue";

const formRef = ref();
const form = ref({ name: "", phone: "" });
const rules = {
  name: [{ required: true, message: "请输入姓名" }],
  phone: [
    { required: true, message: "请输入手机号" },
    { pattern: /^1\d{10}$/, message: "手机号格式错误" },
  ],
};

const onSubmit = () => {
  if (formRef.value.validate()) {
    // 提交
  }
};
</script>

<template>
  <C_Form ref="formRef" :model="form" :rules="rules">
    <!-- 表单内容 -->
    <template #footer>
      <wd-button block @click="onSubmit">提交</wd-button>
    </template>
  </C_Form>
</template>
```

---

## API 文档

### Props

| 属性          | 类型    | 默认值   | 说明         |
| ------------- | ------- | -------- | ------------ |
| model         | Object  | 必填     | 表单数据对象 |
| rules         | Object  | `{}`     | 校验规则     |
| labelWidth    | String  | `180rpx` | 标签宽度     |
| labelPosition | String  | `left`   | 标签位置     |
| disabled      | Boolean | `false`  | 是否禁用     |
| colon         | Boolean | `false`  | 标签后冒号   |

### Expose

| 方法            | 说明         | 返回值  |
| --------------- | ------------ | ------- |
| validate()      | 校验全部字段 | Boolean |
| resetValidation | 重置校验     | void    |
| errors          | 当前错误对象 | Object  |

### Slots

| 名称    | 说明       |
| ------- | ---------- |
| default | 表单项     |
| footer  | 底部操作区 |

---

## 注意事项

- `rules` 对象的 key 需与 `model` 的属性名一致
- 校验规则支持: `required` / `pattern` / `validator(value, model)`
- `validator` 函数返回字符串表示错误信息，返回 falsy 表示通过
