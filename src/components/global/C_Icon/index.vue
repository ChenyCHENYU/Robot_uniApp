<template>
  <view
    class="inline-flex items-center justify-center relative"
    :style="iconStyle"
    @click="handleClick"
  >
    <!-- UnoCSS 图标 -->
    <view
      v-if="type === 'unocss' && hasValidName"
      :class="name"
      :style="unocssStyle"
    ></view>

    <!-- wot-design-uni 图标 -->
    <wd-icon
      v-else-if="type === 'wot' && hasValidName"
      v-bind="wotProps"
    ></wd-icon>

    <!-- SVG 图标文件 -->
    <image
      v-else-if="type === 'svg' && hasValidName"
      :src="name"
      :style="svgStyle"
      mode="aspectFit"
    />

    <!-- 图片图标 -->
    <image
      v-else-if="type === 'image' && hasValidName"
      :src="name"
      :style="imageStyle"
      mode="aspectFit"
    />

    <!-- 自定义内容插槽 -->
    <slot v-else-if="type === 'custom'"></slot>

    <!-- 兜底：显示错误状态 -->
    <view
      v-else
      class="inline-flex items-center justify-center w-4 h-4 border border-red-500 rounded-sm bg-red-50"
    >
      <text class="text-red-500 text-xs font-bold">?</text>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  defineOptions({
    name: 'CIcon',
  })

  const props = defineProps({
    // 图标类型
    type: {
      type: String,
      default: 'unocss',
    },
    // 图标名称
    name: {
      type: String,
      default: '',
    },
    // 图标大小
    size: {
      type: [String, Number],
      default: 24,
    },
    // 图标颜色
    color: {
      type: String,
      default: '#333',
    },
    // 是否加粗 (wot专用)
    bold: {
      type: Boolean,
      default: false,
    },
    // 图标标签 (wot专用)
    label: {
      type: String,
      default: '',
    },
    // 自定义前缀 (wot专用)
    customPrefix: {
      type: String,
      default: '',
    },
    // 自定义样式
    customStyle: {
      type: Object,
      default: () => ({}),
    },
  })

  const emit = defineEmits(['click'])

  // 检查是否有有效的name值
  const hasValidName = computed(() => {
    return props.name && props.name.trim().length > 0
  })

  // 棄用类型校验（已通过 Props 校验保证）
  // const isValidType = computed(() => {
  //   return ['unocss', 'wot', 'svg', 'image', 'custom'].includes(props.type);
  // });

  // 构建 wot-design-uni 图标的完整属性对象
  const wotProps = computed(() => {
    if (!hasValidName.value) return {}

    const propsObj = {
      name: props.name.trim(),
      size: typeof props.size === 'number' ? props.size + 'px' : props.size,
      color: props.color,
    }

    // 只在有值时传递这些可选属性
    if (props.customPrefix && props.customPrefix.trim()) {
      propsObj.classPrefix = props.customPrefix.trim()
    }

    return propsObj
  })

  const iconStyle = computed(() => {
    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...props.customStyle,
    }
  })

  const unocssStyle = computed(() => {
    const sizeValue =
      typeof props.size === 'number' ? `${props.size}px` : props.size
    return {
      width: sizeValue,
      height: sizeValue,
      color: props.color,
      flexShrink: 0,
    }
  })

  const svgStyle = computed(() => {
    const sizeValue =
      typeof props.size === 'number' ? `${props.size}px` : props.size
    return {
      width: sizeValue,
      height: sizeValue,
    }
  })

  const imageStyle = computed(() => {
    const sizeValue =
      typeof props.size === 'number' ? `${props.size}px` : props.size
    return {
      width: sizeValue,
      height: sizeValue,
    }
  })

  const handleClick = event => {
    emit('click', event)
  }
</script>
