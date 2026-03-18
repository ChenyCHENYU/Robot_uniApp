# C_IndexList 索引列表组件

## 组件简介

带字母索引侧边栏的分组列表组件，常用于通讯录和城市选择。

**特性：**

- 右侧字母索引栏
- 触摸快速定位 + 气泡提示
- 分组标题吸顶
- 支持自定义渲染列表项（Scoped Slot）

---

## 快速开始

```vue
<C_IndexList :data="contacts" @select="onSelect">
  <template #default="{ items }">
    <view v-for="item in items" :key="item.id" class="contact-item">
      {{ item.name }}
    </view>
  </template>
</C_IndexList>
```

---

## API 文档

### Props

| 属性        | 类型    | 默认值     | 说明                                             |
| ----------- | ------- | ---------- | ------------------------------------------------ |
| data        | Array   | `[]`       | 分组数据，格式 `[{ letter: 'A', items: [...] }]` |
| indexKey    | String  | `'letter'` | 分组索引字段名                                   |
| sticky      | Boolean | `true`     | 分组标题是否吸顶                                 |
| activeColor | String  | `''`       | 索引栏高亮颜色                                   |

### Events

| 事件名 | 参数             | 说明             |
| ------ | ---------------- | ---------------- |
| select | `letter: string` | 触摸索引栏时触发 |

### Slots

| 名称    | 参数               | 说明             |
| ------- | ------------------ | ---------------- |
| default | `{ group, items }` | 每组的列表项渲染 |

---

## 代码示例

### 通讯录

```vue
<C_IndexList :data="contactGroups">
  <template #default="{ items }">
    <view v-for="person in items" :key="person.id" class="person-row">
      <image :src="person.avatar" class="avatar" />
      <text>{{ person.name }}</text>
    </view>
  </template>
</C_IndexList>
```

### 数据格式

```js
const contactGroups = [
  { letter: 'A', items: [{ id: 1, name: '安琪', avatar: '...' }] },
  { letter: 'B', items: [{ id: 2, name: '白洁', avatar: '...' }] },
  // ...
]
```

---

## 注意事项

- 组件需要外部容器提供固定高度
- 索引栏位置基于 `fixed` 定位
- 快速滑动索引栏时通过 `scroll-into-view` 自动定位
