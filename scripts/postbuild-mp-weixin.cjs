/**
 * 微信小程序 WXSS 构建后规范化与清洗
 *
 * 当前 uni/UnoCSS 组合先输出 .css，插件预期的 .wxss 后缀还原未生效。
 * 仅处理 app、WXML 同名样式及其本地 @import，静态 Web CSS 保持原样。
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
 * 只读产物检查：node scripts/postbuild-mp-weixin.cjs --check [targetDir]
 */
const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')

function sanitizeWxss(content) {
  return (
    content
      // 通配选择器规则整块删除
      .replace(/\*,[^{}]*\{[^{}]*\}/g, '')
      .replace(/(^|\})\s*\*\s*\{[^{}]*\}/g, '$1')
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
      .replace(/-webkit-backdrop-filter\s*:\s*[^;{}]+;?/g, '')
      .replace(/backdrop-filter\s*:\s*[^;{}]+;?/g, '')
  )
}

/** 读取全部产物文件；不跟随链接或访问构建目录之外。 */
function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) return listFiles(file)
    return entry.isFile() ? [file] : []
  })
}

/** 与默认 WXSS 规则一致，包含主包和分包的登记页面。 */
function readPages(target) {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(target, 'app.json'), 'utf8')
  )
  if (!Array.isArray(manifest.pages)) {
    throw new Error('target is not a Weixin mini-program build: missing pages')
  }
  const packages = manifest.subPackages || manifest.subpackages || []
  return [
    ...manifest.pages,
    ...packages.flatMap(group =>
      group.pages.map(page => `${group.root}/${page}`)
    ),
  ]
}

/** 只定位本地 @import，资源 URL、查询参数与 SVG 数据均不作全局替换。 */
function mapImports(content, mapper) {
  return content.replace(
    /@import\s+(?:url\(\s*)?(?:"([^"]+)"|'([^']+)'|([^\s);]+))\s*\)?[^;]*;/g,
    (statement, doubleQuoted, singleQuoted, plain) => {
      const resource = doubleQuoted || singleQuoted || plain
      return statement.replace(resource, mapper(resource))
    }
  )
}

function resolveLocalImport(resource, importer, target) {
  if (/^(?:[a-z]+:|\/\/)/i.test(resource)) return null
  const filename = resource.split(/[?#]/)[0]
  const file = filename.startsWith('/')
    ? path.join(target, filename.slice(1))
    : path.resolve(path.dirname(importer), filename)
  if (!file.startsWith(`${target}${path.sep}`)) return null
  return file
}

/** 从真正的小程序入口追踪共享 CSS，不改 WebView 的静态站点资源。 */
function collectCssEntries(target, files) {
  const entries = new Set(
    files.filter(
      file =>
        file.endsWith('.css') &&
        (file === path.join(target, 'app.css') ||
          fs.existsSync(file.replace(/\.css$/, '.wxml')))
    )
  )
  const queue = [...entries, ...files.filter(file => file.endsWith('.wxss'))]
  for (const importer of queue) {
    mapImports(fs.readFileSync(importer, 'utf8'), resource => {
      const imported = resolveLocalImport(resource, importer, target)
      if (imported?.endsWith('.css') && fs.existsSync(imported)) {
        if (!entries.has(imported)) {
          entries.add(imported)
          queue.push(imported)
        }
      }
      return resource
    })
  }
  return entries
}

function rewriteImports(content, importer, target, cssEntries) {
  return mapImports(content, resource => {
    const imported = resolveLocalImport(resource, importer, target)
    return cssEntries.has(imported)
      ? resource.replace(/\.css(?=[?#]|$)/, '.wxss')
      : resource
  })
}

function verifyStyleImports(target, files) {
  files.forEach(file => {
    mapImports(fs.readFileSync(file, 'utf8'), resource => {
      const imported = resolveLocalImport(resource, file, target)
      if (
        imported &&
        (!imported.endsWith('.wxss') || !fs.existsSync(imported))
      ) {
        throw new Error(`invalid local WXSS import: ${file} -> ${resource}`)
      }
      return resource
    })
  })
}

/** 构建成功还必须有可被微信加载的样式；缺失时失败，禁止假通过。 */
function verifyWxss(target) {
  const pages = readPages(target)
  const required = ['app', ...pages]
  const missing = required.filter(
    page => !fs.existsSync(path.join(target, `${page}.wxss`))
  )
  if (missing.length) {
    throw new Error(`missing WXSS: ${missing.join(', ')}`)
  }
  const files = listFiles(target)
  const cssEntries = collectCssEntries(target, files)
  if (cssEntries.size) {
    throw new Error(
      `unconverted mini-program CSS: ${[...cssEntries].join(', ')}`
    )
  }
  const wxss = files.filter(file => file.endsWith('.wxss'))
  verifyStyleImports(target, wxss)
  const unsupported = wxss.filter(file =>
    /:root\b|100dvh|background-clip\s*:\s*text|text-fill-color\s*:\s*transparent|:focus-within|::backdrop/.test(
      fs.readFileSync(file, 'utf8')
    )
  )
  if (unsupported.length) {
    throw new Error(`unsupported WXSS: ${unsupported.join(', ')}`)
  }
  return { pages: pages.length, styles: wxss.length }
}

/** 先生成完整计划并检查冲突，随后才写产物，重复运行不改变结果。 */
function postbuildWxss(target) {
  readPages(target)
  const files = listFiles(target)
  const cssEntries = collectCssEntries(target, files)
  const styles = [
    ...cssEntries,
    ...files.filter(file => file.endsWith('.wxss')),
  ]
  const plans = styles.map(file => ({
    source: file,
    destination: file.replace(/\.css$/, '.wxss'),
    original: fs.readFileSync(file, 'utf8'),
    content: sanitizeWxss(
      rewriteImports(fs.readFileSync(file, 'utf8'), file, target, cssEntries)
    ),
  }))
  const destinations = new Map()
  for (const plan of plans) {
    if (
      destinations.has(plan.destination) &&
      destinations.get(plan.destination) !== plan.content
    ) {
      throw new Error(`conflicting styles: ${plan.destination}`)
    }
    destinations.set(plan.destination, plan.content)
  }
  let sanitized = 0
  for (const plan of plans) {
    if (plan.content !== plan.original) sanitized += 1
    fs.writeFileSync(plan.destination, plan.content)
    if (plan.source !== plan.destination) fs.unlinkSync(plan.source)
  }
  return { renamed: cssEntries.size, sanitized, ...verifyWxss(target) }
}

module.exports = { sanitizeWxss, postbuildWxss, verifyWxss }

if (require.main === module) {
  const args = process.argv.slice(2)
  const target = path.resolve(
    args.find(argument => argument !== '--check') ||
      path.join(projectRoot, 'dist', 'build', 'mp-weixin')
  )
  try {
    const result = args.includes('--check')
      ? verifyWxss(target)
      : postbuildWxss(target)
    console.log('[postbuild-mp-weixin] verified', JSON.stringify(result))
  } catch (error) {
    console.error('[postbuild-mp-weixin]', error.message)
    process.exitCode = 1
  }
}
