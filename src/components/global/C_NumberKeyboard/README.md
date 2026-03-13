# C_NumberKeyboard 数字键盘组件

## 组件简介

自定义数字键盘，适用于金额输入、验证码输入等场景。

**特性：**
- v-model 双向绑定输入值
- 支持小数点、额外按键
- 随机排列模式（安全键盘）
- 最大长度限制

---

## 快速开始

```vue
<script setup>
import { ref } from 'vue'
const showKeyboard = ref(false)
const amount = ref('')
</script>

<template>
  <view @click="showKeyboard = true">{{ amount || '请输入金额' }}</view>
  <C_NumberKeyboard v-model:visible="showKeyboard" v-model="amount" title="输入金额" />
</template>
```

---

## API 文档

### Props

| 属性        | 类型    | 默认值 | 说明             |
| ----------- | ------- | ------ | ---------------- |
| visible     | Boolean | false  | 是否显示         |
| modelValue  | String  | `''`   | 当前输入值       |
| title       | String  | -      | 标题             |
| maxLength   | Number  | `-1`   | 最大长度         |
| showDot     | Boolean | true   | 显示小数点       |
| randomOrder | Boolean | false  | 随机排列（安全） |
| extraKey    | String  | -      | 左下角额外按键   |

### Events

| 事件名           | 参数  | 说明       |
| ---------------- | ----- | ---------- |
| update:modelValue| value | 值变化     |
| update:visible   | Bool  | 显隐变化   |
| input            | key   | 按键输入   |
| delete           | -     | 删除       |
| done             | value | 点击完成   |

---

## 注意事项

- `randomOrder` 每次渲染随机排列，适用于密码/支付场景
- 小数点不可重复输入，不可作为首字符
