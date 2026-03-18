<template>
  <view :class="['c-timeline', `c-timeline--${direction}`]">
    <view
      v-for="(item, index) in displayItems"
      :key="index"
      :class="['c-timeline__item', `c-timeline__item--${getStatus(index)}`]"
    >
      <!-- 节点 -->
      <view class="c-timeline__node">
        <slot
          name="icon"
          :item="item"
          :index="index"
        >
          <view
            class="c-timeline__dot"
            :style="{ background: getDotColor(item, index) }"
          >
            <wd-icon
              v-if="item.icon"
              :name="item.icon"
              size="12px"
              color="#fff"
            />
          </view>
        </slot>
        <!-- 连线 -->
        <view
          v-if="index < displayItems.length - 1"
          class="c-timeline__line"
          :style="{ background: getLineColor(index) }"
        />
      </view>

      <!-- 内容 -->
      <view class="c-timeline__content">
        <text class="c-timeline__title">{{ item.title }}</text>
        <text
          v-if="item.content"
          class="c-timeline__desc"
          >{{ item.content }}</text
        >
        <text
          v-if="item.time"
          class="c-timeline__time"
          >{{ item.time }}</text
        >
        <slot
          name="extra"
          :item="item"
          :index="index"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { computed, type PropType } from 'vue'
  import { defaultProps, NODE_STATUS } from './data'

  interface TimelineItem {
    title: string
    content?: string
    time?: string
    icon?: string
    color?: string
    [key: string]: any
  }

  const props = defineProps({
    /** 时间轴数据 */
    items: {
      type: Array as PropType<TimelineItem[]>,
      default: () => defaultProps.items,
    },
    /** 排列方向 */
    direction: { type: String, default: defaultProps.direction },
    /** 是否倒序 */
    reverse: { type: Boolean, default: defaultProps.reverse },
    /** 当前激活索引 */
    current: { type: Number, default: defaultProps.current },
    /** 已完成步骤颜色 */
    finishedColor: { type: String, default: defaultProps.finishedColor },
    /** 未完成步骤颜色 */
    pendingColor: { type: String, default: defaultProps.pendingColor },
  })

  const displayItems = computed(() =>
    props.reverse ? [...props.items].reverse() : props.items
  )

  /**
   *
   */
  function getStatus(index) {
    if (props.current < 0) return NODE_STATUS.FINISHED
    const realIndex = props.reverse ? props.items.length - 1 - index : index
    if (realIndex < props.current) return NODE_STATUS.FINISHED
    if (realIndex === props.current) return NODE_STATUS.CURRENT
    return NODE_STATUS.PENDING
  }

  /**
   *
   */
  function getDotColor(item, index) {
    if (item.color) return item.color
    const status = getStatus(index)
    if (status === NODE_STATUS.PENDING) return props.pendingColor
    return props.finishedColor
  }

  /**
   *
   */
  function getLineColor(index) {
    const status = getStatus(index)
    if (status === NODE_STATUS.PENDING) return props.pendingColor
    return props.finishedColor
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
