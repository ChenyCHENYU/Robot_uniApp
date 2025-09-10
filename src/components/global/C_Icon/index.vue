<template>
  <view
    class="inline-flex items-center justify-center"
    :style="iconStyle"
    @click="handleClick"
  >
    <!-- UnoCSS 图标 (默认) -->
    <view
      v-if="type === 'unocss'"
      :class="unocssClass"
      :style="unocssStyle"
    ></view>

    <!-- uView+ 图标 -->
    <up-icon
      v-else-if="type === 'uview'"
      :name="name"
      :size="size"
      :color="color"
      :bold="bold"
      :label="label"
      :custom-prefix="customPrefix"
    ></up-icon>

    <!-- SVG 图标文件 -->
    <image
      v-else-if="type === 'svg'"
      :src="name"
      :style="svgStyle"
      mode="aspectFit"
    />

    <!-- 图片图标 (注意：图片类型不支持 color 属性) -->
    <image
      v-else-if="type === 'image'"
      :src="name"
      :style="imageStyle"
      mode="aspectFit"
    />

    <!-- 自定义内容插槽 -->
    <slot v-else></slot>
  </view>
</template>

<script setup>
import { computed } from "vue";

// 定义组件选项（Vue 3.4+ 语法）
defineOptions({
  name: "CIcon",
});

// Props 定义
const props = defineProps({
  // 图标类型：unocss(默认) | uview | svg | image | custom
  type: {
    type: String,
    default: "unocss",
  },

  // 图标名称
  // unocss: 'mdi-home', 'carbon-user'
  // uview: 'home', 'setting'
  // svg: SVG文件路径 '/static/icons/custom.svg'
  // image: 图片路径 '/static/images/logo.png'
  name: {
    type: String,
    required: true,
  },

  // 图标大小
  size: {
    type: [String, Number],
    default: 24,
  },

  // 图标颜色
  // 注意：仅对 unocss 和 uview 类型有效
  // svg 和 image 类型无法通过此属性修改颜色
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

// 事件定义
const emit = defineEmits(["click"]);

// 计算属性
const iconStyle = computed(() => {
  return {
    ...props.customStyle,
  };
});

// UnoCSS 图标类名
const unocssClass = computed(() => {
  if (props.type !== "unocss") return "";

  // 处理不同格式的图标名称
  let iconClass = "";

  if (props.name.includes("-")) {
    // 格式：'mdi-home' -> 'i-mdi-home'
    iconClass = `i-${props.name}`;
  } else if (props.name.includes(":")) {
    // 格式：'mdi:home' -> 'i-mdi-home'
    iconClass = `i-${props.name.replace(":", "-")}`;
  } else {
    // 兜底：假设是完整类名或需要默认前缀
    iconClass = props.name.startsWith("i-") ? props.name : `i-${props.name}`;
  }

  return iconClass;
});

// UnoCSS 图标样式
const unocssStyle = computed(() => {
  const sizeValue =
    typeof props.size === "number" ? `${props.size}px` : props.size;

  return {
    width: sizeValue,
    height: sizeValue,
    color: props.color,
    flexShrink: 0,
  };
});

// SVG 图标样式
const svgStyle = computed(() => {
  const sizeValue =
    typeof props.size === "number" ? `${props.size}px` : props.size;

  return {
    width: sizeValue,
    height: sizeValue,
  };
});

// 图片图标样式
const imageStyle = computed(() => {
  const sizeValue =
    typeof props.size === "number" ? `${props.size}px` : props.size;

  return {
    width: sizeValue,
    height: sizeValue,
  };
});

// 点击事件处理
const handleClick = (event) => {
  emit("click", event);
};
</script>
