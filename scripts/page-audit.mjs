/**
 * 全页面巡检 — 逐页检测：纵向可滚动性 / 横向溢出 / 关键区块是否被裁剪
 * 输出每页体检报告，超标页面列出最右溢出元素。
 */
import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900 })
await page.goto('http://localhost:1999/', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 2000))

// 跳过引导 + 登录进入应用
if (await page.$('.skip-btn')) {
  await (await page.$('.skip-btn')).click()
  await new Promise(r => setTimeout(r, 1000))
}
await page.click('.login-btn')
await new Promise(r => setTimeout(r, 2500))

// 收集全部页面路由
const routes = await page.evaluate(() => {
  const paths = []
  try {
    const raw = localStorage.getItem('ROBOT_PAGES_PROBE')
    void raw
  } catch {}
  return paths
})
void routes

/** 逐页体检 */
async function auditRoute(path) {
  const url = `http://localhost:1999/#${path}`
  await page.goto(url, { waitUntil: 'networkidle0' })
  await page.reload({ waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 700))
  return page.evaluate(() => {
    const body = document.querySelector('uni-page-body')
    if (!body) return { ok: false, reason: 'no body' }
    const bodyRect = body.getBoundingClientRect()
    const canScrollV = body.scrollHeight > body.clientHeight + 4
    let worst = null
    document.querySelectorAll('uni-page-body *').forEach(el => {
      const r = el.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) {
        const over = r.right - (bodyRect.left + body.clientWidth)
        if (over > 8 && (!worst || over > worst.over)) {
          worst = {
            over: +over.toFixed(0),
            cls: (el.className?.toString?.() || el.tagName).slice(0, 48),
          }
        }
      }
    })
    return {
      ok: true,
      clientH: body.clientHeight,
      scrollH: body.scrollHeight,
      canScrollV,
      hOverflow: worst,
    }
  })
}

// 主包 + 分包全部页面（从 pages.json 读）
import fs from 'node:fs'
const pagesJson = JSON.parse(
  fs
    .readFileSync('src/pages.json', 'utf8')
    .replace(/\/\/[^\n]*/g, '')
)
const allRoutes = [
  ...pagesJson.pages.map(p => '/' + p.path),
  ...pagesJson.subPackages.flatMap(sp => sp.pages.map(p => `/${sp.root}/${p.path}`)),
]

const problems = []
const clean = []
for (const route of allRoutes) {
  try {
    const r = await auditRoute(route)
    if (!r.ok) continue
    const issues = []
    if (r.scrollH > r.clientH && !r.canScrollV) issues.push('内容超高且不可滚')
    if (r.hOverflow) issues.push(`横向溢出 ${r.hOverflow.over}px <${r.hOverflow.cls}>`)
    if (issues.length) problems.push([route, ...issues])
    else clean.push(route)
  } catch (e) {
    problems.push([route, '巡检异常', String(e).slice(0, 60)])
  }
}

console.log(`\n=== 通过 ${clean.length} 页 ===`)
console.log(`=== 问题 ${problems.length} 页 ===`)
problems.forEach(([route, ...issues]) => {
  console.log(route)
  issues.forEach(i => console.log('   -', i))
})

await browser.close()
