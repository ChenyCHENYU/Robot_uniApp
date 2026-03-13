# C_Watermark 安全水印组件

## 组件简介

在页面上覆盖半透明水印，防止截图泄密。

**特性：**
- Canvas 动态生成水印图案
- 支持自定义文字、字号、颜色、角度
- 全页面 / 局部两种模式

---

## 快速开始

```vue
<C_Watermark text="张三 工号10086">
  <view>页面内容</view>
</C_Watermark>
```

---

## API 文档

### Props

| 属性     | 类型    | 默认值                 | 说明            |
| -------- | ------- | ---------------------- | --------------- |
| text     | String  | -                      | 水印文字        |
| fontSize | Number  | `14`                   | 字号 (px)       |
| color    | String  | `rgba(0,0,0,0.05)`    | 颜色            |
| rotate   | Number  | `-22`                  | 旋转角度        |
| gap      | Array   | `[100, 100]`           | 间距 [x, y]     |
| fullPage | Boolean | `true`                 | 覆盖整个页面    |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 页面内容 |

---

## 注意事项

- H5 端使用 Canvas 生成水印，性能优秀
- 非 H5 环境（小程序/App）当前为降级方案
- 水印层 `pointer-events: none`，不影响页面交互
