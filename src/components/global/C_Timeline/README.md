# C_Timeline 时间轴

按时间线展示事件流程，支持自定义节点、倒序排列和当前进度标记。

## 快速开始

```vue
<C_Timeline :items="events" :current="1" />
```

## API 文档

### Props

| 参数          | 说明         | 类型                                               | 默认值           |
| ------------- | ------------ | -------------------------------------------------- | ---------------- |
| items         | 时间轴数据   | `Array<{ title, content?, time?, icon?, color? }>` | `[]`             |
| direction     | 排列方向     | `String` `vertical`                                | `vertical`       |
| reverse       | 是否倒序     | `Boolean`                                          | `false`          |
| current       | 当前激活索引 | `Number`                                           | `-1`（全部完成） |
| finishedColor | 已完成颜色   | `String`                                           | 主题色           |
| pendingColor  | 未完成颜色   | `String`                                           | `#ccc`           |

### Slots

| 名称  | 说明           | 参数              |
| ----- | -------------- | ----------------- |
| icon  | 自定义节点图标 | `{ item, index }` |
| extra | 节点额外内容   | `{ item, index }` |

### Events

无。

## 代码示例

### 快递追踪

```vue
<C_Timeline
  :items="[
    {
      title: '已签收',
      content: '已签收，签收人：本人',
      time: '2025-01-15 14:30',
    },
    { title: '派送中', content: '快递员正在配送中', time: '2025-01-15 09:00' },
    { title: '已发货', time: '2025-01-14 16:00' },
  ]"
  :current="0"
/>
```

### 自定义图标

```vue
<C_Timeline
  :items="[
    { title: '完成', icon: 'check', color: '#34c759' },
    { title: '进行中', icon: 'clock' },
    { title: '待开始' },
  ]"
  :current="1"
/>
```

## 注意事项

1. `current` 为 -1 时所有节点显示为已完成状态。
2. `reverse` 为 true 时数据倒序显示，但 `current` 仍基于原始数据索引。
3. 每个 item 可通过 `color` 单独设置节点颜色，优先级高于状态颜色。
