# C_SwipeAction 滑动操作组件

## 组件简介

列表项滑动操作组件，支持左右滑动展示操作按钮。

**特性：**

- 支持左滑/右滑操作区域
- 多按钮自定义（图标 + 文字）
- 滑动阈值自动展开/收起
- 点击按钮后自动关闭
- 支持禁用状态

---

## 快速开始

```vue
<C_SwipeAction
  :right-actions="[
    { text: '置顶', type: 'primary', icon: 'top' },
    { text: '删除', type: 'danger', icon: 'delete' },
  ]"
  @action="onAction"
>
  <view class="list-item">消息内容</view>
</C_SwipeAction>
```

---

## API 文档

### Props

| 属性         | 类型    | 默认值  | 说明                          |
| ------------ | ------- | ------- | ----------------------------- |
| disabled     | Boolean | `false` | 是否禁用滑动                  |
| leftActions  | Array   | `[]`    | 左侧操作按钮列表              |
| rightActions | Array   | `[]`    | 右侧操作按钮列表              |
| threshold    | Number  | `60`    | 滑动阈值(rpx)，超过时自动展开 |

### Action 对象

| 属性    | 类型   | 说明                                                   |
| ------- | ------ | ------------------------------------------------------ |
| text    | String | 按钮文字                                               |
| icon    | String | 按钮图标（wd-icon name）                               |
| type    | String | 按钮类型：`primary` / `success` / `warning` / `danger` |
| bgColor | String | 自定义背景色（如 `#ee0a24`）                           |
| style   | Object | 自定义样式                                             |

### Events

| 事件名 | 参数                          | 说明         |
| ------ | ----------------------------- | ------------ |
| action | `{ action, index, position }` | 点击操作按钮 |
| open   | `'left'` / `'right'`          | 滑动展开     |
| close  | -                             | 滑动关闭     |

### Methods (ref)

| 方法名  | 说明         |
| ------- | ------------ |
| close() | 手动关闭滑动 |

---

## 代码示例

### 消息列表滑动删除

```vue
<C_SwipeAction
  v-for="item in messages"
  :key="item.id"
  :right-actions="[
    { text: '标已读', type: 'primary' },
    { text: '删除', type: 'danger' },
  ]"
  @action="({ index }) => handleAction(item, index)"
>
  <view class="message-item">{{ item.content }}</view>
</C_SwipeAction>
```

---

## 注意事项

- 嵌套在 `scroll-view` 中时需注意事件冲突
- 每个按钮默认宽度 160rpx
- 内容区背景默认跟随 `--r-bg-card` 变量
