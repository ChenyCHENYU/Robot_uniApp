import {
  defineConfig,
  presetWind3,
  presetAttributify,
  presetIcons,
  transformerDirectives,
} from "unocss";

export default defineConfig({
  presets: [
    presetWind3(), // Wind3 预设（替代已弃用的 presetUno）
    presetAttributify(), // 属性化模式支持
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
      // 显式声明要使用的图标集
      collections: {
        mdi: () =>
          import("@iconify-json/mdi/icons.json").then((i) => i.default),
      },
    }), // 图标预设
  ],
  transformers: [
    transformerDirectives(), // 支持 @apply 等指令
  ],
  // 自定义规则（可选）
  rules: [
    // 示例：自定义安全区域
    ["pt-safe", { "padding-top": "env(safe-area-inset-top)" }],
    ["pb-safe", { "padding-bottom": "env(safe-area-inset-bottom)" }],
  ],
  // 快捷方式（可选）
  shortcuts: {
    "flex-center": "flex justify-center items-center",
    "flex-between": "flex justify-between items-center",
  },
});