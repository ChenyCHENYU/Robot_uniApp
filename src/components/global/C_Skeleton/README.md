# C_Skeleton 骨架屏组件

## 组件简介

数据加载时的占位效果，提升用户感知体验。

**特性：**

- 支持头像 + 标题 + 段落组合
- 脉冲动画效果
- `loading` 为 false 时自动展示默认插槽内容

---

## 快速开始

```vue
<C_Skeleton :loading="loading" avatar :rows="3">
  <view>实际内容</view>
</C_Skeleton>
```

---

## API 文档

### Props

| 属性    | 类型    | 默认值  | 说明             |
| ------- | ------- | ------- | ---------------- |
| loading | Boolean | `true`  | 是否展示骨架屏   |
| rows    | Number  | `3`     | 段落行数         |
| animate | Boolean | `true`  | 是否启用脉冲动画 |
| avatar  | Boolean | `false` | 是否显示头像占位 |
| title   | Boolean | `true`  | 是否显示标题占位 |

### Slots

| 名称    | 说明                          |
| ------- | ----------------------------- |
| default | loading 为 false 时展示的内容 |

---

## 代码示例

### 列表骨架屏

```vue
<C_Skeleton :loading="loading" avatar :rows="2">
  <view class="user-item">
    <image :src="user.avatar" />
    <text>{{ user.name }}</text>
  </view>
</C_Skeleton>
```

### 纯文本骨架

```vue
<C_Skeleton :loading="loading" :avatar="false" :title="false" :rows="5">
  <rich-text :nodes="content" />
</C_Skeleton>
```

---

## 注意事项

- 建议配合 `useLoading` composable 管理 loading 状态
- `rows` 最后一行默认宽度为 60%，模拟自然文本效果
