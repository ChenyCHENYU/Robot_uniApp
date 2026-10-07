/**
 * 契约测试：平台 API 隔离
 *
 * 扫描 src 下对 Web 专属全局对象（window/document/localStorage/
 * sessionStorage/navigator）的引用，要求必须出现在 #ifdef H5 /
 * APP-PLUS 条件编译块内，防止跨端运行时炸弹（如小程序端
 * localStorage 未定义导致白屏）。
 *
 * 白名单：src/config/env.ts、src/utils/logger.ts 等模块允许
 * 带 typeof 守卫的非 H5 块引用（守卫形式不会在运行时抛错）。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const WEB_GLOBALS = [
  'window.',
  'document.',
  'localStorage',
  'sessionStorage',
  'navigator.',
]

/** 允许无条件引用（自身有 typeof 守卫语义）的文件 */
const ALLOW_FILES = new Set([
  'src/config/env.ts',
  'src/utils/logger.ts',
  'src/utils/error-handler.ts',
  'src/platform/index.ts',
  'src/services/app-update/index.ts',
])

const errors = []

function scanFile(filePath) {
  const rel = path.relative(root, filePath)
  const lines = fs.readFileSync(filePath, 'utf8').split('\n')

  let inH5Block = false
  let inAppBlock = false
  let blockDepth = 0

  lines.forEach((line, idx) => {
    const lineno = idx + 1

    // 条件编译块追踪（#ifdef / #ifndef / #endif）
    const ifdef = line.match(/#ifdef\s+(.*)/)
    const ifndef = line.match(/#ifndef\s+(.*)/)
    const endif = line.match(/#endif/)

    if (ifdef || ifndef) {
      blockDepth++
      const cond = (ifdef ? ifdef[1] : ifndef[1]) || ''
      const isH5 = cond.includes('H5')
      const isApp = cond.includes('APP-PLUS')
      // #ifndef H5 表示"非 H5"，其中不允许出现 Web API
      if (ifdef) {
        if (isH5) inH5Block = true
        if (isApp) inAppBlock = true
      }
      return
    }
    if (endif && blockDepth > 0) {
      blockDepth--
      if (blockDepth === 0) {
        inH5Block = false
        inAppBlock = false
      }
      return
    }

    // 检查 Web 全局引用
    if (inH5Block || inAppBlock) return
    if (ALLOW_FILES.has(rel)) return

    const code = line.replace(/\/\/.*$/, '')
    for (const global of WEB_GLOBALS) {
      if (code.includes(global)) {
        // typeof 守卫形式放行
        const before = code.slice(0, code.indexOf(global))
        if (/typeof\s+$/.test(before)) continue
        errors.push(
          `${rel}:${lineno} 在条件编译块外引用 Web API「${global}」：${line.trim()}`
        )
      }
    }
  })
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full)
    } else if (/\.(ts|vue)$/.test(entry.name)) {
      scanFile(full)
    }
  }
}

walk(path.join(root, 'src'))

if (errors.length) {
  console.error('[verify-platform-isolation] 失败：')
  errors.forEach(e => console.error(`  - ${e}`))
  process.exit(1)
}

console.log('[verify-platform-isolation] 通过：Web API 引用全部位于条件编译块内')
