# C_Cascader 级联选择器

多级联动选择器，适用于省市区选择、部门层级选择等场景，支持搜索过滤。

## 快速开始

```vue
<C_Cascader v-model:visible="show" :options="areaData" @confirm="onConfirm" />
```

## API 文档

### Props

| 参数         | 说明           | 类型      | 默认值     |
| ------------ | -------------- | --------- | ---------- |
| visible      | 是否显示       | `Boolean` | `false`    |
| title        | 标题           | `String`  | `请选择`   |
| options      | 选项数据       | `Array`   | `[]`       |
| defaultValue | 默认选中值数组 | `Array`   | `[]`       |
| valueKey     | 值字段名       | `String`  | `value`    |
| labelKey     | 文本字段名     | `String`  | `label`    |
| childrenKey  | 子级字段名     | `String`  | `children` |
| filterable   | 是否可搜索     | `Boolean` | `false`    |
| placeholder  | 搜索占位文字   | `String`  | `搜索`     |
| resetOnClose | 关闭后是否重置 | `Boolean` | `false`    |

### Events

| 事件名         | 说明                 | 回调参数                           |
| -------------- | -------------------- | ---------------------------------- |
| update:visible | 显示状态变更         | `visible: Boolean`                 |
| change         | 选择变更（逐级）     | `{ values: Array, labels: Array }` |
| confirm        | 选择完成（叶子节点） | `{ values: Array, labels: Array }` |

### 数据格式

```js
const options = [
  {
    value: 'zhejiang',
    label: '浙江省',
    children: [
      {
        value: 'hangzhou',
        label: '杭州市',
        children: [
          { value: 'xihu', label: '西湖区' },
          { value: 'binjiang', label: '滨江区' },
        ],
      },
    ],
  },
]
```

## 代码示例

### 省市区选择

```vue
<C_Cascader
  v-model:visible="show"
  title="选择地区"
  :options="areaData"
  @confirm="onArea"
/>
```

### 带搜索

```vue
<C_Cascader
  v-model:visible="show"
  :options="deptData"
  filterable
  placeholder="搜索部门"
  @confirm="onDept"
/>
```

### 自定义字段名

```vue
<C_Cascader
  v-model:visible="show"
  :options="customData"
  value-key="id"
  label-key="name"
  children-key="sub"
  @confirm="onConfirm"
/>
```

## 注意事项

1. 选择到叶子节点（无 `children`）时自动触发 `confirm` 并关闭。
2. `confirm` 返回 `{ values, labels }` 分别为值路径和标签路径数组。
3. 开启 `filterable` 后搜索结果直接展示完整路径，点击即选中。
4. 通过 `valueKey / labelKey / childrenKey` 可适配不同后端数据结构。
