import { afterEach, describe, expect, it } from 'vitest'
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const require = createRequire(import.meta.url)
const {
  postbuildWxss,
  verifyWxss,
} = require('../scripts/postbuild-mp-weixin.cjs')
const fixtures: string[] = []

/** 构造测试产物，按实际相对路径写入隔离目录。 */
function write(root: string, filename: string, content: string) {
  const file = join(root, filename)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
}

/** 含主包、分包与默认样式的最小微信构建。 */
function fixture(extension = 'css') {
  const root = mkdtempSync(join(tmpdir(), 'robot-wxss-'))
  fixtures.push(root)
  write(
    root,
    'app.json',
    JSON.stringify({
      pages: ['pages/home/index'],
      subPackages: [{ root: 'detail', pages: ['index'] }],
    })
  )
  write(root, `app.${extension}`, ':root{--primary:#0071e3}')
  for (const page of ['pages/home/index', 'detail/index']) {
    write(root, `${page}.wxml`, '<view class="sample"/>')
    write(root, `${page}.${extension}`, '.sample{color:var(--primary)}')
  }
  return root
}

afterEach(() =>
  fixtures
    .splice(0)
    .forEach(root => rmSync(root, { recursive: true, force: true }))
)

describe('微信生产样式产物契约', () => {
  it('CLI 还原主包与分包WXSS并清洗Web样式，保留图标SVG和mask', () => {
    const root = fixture()
    const svg =
      'url("data:image/svg+xml;utf8,%3Csvg%3E%3Cpath fill=%27%23ff9500%27/%3E%3C/svg%3E")'
    write(
      root,
      'app.css',
      `:root{--primary:#0071e3}*,::before{box-sizing:border-box}.sample{height:100dvh;inset:0;background-clip:text;-webkit-text-fill-color:transparent;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.glyph{mask:${svg};background-color:currentColor}.colored{background-image:${svg}}`
    )
    const result = spawnSync(
      process.execPath,
      ['scripts/postbuild-mp-weixin.cjs', root],
      { encoding: 'utf8' }
    )
    expect(result.status, result.stderr).toBe(0)
    expect(result.stdout).toContain('"renamed":3')
    const style = readFileSync(join(root, 'app.wxss'), 'utf8')
    expect(style).toContain('page{--primary:#0071e3}')
    expect(style).toContain('height:100vh')
    expect(style).toContain('top:0;right:0;bottom:0;left:0;')
    expect(style).toContain(`mask:${svg}`)
    expect(style).toContain(`background-image:${svg}`)
    expect(style).not.toMatch(
      /:root|100dvh|background-clip|text-fill-color|backdrop-filter|\*,/
    )
    expect(style).not.toContain('-webkit-}')
    expect(verifyWxss(root)).toEqual({ pages: 2, styles: 3 })
  })

  it('追踪本地共享CSS并同步引用，保留远程导入及未引用的WebView CSS', () => {
    const root = fixture()
    write(
      root,
      'app.css',
      '@import url("./shared/colors.css");@import "https://example.com/site.css";'
    )
    write(root, 'shared/colors.css', '.shared{color:#0071e3}')
    write(root, 'static/web.css', 'body{color:red}')
    const result = postbuildWxss(root)
    expect(result.renamed).toBe(4)
    expect(readFileSync(join(root, 'app.wxss'), 'utf8')).toContain(
      'url("./shared/colors.wxss")'
    )
    expect(readFileSync(join(root, 'app.wxss'), 'utf8')).toContain(
      'https://example.com/site.css'
    )
    expect(readFileSync(join(root, 'static/web.css'), 'utf8')).toBe(
      'body{color:red}'
    )
    expect(readFileSync(join(root, 'shared/colors.wxss'), 'utf8')).toContain(
      '.shared'
    )
  })

  it('只读产物检查拦截遗漏的页面WXSS', () => {
    const root = fixture('wxss')
    write(root, 'app.wxss', 'page{--primary:#0071e3}')
    rmSync(join(root, 'detail/index.wxss'))
    const result = spawnSync(
      process.execPath,
      ['scripts/postbuild-mp-weixin.cjs', '--check', root],
      { encoding: 'utf8' }
    )
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('missing WXSS: detail/index')
  })

  it('拦截缺失的app.wxss和错误本地导入', () => {
    const root = fixture('wxss')
    rmSync(join(root, 'app.wxss'))
    expect(() => verifyWxss(root)).toThrow('missing WXSS: app')
    write(root, 'app.wxss', '@import "./missing.wxss";')
    expect(() => verifyWxss(root)).toThrow('invalid local WXSS import')
  })

  it('已有WXSS与CSS冲突时失败，保留原文件供定位', () => {
    const root = fixture()
    write(root, 'pages/home/index.wxss', '.sample{color:red}')
    expect(() => postbuildWxss(root)).toThrow('conflicting styles')
    expect(readFileSync(join(root, 'app.css'), 'utf8')).toContain(':root')
    expect(readFileSync(join(root, 'pages/home/index.wxss'), 'utf8')).toContain(
      'color:red'
    )
  })

  it('重复运行已规范化产物保持结果和共享引用有效', () => {
    const root = fixture()
    postbuildWxss(root)
    const original = readFileSync(join(root, 'app.wxss'), 'utf8')
    expect(postbuildWxss(root)).toEqual({
      renamed: 0,
      sanitized: 0,
      pages: 2,
      styles: 3,
    })
    expect(readFileSync(join(root, 'app.wxss'), 'utf8')).toBe(original)
  })
})
