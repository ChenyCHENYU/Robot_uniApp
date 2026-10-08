/**
 * 视觉几何自检 — 量化"是否变形/贴边/溢出"（无需看图）
 */
import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox'],
})

const url = process.argv[2] || 'http://localhost:1999/'
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900 })
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 2500))

// 引导页：测量后跳过进入登录
async function trySkipGuide() {
  const skip = await page.$('.skip-btn')
  if (skip) {
    await skip.click()
    await new Promise(r => setTimeout(r, 1200))
    return true
  }
  return false
}
const wasGuide = await trySkipGuide()

const report = await page.evaluate(() => {
  const body = document.querySelector('uni-page-body')
  const r = el => {
    if (!el) return null
    const b = el.getBoundingClientRect()
    return {
      top: +b.top.toFixed(1),
      bottom: +b.bottom.toFixed(1),
      left: +b.left.toFixed(1),
      right: +b.right.toFixed(1),
      w: +b.width.toFixed(1),
      h: +b.height.toFixed(1),
    }
  }
  const bodyStyle = body ? getComputedStyle(body) : null

  // 页面内所有元素的最右/最下边界（检测溢出）
  let maxRight = 0
  let maxBottom = 0
  document.querySelectorAll('uni-page-body *').forEach(el => {
    const b = el.getBoundingClientRect()
    if (b.width > 0 && b.height > 0) {
      maxRight = Math.max(maxRight, b.right)
      maxBottom = Math.max(maxBottom, b.bottom)
    }
  })

  const brand = document.querySelector('.brand__icon')
  const brandName = document.querySelector('.brand__name')
  const card = document.querySelector('.glass-card')
  const footer = document.querySelector('.footer')
  const loginBtn = document.querySelector('.login-btn')
  const sb = document.getElementById('robot-h5-statusbar')

  return {
    viewport: { w: innerWidth, h: innerHeight },
    bodyRect: r(body),
    bodyComputed: bodyStyle
      ? {
          height: bodyStyle.height,
          aspectRatio: bodyStyle.aspectRatio,
          transform: bodyStyle.transform,
          overflowY: bodyStyle.overflowY,
          borderW: bodyStyle.borderWidth,
        }
      : null,
    bodyScroll: body
      ? { scrollH: body.scrollHeight, clientH: body.clientHeight }
      : null,
    statusbar: r(sb),
    brandIcon: r(brand),
    brandName: r(brandName),
    glassCard: r(card),
    loginBtn: r(loginBtn),
    footer: r(footer),
    maxRight: +maxRight.toFixed(1),
    maxBottom: +maxBottom.toFixed(1),
    contentOverflowsBody:
      body && (maxRight > body.getBoundingClientRect().right + 1),
  }
})

console.log(JSON.stringify({ wasGuide, ...report }, null, 2))
await browser.close()
