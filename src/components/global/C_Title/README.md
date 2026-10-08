# C_Title 区块标题

清晰的主题标题，支持副标题、左右图标、分隔线和装饰色条，颜色通过 `--r-*` 令牌跟随深色主题。

```vue
<C_Title title="基本信息" subtitle="共 6 项" />
<C_Title title="审批流程" left-icon="mdi-file-check-outline" show-decoration />
```

| Prop                 | 类型                                                  | 默认值  | 说明               |
| -------------------- | ----------------------------------------------------- | ------- | ------------------ |
| title                | string                                                | 必填    | 主标题             |
| subtitle             | string                                                | `''`    | 副标题             |
| level                | number / string                                       | `2`     | 标题级别，1 至 6   |
| type                 | default / primary / success / warning / danger / info | primary | 图标、装饰色条主题 |
| size                 | small / medium / large                                | medium  | 尺寸               |
| align                | left / center / right                                 | left    | 文本对齐           |
| leftIcon / rightIcon | string                                                | `''`    | 左右图标           |
| iconType             | string                                                | unocss  | 图标渲染类型       |
| bold                 | boolean                                               | true    | 标题加粗           |
| showDivider          | boolean                                               | false   | 显示分隔线         |
| dividerPosition      | top / bottom                                          | bottom  | 分隔线位置         |
| showDecoration       | boolean                                               | false   | 显示装饰色条       |
| clickable            | boolean                                               | false   | 启用点击事件       |
| customStyle          | object                                                | `{}`    | 容器自定义样式     |

只有 `clickable` 为 true 时发出 `click` 事件。
