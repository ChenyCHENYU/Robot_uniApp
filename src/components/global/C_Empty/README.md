# C_Empty 空状态组件

## 组件简介

当页面数据为空或出现异常时展示的占位组件。

**特性：**

- 内置 8 种常用空状态类型（default/network/search/permission/error/cart/message/collect）
- 支持自定义图标、文案、操作按钮
- 提供 icon / default / action 三个插槽，完全自定义

---

## 快速开始

```vue
<C_Empty type="search" />
```

---

## API 文档

### Props

| 属性       | 类型    | 默认值     | 说明             |
| ---------- | ------- | ---------- | ---------------- |
| type       | String  | `default`  | 空状态类型       |
| text       | String  | -          | 自定义描述文案   |
| icon       | String  | -          | 自定义图标名     |
| iconSize   | Number  | `160`      | 图标尺寸 (px)    |
| showAction | Boolean | `false`    | 是否显示操作按钮 |
| actionText | String  | `重新加载` | 操作按钮文案     |

### Events

| 事件名 | 说明           |
| ------ | -------------- |
| action | 点击操作按钮时 |

### Slots

| 名称    | 说明               |
| ------- | ------------------ |
| default | 自定义文案区域     |
| icon    | 自定义图标区域     |
| action  | 自定义操作按钮内容 |

### 内置类型

| 类型       | 图标                       | 默认文案                 |
| ---------- | -------------------------- | ------------------------ |
| default    | i-mdi-inbox-outline        | 暂无数据                 |
| network    | i-mdi-wifi-off             | 网络异常，请检查网络设置 |
| search     | i-mdi-magnify              | 未找到相关结果           |
| permission | i-mdi-lock-outline         | 暂无权限查看             |
| error      | i-mdi-alert-circle-outline | 加载失败，请重试         |
| cart       | i-mdi-cart-outline         | 购物车是空的             |
| message    | i-mdi-message-text-outline | 暂无消息                 |
| collect    | i-mdi-heart-outline        | 暂无收藏                 |

---

## 代码示例

### 网络异常 + 重试按钮

```vue
<C_Empty type="network" show-action @action="retry" />
```

### 完全自定义

```vue
<C_Empty>
  <template #icon>
    <image src="/static/images/empty.png" style="width: 200rpx; height: 200rpx" />
  </template>
  暂时没有任何内容哦~
  <template #action>
    <wd-button size="small" @click="goSomewhere">去看看</wd-button>
  </template>
</C_Empty>
```

---

## 注意事项

- `icon` 属性值为 UnoCSS 图标类名（如 `i-mdi-inbox-outline`）
- 自定义 `text` 会覆盖内置类型的默认文案
- 自定义 `icon` 会覆盖内置类型的默认图标
