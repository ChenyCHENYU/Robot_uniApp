# C_Modal 弹窗组件

## 组件简介

可自定义内容的模态弹窗，支持 v-model 控制显隐。

**特性：**
- v-model:visible 双向绑定
- 支持纯文本内容或自定义插槽
- 可配置取消/确认/关闭按钮
- 遮罩点击关闭可选
- 弹入动画

---

## 快速开始

```vue
<C_Modal v-model:visible="showModal" title="确认删除" content="删除后不可恢复" @confirm="onDelete" />
```

---

## API 文档

### Props

| 属性                | 类型    | 默认值 | 说明             |
| ------------------- | ------- | ------ | ---------------- |
| visible (v-model)   | Boolean | false  | 是否显示         |
| title               | String  | `提示` | 标题             |
| content             | String  | -      | 纯文本内容       |
| showClose           | Boolean | true   | 显示关闭按钮     |
| showCancel          | Boolean | true   | 显示取消按钮     |
| showConfirm         | Boolean | true   | 显示确认按钮     |
| confirmText         | String  | `确定` | 确认按钮文案     |
| cancelText          | String  | `取消` | 取消按钮文案     |
| closeOnClickOverlay | Boolean | true   | 遮罩关闭         |
| width               | String  | `80%`  | 弹窗宽度         |

### Events

| 事件名         | 说明         |
| -------------- | ------------ |
| update:visible | 显隐变化     |
| confirm        | 点击确认     |
| cancel         | 点击取消     |
| close          | 弹窗关闭     |

### Slots

| 名称    | 说明                 |
| ------- | -------------------- |
| default | 自定义弹窗内容区域   |

---

## 代码示例

### 自定义内容

```vue
<C_Modal v-model:visible="show" title="用户协议">
  <scroll-view scroll-y style="max-height: 600rpx">
    <text>协议内容...</text>
  </scroll-view>
</C_Modal>
```

---

## 注意事项

- `confirm` 事件触发后不会自动关闭弹窗，需在回调中手动设置 `visible = false`
- 使用 `v-model:visible` 实现双向绑定
