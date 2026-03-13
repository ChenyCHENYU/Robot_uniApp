# C_Tag 状态标签组件

## 组件简介

用于标记/分类的状态标签。

**特性：**
- 5 种预设颜色（primary/success/warning/error/info）
- 朴素/实心两种模式
- 可关闭、自定义颜色

---

## 快速开始

```vue
<C_Tag type="success" text="已通过" />
<C_Tag type="warning" text="审批中" round />
<C_Tag type="error" text="已拒绝" closeable @close="onClose" />
```

---

## API 文档

### Props

| 属性      | 类型    | 默认值    | 说明                 |
| --------- | ------- | --------- | -------------------- |
| text      | String  | -         | 标签文字             |
| type      | String  | `primary` | 颜色类型             |
| plain     | Boolean | `true`    | 朴素模式（浅色背景） |
| round     | Boolean | `false`   | 是否圆角             |
| closeable | Boolean | `false`   | 是否可关闭           |
| size      | String  | `default` | 尺寸                 |
| color     | String  | -         | 自定义颜色           |

### Events

| 事件名 | 说明       |
| ------ | ---------- |
| close  | 关闭时触发 |

### Slots

| 名称    | 说明           |
| ------- | -------------- |
| default | 自定义标签内容 |

---

## 注意事项

- 配合 `APPROVAL_STATUS_MAP` 常量使用可快速渲染业务状态
