import { ref, computed, watch } from 'vue'

/**
 * C_Calendar - 日历组件数据逻辑
 */

export const defaultProps = {
  /** 是否显示 */
  visible: false,
  /** 选择模式：single / multiple / range */
  mode: 'single',
  /** 默认选中日期 */
  defaultDate: null,
  /** 可选最小日期 */
  minDate: null,
  /** 可选最大日期 */
  maxDate: null,
  /** 标题 */
  title: '选择日期',
  /** 是否显示确认按钮 */
  showConfirm: true,
  /** 确认按钮文字 */
  confirmText: '确定',
  /** 一周第一天：0=周日, 1=周一 */
  firstDayOfWeek: 1,
  /** 日期标记 [{date: '2026-03-18', type: 'dot', color: '#ff0000'}] */
  marks: [],
  /** range 模式最大可选天数 */
  maxRange: 0,
}

/** 星期标题 */
export const WEEK_DAYS_MON = ['一', '二', '三', '四', '五', '六', '日']
export const WEEK_DAYS_SUN = ['日', '一', '二', '三', '四', '五', '六']

/**
 * 格式化日期为 YYYY-MM-DD
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * 获取某月天数
 * @param {number} year
 * @param {number} month - 1~12
 * @returns {number}
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

/** 校验日期字符串，避免不合法默认值导致日历显示 NaN。 */
export function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

/** 按日历日期计数，不受夏令时切换影响，首尾两天均计入。 */
export function getRangeDays(start: string, end: string) {
  return (
    Math.round(
      (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) /
        86400000
    ) + 1
  )
}

interface CalendarProps {
  visible: boolean
  defaultDate: string | unknown[] | null
  minDate: string | null
  maxDate: string | null
  mode: string
  firstDayOfWeek: number
  maxRange: number
  showConfirm: boolean
  marks: { date: string; color?: string }[]
}

