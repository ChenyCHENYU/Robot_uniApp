# C_List 列表容器组件

## 组件简介

基于 scroll-view 的高性能列表容器，集成下拉刷新、上拉加载、空态、错误态。

**特性：**

- 下拉刷新 + 上拉加载更多
- 集成 `C_Empty` 空状态
- 加载失败 + 点击重试
- 配合 `usePagination` composable 使用效果最佳

---

## 快速开始

```vue
<script setup>
import { usePagination } from "@/composables";

const { list, loading, finished, loadMore, refresh } = usePagination(fetchList);
</script>

<template>
  <C_List
    :loading="loading"
    :finished="finished"
    :show-empty="!loading && list.length === 0"
    @load="loadMore"
    @refresh="(done) => refresh().then(done)"
  >
    <view v-for="item in list" :key="item.id">
      {{ item.name }}
    </view>
  </C_List>
</template>
```

---

## API 文档

### Props

| 属性             | 类型    | 默认值               | 说明             |
| ---------------- | ------- | -------------------- | ---------------- |
| loading          | Boolean | `false`              | 是否加载中       |
| finished         | Boolean | `false`              | 是否加载完全部   |
| finishedText     | String  | `没有更多了`         | 加载完毕文案     |
| loadingText      | String  | `加载中...`          | 加载中文案       |
| errorText        | String  | `加载失败，点击重试` | 错误文案         |
| error            | Boolean | `false`              | 是否加载失败     |
| showEmpty        | Boolean | `false`              | 是否展示空状态   |
| emptyType        | String  | `default`            | 空状态类型       |
| emptyText        | String  | `暂无数据`           | 空状态文案       |
| refresherEnabled | Boolean | `true`               | 是否启用下拉刷新 |

### Events

| 事件名  | 说明                                     |
| ------- | ---------------------------------------- |
| load    | 滚动到底部触发加载更多                   |
| refresh | 下拉刷新，回调参数 `done` 函数需手动调用 |

### Slots

| 名称    | 说明       |
| ------- | ---------- |
| default | 列表项内容 |

---

## 注意事项

- 需给 C_List 的父容器设置固定高度
- `@refresh` 事件的回调参数 `done` 必须在刷新完成后调用，否则刷新动画不会结束
