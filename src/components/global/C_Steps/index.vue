<template>
  <view
    :class="['c-steps', `c-steps--${direction}`]"
    :style="{
      '--steps-active-color': activeColor,
      '--steps-inactive-color': inactiveColor,
    }"
  >
    <view
      v-for="(step, index) in steps"
      :key="index"
      class="c-steps__item"
    >
      <!-- 连接线 -->
      <view
        v-if="index < steps.length - 1"
        :class="['c-steps__line', index < current && 'c-steps__line--active']"
      />

      <!-- 指示器 -->
      <view
        :class="[
          'c-steps__indicator',
          `c-steps__indicator--${getStatus(index)}`,
        ]"
      >
        <wd-icon
          v-if="index < current"
          name="check"
          size="14px"
          color="#fff"
        />
        <text v-else>{{ index + 1 }}</text>
      </view>

      <!-- 内容 -->
      <view class="c-steps__content">
        <view
          :class="[
            'c-steps__title',
            index > current && 'c-steps__title--inactive',
          ]"
        >
          {{ step.title }}
        </view>
        <view
          v-if="step.description"
          class="c-steps__desc"
          >{{ step.description }}</view
        >
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { defaultProps } from './data'

  const props = defineProps({
    /** 步骤数据 [{ title, description }] */
    steps: { type: Array, required: true },
    /** 当前步骤索引（从 0 开始） */
    current: { type: Number, default: defaultProps.current },
    /** 方向 horizontal / vertical */
    direction: { type: String, default: defaultProps.direction },
    /** 激活态颜色 */
    activeColor: { type: String, default: defaultProps.activeColor },
    /** 非激活态颜色 */
    inactiveColor: { type: String, default: defaultProps.inactiveColor },
  })

  const getStatus = index => {
    if (index < props.current) return 'finished'
    if (index === props.current) return 'active'
    return 'inactive'
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
