<template>
  <view
    v-if="visible"
    class="c-calendar"
  >
    <view
      class="c-calendar__overlay"
      @touchmove.stop.prevent
      @wheel.stop.prevent
      @click="onClose"
    />
    <view
      class="c-calendar__panel"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
    >
      <!-- 标题 -->
      <view class="c-calendar__header">
        <text class="c-calendar__title">{{ title }}</text>
        <view
          class="c-calendar__close"
          @click="onClose"
        >
          <wd-icon
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
          <wd-icon
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
          <wd-icon
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
          :class="[
            'c-calendar__confirm',
            !canConfirm && 'c-calendar__confirm--disabled',
          ]"
          :aria-disabled="!canConfirm"
          @click="onConfirm"
        >
          <text class="c-calendar__confirm-text">{{ confirmText }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { defaultProps, useCalendar } from './data'
  import type { PropType } from 'vue'

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
    marks: {
      type: Array as PropType<{ date: string; color?: string }[]>,
      default: () => defaultProps.marks,
    },
    /** 范围模式最大天数 */
    maxRange: { type: Number, default: defaultProps.maxRange },
  })

  const emit = defineEmits(['update:visible', 'confirm', 'select', 'close'])

  const {
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
  } = useCalendar(props, emit)
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
