<template>
  <view class="c-index-list">
    <!-- 列表区域 -->
    <ScrollView
      class="c-index-list__scroll"
      scroll-y
      :scroll-into-view="scrollTarget"
      scroll-with-animation
    >
      <view
        v-for="group in data"
        :key="group[indexKey]"
        :id="'idx-' + group[indexKey]"
        class="c-index-list__group"
      >
        <view
          :class="[
            'c-index-list__title',
            sticky && 'c-index-list__title--sticky',
          ]"
        >
          <text class="c-index-list__title-text">{{ group[indexKey] }}</text>
        </view>
        <view class="c-index-list__items">
          <slot
            :group="group"
            :items="group.items || []"
          />
        </view>
      </view>
    </ScrollView>

    <!-- 右侧索引栏 -->
    <view
      class="c-index-list__sidebar"
      @touchstart.stop.prevent="onSidebarTouch"
      @touchmove.stop.prevent="onSidebarTouch"
      @touchend.stop.prevent="onSidebarEnd"
    >
      <view
        v-for="group in data"
        :key="group[indexKey]"
        :class="[
          'c-index-list__sidebar-item',
          activeIndex === group[indexKey] &&
            'c-index-list__sidebar-item--active',
        ]"
        :style="
          activeIndex === group[indexKey] && activeColor
            ? { color: activeColor }
            : {}
        "
      >
        <text>{{ group[indexKey] }}</text>
      </view>
    </view>

    <!-- 触摸提示 -->
    <view
      v-if="touching && activeIndex"
      class="c-index-list__tooltip"
    >
      <text class="c-index-list__tooltip-text">{{ activeIndex }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref, getCurrentInstance as vueGetCurrentInstance } from 'vue'
  import { defaultProps } from './data'

  const props = defineProps({
    /** 分组数据 */
    data: { type: Array, default: () => defaultProps.data },
    /** 索引字段名 */
    indexKey: { type: String, default: defaultProps.indexKey },
    /** 是否吸顶 */
    sticky: { type: Boolean, default: defaultProps.sticky },
    /** 高亮颜色 */
    activeColor: { type: String, default: defaultProps.activeColor },
  })

  const emit = defineEmits(['select'])

  const scrollTarget = ref('')
  const activeIndex = ref('')
  const touching = ref(false)

  let sidebarRect = null
  let itemHeight = 0

  /** 获取侧边栏位置信息 */
  function _getSidebarRect() {
    return new Promise(resolve => {
      uni
        .createSelectorQuery()
        .in(getCurrentInstance())
        .select('.c-index-list__sidebar')
        .boundingClientRect(rect => {
          resolve(rect)
        })
        .exec()
    })
  }

  /** 侧边栏触摸 */
  async function onSidebarTouch(e) {
    touching.value = true

    if (!sidebarRect) {
      sidebarRect = await _getSidebarRect()
      if (sidebarRect && props.data.length) {
        itemHeight = sidebarRect.height / props.data.length
      }
    }

    if (!sidebarRect || !itemHeight) return

    const touch = e.touches[0]
    const offsetY = touch.clientY - sidebarRect.top
    const idx = Math.floor(offsetY / itemHeight)

    if (idx >= 0 && idx < props.data.length) {
      const letter = props.data[idx][props.indexKey]
      activeIndex.value = letter
      scrollTarget.value = `idx-${letter}`
      emit('select', letter)
    }
  }

  /** 触摸结束 */
  function onSidebarEnd() {
    touching.value = false
    sidebarRect = null
  }

  /**
   * 获取组件实例（用于 createSelectorQuery）
   * @returns {object}
   */
  function getCurrentInstance() {
    // uni-app 下使用 getCurrentInstance 获取组件上下文
    const { proxy } = vueGetCurrentInstance()!
    return proxy
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
