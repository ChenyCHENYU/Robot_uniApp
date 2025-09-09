# uni-app 表单验证工具 (v_verify)

一个专为 uni-app 项目设计的简洁、易用的表单验证工具，让表单验证变得超级简单！

## ✨ 特性

- 🚀 **简洁易用**: `rules: [required('用户名'), length('用户名', 3, 20)]`
- 📱 **uni-app 优化**: 专为 uni-app 框架定制，完美兼容
- 🎯 **预设规则**: 内置常用验证规则，开箱即用
- 🔧 **高度可定制**: 支持自定义验证函数和正则表达式
- 📦 **零依赖**: 无需安装额外依赖
- 🎨 **TypeScript 友好**: 完整的类型提示支持

## 🚀 快速开始

### 1. 基础使用

```javascript
import { required, length, mobile, email } from "@/utils/v_verify";

// 在你的数据文件中
export function useFormData() {
  const rules = {
    username: [required("用户名"), length("用户名", 3, 20)],
    password: [required("密码"), length("密码", 6, 15)],
    phone: [required("手机号"), mobile("手机号")],
    email: [email("邮箱")], // 非必填的邮箱验证
  };

  return { rules };
}
```

### 2. 在 Vue 组件中使用

```vue
<template>
  <u-form :model="form" :rules="rules" ref="formRef">
    <u-form-item prop="username">
      <u-input v-model="form.username" placeholder="请输入用户名" />
    </u-form-item>
    <u-form-item prop="password">
      <u-input
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
      />
    </u-form-item>
  </u-form>
</template>

<script setup>
import { useFormData } from "./data.js";
const { form, rules } = useFormData();
</script>
```

## 📋 API 文档

### 基础验证规则

| 函数                        | 参数                       | 说明     | 示例                    |
| --------------------------- | -------------------------- | -------- | ----------------------- |
| `required(field, trigger?)` | 字段名, 触发方式           | 必填验证 | `required('用户名')`    |
| `length(field, min, max?)`  | 字段名, 最小长度, 最大长度 | 长度验证 | `length('密码', 6, 20)` |
| `range(field, min, max)`    | 字段名, 最小值, 最大值     | 数值范围 | `range('年龄', 18, 65)` |

### 格式验证规则

| 函数                     | 参数   | 说明                       | 示例                     |
| ------------------------ | ------ | -------------------------- | ------------------------ |
| `mobile(field?)`         | 字段名 | 手机号验证                 | `mobile('手机号')`       |
| `email(field?)`          | 字段名 | 邮箱验证                   | `email('邮箱')`          |
| `username(field?)`       | 字段名 | 用户名验证(字母数字下划线) | `username('用户名')`     |
| `password(field?)`       | 字段名 | 简单密码验证(6-20 位)      | `password('密码')`       |
| `strongPassword(field?)` | 字段名 | 强密码验证(含大小写+数字)  | `strongPassword('密码')` |
| `idCard(field?)`         | 字段名 | 身份证验证                 | `idCard('身份证号')`     |
| `url(field?)`            | 字段名 | URL 验证                   | `url('网站地址')`        |
| `ip(field?)`             | 字段名 | IP 地址验证                | `ip('服务器地址')`       |

### 类型验证规则

| 函数             | 参数   | 说明           | 示例              |
| ---------------- | ------ | -------------- | ----------------- |
| `chinese(field)` | 字段名 | 中文验证       | `chinese('姓名')` |
| `number(field)`  | 字段名 | 纯数字验证     | `number('数量')`  |
| `decimal(field)` | 字段名 | 数字或小数验证 | `decimal('金额')` |

### 高级验证规则

| 函数                                       | 参数                         | 说明           | 示例                                               |
| ------------------------------------------ | ---------------------------- | -------------- | -------------------------------------------------- |
| `confirmPassword(field, getOriginalValue)` | 字段名, 获取原密码函数       | 确认密码验证   | `confirmPassword('确认密码', () => form.password)` |
| `pattern(field, regex, message?)`          | 字段名, 正则, 错误消息       | 自定义正则验证 | `pattern('QQ号', /^[1-9]\d{4,10}$/)`               |
| `custom(validateFn, message, trigger?)`    | 验证函数, 错误消息, 触发方式 | 自定义验证     | `custom(v => v > 0, '必须大于0')`                  |

### 预设组合规则

使用 `RULE_COMBOS` 可以快速应用常用的组合规则：

```javascript
import { RULE_COMBOS } from "@/utils/v_verify";

const rules = {
  username: RULE_COMBOS.username("用户名"), // 必填 + 用户名格式
  password: RULE_COMBOS.password("密码"), // 必填 + 简单密码
  strongPassword: RULE_COMBOS.strongPassword("密码"), // 必填 + 强密码
  email: RULE_COMBOS.email("邮箱"), // 必填 + 邮箱格式
  mobile: RULE_COMBOS.mobile("手机号"), // 必填 + 手机号格式
};
```

## 💡 使用示例

### 登录表单

```javascript
import { required, length } from "@/utils/v_verify";

const loginRules = {
  username: [required("用户名"), length("用户名", 3, 20)],
  password: [required("密码"), length("密码", 6, 20)],
};
```

### 注册表单

```javascript
import {
  required,
  length,
  mobile,
  email,
  confirmPassword,
} from "@/utils/v_verify";

const registerRules = {
  username: [required("用户名"), length("用户名", 3, 20)],
  password: [required("密码"), length("密码", 6, 20)],
  confirmPassword: [
    required("确认密码"),
    confirmPassword("确认密码", () => form.password),
  ],
  phone: [required("手机号"), mobile("手机号")],
  email: [email("邮箱")], // 非必填
};
```

### 个人信息表单

```javascript
import { required, chinese, range, pattern } from "@/utils/v_verify";

const profileRules = {
  realName: [required("姓名"), chinese("姓名"), length("姓名", 2, 4)],
  age: [required("年龄"), range("年龄", 1, 120)],
  qq: [pattern("QQ号", /^[1-9]\d{4,10}$/, "QQ号格式错误")],
};
```

### 自定义验证

```javascript
import { required, custom } from "@/utils/v_verify";

const customRules = {
  code: [
    required("验证码"),
    custom(
      (value) => value && value.length === 6 && /^\d+$/.test(value),
      "验证码必须是6位数字"
    ),
  ],
};
```

## 🔧 配置说明

所有验证规则都支持以下特性：

1. **空值处理**: 非必填字段在空值时自动跳过验证
2. **触发方式**: 默认为 `blur`，可自定义
3. **错误消息**: 支持自定义错误提示文本
4. **uni-app 兼容**: 完全兼容 uni-app 的表单组件

## 📝 注意事项

1. 确保项目中已正确配置路径别名 `@` 指向 `src` 目录
2. 验证规则按数组顺序执行，遇到第一个错误即停止
3. 所有非必填字段在空值时会跳过后续验证
4. 建议将验证规则定义在 `data.js` 文件中，保持代码整洁

## 🎉 现在开始

现在你可以在项目中愉快地使用这个验证工具了！记住，简洁就是美：

```javascript
// 以前需要这样写
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "用户名长度在3-20位之间", trigger: "blur" },
  ],
};

// 现在只需要这样
const rules = {
  username: [required("用户名"), length("用户名", 3, 20)],
};
```

享受编码的乐趣吧！🚀
