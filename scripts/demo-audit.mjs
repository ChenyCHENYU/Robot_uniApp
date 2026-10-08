/**
 * 组件演示页深检 — 重叠/文本溢出/破容器 三类"错乱"几何检测
 */
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

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
if (await page.$('.skip-btn')) {
  await (await page.$('.skip-btn')).click()
  await new Promise(r => setTimeout(r, 1000))
}
await page.click('.login-btn')
await new Promise(r => setTimeout(r, 2500))

const pagesJson = JSON.parse(
  fs.readFileSync('src/pages.json', 'utf8').replace(/\/\/[^\n]*/g, '')
)
const demoRoutes = pagesJson.subPackages
  .find(sp => sp.root === 'pages/demo')
  .pages.map(p => `/pages/demo/${p.path}`)

const detect = () => {
  const issues = []
  const els = [...document.querySelectorAll('uni-page-body *')]

  // 1) 文本溢出容器（块级文本 scrollWidth 超 clientWidth 且未换行）
  els.forEach(el => {
    if (el.children.length === 0 && el.textContent.trim()) {
      const cs = getComputedStyle(el)
      if (
        el.scrollWidth > el.clientWidth + 6 &&
        cs.overflowX !== 'auto' &&
        cs.overflowX !== 'scroll' &&
        el.clientWidth > 0
      ) {
        issues.push(
          `文本溢出 <${(el.className?.toString?.() || el.tagName).slice(0, 36)}> +${el.scrollWidth - el.clientWidth}px`
        )
      }
    }
  })

  // 2) 子元素破容器（宽度超出可见父容器右缘 12px+，排除滚动/装饰）
  const inScroller = el => {
    for (let n = el.parentElement; n; n = n.parentElement) {
      const cs = getComputedStyle(n)
      if (['auto', 'scroll', 'hidden'].includes(cs.overflowX)) return true
    }
    return false
  }
  els.forEach(el => {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.width < 30) return
    const cs = getComputedStyle(el)
    if (['absolute', 'fixed'].includes(cs.position)) return
    if (inScroller(el)) return
    // 找最近可见块父
    let parent = el.parentElement
    while (parent) {
      const pr = parent.getBoundingClientRect()
      if (pr.width > 50) {
        if (r.right > pr.right + 12) {
          issues.push(
            `破容器 <${(el.className?.toString?.() || el.tagName).slice(0, 36)}> 超父 +${(r.right - pr.right).toFixed(0)}px`
          )
        }
        break
      }
      parent = parent.parentElement
    }
  })

  // 3) 兄弟重叠（同父可见兄弟矩形相交 8px+，排除定位装饰）
  const seen = new Set()
  els.forEach(el => {
    const r = el.getBoundingClientRect()
    if (r.width < 40 || r.height < 20) return
    const cs = getComputedStyle(el)
    if (['absolute', 'fixed'].includes(cs.position)) return
    let sib = el.nextElementSibling
    let count = 0
    while (sib && count < 3) {
      const scs = getComputedStyle(sib)
      if (!['absolute', 'fixed'].includes(scs.position)) {
        const sr = sib.getBoundingClientRect()
        const ox = Math.min(r.right, sr.right) - Math.max(r.left, sr.left)
        const oy = Math.min(r.bottom, sr.bottom) - Math.max(r.top, sr.top)
        if (ox > 12 && oy > 12) {
          const key =
            (el.className?.toString?.() || '') + '|' + (sib.className?.toString?.() || '')
          if (!seen.has(key)) {
            seen.add(key)
            issues.push(
              `重叠 <${(el.className?.toString?.() || el.tagName).slice(0, 28)}> × <${(sib.className?.toString?.() || sib.tagName).slice(0, 28)}> ${ox.toFixed(0)}×${oy.toFixed(0)}px`
            )
          }
        }
      }
      sib = sib.nextElementSibling
      count++
    }
  })

  return [...new Set(issues)].slice(0, 8)
}

const report = []
for (const route of demoRoutes) {
  await page.goto(`http://localhost:1999/#${route}`, {
    waitUntil: 'networkidle0',
  })
  await new Promise(r => setTimeout(r, 600))
  const issues = await page.evaluate(detect)
  if (issues.length) report.push([route, issues])
}

console.log(`\n=== demo 共 ${demoRoutes.length} 页，问题页 ${report.length} ===`)
report.forEach(([route, issues]) => {
  console.log('\n' + route)
  issues.forEach(i => console.log('   -', i))
})
await browser.close()
