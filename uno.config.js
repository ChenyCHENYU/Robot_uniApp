import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRequire } from 'node:module'

import {
  defineConfig,
  presetWind3,
  presetAttributify,
  presetIcons,
  transformerDirectives,
} from 'unocss'

// 配置同时由 Vite 与 Node 测试读取，require 兼容 JSON 包加载与不同 Node 版本。
const iconRequire = createRequire(import.meta.url)

/** 提取完整图标名；支持 Iconify 冒号写法，排除仅有集合名的前缀。 */
export function extractSourceIcons(content) {
  const matches =
    content.match(
      /\b(?:i-)?(?:mdi|solar|fluent-color|fluent|ion)[:-][a-z0-9]+(?:-[a-z0-9]+)*\b/g
    ) || []
  return matches
    .filter(name => name.replace(/^i-/, '') !== 'fluent-color')
    .map(name => {
      const normalized = name.replace(':', '-')
      return normalized.startsWith('i-') ? normalized : `i-${normalized}`
    })
}

// C_Icon 允许数据驱动名称；登记实际源码中的图标，保证 H5 与小程序都生成样式。
/** 从源码收集动态名称使用的图标，保证跨端构建生成对应样式。 */
function collectSourceIcons(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) return collectSourceIcons(path)
    if (!/\.(vue|ts)$/.test(entry.name)) return []
    const content = readFileSync(path, 'utf8')
    return extractSourceIcons(content)
  })
}

export default defineConfig({
  safelist: [...new Set(collectSourceIcons(resolve(process.cwd(), 'src')))],
  presets: [
    presetWind3(), // Wind3 预设（替代已弃用的 presetUno）
    presetAttributify(), // 属性化模式支持
    presetIcons({
      scale: 1.2,
      warn: true,
      mode: 'auto', // 单色 SVG 用 mask，多色 SVG 用 background-image，保留原始配色。
      // 显式声明已安装图标集，从本地 JSON 读取，不依赖运行时网络。
      collections: {
        mdi: async () => iconRequire('@iconify-json/mdi/icons.json'),
        fluent: async () => iconRequire('@iconify-json/fluent/icons.json'),
        'fluent-color': async () =>
          iconRequire('@iconify-json/fluent-color/icons.json'),
        ion: async () => iconRequire('@iconify-json/ion/icons.json'),
        solar: async () => iconRequire('@iconify-json/solar/icons.json'),
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
