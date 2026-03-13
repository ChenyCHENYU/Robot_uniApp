# C_Icon 通用图标组件

> 🎨 支持多种图标类型的统一图标组件，让图标使用更简单、更统一

## 🚀 特性

- **🔥 五种图标类型**: UnoCSS、wot-design-uni、SVG 文件、图片、自定义内容
- **🎯 统一 API 接口**: 所有图标类型使用相同的组件接口
- **🎨 灵活样式**: 支持颜色、大小自定义
- **⚡ 零 CSS 代码**: 基于 UnoCSS utility classes，无额外样式文件
- **📱 跨平台支持**: H5、小程序、App 全平台兼容
- **🛡️ 错误处理**: 无效参数时显示错误提示

## 📦 安装

```bash
# 组件已集成在项目中，确保安装相关依赖

# UnoCSS 图标依赖（需安装对应的图标集）
pnpm add @iconify-json/mdi
pnpm add @iconify-json/carbon

# wot-design-uni UI库
pnpm add wot-design-uni
```

## 🎯 快速开始

### 基础使用

```vue
<template>
  <!-- UnoCSS 图标 (默认类型) -->
  <C_Icon name="i-mdi-home" />
  <C_Icon name="i-carbon-user" :size="24" color="#409eff" />
  
  <!-- wot-design-uni 图标 -->
  <C_Icon type="wot" name="home" :size="24" color="#67c23a" />
</template>
```

### 五种图标类型

```vue
<template>
  <!-- 1. UnoCSS 图标 (默认，推荐) -->
  <C_Icon name="i-mdi-home" />
  <C_Icon name="i-carbon-user" />
  <C_Icon name="i-heroicons-heart" />

  <!-- 2. wot-design-uni 图标 -->
  <C_Icon type="wot" name="home" />
  <C_Icon type="wot" name="setting" />

  <!-- 3. SVG 文件 -->
  <C_Icon type="svg" name="/static/icons/custom.svg" :size="24" />
  <!-- Base64 SVG -->
  <C_Icon type="svg" name="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQi..." />

  <!-- 4. 图片文件 -->
  <C_Icon type="image" name="/static/images/logo.png" :size="32" />
  <!-- 远程图片 -->
  <C_Icon type="image" name="https://example.com/icon.png" :size="32" />

  <!-- 5. 自定义内容 -->
  <C_Icon type="custom" :size="24">🚀</C_Icon>
  <C_Icon type="custom" :size="24">
    <text class="custom-text">A</text>
  </C_Icon>
</template>
```

## 📖 API 文档

### Props

| 参数             | 类型                                                  | 默认值     | 说明                                  |
| ---------------- | ----------------------------------------------------- | ---------- | ------------------------------------- |
| **name**         | `string`                                              | `''`       | 图标名称/路径                         |
| **type**         | `'unocss' \| 'wot' \| 'svg' \| 'image' \| 'custom'` | `'unocss'` | 图标类型                              |
| **size**         | `number \| string`                                    | `24`       | 图标大小(px)                          |
| **color**        | `string`                                              | `'#333'`   | 图标颜色(仅 unocss 和 wot 类型有效) |
| **bold**         | `boolean`                                             | `false`    | 是否加粗(仅 wot 类型)               |
| **label**        | `string`                                              | `''`       | 图标标签(仅 wot 类型)               |
| **customPrefix** | `string`                                              | `''`       | 自定义前缀(仅 wot 类型)             |
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
    <C_Icon name="i-mdi-heart" :size="16" color="#f56c6c" />
    <C_Icon name="i-mdi-heart" :size="24" color="#f56c6c" />
    <C_Icon name="i-mdi-heart" :size="32" color="#f56c6c" />
    <C_Icon name="i-mdi-heart" :size="48" color="#f56c6c" />

    <!-- 不同颜色 -->
    <C_Icon name="i-mdi-home" :size="24" color="#409eff" />
    <C_Icon name="i-mdi-home" :size="24" color="#67c23a" />
    <C_Icon name="i-mdi-home" :size="24" color="#e6a23c" />
    <C_Icon name="i-mdi-home" :size="24" color="#f56c6c" />
  </view>
