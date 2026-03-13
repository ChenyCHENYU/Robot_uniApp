# C_Card 内容卡片组件

## 组件简介

统一的内容卡片容器，规范页面卡片视觉。

**特性：**

- 支持 header / body / footer 三段式结构
- 4 级阴影可选（sm/md/lg/none）
- 可点击态（含缩放反馈）

---

## 快速开始

```vue
<C_Card title="基本信息">
  <text>卡片内容</text>
</C_Card>
```

---

## API 文档

### Props

| 属性      | 类型    | 默认值  | 说明                     |
| --------- | ------- | ------- | ------------------------ |
| title     | String  | -       | 卡片标题                 |
| subtitle  | String  | -       | 副标题                   |
| shadow    | String  | `sm`    | 阴影等级 `sm/md/lg/none` |
| padding   | Boolean | `true`  | 内容区是否有内边距       |
| clickable | Boolean | `false` | 是否可点击               |

### Events

| 事件名 | 说明                     |
| ------ | ------------------------ |
| click  | clickable 为 true 时触发 |

### Slots

| 名称    | 说明         |
| ------- | ------------ |
| default | 卡片主体内容 |
| header  | 自定义头部   |
| extra   | 头部右侧扩展 |
| footer  | 卡片底部     |

---

## 代码示例

### 带操作的卡片

```vue
<C_Card title="待办事项">
  <template #extra>
    <wd-icon name="more" @click="showMore" />
  </template>
  <view>事项内容...</view>
  <template #footer>
    <wd-button size="small">查看详情</wd-button>
  </template>
</C_Card>
```

---

## 注意事项

- `clickable` 为 true 时会有点击缩放效果
- `padding` 为 false 时内容区无内边距，适合放置图片等全宽内容
