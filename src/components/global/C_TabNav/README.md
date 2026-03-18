# C_TabNav 标签页导航

页面内标签页导航，支持滚动、等分、吸顶、徽标等特性，适用于内容分类切换场景。

## 快速开始

```vue
<C_TabNav v-model="active" :tabs="tabs" />
```

## API 文档

### Props

| 参数         | 说明             | 类型                                         | 默认值  |
| ------------ | ---------------- | -------------------------------------------- | ------- |
| modelValue   | 当前激活值       | `String / Number`                            | `""`    |
| tabs         | 标签列表         | `Array<{ label, value, badge?, disabled? }>` | `[]`    |
| scrollable   | 是否可滚动       | `Boolean`                                    | `false` |
| showLine     | 是否显示下划线   | `Boolean`                                    | `true`  |
| lineWidth    | 下划线宽度 (rpx) | `Number`                                     | `60`    |
| equalWidth   | 是否等分         | `Boolean`                                    | `false` |
| sticky       | 是否吸顶         | `Boolean`                                    | `false` |
| stickyOffset | 吸顶偏移量 (px)  | `Number`                                     | `0`     |

### Events

| 事件名            | 说明       | 回调参数                 |
| ----------------- | ---------- | ------------------------ |
| update:modelValue | 激活值变更 | `value: String / Number` |
| change            | 切换标签   | `value: String / Number` |

### Tab 数据格式

```js
const tabs = [
  { label: '全部', value: 'all' },
  { label: '待处理', value: 'pending', badge: 5 },
  { label: '已完成', value: 'done' },
  { label: '已禁用', value: 'off', disabled: true },
]
```

## 代码示例

### 基础用法

```vue
<C_TabNav v-model="active" :tabs="tabs" equal-width />
```

### 可滚动标签

```vue
<C_TabNav v-model="active" :tabs="manyTabs" scrollable />
```

### 吸顶效果

```vue
<C_TabNav v-model="active" :tabs="tabs" sticky :sticky-offset="44" />
```

### 带徽标

```vue
<C_TabNav
  v-model="active"
  :tabs="[
    { label: '消息', value: 'msg', badge: 99 },
    { label: '通知', value: 'notice', badge: 3 },
    { label: '待办', value: 'todo' },
  ]"
/>
```

## 注意事项

1. 使用 `v-model` 双向绑定当前激活标签值。
2. `scrollable` 适用于标签数量较多的场景，激活标签会自动居中。
3. `equalWidth` 适用于标签数量固定（3-5个）的场景。
4. `sticky` 吸顶需要配合 `stickyOffset` 设置导航栏高度偏移。
5. `badge` 支持数字和字符串，超长内容会自动缩小。
