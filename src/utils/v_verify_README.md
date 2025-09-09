# 表单验证工具 v_verify

## 🎯 设计理念

移动端表单验证工具，采用弹框提示方式，简洁优雅，符合移动端交互习惯。当多个字段存在错误时，按顺序只提示第一个错误，保持界面清爽。

## ✨ 核心特点

- 🚀 **超级简洁** - 一行代码完成验证+提示
- 📱 **移动端友好** - 弹框提示符合移动端交互习惯  
- 🎯 **错误有序** - 永远只提示第一个错误，界面清爽
- 🔧 **零组件依赖** - 直接使用工具方法，无需额外组件
- ⚡ **高性能** - 验证失败立即停止，不做无效验证

## 🚀 快速开始

### 基础验证规则

```javascript
import { required, length, mobile, email } from '@/utils/v_verify';

// 基础验证规则定义
const rules = {
  username: [required('用户名'), length('用户名', 3, 20)],
  password: [required('密码'), length('密码', 6, 20)],
  mobile: [required('手机号'), mobile('手机号')],
  email: [email('邮箱')] // 非必填
};
```

### 三种验证方式

#### 1. 失焦验证（推荐）
```javascript
import { quickValidate } from '@/utils/v_verify';

const handleFieldBlur = (field) => {
  const value = form[field];
  const fieldRules = rules[field];
  const result = quickValidate(value, fieldRules, field);
  
  if (!result.valid) {
    uni.showToast({
      title: result.message,
      icon: 'none',
      duration: 2000
    });
  }
};
```

#### 2. 提交验证（最推荐）
```javascript
import { validateWithToast } from '@/utils/v_verify';

const handleSubmit = async () => {
  // 一行代码完成验证+弹框提示
  if (!validateWithToast(form, rules)) {
    return; // 验证失败，已自动弹框提示
  }
  
  // 验证通过，继续提交逻辑
  console.log('表单验证通过，开始提交');
};
```

#### 3. 自定义验证
```javascript
import { validateForm } from '@/utils/v_verify';

const customValidate = () => {
  const result = validateForm(form, rules);
  
  if (!result.valid) {
    console.log(`字段 ${result.field} 验证失败: ${result.message}`);
    // 自定义处理逻辑
  }
};
```

## 📋 完整示例

### 登录页面完整代码

```vue
<template>
  <view>
    <!-- 用户名输入 -->
    <view class="input-wrapper">
      <u-icon name="account" size="20" color="rgba(255,255,255,0.7)"></u-icon>
      <u-input 
        v-model="form.username" 
        placeholder="用户名或邮箱"
        :border="false"
        :customStyle="inputStyle"
        @blur="handleFieldBlur('username')"
      />
    </view>
    
    <!-- 密码输入 -->
    <view class="input-wrapper">
      <u-icon name="lock" size="20" color="rgba(255,255,255,0.7)"></u-icon>
      <u-input 
        v-model="form.password" 
        type="password"
        placeholder="密码"
        :border="false"
        :customStyle="inputStyle"
        @blur="handleFieldBlur('password')"
      />
    </view>
    
    <u-button @click="handleLogin">登录</u-button>
  </view>
</template>

<script setup>
import { reactive } from 'vue';
import { 
  required, 
  length, 
  quickValidate, 
  validateWithToast 
} from '@/utils/v_verify';

const form = reactive({
  username: '',
  password: ''
});

const rules = {
  username: [
    required('用户名'), 
    length('用户名', 3, 20),
    // 自定义验证器
    {
      validator: (rule, value, callback) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
        
        if (emailPattern.test(value) || usernamePattern.test(value)) {
          callback();
        } else {
          callback(new Error('请输入正确的用户名或邮箱格式'));
        }
      }
    }
  ],
  password: [required('密码'), length('密码', 6, 20)]
};

const inputStyle = {
  backgroundColor: 'transparent',
  color: '#ffffff',
  fontSize: '32rpx'
};

// 失焦验证
const handleFieldBlur = (field) => {
  const value = form[field];
  const fieldRules = rules[field];
  const result = quickValidate(value, fieldRules, field);
  
  if (!result.valid) {
    uni.showToast({
      title: result.message,
      icon: 'none',
      duration: 2000
    });
  }
};

// 提交验证
const handleLogin = async () => {
  // 一行代码完成验证
  if (!validateWithToast(form, rules)) {
    return;
  }
  
  // 验证通过，执行登录逻辑
  console.log('开始登录', form);
};
</script>
```

## 📚 API 文档

### 基础验证规则

