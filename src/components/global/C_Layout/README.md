# C_Layout 布局容器

页面级布局容器：智能拼装 Header / 内容区 / Tabbar / 全局 Loading / 环境角标，
并承担主题（亮/暗）与页面级请求取消的接入点。

## 基本用法

```vue
<template>
  <C_Layout title="页面标题" :show-tabbar="true">
    <view>页面内容</view>
  </C_Layout>
</template>
```

## 核心能力

| 能力 | 说明 |
| --- | --- |
| 三种布局形态 | `layout-none`（登录/引导）/ `layout-header-only`（详情/设置）/ `layout-full`（TabBar 页） |
| 智能返回 | `handleBackClick` 内置页面栈判断，栈底自动回首页 |
| Tabbar 同步 | `onShow` 自动同步当前 tab 高亮与消息角标 |
| 主题接入 | 根节点绑定 `themeClass`（暗色级联），内容包裹 `wd-config-provider`（组件库暗色/品牌变量） |
| 请求取消 | 页面 `onUnload` 自动调用 `http.cancelPageRequests(route)` |
| 全局 Loading | `globalLoading` 遮罩（配合 `--r-z-modal` 层级） |

## 主要 Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | string | `''` | Header 标题 |
| `showHeader` | boolean | `true` | 是否显示 Header |
| `showTabbar` | boolean | 页面路径自动判断 | 是否显示 Tabbar |
| `forceLayoutType` | `'none'\|'header-only'\|'full'` | 自动 | 强制布局形态 |
| `globalLoading` | boolean | `false` | 全局加载遮罩 |
| `debug` | boolean | `false` | 调试信息 |

## Events

`userClick` / `notificationClick` / `settingsClick` / `backClick` / `tabChange` / `layoutChange`
