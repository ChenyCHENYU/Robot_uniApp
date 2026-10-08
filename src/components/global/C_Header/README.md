# C_Header 顶部导航

使用主题色变量的页面导航：返回、用户头像、标题、通知与设置。默认头像与加载失败头像显示昵称首字。

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

| Prop                | 类型    | 默认    | 说明                          |
| ------------------- | ------- | ------- | ----------------------------- |
| `title`             | string  | `''`    | 标题                          |
| `showBack`          | boolean | `false` | 返回按钮                      |
| `showUser`          | boolean | `true`  | 用户区（头像取自 user store） |
| `notificationCount` | number  | `0`     | 未读角标，0 时隐藏            |
| `subtitle`          | string  | `''`    | 可选副标题                    |

## Events

`backClick` / `userClick` / `notificationClick` / `settingsClick` / `statusClick`

## 主题说明

头部背景、文字与交互颜色跟随亮色/深色主题。`environment` 插槽位于标题旁，C_Layout 用它展示非生产环境标识，不遮挡通知和设置按钮。