| 函数 | 参数 | 说明 | 示例 |
|------|------|------|------|
| `required(field, trigger?)` | 字段名, 触发方式 | 必填验证 | `required('用户名')` |
| `length(field, min, max?)` | 字段名, 最小长度, 最大长度 | 长度验证 | `length('密码', 6, 20)` |
| `range(field, min, max)` | 字段名, 最小值, 最大值 | 数值范围 | `range('年龄', 18, 65)` |

### 格式验证规则

| 函数 | 参数 | 说明 | 示例 |
|------|------|------|------|
| `mobile(field?)` | 字段名 | 手机号验证 | `mobile('手机号')` |
| `email(field?)` | 字段名 | 邮箱验证 | `email('邮箱')` |
| `username(field?)` | 字段名 | 用户名验证 | `username('用户名')` |
| `password(field?)` | 字段名 | 简单密码验证 | `password('密码')` |
| `strongPassword(field?)` | 字段名 | 强密码验证 | `strongPassword('密码')` |
| `idCard(field?)` | 字段名 | 身份证验证 | `idCard('身份证号')` |

### 核心验证方法

#### quickValidate(value, rules, field)
单字段快速验证

**参数**:
- `value`: 要验证的值
- `rules`: 验证规则数组  
- `field`: 字段名称

**返回**: `{ valid: boolean, message: string }`

```javascript
const result = quickValidate('test', [required('用户名')], '用户名');
if (!result.valid) {
  console.log(result.message); // "用户名不能为空"
}
```

#### validateForm(formData, rulesConfig) 
表单批量验证，返回第一个错误

**参数**:
- `formData`: 表单数据对象
- `rulesConfig`: 验证规则配置对象

**返回**: `{ valid: boolean, message: string, field: string }`

```javascript
const result = validateForm(form, rules);
if (!result.valid) {
  console.log(`字段 ${result.field} 验证失败: ${result.message}`);
}
```

#### validateWithToast(formData, rulesConfig, options)
表单验证并自动弹框提示

**参数**:
- `formData`: 表单数据对象
- `rulesConfig`: 验证规则配置对象
- `options`: 可选配置 `{ duration: 2000 }`

**返回**: `boolean` (验证是否通过)

```javascript
if (!validateWithToast(form, rules, { duration: 3000 })) {
  return; // 验证失败，已自动弹框提示
}
// 验证通过，继续执行
```

## 🔧 自定义验证

### 自定义验证器
```javascript
const customRules = [
  {
    validator: (rule, value, callback) => {
      if (value && value.includes('admin')) {
        callback(new Error('用户名不能包含admin'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }
];
```

### 正则验证
```javascript
import { pattern } from '@/utils/v_verify';

const rules = [
  pattern('QQ号', /^[1-9]\d{4,10}$/, 'QQ号格式错误')
];
```

### 自定义函数验证
```javascript
import { custom } from '@/utils/v_verify';

const rules = [
  custom(
    (value) => value && value.length === 6 && /^\d+$/.test(value),
    '验证码必须是6位数字'
  )
];
```

## 🎯 最佳实践

### 1. 验证时机
- **失焦验证**: 用户输入完成后立即反馈
- **提交验证**: 表单提交前的最终检查

### 2. 错误提示
- 只显示第一个错误，避免信息过载
- 使用 `uni.showToast` 弹框提示，符合移动端习惯

### 3. 规则定义
```javascript
// 推荐：按业务逻辑分组
const userRules = {
  username: [required('用户名'), length('用户名', 3, 20)],
  password: [required('密码'), length('密码', 6, 20)]
};

const profileRules = {
  nickname: [required('昵称'), length('昵称', 2, 10)],
  mobile: [required('手机号'), mobile('手机号')]
};
```

### 4. 性能优化
```javascript
// 验证失败立即停止，提升性能
const handleSubmit = () => {
  if (!validateWithToast(form, rules)) {
    return; // 立即返回，不执行后续逻辑
  }
  
  // 继续执行提交逻辑
};
```

## ⚠️ 注意事项

1. **非必填字段**: 值为空时自动跳过后续验证
2. **验证顺序**: 按规则数组顺序执行，遇到第一个错误即停止
3. **异步验证**: 自定义验证器支持异步，但建议使用同步验证
4. **错误信息**: 确保错误提示信息简洁明了，便于用户理解

## 🚀 使用场景

- ✅ **登录/注册表单** - 用户认证场景
- ✅ **个人信息编辑** - 用户资料修改
- ✅ **订单提交** - 电商业务表单
- ✅ **反馈表单** - 意见建议收集
- ✅ **设置页面** - 应用配置修改

这套验证工具让表单验证变得超级简单，告别重复代码，拥抱优雅开发！🎉