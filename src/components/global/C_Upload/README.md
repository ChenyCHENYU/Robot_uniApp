# C_Upload 文件上传组件

## 组件简介

图片选择、预览、删除的上传组件，支持进度展示。

**特性：**
- v-model 双向绑定文件列表
- 压缩选择、相册/相机双来源
- 文件大小限制 + oversize 事件
- 上传进度条展示
- 点击预览大图

---

## 快速开始

```vue
<script setup>
import { ref } from 'vue'
const fileList = ref([])
</script>

<template>
  <C_Upload v-model="fileList" :max-count="3" />
</template>
```

---

## API 文档

### Props

| 属性        | 类型    | 默认值    | 说明             |
| ----------- | ------- | --------- | ---------------- |
| modelValue  | Array   | `[]`      | 文件列表         |
| maxCount    | Number  | `9`       | 最大上传数       |
| maxSize     | Number  | 10MB      | 最大文件大小     |
| previewSize | String  | `160rpx`  | 预览缩略图尺寸   |
| deletable   | Boolean | `true`    | 是否可删除       |
| disabled    | Boolean | `false`   | 是否禁用         |

### Events

| 事件名           | 参数            | 说明           |
| ---------------- | --------------- | -------------- |
| update:modelValue| fileList        | 文件列表变化   |
| choose           | newFiles        | 选择文件后     |
| delete           | file, index     | 删除文件       |
| preview          | file, index     | 预览图片       |
| oversize         | file            | 文件超出限制   |

---

## 代码示例

### 配合 useUpload 上传到服务器

```vue
<script setup>
import { ref } from 'vue'
const fileList = ref([])

const onChoose = async (newFiles) => {
  // 自行调用接口上传
}
</script>

<template>
  <C_Upload v-model="fileList" :max-count="5" @choose="onChoose" />
</template>
```

---

## 注意事项

- 文件对象结构: `{ url, name, size, status, progress }`
- `status`: `pending` / `uploading` / `success` / `error`
- 组件仅管理选择和展示，上传逻辑由外部实现
