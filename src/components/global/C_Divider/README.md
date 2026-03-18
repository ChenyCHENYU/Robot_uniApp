# C_Divider 分割线

区隔内容的分割线，支持带文字和虚线样式。

## 快速开始

```vue
<C_Divider />
<C_Divider text="分割内容" />
```

## API 文档

### Props

| 参数         | 说明                             | 类型      | 默认值   |
| ------------ | -------------------------------- | --------- | -------- |
| text         | 文本内容                         | `String`  | `""`     |
| textPosition | 文本位置 `left / center / right` | `String`  | `center` |
| dashed       | 是否虚线                         | `Boolean` | `false`  |
| lineColor    | 线条颜色                         | `String`  | `#eee`   |
| textColor    | 文字颜色                         | `String`  | `#999`   |
| textSize     | 文字大小 (rpx)                   | `Number`  | `24`     |
| margin       | 上下间距 (rpx)                   | `Number`  | `32`     |

### Slots

| 名称    | 说明           |
| ------- | -------------- |
| default | 自定义文本内容 |

## 代码示例

### 虚线

```vue
<C_Divider dashed />
```

### 带文字

```vue
<C_Divider text="OR" />
<C_Divider text="更多" text-position="left" />
```

### 自定义颜色

```vue
<C_Divider text="重要" line-color="#ff4d4f" text-color="#ff4d4f" />
```

## 注意事项

1. 不传 `text` 且无默认插槽时显示纯分割线。
2. `textPosition` 控制文字在线条中的位置。
