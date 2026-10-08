import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { effectScope, nextTick, reactive, type EffectScope } from 'vue'
import {
  useCalendar,
  isValidDate,
  getRangeDays,
} from '@/components/global/C_Calendar/data'
import { flattenOptions } from '@/components/global/C_Cascader/data'
import { parseTime, formatTime } from '@/components/global/C_CountDown/data'
import { normalizeIconName } from '@/components/global/C_Icon/data'
import { defaultProps as rateDefaults } from '@/components/global/C_Rate/data'
import {
  getSearchHistory,
  saveSearchHistory,
  clearSearchHistory,
} from '@/components/global/C_Search/data'
import { STORAGE_KEYS } from '@/constants'

const scopes: EffectScope[] = []

const createCalendar = (
  overrides: Partial<Parameters<typeof useCalendar>[0]> = {}
) => {
  const props = reactive({
    visible: true,
    defaultDate: null,
    minDate: '2026-10-01',
    maxDate: null,
    mode: 'single',
    firstDayOfWeek: 1,
    maxRange: 0,
    showConfirm: true,
    marks: [],
    ...overrides,
  })
  const emit = vi.fn()
  const scope = effectScope()
  scopes.push(scope)
  const calendar = scope.run(() => useCalendar(props, emit))!
  return { calendar, props, emit }
}

beforeEach(() => {
  uni.clearStorageSync()
})

afterEach(() => {
  scopes.splice(0).forEach(scope => scope.stop())
})

describe('评分图标与实际 Wot 字体兼容', () => {
  it('选中和未选中的默认图标都具有可渲染字形', () => {
    const iconStyles = readFileSync(
      new URL(
        '../node_modules/wot-design-uni/components/wd-icon/index.scss',
        import.meta.url
      ),
      'utf8'
    )
    for (const name of [rateDefaults.activeIcon, rateDefaults.inactiveIcon]) {
      expect(iconStyles).toMatch(
        new RegExp(
          `\\.wd-icon-${name}:before\\s*\\{\\s*content:\\s*["']\\\\e[0-9a-f]+["']`
        )
      )
    }
  })

  it('非登录页面和共享组件使用的静态 Wot 图标均有字形', () => {
    const styles = readFileSync(
      new URL(
        '../node_modules/wot-design-uni/components/wd-icon/index.scss',
        import.meta.url
      ),
      'utf8'
    )
    const supported = new Set(
      Array.from(styles.matchAll(/\.wd-icon-([a-z0-9-]+):before/g), m => m[1])
    )
    const missing: string[] = []
    let checked = 0
    const visit = (directory: URL) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const file = new URL(entry.name, directory)
        if (file.pathname.includes('/pages/login')) continue
        if (entry.isDirectory()) {
          visit(new URL(`${entry.name}/`, directory))
        } else if (entry.name.endsWith('.vue')) {
          const source = readFileSync(file, 'utf8')
          for (const tag of source.matchAll(/<wd-icon\b[\s\S]*?>/g)) {
            const name = tag[0].match(/\sname=["']([^"']+)["']/)?.[1]
            if (!name) continue
            checked++
            if (!supported.has(name)) missing.push(`${file.pathname}: ${name}`)
          }
        }
      }
    }
    visit(new URL('../src/', import.meta.url))
    expect(checked).toBeGreaterThan(80)
    expect(missing).toEqual([])
  })
})

