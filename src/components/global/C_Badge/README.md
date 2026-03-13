# C_Badge 增强徽标组件

## 组件简介

在子元素右上角展示消息数或小圆点。

**特性：**
- 数值超出 max 自动显示 `99+`
- 支持小圆点模式
- 可自定义颜色和偏移

---

## 快速开始

```vue
<C_Badge :value="5">
  <wd-icon name="bell" size="24px" />
</C_Badge>
```

---

## API 文档

### Props

| 属性     | 类型            | 默认值     | 说明               |
| -------- | --------------- | ---------- | ------------------ |
| value    | Number / String | `0`        | 徽标值             |
| max      | Number          | `99`       | 最大数值           |
| dot      | Boolean         | `false`    | 小圆点模式         |
| showZero | Boolean         | `false`    | 值为 0 时是否显示  |
| color    | String          | `#dd524d`  | 徽标颜色           |
| offset   | Array           | `[0, 0]`   | 偏移 [x, y] (rpx)  |

### Slots

| 名称    | 说明         |
| ------- | ------------ |
| default | 被标记的内容 |

---

## 注意事项

- `value` 为字符串时直接显示，不受 `max` 限制
- `dot` 模式下 `value` 被忽略