</template>
```

### 导航菜单

```vue
<template>
  <view class="nav-menu flex gap-4">
    <C_Icon
      name="i-mdi-home"
      :size="20"
      color="#409eff"
      @click="handleNavClick('home')"
    />
    <C_Icon 
      name="i-mdi-account" 
      :size="20" 
      color="#67c23a"
      @click="handleNavClick('profile')" 
    />
    <C_Icon 
      name="i-mdi-cog" 
      :size="20" 
      color="#909399"
      @click="handleNavClick('settings')" 
    />
  </view>
</template>

<script setup>
const handleNavClick = (route) => {
  console.log("导航到:", route);
  // 路由跳转逻辑
};
</script>
```

### wot-design-uni 图标高级用法

```vue
<template>
  <view class="wot-demo">
    <!-- 基础用法 -->
    <C_Icon type="wot" name="home" :size="24" color="#409eff" />

    <!-- 心形图标 -->
    <C_Icon type="wot" name="heart" :size="24" color="#f56c6c" />

    <!-- 星形图标 -->
    <C_Icon type="wot" name="star" :size="24" color="#e6a23c" />

    <!-- 自定义前缀 -->
    <C_Icon type="wot" name="custom" custom-prefix="my-icon" :size="24" />
  </view>
</template>
```

### 自定义内容

```vue
<template>
  <view class="custom-demo">
    <!-- Emoji -->
    <C_Icon type="custom" :size="32">🏠</C_Icon>
    <C_Icon type="custom" :size="32">⭐</C_Icon>
    
    <!-- 文字内容 -->
    <C_Icon type="custom" :size="32">
      <text style="color: #409eff; font-weight: 600;">A</text>
    </C_Icon>
    
    <!-- 自定义形状 -->
    <C_Icon type="custom" :size="24">
      <view style="width: 12px; height: 12px; background: linear-gradient(45deg, #409eff, #67c23a); border-radius: 50%;"></view>
    </C_Icon>
  </view>
</template>
```

## 🔧 配置说明

### UnoCSS 配置

确保在 `uno.config.js` 中配置图标预设：

```javascript
import {
  defineConfig,
  presetWind,
  presetAttributify,
  presetIcons,
} from "unocss";

