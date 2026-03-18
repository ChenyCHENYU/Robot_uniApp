# C_Calendar 日历

日历组件，支持单选、多选、范围选择三种模式，可自定义日期范围、标记和一周起始日。

## 快速开始

```vue
<C_Calendar v-model:visible="show" @confirm="onConfirm" />
```

## API 文档

### Props

| 参数           | 说明                        | 类型                                 | 默认值      |
| -------------- | --------------------------- | ------------------------------------ | ----------- |
| visible        | 是否显示                    | `Boolean`                            | `false`     |
| mode           | 选择模式                    | `String` `single / multiple / range` | `single`    |
| defaultDate    | 默认选中日期                | `String / Array`                     | `null`      |
| minDate        | 可选最小日期                | `String`                             | 无限制      |
| maxDate        | 可选最大日期                | `String`                             | 无限制      |
| title          | 标题                        | `String`                             | `选择日期`  |
| showConfirm    | 是否显示确认按钮            | `Boolean`                            | `true`      |
| confirmText    | 确认按钮文字                | `String`                             | `确定`      |
| firstDayOfWeek | 一周起始日 (0=周日, 1=周一) | `Number`                             | `1`         |
| marks          | 日期标记                    | `Array<{ date, color }>`             | `[]`        |
| maxRange       | 范围模式最大天数            | `Number`                             | `0`（不限） |

### Events

| 事件名         | 说明           | 回调参数               |
| -------------- | -------------- | ---------------------- |
| update:visible | 显示状态变更   | `visible: Boolean`     |
| select         | 选择日期时触发 | `date: String / Array` |
| confirm        | 确认选择       | `date: String / Array` |

## 代码示例

### 单选模式

```vue
<C_Calendar v-model:visible="show" mode="single" @confirm="onDate" />
```

### 多选模式

```vue
<C_Calendar v-model:visible="show" mode="multiple" @confirm="onDates" />
```

### 范围选择

```vue
<C_Calendar v-model:visible="show" mode="range" @confirm="onRange" />
```

### 自定义标记

```vue
<C_Calendar
  v-model:visible="show"
  :marks="[
    { date: '2025-01-01', color: '#ff4d4f' },
    { date: '2025-02-14', color: '#ff85c0' },
  ]"
  @confirm="onConfirm"
/>
```

### 限定日期范围

```vue
<C_Calendar
  v-model:visible="show"
  min-date="2025-01-01"
  max-date="2025-12-31"
  @confirm="onConfirm"
/>
```

## 注意事项

1. 日期格式统一使用 `YYYY-MM-DD` 字符串。
2. `range` 模式下 `confirm` 事件返回 `[startDate, endDate]` 数组。
3. `multiple` 模式下 `confirm` 事件返回选中日期数组。
4. `marks` 数组中 `color` 可选，默认使用主题色。
5. 通过 `v-model:visible` 双向绑定控制显隐。
