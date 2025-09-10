# C_Icon 通用图标组件

> 🎨 支持多种图标类型的统一图标组件，让图标使用更简单、更统一

## 🚀 特性

- **🔥 五种图标类型**: UnoCSS、uView+、SVG 文件、图片、自定义内容
- **🎯 统一 API 接口**: 所有图标类型使用相同的组件接口
- **🎨 灵活样式**: 支持颜色、大小自定义
- **⚡ 零 CSS 代码**: 基于 UnoCSS utility classes，无额外样式文件
- **🧩 智能解析**: 自动处理不同格式的图标名称
- **📱 跨平台支持**: H5、小程序、App 全平台兼容

## 📦 安装

```bash
# 组件已集成在项目中，确保安装相关依赖

# UnoCSS 图标依赖（需安装对应的图标集文件）
pnpm add -D @iconify-json/mdi
# uView+ UI库
pnpm i uview-plus
```

## 🎯 快速开始

### 基础使用

```vue
<template>
  <!-- 最简单的使用方式 (默认UnoCSS图标) -->
  <C_Icon name="mdi-home" />

  <!-- 指定大小和颜色 -->
  <C_Icon name="carbon-user" :size="24" color="#409eff" />
</template>
```

### 五种图标类型

```vue
<template>
  <!-- 1. UnoCSS 图标 (默认推荐) -->
  <C_Icon name="mdi-home" />
  <C_Icon name="carbon-user" />
  <C_Icon name="heroicons-heart" />

  <!-- 2. uView+ 图标 -->
  <C_Icon type="uview" name="home" />
  <C_Icon type="uview" name="setting" />

  <!-- 3. SVG 文件 -->
  <C_Icon type="svg" name="/static/icons/custom.svg" />

  <!-- 4. 图片文件 -->
  <C_Icon type="image" name="/static/images/logo.png" />

  <!-- 5. 自定义内容 -->
  <C_Icon type="custom">
    <text>🚀</text>
  </C_Icon>
</template>
```

## 📖 API 文档

### Props

| 参数             | 类型                                                  | 默认值     | 说明                                  |
| ---------------- | ----------------------------------------------------- | ---------- | ------------------------------------- |
| **name**         | `string`                                              | -          | 图标名称/路径                         |
| **type**         | `'unocss' \| 'uview' \| 'svg' \| 'image' \| 'custom'` | `'unocss'` | 图标类型                              |
| **size**         | `number \| string`                                    | `24`       | 图标大小(px)                          |
| **color**        | `string`                                              | `'#333'`   | 图标颜色(仅 unocss 和 uview 类型有效) |
| **bold**         | `boolean`                                             | `false`    | 是否加粗(仅 uview 类型)               |
| **label**        | `string`                                              | `''`       | 图标标签(仅 uview 类型)               |
| **customPrefix** | `string`                                              | `''`       | 自定义前缀(仅 uview 类型)             |
| **customStyle**  | `object`                                              | `{}`       | 自定义样式对象                        |

### Events

| 事件名    | 参数                  | 说明     |
| --------- | --------------------- | -------- |
| **click** | `(event: MouseEvent)` | 点击事件 |

### Slots

| 插槽名  | 说明                            |
| ------- | ------------------------------- |
| default | 自定义内容(type="custom"时使用) |

## 🎨 使用示例

### 基础图标展示

```vue
<template>
  <view class="icon-demo">
    <!-- 不同尺寸 -->
    <C_Icon name="mdi-heart" :size="16" color="red" />
    <C_Icon name="mdi-heart" :size="24" color="red" />
    <C_Icon name="mdi-heart" :size="32" color="red" />

    <!-- 不同颜色 -->
    <C_Icon name="carbon-home" color="#409eff" />
    <C_Icon name="carbon-home" color="#67c23a" />
    <C_Icon name="carbon-home" color="#e6a23c" />
  </view>
</template>
```

### 导航菜单

```vue
<template>
  <view class="nav-menu flex gap-4">
    <C_Icon
      name="mdi-home"
      :size="20"
      color="var(--primary-color)"
      @click="handleNavClick('home')"
    />
    <C_Icon name="mdi-account" :size="20" @click="handleNavClick('profile')" />
    <C_Icon name="mdi-cog" :size="20" @click="handleNavClick('settings')" />
  </view>
</template>

<script setup>
const handleNavClick = (route) => {
  console.log("导航到:", route);
  // 路由跳转逻辑
};
</script>
```

### 自定义样式

```vue
<template>
  <view class="custom-icon-demo">
    <C_Icon
      name="mdi-star"
      :size="28"
      color="gold"
      :custom-style="{
        transform: 'rotate(15deg)',
        transition: 'all 0.3s ease',
      }"
    />
  </view>
</template>
```

### uView+ 图标特性

```vue
<template>
  <view class="uview-demo">
    <!-- 基础uView+图标 -->
    <C_Icon type="uview" name="home" :size="24" />

    <!-- 加粗效果 -->
    <C_Icon type="uview" name="heart" :bold="true" />

    <!-- 带标签 -->
    <C_Icon type="uview" name="star" label="收藏" />

    <!-- 自定义前缀 -->
    <C_Icon type="uview" name="custom" custom-prefix="my-icon" />
  </view>
</template>
```

## 🔧 配置说明

### UnoCSS 配置

确保在 `uno.config.js` 中配置图标预设：

```javascript
import {
  defineConfig,
  presetWind3,
  presetAttributify,
  presetIcons,
} from "unocss";

export default defineConfig({
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons({
      collections: {
        mdi: () =>
          import("@iconify-json/mdi/icons.json").then((i) => i.default),
        carbon: () =>
          import("@iconify-json/carbon/icons.json").then((i) => i.default),
        heroicons: () =>
          import("@iconify-json/heroicons/icons.json").then((i) => i.default),
      },
    }),
  ],
});
```

