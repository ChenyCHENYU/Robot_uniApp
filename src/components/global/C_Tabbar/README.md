# C_Tabbar 底部标签栏

自绘双模式 Tabbar（glass 玻璃拟态胶囊 / flat 扁平），替代原生 tabBar。

## 基本用法

```vue
<C_Tabbar v-model="activeIndex" :tab-list="tabList" @tab-click="onTab" />
```

C_Layout 已内置本组件（`tabbarConfig` 驱动），页面一般不直接使用。

## 模式

| 模式    | 说明                                                                        |
| ------- | --------------------------------------------------------------------------- |
| `glass` | 玻璃拟态悬浮胶囊（backdrop-filter + 渐变描边），含暗色适配（`.theme-dark`） |
| `flat`  | 扁平简约（卡片底 + 顶部分隔线）                                             |

## 主要 Props

| Prop         | 类型              | 默认       | 说明                                                   |
| ------------ | ----------------- | ---------- | ------------------------------------------------------ |
| `modelValue` | number            | `0`        | 当前索引（v-model）                                    |
| `mode`       | `'glass'\|'flat'` | `'flat'`   | 展示模式                                               |
| `tabList`    | TabItem[]         | 内置四 Tab | `{ id, text, path, unoIcon, icon, activeIcon, badge }` |

| `fixed` | boolean | `true` | 独立使用可固定定位；C_Layout 传 false，使底栏在布局中占位 |

## Events / Methods

- `tab-click({ item, index })`、`change({ item, index })`
- `setBadge(tabId, count)`：设置角标
- `setCurrentIndex(i)`：外部同步高亮

## 图标体系

优先 `unoIcon`，内置导航采用同一套 MDI 线形图标并通过文字色区分选中状态；降级使用 `wd-icon`（icon/activeIcon 双态）。支持点击、Enter 和空格键切换。
