# C_ImagePreview 图片预览组件

## 组件简介

全屏图片预览组件，支持多图切换、双指缩放和保存到相册。

**特性：**

- 多图左右滑动切换
- 双指缩放（1x - 3x）
- 长按保存到相册
- 页码指示器
- 点击关闭

---

## 快速开始

```vue
<C_ImagePreview
  v-model:visible="showPreview"
  :images="imageList"
  :current="0"
/>
```

---

## API 文档

### Props

| 属性          | 类型    | 默认值  | 说明                     |
| ------------- | ------- | ------- | ------------------------ |
| visible       | Boolean | `false` | 是否显示（支持 v-model） |
| images        | Array   | `[]`    | 图片 URL 列表            |
| current       | Number  | `0`     | 默认展示图片索引         |
| showIndicator | Boolean | `true`  | 是否显示页码指示器       |
| saveable      | Boolean | `true`  | 是否允许保存到相册       |
| longPress     | Boolean | `true`  | 是否支持长按菜单         |

### Events

| 事件名         | 参数            | 说明         |
| -------------- | --------------- | ------------ |
| update:visible | `boolean`       | 显示状态变更 |
| change         | `index: number` | 图片切换     |
| save           | `url: string`   | 图片保存成功 |

---

## 代码示例

### 工单附件预览

```vue
<template>
  <view
    v-for="(img, idx) in attachments"
    :key="idx"
    @click="preview(idx)"
  >
    <image
      :src="img"
      mode="aspectFill"
    />
  </view>
  <C_ImagePreview
    v-model:visible="showPreview"
    :images="attachments"
    :current="previewIdx"
  />
</template>

<script setup>
  const showPreview = ref(false)
  const previewIdx = ref(0)
  const attachments = ref(['url1', 'url2', 'url3'])

  function preview(idx) {
    previewIdx.value = idx
    showPreview.value = true
  }
</script>
```

---

## 注意事项

- 保存到相册需要用户授权 `scope.writePhotosAlbum`
- 网络图片会先下载到临时文件再保存
- 双指缩放基于 `movable-view` 实现，各端表现可能略有差异
