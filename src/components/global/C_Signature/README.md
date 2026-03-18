# C_Signature 电子签名组件

## 组件简介

基于 Canvas 的手写签名组件，支持撤销、清除和导出图片。

**特性：**

- 流畅手写体验（圆角线条）
- 支持撤销上一笔
- 支持清除全部
- 导出 PNG/JPG 临时文件路径
- 可配置画笔颜色和粗细
- 签名为空时的占位提示

---

## 快速开始

```vue
<C_Signature @confirm="onSign" />
```

---

## API 文档

### Props

| 属性        | 类型    | 默认值           | 说明                    |
| ----------- | ------- | ---------------- | ----------------------- |
| penColor    | String  | `'#000000'`      | 画笔颜色                |
| lineWidth   | Number  | `3`              | 画笔粗细                |
| bgColor     | String  | `'#ffffff'`      | 画布背景色              |
| height      | Number  | `400`            | 画布高度(rpx)           |
| showFooter  | Boolean | `true`           | 是否显示操作栏          |
| exportType  | String  | `'png'`          | 导出类型：`png` / `jpg` |
| placeholder | String  | `'请在此处签名'` | 占位提示文字            |

### Events

| 事件名  | 参数                   | 说明                       |
| ------- | ---------------------- | -------------------------- |
| confirm | `tempFilePath: string` | 确认签名，返回临时文件路径 |
| clear   | -                      | 清除签名                   |

### Methods (ref)

| 方法名    | 说明         |
| --------- | ------------ |
| clear()   | 清除画布     |
| undo()    | 撤销上一笔   |
| confirm() | 导出签名图片 |

---

## 代码示例

### 合同签署场景

```vue
<template>
  <view class="contract-sign">
    <text>请在下方签名确认</text>
    <C_Signature
      ref="signRef"
      :height="500"
      pen-color="#1a1a1a"
      @confirm="onConfirm"
    />
  </view>
</template>

<script setup>
  const signRef = ref()

  function onConfirm(filePath) {
    // filePath 为临时文件路径，可上传至服务器
    uploadSignature(filePath)
  }
</script>
```

---

## 注意事项

- Canvas 导出图片为临时路径，需上传或持久化后使用
- 不同端 Canvas API 表现可能有差异（特别是支付宝小程序）
- 撤销功能基于笔画记录，每次 touchend 算一笔
