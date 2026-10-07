import {
  defineConfig,
  presetWind3,
  presetAttributify,
  presetIcons,
  transformerDirectives,
} from "unocss";

export default defineConfig({
  safelist: [
    // Fluent Color 图标集 — Tabbar 多色图标
    'i-fluent-color-home-28',
    'i-fluent-color-chat-28',
    'i-fluent-color-apps-28',
    'i-fluent-color-person-28',
  ],
  presets: [
    presetWind3(), // Wind3 预设（替代已弃用的 presetUno）
    presetAttributify(), // 属性化模式支持
    presetIcons({
      scale: 1.2,
      warn: true,
      // 显式声明图标集（静态 import，避免运行时按包名探测在部分环境下失败）
      collections: {
        mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
        fluent: () =>
          import('@iconify-json/fluent/icons.json').then(i => i.default),
        'fluent-color': () =>
          import('@iconify-json/fluent-color/icons.json').then(i => i.default),
        ion: () => import('@iconify-json/ion/icons.json').then(i => i.default),
        solar: () =>
          import('@iconify-json/solar/icons.json').then(i => i.default),
      },
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }), // 图标预设
  ],
  transformers: [
    transformerDirectives(), // 支持 @apply 等指令
  ],
  // 自定义规则（可选）
  rules: [
    // 示例：自定义安全区域
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
  ],
  // 快捷方式（可选）
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
    'flex-between': 'flex justify-between items-center',
  },
})