# C_Title 区块标题

带可选副标题/图标的区块标题，支持前置色条与尺寸分级。

## 基本用法

```vue
<C_Title title="基本信息" subtitle="共 6 项" />
<C_Title title="审批流程" type="primary" size="large" show-bar />
```

## 主要 Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | string | 必填 | 主标题 |
| `subtitle` | string | `''` | 副标题 |
| `type` | `'default'\|'primary'\|'success'\|'warning'\|'danger'\|'info'` | `'default'` | 主题色（色条/图标着色） |
| `size` | `'small'\|'medium'\|'large'` | `'medium'` | 尺寸 |
| `showBar` | boolean | `false` | 前置色条 |
| `align` | `'left'\|'center'\|'right'` | `'left'` | 对齐 |

## 主题

type 色值取自 `--r-color-*` token，自动跟随亮/暗主题。