describe('日历选择边界和确认行为', () => {
  it('校验真实日期，拒绝非法闰日和溢出的月份', () => {
    expect(isValidDate('2024-02-29')).toBe(true)
    expect(isValidDate('2026-02-29')).toBe(false)
    expect(isValidDate('2026-13-01')).toBe(false)
    expect(isValidDate('not-a-date')).toBe(false)
  })

  it('范围天数包含首尾，跨夏令时也按自然日计数', () => {
    expect(getRangeDays('2026-03-07', '2026-03-09')).toBe(3)
    expect(getRangeDays('2026-10-01', '2026-10-01')).toBe(1)
  })

  it('空选择和仅有范围起点时均不能提交', () => {
    const { calendar, emit } = createCalendar({ mode: 'range' })
    calendar.onConfirm()
    expect(emit).not.toHaveBeenCalled()
    calendar.onSelectDay(1)
    expect(calendar.canConfirm.value).toBe(false)
    calendar.onConfirm()
    expect(emit.mock.calls.some(call => call[0] === 'confirm')).toBe(false)
  })

  it('最大范围拒绝超出的终点，允许恰好达到上限', () => {
    const { calendar, emit } = createCalendar({ mode: 'range', maxRange: 3 })
    calendar.onSelectDay(1)
    calendar.onSelectDay(4)
    expect(calendar.canConfirm.value).toBe(false)
    calendar.onSelectDay(3)
    expect(calendar.canConfirm.value).toBe(true)
    calendar.onConfirm()
    expect(emit).toHaveBeenCalledWith('confirm', ['2026-10-01', '2026-10-03'])
    expect(emit).toHaveBeenCalledWith('update:visible', false)
  })

  it('禁止选择范围外日期', () => {
    const { calendar, emit } = createCalendar({
      minDate: '2026-10-05',
      maxDate: '2026-10-10',
    })
    calendar.onSelectDay(4)
    calendar.onSelectDay(11)
    expect(emit).not.toHaveBeenCalled()
    calendar.onSelectDay(5)
    expect(calendar.canConfirm.value).toBe(true)
  })

  it('过滤非法默认日期和超出的默认范围', () => {
    const { calendar } = createCalendar({
      mode: 'range',
      maxRange: 3,
      defaultDate: ['bad', '2026-10-01', '2026-10-10'],
    })
    expect(calendar.currentYear.value).toBe(2026)
    expect(calendar.currentMonth.value).toBe(10)
    expect(calendar.canConfirm.value).toBe(false)
  })

  it('重新打开空默认值时清除上次未确认草稿', async () => {
    const { calendar, props } = createCalendar()
    calendar.onSelectDay(5)
    expect(calendar.canConfirm.value).toBe(true)
    props.visible = false
    await nextTick()
    props.visible = true
    await nextTick()
    expect(calendar.canConfirm.value).toBe(false)
  })

  it('不显示确认按钮的单选模式选中后确认并关闭', () => {
    const { calendar, emit } = createCalendar({ showConfirm: false })
    calendar.onSelectDay(5)
    expect(emit).toHaveBeenCalledWith('confirm', '2026-10-05')
    expect(emit).toHaveBeenCalledWith('update:visible', false)
  })
})

describe('倒计时格式化的状态一致性', () => {
  it('多次格式化不会把天数重复累计到 slot 的小时对象', () => {
    const time = parseTime(25 * 60 * 60 * 1000)
    expect(formatTime('HH:mm:ss', time)).toBe('25:00:00')
    expect(formatTime('HH:mm:ss', time)).toBe('25:00:00')
    expect(time.hours).toBe(1)
    expect(formatTime('DD HH:mm:ss', time)).toBe('01 01:00:00')
  })

  it('负数和非有限时长显示为零', () => {
    expect(formatTime('HH:mm:ss', parseTime(-1))).toBe('00:00:00')
    expect(formatTime('HH:mm:ss', parseTime(NaN))).toBe('00:00:00')
  })
})

describe('搜索历史恢复和保存', () => {
  it('损坏 JSON 或非数组值不会破坏搜索栏', () => {
    uni.setStorageSync(STORAGE_KEYS.SEARCH_HISTORY, '{broken')
    expect(getSearchHistory()).toEqual([])
    uni.setStorageSync(STORAGE_KEYS.SEARCH_HISTORY, '{"not":"an array"}')
    expect(getSearchHistory()).toEqual([])
  })

  it('仅恢复合法非空字符串', () => {
    uni.setStorageSync(
      STORAGE_KEYS.SEARCH_HISTORY,
      JSON.stringify(['valid', 2, null, ' '])
    )
    expect(getSearchHistory()).toEqual(['valid'])
  })

  it('trim 之后去重，零上限不保存历史，清空操作清除持久化', () => {
    saveSearchHistory('审批', 3)
    saveSearchHistory('订单', 3)
    expect(saveSearchHistory('  审批  ', 3)).toEqual(['审批', '订单'])
    expect(saveSearchHistory('新关键词', 0)).toEqual([])
    clearSearchHistory()
    expect(getSearchHistory()).toEqual([])
  })
})

describe('图标名称兼容与禁用级联选项', () => {
  it.each([
    'mdi-magnify',
    'solar-home-2-bold',
    'fluent-home-24-regular',
    'fluent-color-home-24',
    'ion-search',
  ])('为 %s 补齐 UnoCSS 前缀', name => {
    expect(normalizeIconName(name)).toBe(`i-${name}`)
  })

  it('保留已有完整类名和 Wot 名称', () => {
    expect(normalizeIconName(' i-mdi-magnify ')).toBe('i-mdi-magnify')
    expect(normalizeIconName('search')).toBe('search')
  })

  it('级联搜索不会暴露已禁用叶子和已禁用父级子树', () => {
    const result = flattenOptions([
      {
        value: 'a',
        label: '部门 A',
        disabled: true,
        children: [{ value: 'a1', label: '成员' }],
      },
      {
        value: 'b',
        label: '部门 B',
        children: [
          { value: 'b1', label: '禁用成员', disabled: true },
          { value: 'b2', label: '可选成员' },
        ],
      },
    ])
    expect(result.map(item => item.valuePath)).toEqual([['b', 'b2']])
  })
})
