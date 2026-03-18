<template>
  <view
    :class="[
      'c-rate',
      disabled && 'c-rate--disabled',
      readonly && 'c-rate--readonly',
    ]"
  >
    <view
      v-for="n in count"
      :key="n"
      class="c-rate__item"
      :style="{ marginRight: n < count ? gap + 'rpx' : 0 }"
      @click="onSelect(n)"
    >
      <!-- 半星模式 -->
      <view
        v-if="allowHalf"
        class="c-rate__half-wrap"
        :style="{ width: size + 'rpx', height: size + 'rpx' }"
      >
        <view
          class="c-rate__half-left"
          @click.stop="onSelect(n - 0.5)"
        >
          <wd-icon
            :name="modelValue >= n - 0.5 ? activeIcon : inactiveIcon"
            :size="size + 'rpx'"
            :color="modelValue >= n - 0.5 ? activeColor : inactiveColor"
          />
        </view>
        <view
          class="c-rate__half-right"
          @click.stop="onSelect(n)"
        >
          <wd-icon
            :name="modelValue >= n ? activeIcon : inactiveIcon"
            :size="size + 'rpx'"
            :color="modelValue >= n ? activeColor : inactiveColor"
          />
        </view>
      </view>

      <!-- 全星模式 -->
      <wd-icon
        v-else
        :name="modelValue >= n ? activeIcon : inactiveIcon"
        :size="size + 'rpx'"
        :color="modelValue >= n ? activeColor : inactiveColor"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
  import { defaultProps } from './data'

  const props = defineProps({
    /** 当前值 */
    modelValue: { type: Number, default: defaultProps.modelValue },
    /** 总数 */
    count: { type: Number, default: defaultProps.count },
    /** 图标尺寸 */
    size: { type: Number, default: defaultProps.size },
    /** 间距 */
    gap: { type: Number, default: defaultProps.gap },
    /** 选中颜色 */
    activeColor: { type: String, default: defaultProps.activeColor },
    /** 未选中颜色 */
    inactiveColor: { type: String, default: defaultProps.inactiveColor },
    /** 选中图标 */
    activeIcon: { type: String, default: defaultProps.activeIcon },
    /** 未选中图标 */
    inactiveIcon: { type: String, default: defaultProps.inactiveIcon },
    /** 是否允许半星 */
    allowHalf: { type: Boolean, default: defaultProps.allowHalf },
    /** 是否只读 */
    readonly: { type: Boolean, default: defaultProps.readonly },
    /** 是否禁用 */
    disabled: { type: Boolean, default: defaultProps.disabled },
    /** 是否允许归零 */
    clearable: { type: Boolean, default: defaultProps.clearable },
  })

  const emit = defineEmits(['update:modelValue', 'change'])

  /**
   *
   */
  function onSelect(value) {
    if (props.readonly || props.disabled) return

    // 归零逻辑
    const newValue = props.clearable && value === props.modelValue ? 0 : value
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
