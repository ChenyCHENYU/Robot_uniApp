# C_ActionSheet 底部操作面板组件

## 组件简介

从底部弹出的操作选项面板。

**特性：**
- v-model:visible 双向绑定
- 支持图标、描述、危险操作、禁用
- 底部安全区域适配

---

## 快速开始

```vue
<C_ActionSheet
  v-model:visible="show"
  :actions="[
    { name: '编辑' },
    { name: '删除', danger: true },
  ]"
  @select="onSelect"
/>
```

---

## API 文档

### Props

| 属性                | 类型    | 默认值 | 说明         |
| ------------------- | ------- | ------ | ------------ |
| visible (v-model)   | Boolean | false  | 是否显示     |
| title               | String  | -      | 标题         |
| actions             | Array   | `[]`   | 操作项列表   |
| cancelText          | String  | `取消` | 取消按钮文案 |
| showCancel          | Boolean | true   | 显示取消按钮 |
| closeOnClickOverlay | Boolean | true   | 遮罩关闭     |

### actions 数据结构

```js
[{
  name: '操作名称',       // 必填
  icon: 'edit',           // 可选: wot-design-uni 图标名
  description: '操作说明', // 可选
  danger: false,          // 可选: 危险操作（红色）
  disabled: false,        // 可选: 禁用
}]
```

### Events

| 事件名         | 参数         | 说明       |
| -------------- | ------------ | ---------- |
| update:visible | Boolean      | 显隐变化   |
| select         | item, index  | 选择操作项 |
| cancel         | -            | 点击取消   |

---

## 注意事项

- 选择操作项后自动关闭面板
- `disabled` 项不可点击且样式置灰
