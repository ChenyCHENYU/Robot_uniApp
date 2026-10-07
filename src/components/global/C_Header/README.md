# C_Header 顶部导航

玻璃拟态风格的页面头部：返回、用户信息（头像/问候）、状态、通知、设置。

## 基本用法

```vue
<C_Header
  title="页面标题"
  :show-back="true"
  :show-user="true"
  :notification-count="3"
  @back-click="onBack"
/>
```

C_Layout 已内置本组件，多数页面无需直接使用。

## 主要 Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | string | `''` | 标题 |
| `showBack` | boolean | `true` | 返回按钮 |
| `showUser` | boolean | `true` | 用户区（头像取自 user store） |
| `notificationCount` | number | `0` | 通知角标（0 显示小红点样式） |
| `compactMode` | boolean | `false` | 紧凑模式（高度收窄） |
| `defaultTitle` | string | `'早上好'` | 问候语兜底 |

## Events

`backClick` / `userClick` / `notificationClick` / `settingsClick` / `statusClick`

## 主题说明

头部为深色渐变 + 白字设计，亮/暗两主题下均直接可用，无需覆盖。
