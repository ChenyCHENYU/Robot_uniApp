<template>
  <view
    class="c-icon-wrapper"
    :style="iconStyle"
    @click="handleClick"
  >
    <!-- UnoCSS 图标 -->
    <view
      v-if="type === 'unocss' && hasValidName"
      :class="name"
      :style="unocssStyle"
    ></view>

    <!-- uView-Plus 图标 -->
    <up-icon
      v-else-if="type === 'uview' && hasValidName"
      v-bind="uviewProps"
    ></up-icon>

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
    <view v-else class="icon-error">
      <text class="error-text">?</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";

defineOptions({
  name: "CIcon",
});

const props = defineProps({
  // 图标类型
  type: {
    type: String,
    default: "unocss",
  },
  // 图标名称
  name: {
    type: String,
    default: "",
  },
  // 图标大小
  size: {
    type: [String, Number],
    default: 24,
  },
  // 图标颜色
  color: {
    type: String,
    default: "#333",
  },
  // 是否加粗 (uview专用)
  bold: {
    type: Boolean,
    default: false,
  },
  // 图标标签 (uview专用)
  label: {
    type: String,
    default: "",
  },
  // 自定义前缀 (uview专用)
  customPrefix: {
    type: String,
    default: "",
  },
  // 自定义样式
  customStyle: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["click"]);

// 检查是否有有效的name值
const hasValidName = computed(() => {
  return props.name && props.name.trim().length > 0;
});

// 检查类型是否有效
const isValidType = computed(() => {
  return ['unocss', 'uview', 'svg', 'image', 'custom'].includes(props.type);
});

// 构建 uView 图标的完整属性对象
const uviewProps = computed(() => {
  if (!hasValidName.value) return {};
  
  const propsObj = {
    name: props.name.trim(),
    size: props.size,
    color: props.color,
  };

  // 只在有值时传递这些可选属性
  if (props.bold) {
    propsObj.bold = props.bold;
  }
  if (props.label && props.label.trim()) {
    propsObj.label = props.label.trim();
  }
  if (props.customPrefix && props.customPrefix.trim()) {
    propsObj.customPrefix = props.customPrefix.trim();
  }

  return propsObj;
});

const iconStyle = computed(() => {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...props.customStyle,
  };
});

const unocssStyle = computed(() => {
  const sizeValue = typeof props.size === "number" ? `${props.size}px` : props.size;
  return {
    width: sizeValue,
    height: sizeValue,
    color: props.color,
    flexShrink: 0,
  };
});

const svgStyle = computed(() => {
  const sizeValue = typeof props.size === "number" ? `${props.size}px` : props.size;
  return {
    width: sizeValue,
    height: sizeValue,
  };
});

const imageStyle = computed(() => {
  const sizeValue = typeof props.size === "number" ? `${props.size}px` : props.size;
  return {
    width: sizeValue,
    height: sizeValue,
  };
});

const handleClick = (event) => {
  emit("click", event);
};
</script>

<style scoped>
.c-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.icon-error {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  border: 1px solid #ff4757;
  border-radius: 2px;
  background-color: #fff5f5;
}

.error-text {
  color: #ff4757;
  font-size: 12px;
  font-weight: bold;
}
</style>