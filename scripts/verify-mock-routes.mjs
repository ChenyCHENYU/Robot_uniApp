/**
 * 契约测试：API 模块与 Mock 路由同步
 *
 * 校验：
 * 1. api/modules/*.ts 中声明的每个接口（method + path）在 src/mock/modules 中有对应路由
 * 2. mock 路由 key 不携带 baseURL 前缀（如 /api），与 getMockKey 剥离逻辑匹配
 * 3. mock 路由 key 的 path 均以 / 开头且在 api 模块中有声明（无孤儿 mock）
 *
 * 说明：文件上传接口（api.upload）无 mock 路由属正常，跳过。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = p => fs.readFileSync(path.join(root, p), 'utf8')

const errors = []

// ---------- 解析 api/modules/*.ts ----------
const apiDir = path.join(root, 'src/api/modules')
const apiRoutes = new Map() // 'GET /user/info' -> 'user.ts'

for (const file of fs.readdirSync(apiDir)) {
  if (!file.endsWith('.ts')) continue
  const content = read(`src/api/modules/${file}`)

  // api.get<...>('/x') / api.post<...>('/x') / api.put / api.del / api.upload（POST 语义）
  const pattern =
    /api\.(get|post|put|del|upload)(?:<[^>]*(?:<[^>]*>)?[^>]*>)?\(\s*'([^']+)'/g
  for (const m of content.matchAll(pattern)) {
    const raw = m[1] === 'del' ? 'DELETE' : m[1] === 'upload' ? 'POST' : m[1]
    const method = raw.toUpperCase()
    apiRoutes.set(`${method} ${m[2]}`, file)
  }
}

// ---------- 解析 src/mock/modules/*.ts ----------
const mockDir = path.join(root, 'src/mock/modules')
const mockRoutes = new Set()

for (const file of fs.readdirSync(mockDir)) {
  if (!file.endsWith('.ts')) continue
  const content = read(`src/mock/modules/${file}`)
  for (const m of content.matchAll(/'([A-Z]+)\s+(\/[^']*)'/g)) {
    mockRoutes.add(`${m[1]} ${m[2]}`)
  }
}

// ---------- 校验 ----------

// 1. API → Mock
for (const [route, file] of apiRoutes) {
  if (!mockRoutes.has(route)) {
    errors.push(`API 接口缺少 mock 路由：${route}（${file}）`)
  }
}

// 2. mock key 规范
for (const route of mockRoutes) {
  const [, url] = route.split(' ')
  if (!url.startsWith('/')) {
    errors.push(`mock 路由 path 必须以 / 开头：${route}`)
  }
  if (url.startsWith('/api/') || url === '/api') {
    errors.push(`mock 路由不应携带 baseURL 前缀：${route}`)
  }
  if (!apiRoutes.has(route)) {
    errors.push(`mock 路由无对应 API 声明（孤儿路由）：${route}`)
  }
}

if (errors.length) {
  console.error('[verify-mock-routes] 失败：')
  errors.forEach(e => console.error(`  - ${e}`))
  process.exit(1)
}

console.log(
  `[verify-mock-routes] 通过：${apiRoutes.size} 个 API 接口与 ${mockRoutes.size} 条 mock 路由完全同步`
)