/** 日历交互：保留原事件契约，只有有效完整选择才允许确认。 */
export function useCalendar(
  props: CalendarProps,
  emit: (
    event: 'update:visible' | 'confirm' | 'select' | 'close',
    ...args: unknown[]
  ) => void
) {
  const today = new Date()
  const currentYear = ref(today.getFullYear())
  const currentMonth = ref(today.getMonth() + 1)

  // 已选日期
  const selectedDates = ref<string[]>([])

  /** 默认值过滤为可用日历日期。 */
  function selectableDefault(date: unknown): date is string {
    if (typeof date !== 'string' || !isValidDate(date)) return false
    if (props.minDate && date < props.minDate) return false
    return !props.maxDate || date <= props.maxDate
  }

  /** 打开时从默认值恢复草稿，不保留上次未确认的日期。 */
  function initSelection() {
    const defaults = Array.isArray(props.defaultDate)
      ? props.defaultDate
      : [props.defaultDate]
    selectedDates.value = [
      ...new Set(defaults.filter(selectableDefault)),
    ].sort()
    if (props.mode === 'single')
      selectedDates.value = selectedDates.value.slice(0, 1)
    if (props.mode === 'range') {
      selectedDates.value = selectedDates.value.slice(0, 2)
      if (
        selectedDates.value.length === 2 &&
        exceedsRange(selectedDates.value[0], selectedDates.value[1])
      ) {
        selectedDates.value = selectedDates.value.slice(0, 1)
      }
    }
    const focusDate =
      selectedDates.value[0] || props.minDate || formatDate(today)
    const [year, month] = focusDate.split('-').map(Number)
    currentYear.value = year
    currentMonth.value = month
  }

  watch(
    () => props.visible,
    visible => {
      if (visible) initSelection()
    },
    { immediate: true }
  )

  const weekDays = computed(() =>
    props.firstDayOfWeek === 1 ? WEEK_DAYS_MON : WEEK_DAYS_SUN
  )

  const daysInMonth = computed(() =>
    getDaysInMonth(currentYear.value, currentMonth.value)
  )

  const leadingBlanks = computed(() => {
    const firstDay = new Date(
      currentYear.value,
      currentMonth.value - 1,
      1
    ).getDay()
    if (props.firstDayOfWeek === 1) {
      return firstDay === 0 ? 6 : firstDay - 1
    }
    return firstDay
  })

  /** 前一月 */
  function prevMonth() {
    if (currentMonth.value === 1) {
      currentMonth.value = 12
      currentYear.value--
    } else {
      currentMonth.value--
    }
  }

  /** 后一月 */
  function nextMonth() {
    if (currentMonth.value === 12) {
      currentMonth.value = 1
      currentYear.value++
    } else {
      currentMonth.value++
    }
  }

  /** 日期字符串 */
  function getDateStr(day) {
    return formatDate(new Date(currentYear.value, currentMonth.value - 1, day))
  }

  /** 是否禁用 */
  function isDisabled(day) {
    const dateStr = getDateStr(day)
    if (props.minDate && dateStr < props.minDate) return true
    if (props.maxDate && dateStr > props.maxDate) return true
    return false
  }

  /** 是否选中 */
  function isSelected(day) {
    return selectedDates.value.includes(getDateStr(day))
  }

  /** 是否范围区间内 */
  function isInRange(day) {
    if (props.mode !== 'range' || selectedDates.value.length !== 2) return false
    const dateStr = getDateStr(day)
    return dateStr > selectedDates.value[0] && dateStr < selectedDates.value[1]
  }

  /** 是否范围起点 */
  function isRangeStart(day) {
    return props.mode === 'range' && getDateStr(day) === selectedDates.value[0]
  }

  /** 是否范围终点 */
  function isRangeEnd(day) {
    return (
      props.mode === 'range' &&
      selectedDates.value.length === 2 &&
      getDateStr(day) === selectedDates.value[1]
    )
  }

  /** 是否今天 */
  function isToday(day) {
    return getDateStr(day) === formatDate(today)
  }

  /** 日期 class */
  function dayClass(day) {
    return [
      'c-calendar__day',
      isDisabled(day) && 'c-calendar__day--disabled',
      isSelected(day) && 'c-calendar__day--selected',
      isInRange(day) && 'c-calendar__day--in-range',
      isToday(day) && 'c-calendar__day--today',
    ]
  }

  /** 是否有标记 */
  function hasMark(day) {
    return props.marks.some(m => m.date === getDateStr(day))
  }

  /** 获取标记颜色 */
  function getMarkColor(day) {
    const mark = props.marks.find(m => m.date === getDateStr(day))
    return mark?.color || 'var(--r-color-primary)'
  }

  /** 选中日期 */
  function onSelectDay(day) {
    if (isDisabled(day)) return
    const dateStr = getDateStr(day)

    if (props.mode === 'single') {
      selectedDates.value = [dateStr]
      emit('select', dateStr)
      if (!props.showConfirm) {
        emit('confirm', dateStr)
        onClose()
      }
    } else if (props.mode === 'multiple') {
      const idx = selectedDates.value.indexOf(dateStr)
      if (idx > -1) {
        selectedDates.value.splice(idx, 1)
      } else {
        selectedDates.value.push(dateStr)
      }
      emit('select', [...selectedDates.value])
    } else if (props.mode === 'range') {
      selectRange(dateStr)
    }
  }

  /** 范围天数约束包含起止两天。 */
  function exceedsRange(start: string, end: string) {
    return props.maxRange > 0 && getRangeDays(start, end) > props.maxRange
  }

  /** 从起点开始选择范围，第二次点击才产生完整区间。 */
  function selectRange(dateStr: string) {
    if (selectedDates.value.length !== 1 || dateStr < selectedDates.value[0]) {
      selectedDates.value = [dateStr]
    } else {
      const start = selectedDates.value[0]
      if (exceedsRange(start, dateStr)) {
        uni.showToast({ title: `最多选择 ${props.maxRange} 天`, icon: 'none' })
        return
      }
      selectedDates.value = [start, dateStr]
    }
    emit('select', [...selectedDates.value])
  }

  const canConfirm = computed(() =>
    props.mode === 'range'
      ? selectedDates.value.length === 2
      : selectedDates.value.length > 0
  )

  /** 确认 */
  function onConfirm() {
    if (!canConfirm.value) return
    const result =
      props.mode === 'single'
        ? selectedDates.value[0] || ''
        : [...selectedDates.value]
    emit('confirm', result)
    onClose()
  }

  /** 关闭 */
  function onClose() {
    emit('close')
    emit('update:visible', false)
  }
  return {
    currentYear,
    currentMonth,
    weekDays,
    leadingBlanks,
    daysInMonth,
    prevMonth,
    nextMonth,
    dayClass,
    hasMark,
    getMarkColor,
    isRangeStart,
    isRangeEnd,
    onSelectDay,
    onConfirm,
    onClose,
    canConfirm,
  }
}
