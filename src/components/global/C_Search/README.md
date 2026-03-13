# C_Search 搜索栏组件

## 组件简介

带防抖输入、搜索历史的搜索栏组件。

**特性：**

- 输入防抖（默认 300ms）
- 搜索历史自动记录（本地存储）
- 一键清空历史 / 清空输入
- 键盘确认搜索

---

## 快速开始

```vue
<C_Search @search="handleSearch" />
```

---

## API 文档

### Props

| 属性         | 类型    | 默认值 | 说明             |
| ------------ | ------- | ------ | ---------------- |
| placeholder  | String  | `搜索` | 占位文本         |
| maxHistory   | Number  | `10`   | 最大历史记录数   |
| showHistory  | Boolean | `true` | 是否显示搜索历史 |
| debounceTime | Number  | `300`  | 防抖时间 (ms)    |
| showAction   | Boolean | `true` | 是否显示搜索按钮 |

### Events

| 事件名 | 参数    | 说明           |
| ------ | ------- | -------------- |
| search | keyword | 确认搜索时     |
| input  | keyword | 防抖后输入变化 |
| clear  | -       | 点击清空按钮   |

---

## 代码示例

### 不显示历史记录

```vue
<C_Search :show-history="false" placeholder="搜索员工" @search="onSearch" />
```

---

## 注意事项

- 搜索历史使用 `uni.setStorageSync` 存储，Key 为 `STORAGE_KEYS.SEARCH_HISTORY`
- `debounceTime` 仅影响 `input` 事件，`search` 事件不防抖