export default defineConfig({
  presets: [
    presetWind(),
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

### UnoCSS 图标

UnoCSS 图标需要使用完整的类名格式：

```vue
<!-- ✅ 正确格式 -->
<C_Icon name="i-mdi-home" />
<C_Icon name="i-carbon-user" />
<C_Icon name="i-heroicons-heart" />

<!-- ❌ 错误格式 -->
<C_Icon name="mdi-home" />        <!-- 缺少 i- 前缀 -->
<C_Icon name="mdi:home" />        <!-- 错误的分隔符 -->
```

### 图标库推荐

| 图标库        | 安装命令                        | 数量  | 特点                | 示例                |
| ------------- | ------------------------------- | ----- | ------------------- | ------------------- |
| **MDI**       | `@iconify-json/mdi`             | 7000+ | 最全面，设计统一    | `i-mdi-home`        |
| **Carbon**    | `@iconify-json/carbon`          | 2000+ | IBM 设计，商务风格  | `i-carbon-user`     |
| **Heroicons** | `@iconify-json/heroicons`       | 300+  | Tailwind 官方，简洁 | `i-heroicons-heart` |
| **Tabler**    | `@iconify-json/tabler`          | 3000+ | 线条风格，现代      | `i-tabler-home`     |

## ⚠️ 注意事项

### 1. 颜色适用范围

```vue
<!-- ✅ 可以修改颜色 -->
<C_Icon name="i-mdi-home" color="#409eff" />              <!-- UnoCSS图标 -->
<C_Icon type="wot" name="home" color="#67c23a" />       <!-- wot-design-uni图标 -->

<!-- ❌ 无法修改颜色 -->
<C_Icon type="svg" name="/static/icon.svg" color="red" />    <!-- SVG文件 -->
<C_Icon type="image" name="/static/logo.png" color="red" />  <!-- 图片文件 -->
```

### 2. 文件路径注意事项

```vue
<!-- ✅ 正确的文件路径 -->
<C_Icon type="svg" name="/static/icons/icon.svg" />           <!-- 本地SVG -->
<C_Icon type="image" name="/static/images/logo.png" />        <!-- 本地图片 -->
<C_Icon type="image" name="https://example.com/icon.png" />  <!-- 远程图片 -->

<!-- ✅ Base64 编码 -->
<C_Icon type="svg" name="data:image/svg+xml;base64,PHN2ZyB3..." />
<C_Icon type="image" name="data:image/png;base64,iVBORw0K..." />
```

### 3. 跨平台兼容性

- **H5**: 所有图标类型都支持
- **小程序**: 推荐使用 UnoCSS 和 wot-design-uni 图标，远程图片可能需要配置域名白名单
- **App**: 所有图标类型都支持

### 4. 错误处理

组件会在以下情况显示错误提示符号 "?":
- name 为空或无效
- type 为无效值
- 文件路径不存在

```vue
<!-- 这些情况会显示错误提示 -->
<C_Icon name="" />                          <!-- 空名称 -->
<C_Icon type="invalid" name="test" />       <!-- 无效类型 -->
<C_Icon type="svg" name="/not-exist.svg" /> <!-- 文件不存在 -->
```

## 🐛 故障排除

### 常见问题

#### Q1: UnoCSS 图标不显示

**可能原因**:
- 图标集未安装: `npm i -D @iconify-json/mdi`
- UnoCSS 配置错误: 检查 `uno.config.js`
- 图标名称格式错误: 确保使用 `i-mdi-home` 格式

#### Q2: wot-design-uni 图标显示异常

**解决方案**:
```json
// pages.json 确保 easycom 配置正确
{
  "easycom": {
    "custom": {
      "^wd-(.*)": "wot-design-uni/components/wd-$1/wd-$1.vue"
    }
  }
}
```

#### Q3: SVG/图片加载失败

**检查清单**:
1. 文件路径是否正确
2. 文件是否存在于对应目录
3. 小程序端检查域名白名单配置

## 🎯 最佳实践

### 1. 图标库选择建议

```vue
<!-- ✅ 推荐 - 统一使用一个图标库 -->
<C_Icon name="i-mdi-home" />
<C_Icon name="i-mdi-user" />
<C_Icon name="i-mdi-settings" />

<!-- ❌ 避免 - 混用不同风格图标库 -->
<C_Icon name="i-mdi-home" />
<C_Icon name="i-carbon-user" />
<C_Icon name="i-heroicons-cog" />
```

### 2. 性能优化

```vue
<!-- ✅ 推荐 - 合理的图标大小 -->
<C_Icon name="i-mdi-home" :size="24" />

<!-- ❌ 不推荐 - 过大的图标影响性能 -->
<C_Icon name="i-mdi-home" :size="200" />
```

### 3. 响应式设计

```vue
<template>
  <C_Icon name="i-mdi-menu" :size="iconSize" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const windowWidth = ref(window.innerWidth);

const iconSize = computed(() => {
  return windowWidth.value > 768 ? 24 : 20;
});

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
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

### 2. 包体积优化

UnoCSS 会按需生成 CSS，相比传统字体文件能显著减少包体积：

- 传统字体文件: ~200KB+
- UnoCSS 按需生成: 只生成使用的图标 CSS

## 🔄 从其他组件迁移

```vue
<!-- 旧的写法 -->
<wd-icon name="home" size="24px" color="red" />
<Icon icon="mdi:home" size="24" color="red" />
<i class="iconfont icon-home"></i>

<!-- 新的统一写法 -->
<C_Icon type="wot" name="home" :size="24" color="red" />
<C_Icon name="i-mdi-home" :size="24" color="red" />
<C_Icon name="i-mdi-home" :size="24" color="red" />
```

## 📝 更新日志

### v1.0.0 (2025-09-12)

- ✨ 支持 5 种图标类型统一接口
- ✨ 基于 UnoCSS 的零样式文件方案
- ✨ 完整的错误处理机制
- ✨ Vue 3 Composition API 支持
- ✨ 跨平台兼容 (H5/小程序/App)
- ✨ TypeScript 类型支持

---

**💡 提示**: 推荐优先使用 UnoCSS 图标以获得最佳的开发体验和性能表现。记住图标名称需要使用完整的 `i-图标库-图标名` 格式。

**🎯 设计理念**: 一个组件，五种方式，统一体验！


