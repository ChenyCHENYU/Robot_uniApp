# C_FloatButton 悬浮按钮组件

## 组件简介

固定在页面底部角落的快捷操作按钮。

**特性：**
- 左下 / 右下定位
- 可拖拽（可选）
- 安全区域适配
- 缩放点击反馈

---

## 快速开始

```vue
<C_FloatButton icon="add" @click="onCreate" />
```

---

## API 文档

### Props

| 属性      | 类型    | 默认值         | 说明             |
| --------- | ------- | -------------- | ---------------- |
| icon      | String  | `add`          | 图标名           |
| position  | String  | `right-bottom` | 位置             |
| bottom    | Number  | `160`          | 距底部 (rpx)     |
| right     | Number  | `32`           | 距右侧 (rpx)    |
| left      | Number  | `32`           | 距左侧 (rpx)    |
| size      | Number  | `112`          | 按钮尺寸 (rpx)  |
| draggable | Boolean | `false`        | 是否可拖拽       |

### Events

| 事件名 | 说明     |
| ------ | -------- |
| click  | 点击按钮 |

### Slots

| 名称    | 说明             |
| ------- | ---------------- |
| default | 自定义按钮内容   |

---

## 注意事项

- 默认不可拖拽，设置 `draggable` 启用
- 安全区域自动适配，底部安全距离累加到 `bottom`
