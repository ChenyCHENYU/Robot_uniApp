<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <view class="text-center mb-8">
        <C_Title
          title="C_Calendar 日历"
          subtitle="日期选择日历组件"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-calendar-month"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <view class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 单选模式 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="单选模式"
            subtitle="选择一个日期"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-calendar"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-blue-500 px-6 py-2.5 rounded-full"
              @click="showSingle = true"
            >
              {{ selectedDate || '选择日期' }}
            </text>
          </view>
          <C_Calendar
            :visible="showSingle"
            mode="single"
            @confirm="onSingleConfirm"
            @close="showSingle = false"
          />
        </view>

        <!-- 区间选择 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="区间选择"
            subtitle="选择日期范围"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-calendar-range"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-green-500 px-6 py-2.5 rounded-full"
              @click="showRange = true"
              >选择日期范围</text
            >
            <text
              v-if="rangeText"
              class="text-xs text-gray-500 block mt-3"
              >{{ rangeText }}</text
            >
          </view>
          <C_Calendar
            :visible="showRange"
            mode="range"
            @confirm="onRangeConfirm"
            @close="showRange = false"
          />
        </view>

        <!-- 自定义颜色 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="自定义主题色"
            subtitle="color 属性"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-palette"
            :show-decoration="true"
          />
          <view class="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <text
              class="text-sm text-white bg-amber-500 px-6 py-2.5 rounded-full"
              @click="showCustom = true"
              >自定义主题色</text
            >
          </view>
          <C_Calendar
            :visible="showCustom"
            mode="single"
            color="#07c160"
            @confirm="onCustomConfirm"
            @close="showCustom = false"
          />
        </view>

        <!-- 功能特性 -->
        <view class="bg-white rounded-lg shadow-md p-6">
          <C_Title
            title="功能特性"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-star-outline"
            :show-decoration="true"
          />
          <view class="my-6 space-y-3">
            <view class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <text class="text-lg">📅</text>
              <view>
                <text class="text-sm font-bold block">多种模式</text>
                <text class="text-xs text-gray-500">单选 / 多选 / 区间</text>
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <text class="text-lg">📌</text>
              <view>
                <text class="text-sm font-bold block">日期标记</text>
                <text class="text-xs text-gray-500">打点、文字标注</text>
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <text class="text-lg">🔒</text>
              <view>
                <text class="text-sm font-bold block">范围限制</text>
                <text class="text-xs text-gray-500">minDate / maxDate</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="mt-8 text-center">
        <C_Title
          title="日期选择，灵活多变"
          subtitle="单选 · 多选 · 区间 · 主题色 · 范围限制"
          :level="5"
          type="info"
          align="center"
          :show-divider="true"
          divider-position="top"
        />
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const showSingle = ref(false)
  const showRange = ref(false)
  const showCustom = ref(false)
  const selectedDate = ref('')
  const rangeText = ref('')

  /**
   *
   */
  function onSingleConfirm(date: string) {
    selectedDate.value = date
    showSingle.value = false
  }

  /**
   *
   */
  function onRangeConfirm(dates: string[]) {
    rangeText.value = `${dates[0]} 至 ${dates[1]}`
    showRange.value = false
  }

  /**
   *
   */
  function onCustomConfirm(date: string) {
    uni.showToast({ title: `选择: ${date}`, icon: 'none' })
    showCustom.value = false
  }
</script>
