/**
 * 契约测试：路由守卫配置与 pages.json 同步
 *
 * 校验：
 * 1. router.ts 的 WHITE_LIST 中每个页面都真实存在于 pages.json
 * 2. WHITE_LIST 必须包含登录页（守卫依赖其作为 401 落点）
 * 3. 登录页/首页等关键主包页面存在
 * 4. 守卫采用默认拒绝模型（不存在 authPages 黑名单旧模式残留）
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = p => fs.readFileSync(path.join(root, p), 'utf8')

const pagesJson = JSON.parse(
  read('src/pages.json').replace(/\/\/[^\n]*/g, '')
)
const routerTs = read('src/utils/router.ts')

const allPages = [
  ...pagesJson.pages.map(p => `/${p.path}`),
  ...pagesJson.subPackages.flatMap(sp =>
    sp.pages.map(p => `/${sp['root']}/${p.path}`)
  ),
]

const whiteListMatch = routerTs.match(/WHITE_LIST\s*=\s*\[([\s\S]*?)\]/)
if (!whiteListMatch) {
  fail('router.ts 中未找到 WHITE_LIST 定义')
}
const whiteList = [...whiteListMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1])

const errors = []

// 1. 白名单页面必须真实存在
for (const page of whiteList) {
  if (!allPages.includes(page)) {
    errors.push(`WHITE_LIST 页面不存在：${page}`)
  }
}

// 2. 登录页必须在白名单
if (!whiteList.includes('/pages/login/index')) {
  errors.push('WHITE_LIST 必须包含 /pages/login/index（401 落点）')
}

// 3. 关键页面存在性
for (const required of ['/pages/login/index', '/pages/index/index']) {
  if (!allPages.includes(required)) {
    errors.push(`关键页面缺失：${required}`)
  }
}

// 4. 旧黑名单模式不得回归
if (/authPages\s*=/.test(routerTs)) {
  errors.push('检测到 authPages 黑名单模式（应为默认拒绝 + 白名单放行）')
}

if (errors.length) {
  console.error('[verify-router-guard] 失败：')
  errors.forEach(e => console.error(`  - ${e}`))
  process.exit(1)
}

console.log(
  `[verify-router-guard] 通过：白名单 ${whiteList.length} 页全部存在，默认拒绝模型生效`
)
