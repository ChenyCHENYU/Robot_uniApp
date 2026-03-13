# C_Steps 步骤条组件

## 组件简介

用于展示流程进度，支持水平/垂直方向。

**特性：**
- 水平 / 垂直两种布局
- 自动标记已完成/当前/待进行状态
- 已完成步骤显示勾选图标
- 可自定义激活颜色

---

## 快速开始

```vue
<C_Steps :steps="[{ title: '提交' }, { title: '审核' }, { title: '完成' }]" :current="1" />
```

---

## API 文档

### Props

| 属性          | 类型   | 默认值       | 说明                 |
| ------------- | ------ | ------------ | -------------------- |
| steps         | Array  | 必填         | 步骤数据             |
| current       | Number | `0`          | 当前步骤索引         |
| direction     | String | `horizontal` | 方向                 |
| activeColor   | String | `#007aff`    | 激活态颜色           |
| inactiveColor | String | `#c0c4cc`    | 非激活态颜色         |

### steps 数据结构

```js
[
  { title: '步骤标题', description: '步骤描述（可选）' }
]
```

---

## 代码示例

### 垂直审批流

```vue
<C_Steps
  direction="vertical"
  :current="2"
  :steps="[
    { title: '张三 提交申请', description: '2025-01-01 10:00' },
    { title: '李四 审批通过', description: '2025-01-02 14:00' },
    { title: '王五 审批中', description: '等待处理' },
  ]"
/>
```

---

## 注意事项

- `current` 从 0 开始，位于 current 之前的步骤会显示为"已完成"（绿色勾选）
- 水平模式下步骤数建议不超过 5 个
