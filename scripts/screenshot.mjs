/**
 * 视觉自检脚本 — 用系统 Chrome 截取桌面/移动两形态截图
 * 用法：node scripts/screenshot.mjs [url]
 */
import puppeteer from 'puppeteer-core'

const CHROME =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const url = process.argv[2] || 'http://localhost:1999/'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
})

const shot = async (name, viewport) => {
  const page = await browser.newPage()
  await page.setViewport(viewport)
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
  await new Promise(r => setTimeout(r, 1800))
  // 尝试登录（填入演示账号）
  if (url.includes('localhost')) {
    try {
      const inputs = await page.$$('input')
      if (inputs.length >= 2) {
        await inputs[0].type('admin', { delay: 20 })
        await inputs[1].type('admin123', { delay: 20 })
        const btn = await page.$('.login-btn')
        if (btn) {
          await btn.click()
          await new Promise(r => setTimeout(r, 2500))
        }
      }
    } catch {
      // 忽略登录尝试失败
    }
  }
  const file = `/tmp/robot-shots/${name}.png`
  await page.screenshot({ path: file, fullPage: false })
  // 溢出检测：机身内容是否超出视口
  const metrics = await page.evaluate(() => {
    const body = document.querySelector('uni-page-body')
    return {
      viewportH: window.innerHeight,
      bodyScrollH: body ? body.scrollHeight : 0,
      bodyClientH: body ? body.clientHeight : 0,
      docScrollY: window.scrollY,
    }
  })
  console.log(`[${name}]`, JSON.stringify(metrics), '→', file)
  await page.close()
}

import fs from 'node:fs'
fs.mkdirSync('/tmp/robot-shots', { recursive: true })

await shot('desktop-login', { width: 1280, height: 900 })
await shot('mobile-390', { width: 390, height: 844 })

await browser.close()
console.log('done')
