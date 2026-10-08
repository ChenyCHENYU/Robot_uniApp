# C_ActionSheet 底部操作面板组件

## 组件简介

从底部弹出的操作选项面板。

**特性：**

- v-model:visible 双向绑定
- 支持图标、描述、危险操作、禁用
- 支持当前选项高亮与勾选，使用独立的取消按钮
- 底部安全区域适配

---

## 快速开始

```vue
<C_ActionSheet
  v-model:visible="show"
  :actions="[{ name: '编辑' }, { name: '删除', danger: true }]"
  @select="onSelect"
/>
```

---

## API 文档

### Props

| 属性                | 类型    | 默认值 | 说明                            |
| ------------------- | ------- | ------ | ------------------------------- |
| visible (v-model)   | Boolean | false  | 是否显示                        |
| title               | String  | -      | 标题                            |
| actions             | Array   | `[]`   | 操作项列表                      |
| selectedIndex       | Number  | `-1`   | 当前选项序号，`-1` 表示无选中项 |
| cancelText          | String  | `取消` | 取消按钮文案                    |
| showCancel          | Boolean | true   | 显示取消按钮                    |
| closeOnClickOverlay | Boolean | true   | 遮罩关闭                        |

### actions 数据结构

```js
;[
  {
    name: '操作名称', // name / text 至少提供一项
    value: 'edit', // 可选: 业务操作值，随原选项对象回传
    icon: 'i-mdi-pencil', // 可选: C_Icon 支持的 Iconify 或 wot-design-uni 图标名
    description: '操作说明', // 可选
    danger: false, // 可选: 危险操作（红色）
    disabled: false, // 可选: 禁用
  },
]
```

### Events

| 事件名         | 参数        | 说明                     |
| -------------- | ----------- | ------------------------ |
| update:visible | Boolean     | 显隐变化                 |
| select         | item, index | 选择操作项               |
| cancel         | -           | 点击取消或允许关闭的遮罩 |

---

## 注意事项

- 选择操作项后自动关闭面板
- `disabled` 项不可点击且样式置灰
- `select` 按顺序返回原选项对象和序号，区别于 Wot 的 `{ item, index }` 单个事件对象；业务迁移可在 `data.ts` 中适配，不改变原处理逻辑。
- 使用项目主题令牌，亮色 / 暗色保持同一布局，面板与屏幕底部安全区保留间距。
- H5 打开面板后自动聚焦当前选项或面板；Tab 在可用控件内循环，Enter / Space 选择或取消，Esc 取消，关闭后恢复原焦点。禁用项不进入键盘顺序。
