<template>
  <view
    v-if="visible"
    class="c-calendar"
  >
    <view
      class="c-calendar__overlay"
      @click="onClose"
    />
    <view class="c-calendar__panel">
      <!-- 标题 -->
      <view class="c-calendar__header">
        <text class="c-calendar__title">{{ title }}</text>
        <view
          class="c-calendar__close"
          @click="onClose"
        >
          <WdIcon
            name="close"
            size="18px"
          />
        </view>
      </view>

      <!-- 月份导航 -->
      <view class="c-calendar__nav">
        <view
          class="c-calendar__nav-btn"
          @click="prevMonth"
        >
          <WdIcon
            name="arrow-left"
            size="16px"
          />
        </view>
        <text class="c-calendar__nav-title"
          >{{ currentYear }}年{{ currentMonth }}月</text
        >
        <view
          class="c-calendar__nav-btn"
          @click="nextMonth"
        >
          <WdIcon
            name="arrow-right"
            size="16px"
          />
        </view>
      </view>

      <!-- 星期标题 -->
      <view class="c-calendar__weeks">
        <text
          v-for="w in weekDays"
          :key="w"
          class="c-calendar__week-item"
          >{{ w }}</text
        >
      </view>

      <!-- 日期网格 -->
      <view class="c-calendar__days">
        <!-- 前置空白 -->
        <view
          v-for="n in leadingBlanks"
          :key="'b' + n"
          class="c-calendar__day c-calendar__day--blank"
        />
        <!-- 日期 -->
        <view
          v-for="day in daysInMonth"
          :key="day"
          :class="dayClass(day)"
          @click="onSelectDay(day)"
        >
          <text class="c-calendar__day-text">{{ day }}</text>
          <view
            v-if="hasMark(day)"
            class="c-calendar__day-mark"
            :style="{ background: getMarkColor(day) }"
          />
          <text
            v-if="isRangeStart(day)"
            class="c-calendar__day-tip"
            >开始</text
          >
          <text
            v-if="isRangeEnd(day)"
            class="c-calendar__day-tip"
            >结束</text
          >
        </view>
      </view>

      <!-- 确认按钮 -->
      <view
        v-if="showConfirm"
        class="c-calendar__footer"
      >
        <view
          class="c-calendar__confirm"
          @click="onConfirm"
        >
          <text class="c-calendar__confirm-text">{{ confirmText }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import {
    defaultProps,
    WEEK_DAYS_MON,
    WEEK_DAYS_SUN,
    formatDate,
    getDaysInMonth,
  } from './data'

  const props = defineProps({
    /** 是否显示 */
    visible: { type: Boolean, default: defaultProps.visible },
    /** 选择模式 */
    mode: { type: String, default: defaultProps.mode },
    /** 默认选中 */
    defaultDate: { type: [String, Array], default: defaultProps.defaultDate },
    /** 可选最小日期 */
    minDate: { type: String, default: defaultProps.minDate },
    /** 可选最大日期 */
    maxDate: { type: String, default: defaultProps.maxDate },
    /** 标题 */
    title: { type: String, default: defaultProps.title },
    /** 是否显示确认按钮 */
    showConfirm: { type: Boolean, default: defaultProps.showConfirm },
    /** 确认按钮文字 */
    confirmText: { type: String, default: defaultProps.confirmText },
    /** 一周第一天 */
    firstDayOfWeek: { type: Number, default: defaultProps.firstDayOfWeek },
    /** 日期标记 */
    marks: { type: Array, default: () => defaultProps.marks },
    /** 范围模式最大天数 */
    maxRange: { type: Number, default: defaultProps.maxRange },
  })

  const emit = defineEmits(['update:visible', 'confirm', 'select'])

  const today = new Date()
  const currentYear = ref(today.getFullYear())
  const currentMonth = ref(today.getMonth() + 1)

  // 已选日期
  const selectedDates = ref([])

  // 初始化
  watch(
    () => props.visible,
    val => {
      if (val && props.defaultDate) {
        if (Array.isArray(props.defaultDate)) {
          selectedDates.value = [...props.defaultDate]
        } else {
          selectedDates.value = [props.defaultDate]
        }
        // 自动跳转到选中月份
        const d = new Date(selectedDates.value[0])
        currentYear.value = d.getFullYear()
        currentMonth.value = d.getMonth() + 1
      }
    }
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
      if (!props.showConfirm) emit('confirm', dateStr)
    } else if (props.mode === 'multiple') {
      const idx = selectedDates.value.indexOf(dateStr)
      if (idx > -1) {
        selectedDates.value.splice(idx, 1)
      } else {
        selectedDates.value.push(dateStr)
      }
      emit('select', [...selectedDates.value])
    } else if (props.mode === 'range') {
      if (
        selectedDates.value.length === 0 ||
        selectedDates.value.length === 2
      ) {
        selectedDates.value = [dateStr]
      } else {
        const start = selectedDates.value[0]
        if (dateStr < start) {
          selectedDates.value = [dateStr]
        } else {
          selectedDates.value = [start, dateStr]
        }
      }
      emit('select', [...selectedDates.value])
    }
  }

  /** 确认 */
  function onConfirm() {
    const result =
      props.mode === 'single'
        ? selectedDates.value[0] || ''
        : [...selectedDates.value]
    emit('confirm', result)
    onClose()
  }

  /** 关闭 */
  function onClose() {
    emit('update:visible', false)
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
