/**
 * 契约测试：HTTP 成功协议一致性（code === 0）
 *
 * 校验：
 * 1. RESPONSE_CODE.SUCCESS 常量值为 0
 * 2. http.ts 成功判定引用 RESPONSE_CODE.SUCCESS（不允许裸写 code === 0/200）
 * 3. mock helpers 的 success() 与常量对齐
 * 4. 全库无 `code === 200` 成功判定残留（历史协议回归检查）
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = p => fs.readFileSync(path.join(root, p), 'utf8')

const errors = []

// 1. 常量值
const business = read('src/constants/business.ts')
const successMatch = business.match(/SUCCESS:\s*(\d+)/)
if (!successMatch || successMatch[1] !== '0') {
  errors.push(`RESPONSE_CODE.SUCCESS 应为 0，实际：${successMatch?.[1] ?? '未定义'}`)
}

// 2. 成功判定引用常量（http.ts 或其 helpers 模块）
const http = read('src/utils/http.ts')
const httpHelpers = read('src/utils/http-helpers.ts')
const protocolInHttp = http.includes('data.code === RESPONSE_CODE.SUCCESS')
const protocolInHelpers = httpHelpers.includes(
  'data.code === RESPONSE_CODE.SUCCESS'
)
const httpUsesHelper = http.includes('isBusinessSuccess')
if (!(protocolInHttp || (protocolInHelpers && httpUsesHelper))) {
  errors.push('HTTP 成功判定必须引用 RESPONSE_CODE.SUCCESS（直接或经 http-helpers）')
}

// 3. mock helpers 对齐
const helpers = read('src/mock/helpers.ts')
if (!helpers.includes('RESPONSE_CODE.SUCCESS')) {
  errors.push('src/mock/helpers.ts 的 success() 必须引用 RESPONSE_CODE.SUCCESS')
}

// 4. 历史协议残留
const srcDir = path.join(root, 'src')
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full)
    } else if (/\.(ts|vue)$/.test(entry.name)) {
      const content = fs.readFileSync(full, 'utf8')
      if (/code\s*===\s*200/.test(content)) {
        errors.push(`检测到 code === 200 成功判定残留：${path.relative(root, full)}`)
      }
    }
  }
}
walk(srcDir)

if (errors.length) {
  console.error('[verify-http-protocol] 失败：')
  errors.forEach(e => console.error(`  - ${e}`))
  process.exit(1)
}

console.log('[verify-http-protocol] 通过：HTTP/mock/常量三方协议一致（code: 0）')
