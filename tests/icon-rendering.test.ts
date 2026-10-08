import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, reactive } from 'vue'
import { createGenerator } from 'unocss'
import unoConfig, { extractSourceIcons } from '../uno.config.js'
import {
  formatIconSize,
  normalizeIconName,
  useIcon,
} from '@/components/global/C_Icon/data'
import {
  ICON_COLLECTIONS,
  WOT_SAMPLES,
  useDemo,
} from '@/pages/demo/01-icon/data'

const scopes: ReturnType<typeof effectScope>[] = []
afterEach(() => scopes.splice(0).forEach(scope => scope.stop()))

/** 提取真实生成的选择器，检查 SVG 图形与单色/多色渲染方式。 */
function getIconRule(css: string, name: string) {
  const rule = css.match(new RegExp(`\\.${name}\\{([^}]+)\\}`))
  expect(rule, `${name} 缺少生成样式`).not.toBeNull()
  return rule![1]
}

describe('图标集合真实渲染资源', () => {
  it('所有演示名称均存在于安装的集合，字体图标也具有字形', () => {
    for (const collection of ICON_COLLECTIONS) {
      const json = JSON.parse(
        readFileSync(
          `node_modules/@iconify-json/${collection.id}/icons.json`,
          'utf8'
        )
      )
      for (const icon of collection.icons) {
        const name = icon.name.slice(`i-${collection.id}-`.length)
        expect(
          Boolean(json.icons[name] || json.aliases?.[name]),
          icon.name
        ).toBe(true)
      }
    }
    const font = readFileSync(
      'node_modules/wot-design-uni/components/wd-icon/index.scss',
      'utf8'
    )
    for (const icon of WOT_SAMPLES)
      expect(font).toContain(`.wd-icon-${icon.name}:before`)
  })

  it('五集合共20图形均生成SVG；多色图使用背景，单色图使用遮罩', async () => {
    const names = ICON_COLLECTIONS.flatMap(collection =>
      collection.icons.map(icon => icon.name)
    )
    const generator = await createGenerator({ ...unoConfig, safelist: [] })
    const result = await generator.generate(names, { preflights: false })
    expect(result.matched.size).toBe(20)
    for (const collection of ICON_COLLECTIONS) {
      for (const icon of collection.icons) {
        const rule = getIconRule(result.css, icon.name)
        expect(rule).toContain('data:image/svg+xml')
        const svg = decodeURIComponent(
          rule.match(/data:image\/svg\+xml;utf8,([^"]+)/)![1]
        )
        expect(svg).toMatch(/<path|<circle|<polygon/)
        if (collection.colored) {
          expect(rule).toMatch(/background(?:-image)?:url\(/)
          expect(rule).not.toMatch(/(?:^|;)mask:/)
          const colors = svg.match(/#[a-f\d]{3,8}/gi) || []
          expect(new Set(colors).size).toBeGreaterThan(1)
        } else {
          expect(rule).toContain('mask:')
          expect(rule).toContain('background-color:currentColor')
        }
      }
    }
  })

  it('动态图标登记覆盖所有集合，不将集合前缀误认为图标', () => {
    const names = ICON_COLLECTIONS.flatMap(collection =>
      collection.icons.map(icon => icon.name)
    )
    for (const name of names) expect(unoConfig.safelist).toContain(name)
    expect(unoConfig.safelist).not.toContain('i-fluent-color')
  })

  it('冒号格式图标也进入动态登记，完整集合名与部分前缀被排除', () => {
    expect(
      extractSourceIcons(
        'mdi:head-lightbulb-outline i-fluent-color:home-24 i-ion-people-outline fluent-color i-fluent-color-'
      )
    ).toEqual([
      'i-mdi-head-lightbulb-outline',
      'i-fluent-color-home-24',
      'i-ion-people-outline',
    ])
  })
})

describe('图标组件输入与资源失败恢复', () => {
  it.each([
    ['mdi:home', 'i-mdi-home'],
    ['i-mdi:home', 'i-mdi-home'],
    ['solar-home-2-linear', 'i-solar-home-2-linear'],
    ['fluent:home-24-regular', 'i-fluent-home-24-regular'],
    ['i-fluent-color:home-24', 'i-fluent-color-home-24'],
    ['fluent-color-home-24', 'i-fluent-color-home-24'],
    ['ion:home-outline', 'i-ion-home-outline'],
    [' i-mdi-home ', 'i-mdi-home'],
    ['home', 'home'],
  ])('规范化 %s', (input, expected) =>
    expect(normalizeIconName(input)).toBe(expected)
  )

  it.each([
    [28, '28px'],
    ['28', '28px'],
    ['1.5rem', '1.5rem'],
    ['48rpx', '48rpx'],
    [0, '24px'],
    ['-1', '24px'],
    [NaN, '24px'],
    ['', '24px'],
  ])('尺寸 %s 生成有效CSS单位', (input, expected) =>
    expect(formatIconSize(input)).toBe(expected)
  )

  it('图片失败显示兜底，更换资源后恢复，点击事件仍可传递', async () => {
    const props = reactive({
      type: 'image' as const,
      name: '/static/a.png',
      size: '28',
      color: 'var(--r-text-primary)',
    })
    const emit = vi.fn()
    const scope = effectScope()
    scopes.push(scope)
    const icon = scope.run(() => useIcon(props, emit))!
    expect(icon.imageStyle.value.width).toBe('28px')
    icon.onImageError()
    expect(icon.hasValidName.value).toBe(false)
    expect(icon.fallbackLabel.value).toBe('图片图标加载失败')
    props.name = '/static/b.png'
    await nextTick()
    expect(icon.hasValidName.value).toBe(true)
    const event = { detail: { x: 1 } }
    icon.handleClick(event)
    expect(emit).toHaveBeenCalledWith('click', event)
  })

  it('选中多色集合时保留配色状态，切回单色可设置颜色', () => {
    const demo = useDemo()
    demo.selectIcon(ICON_COLLECTIONS[3].icons[0])
    expect(demo.isColored.value).toBe(true)
    demo.handleIconClick()
    expect(demo.lastIconAction.value).toContain('已响应点击')
    demo.selectIcon(ICON_COLLECTIONS[4].icons[0])
    expect(demo.isColored.value).toBe(false)
  })
})