### 全局注册

```javascript
// main.js
import CIcon from "@/components/C_Icon.vue";

const app = createApp(App);
app.component("C_Icon", CIcon);
```

## 📋 图标名称格式

### UnoCSS 图标 (推荐)

组件会自动处理多种格式：

```vue
<!-- 推荐格式 -->
<C_Icon name="mdi-home" />
<!-- 自动转换为 i-mdi-home -->
<C_Icon name="carbon-user" />
<!-- 自动转换为 i-carbon-user -->

<!-- 兼容格式 -->
<C_Icon name="mdi:home" />
<!-- 自动转换为 i-mdi-home -->
<C_Icon name="i-mdi-home" />
<!-- 直接使用 -->
```

### 图标库推荐

| 图标库        | 数量  | 特点                | 示例              |
| ------------- | ----- | ------------------- | ----------------- |
| **MDI**       | 7000+ | 最全面，设计统一    | `mdi-home`        |
| **Carbon**    | 2000+ | IBM 设计，商务风格  | `carbon-user`     |
| **Heroicons** | 300+  | Tailwind 官方，简洁 | `heroicons-heart` |

## ⚠️ 注意事项

### 1. 颜色限制

```vue
<!-- ✅ 可以修改颜色 -->
<C_Icon name="mdi-home" color="red" />
<!-- UnoCSS图标 -->
<C_Icon type="uview" name="home" color="blue" />
<!-- uView+图标 -->

<!-- ❌ 无法修改颜色 -->
<C_Icon type="svg" name="/static/icon.svg" color="red" />
<!-- SVG文件 -->
<C_Icon type="image" name="/static/logo.png" color="red" />
<!-- 图片文件 -->
```

### 2. 性能建议

```vue
<!-- ✅ 推荐 - 合理的图标大小 -->
<C_Icon name="mdi-home" :size="24" />

<!-- ❌ 不推荐 - 过大的图标影响性能 -->
<C_Icon name="mdi-home" :size="200" />
```

### 3. 跨平台兼容

- **H5**: 所有图标类型都支持
- **小程序**: 推荐使用 UnoCSS 和 uView+ 图标
- **App**: 所有图标类型都支持

## 🐛 故障排除

### 常见问题

#### Q1: UnoCSS 图标不显示

**原因**: 图标集未安装或配置错误

**解决方案**:

1. 安装对应图标集: `npm i -D @iconify-json/mdi`
2. 检查 `uno.config.js` 配置
3. 确认图标名称格式正确

#### Q2: uView+图标显示异常

**原因**: uView+ 未正确导入

**解决方案**:

```javascript
// main.js 确保导入uView+
import uviewPlus from "uview-plus";
app.use(uviewPlus);
```

#### Q3: 图片图标加载失败

**原因**: 图片路径错误或文件不存在

**解决方案**:

1. 检查图片路径是否正确
2. 确认图片文件存在于对应目录
3. 检查图片格式是否支持

## 🎯 最佳实践

### 1. 图标库选择

```vue
<!-- ✅ 推荐 - 统一使用一个图标库 -->
<C_Icon name="mdi-home" />
<C_Icon name="mdi-user" />
<C_Icon name="mdi-settings" />

<!-- ❌ 避免 - 混用不同风格图标库 -->
<C_Icon name="mdi-home" />
<C_Icon name="carbon-user" />
<C_Icon name="heroicons-cog" />
```

### 2. 语义化使用

```vue
<!-- ✅ 推荐 - 图标与功能匹配 -->
<C_Icon name="mdi-home" @click="goHome" />
<C_Icon name="mdi-account" @click="openProfile" />

<!-- ❌ 避免 - 图标语义不明确 -->
<C_Icon name="mdi-star" @click="goHome" />
```

### 3. 响应式设计

```vue
<template>
  <C_Icon name="mdi-menu" :size="iconSize" />
</template>

<script setup>
import { computed } from "vue";

const iconSize = computed(() => {
  // 根据屏幕尺寸调整图标大小
  return window.innerWidth > 768 ? 24 : 20;
});
</script>
```

## 📈 性能优化

### 1. 按需加载图标集

只安装项目中使用的图标集：

```bash
# 只安装需要的图标集
npm i -D @iconify-json/mdi  # 如果只用MDI图标
```

### 2. 图标缓存

UnoCSS 会自动缓存生成的图标 CSS，无需额外配置。

### 3. 包体积优化

使用 UnoCSS 图标相比传统字体文件能显著减少包体积：

- 传统字体文件: ~200KB
- UnoCSS 按需生成: ~几 KB

## 🔄 升级指南

### 从其他图标组件迁移

```vue
<!-- 旧的写法 -->
<u-icon name="home" size="24" color="red" />
<Icon icon="mdi:home" size="24" color="red" />

<!-- 新的统一写法 -->
<C_Icon type="uview" name="home" :size="24" color="red" />
<C_Icon name="mdi-home" :size="24" color="red" />
```

## 📝 更新日志

### v1.0.0 (2025-09-10)

- ✨ 支持 5 种图标类型
- ✨ 统一的 API 接口
- ✨ 基于 UnoCSS 无样式文件
- ✨ 智能图标名称解析
- ✨ Vue 3.4+ defineOptions 支持
- ✨ 完整的跨平台兼容性

---

**💡 提示**: 这个组件是为企业级项目设计的统一图标解决方案。推荐优先使用 UnoCSS 图标以获得最佳的开发体验和性能表现。遇到问题可以查看故障排除部分或联系开发团队。

**🎯 设计理念**: 一个组件，五种方式，统一体验。让图标使用变得简单而强大！
