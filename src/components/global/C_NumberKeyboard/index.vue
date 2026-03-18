<template>
  <view v-if="visible">
    <view
      class="c-number-keyboard__overlay"
      @click="close"
    />
    <view class="c-number-keyboard__panel">
      <!-- 标题栏 -->
      <view
        v-if="title"
        class="c-number-keyboard__header"
      >
        <text class="c-number-keyboard__title">{{ title }}</text>
        <text
          class="c-number-keyboard__done"
          @click="onDone"
          >完成</text
        >
      </view>

      <!-- 按键区 -->
      <view class="c-number-keyboard__grid">
        <view
          v-for="(key, index) in keys"
          :key="index"
          :class="[
            'c-number-keyboard__key',
            `c-number-keyboard__key--${key.type}`,
          ]"
          @click="onKeyPress(key)"
        >
          <wd-icon
            v-if="key.type === 'delete'"
            name="arrow-left"
            size="22px"
          />
          <text v-else>{{ key.text }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { defaultProps, generateKeys } from './data'

  const props = defineProps({
    /** 是否显示 */
    visible: { type: Boolean, default: defaultProps.visible },
    /** 当前值 */
    modelValue: { type: String, default: '' },
    /** 标题 */
    title: { type: String, default: defaultProps.title },
    /** 最大输入长度 */
    maxLength: { type: Number, default: defaultProps.maxLength },
    /** 是否显示小数点 */
    showDot: { type: Boolean, default: defaultProps.showDot },
    /** 是否随机排列 */
    randomOrder: { type: Boolean, default: defaultProps.randomOrder },
    /** 左下角额外按键 */
    extraKey: { type: String, default: defaultProps.extraKey },
  })

  const emit = defineEmits([
    'update:visible',
    'update:modelValue',
    'input',
    'delete',
    'done',
  ])

  const keys = computed(() =>
    generateKeys(props.showDot, props.extraKey, props.randomOrder)
  )

  const close = () => emit('update:visible', false)

  const onKeyPress = key => {
    if (key.type === 'empty') return
    if (key.type === 'delete') {
      const newVal = props.modelValue.slice(0, -1)
      emit('update:modelValue', newVal)
      emit('delete')
      return
    }

    if (props.maxLength > 0 && props.modelValue.length >= props.maxLength)
      return

    // 小数点不能重复、不能在开头
    if (key.text === '.') {
      if (props.modelValue.includes('.') || !props.modelValue) return
    }

    const newVal = props.modelValue + key.text
    emit('update:modelValue', newVal)
    emit('input', key.text)
  }

  const onDone = () => {
    emit('done', props.modelValue)
    close()
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
