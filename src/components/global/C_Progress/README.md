# C_Progress 进度条

展示操作进度，支持线性和圆形两种形态，可自定义颜色和状态。

## 快速开始

```vue
<C_Progress :percent="60" />
```

## API 文档

### Props

| 参数              | 说明                                      | 类型      | 默认值      |
| ----------------- | ----------------------------------------- | --------- | ----------- |
| percent           | 进度百分比 0-100                          | `Number`  | `0`         |
| showText          | 是否显示文字                              | `Boolean` | `true`      |
| strokeHeight      | 进度条高度 (rpx)                          | `Number`  | `16`        |
| color             | 自定义颜色                                | `String`  | 根据 status |
| trackColor        | 轨道颜色                                  | `String`  | `#f0f0f0`   |
| animated          | 是否开启过渡动画                          | `Boolean` | `true`      |
| status            | 状态 `normal / success / warning / error` | `String`  | `normal`    |
| circle            | 是否圆形                                  | `Boolean` | `false`     |
| circleSize        | 圆形尺寸 (rpx)                            | `Number`  | `240`       |
| circleStrokeWidth | 圆形线宽 (rpx)                            | `Number`  | `12`        |

### Slots

| 名称    | 说明             |
| ------- | ---------------- |
| default | 圆形模式中心内容 |

## 代码示例

### 带状态

```vue
<C_Progress :percent="100" status="success" />
<C_Progress :percent="40" status="warning" />
<C_Progress :percent="20" status="error" />
```

### 圆形进度

```vue
<C_Progress :percent="75" circle :circle-size="200" />
```

### 自定义颜色和高度

```vue
<C_Progress :percent="50" color="#ff85c0" :stroke-height="24" />
```

## 注意事项

1. `percent` 自动限制在 0-100 范围内。
2. 圆形模式使用 Canvas 绘制，支持通过默认插槽自定义中心内容。
3. 不传 `color` 时自动根据 `status` 取对应主题色。
