# C_Notify 消息通知

顶部/底部消息通知条，支持多种类型、自动关闭和滑动关闭。

## 快速开始

```vue
<C_Notify v-model:visible="show" message="操作成功" type="success" />
```

## API 文档

### Props

| 参数       | 说明                                               | 类型      | 默认值    |
| ---------- | -------------------------------------------------- | --------- | --------- |
| visible    | 是否显示                                           | `Boolean` | `false`   |
| type       | 类型 `primary / success / warning / danger / info` | `String`  | `primary` |
| message    | 通知内容                                           | `String`  | `""`      |
| duration   | 显示时长 (ms)，0=不自动关闭                        | `Number`  | `3000`    |
| background | 自定义背景色                                       | `String`  | 根据 type |
| color      | 自定义文字颜色                                     | `String`  | 根据 type |
| position   | 位置 `top / bottom`                                | `String`  | `top`     |
| swipeable  | 是否允许滑动关闭                                   | `Boolean` | `true`    |

### Events

| 事件名         | 说明         | 回调参数           |
| -------------- | ------------ | ------------------ |
| update:visible | 显示状态变更 | `visible: Boolean` |
| close          | 关闭时触发   | —                  |

## 代码示例

### 不同类型

```vue
<C_Notify v-model:visible="show1" type="success" message="保存成功" />
<C_Notify v-model:visible="show2" type="danger" message="网络异常" />
<C_Notify v-model:visible="show3" type="warning" message="余额不足" />
```

### 常驻通知

```vue
<C_Notify v-model:visible="show" message="系统维护中" :duration="0" />
```

### 底部通知

```vue
<C_Notify v-model:visible="show" message="已加入购物车" position="bottom" />
```

## 注意事项

1. 通过 `v-model:visible` 控制显隐。
2. `duration` 为 0 时不自动关闭，需手动设置 `visible` 为 `false`。
3. `swipeable` 开启时，顶部通知上滑关闭，底部通知下滑关闭。
