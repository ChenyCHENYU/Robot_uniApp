# C_Rate 评分

星级评分组件，支持全星/半星、自定义图标和归零操作。

## 快速开始

```vue
<C_Rate v-model="score" />
```

## API 文档

### Props

| 参数          | 说明           | 类型      | 默认值      |
| ------------- | -------------- | --------- | ----------- |
| modelValue    | 当前值         | `Number`  | `0`         |
| count         | 星星总数       | `Number`  | `5`         |
| size          | 图标尺寸 (rpx) | `Number`  | `44`        |
| gap           | 间距 (rpx)     | `Number`  | `8`         |
| activeColor   | 选中颜色       | `String`  | 警告色      |
| inactiveColor | 未选中颜色     | `String`  | `#ccc`      |
| activeIcon    | 选中图标名     | `String`  | `star-fill` |
| inactiveIcon  | 未选中图标名   | `String`  | `star`      |
| allowHalf     | 是否允许半星   | `Boolean` | `false`     |
| readonly      | 是否只读       | `Boolean` | `false`     |
| disabled      | 是否禁用       | `Boolean` | `false`     |
| clearable     | 是否允许归零   | `Boolean` | `false`     |

### Events

| 事件名            | 说明     | 回调参数        |
| ----------------- | -------- | --------------- |
| update:modelValue | 值变更   | `value: Number` |
| change            | 评分变更 | `value: Number` |

## 代码示例

### 半星模式

```vue
<C_Rate v-model="score" allow-half />
```

### 只读展示

```vue
<C_Rate :model-value="4.5" allow-half readonly />
```

### 自定义图标和颜色

```vue
<C_Rate
  v-model="score"
  active-icon="heart-fill"
  inactive-icon="heart"
  active-color="#ff4d4f"
/>
```

### 可归零

```vue
<C_Rate v-model="score" clearable />
```

## 注意事项

1. 使用 `v-model` 双向绑定评分值。
2. 半星模式下点击星星左半部分为 0.5 分。
3. `clearable` 开启后再次点击已选分值可归零。
4. 图标名来自 wot-design-uni 的 Icon 组件。
