/**
 * 微信小程序 WXSS 构建后清洗
 *
 * 处理小程序不支持的 CSS 特性（来源：UnoCSS/现代 CSS 经 vite 编译后的产物）：
 * - 删除 `*` 通配选择器规则
 * - `:root` → `page`
 * - `100dvh` → `100vh`
 * - 移除 background-clip:text 渐变文字（小程序会导致文字消失）
 * - 展开 `inset` 简写为 top/right/bottom/left
 * - 移除 -webkit-user-select 等 Web-only 属性
 * - 移除 ::backdrop / :focus-within 规则
 *
 * 用法：node scripts/postbuild-mp-weixin.cjs [targetDir]
 */
const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const target =
  process.argv[2] || path.join(projectRoot, 'dist', 'build', 'mp-weixin')

if (!fs.existsSync(target)) {
  console.error(`[postbuild-mp-weixin] target not found: ${target}`)
  process.exit(1)
}

let count = 0

function sanitizeWxss(content) {
  return (
    content
      // 通配选择器规则整块删除
      .replace(/\*,[^{}]*\{[^{}]*\}/g, '')
      .replace(/::backdrop\{[^{}]*\}/g, '')
      .replace(/@font-face\{[^{}]*local\([^{}]*\}/g, '')
      .replace(/[^{}]*:focus-within[^{}]*\{[^{}]*\}/g, '')
      // :root → page（小程序根选择器）
      .replace(/:root/g, 'page')
      // dvh 兼容
      .replace(/100dvh/g, '100vh')
      // 渐变文字在小程序会消失
      .replace(/-webkit-text-fill-color\s*:\s*transparent\s*;?/g, '')
      .replace(/-webkit-background-clip\s*:\s*text\s*;?/g, '')
      .replace(/background-clip\s*:\s*text\s*;?/g, '')
      // 展开 inset 简写
      .replace(/inset\s*:\s*0\s*;/g, 'top:0;right:0;bottom:0;left:0;')
      .replace(
        /inset\s*:\s*(-?[\d.]+[a-z%]*)\s*;/g,
        'top:$1;right:$1;bottom:$1;left:$1;'
      )
      // Web-only 属性
      .replace(/-webkit-user-select\s*:\s*[^;{}]+;?/g, '')
      .replace(/user-select\s*:\s*[^;{}]+;?/g, '')
      .replace(/scrollbar-width\s*:\s*[^;{}]+;?/g, '')
      .replace(/-ms-overflow-style\s*:\s*[^;{}]+;?/g, '')
      .replace(/backdrop-filter\s*:\s*[^;{}]+;?/g, '')
      .replace(/-webkit-backdrop-filter\s*:\s*[^;{}]+;?/g, '')
  )
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full)
    } else if (entry.name.endsWith('.wxss')) {
      const original = fs.readFileSync(full, 'utf8')
      const sanitized = sanitizeWxss(original)
      if (sanitized !== original) {
        fs.writeFileSync(full, sanitized)
        count++
      }
    }
  }
}

walk(target)
console.log(`[postbuild-mp-weixin] sanitized ${count} wxss files in ${target}`)
