<template>
  <view
    class="relative flex flex-col"
    :class="[
      `c-title-${type}`,
      `text-${align}`,
      `items-${align === 'center' ? 'center' : align === 'right' ? 'end' : 'start'}`,
      { 'cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0': clickable },
    ]"
    :style="wrapperStyle"
    @click="handleClick"
  >
    <!-- 玻璃质感背景容器 -->
    <view 
      class="relative backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden"
      :class="glassBackgroundClass"
    >
      <!-- 光影渐变层 -->
      <view class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></view>
      
      <!-- 顶部分割线 -->
      <view
        v-if="showDivider && dividerPosition === 'top'"
        class="h-0.5 mx-4 mb-3 rounded-full opacity-60"
        :class="dividerGradientClass"
      ></view>

      <!-- 主体内容 -->
      <view class="flex items-start gap-3 p-4 relative z-10">
        <!-- 左侧图标 -->
        <view v-if="leftIcon" class="flex items-center justify-center flex-shrink-0 mt-1">
          <view 
            class="p-2 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg"
            :class="iconBackgroundClass"
          >
            <C_Icon
              :name="leftIcon"
              :type="iconType"
              :size="iconSize"
              :color="iconColor"
            />
          </view>
        </view>

        <!-- 文字内容区 -->
        <view class="flex-1 min-w-0">
          <!-- 主标题 -->
          <view
            class="font-medium leading-tight m-0 break-words"
            :class="[titleSizeClass, titleColorClass, { 'font-semibold': bold }]"
          >
            {{ title }}
          </view>

          <!-- 副标题 -->
          <view
            v-if="subtitle"
            class="text-sm leading-relaxed mt-1 opacity-80"
            :class="subtitleColorClass"
          >
            {{ subtitle }}
          </view>
        </view>

        <!-- 右侧图标 -->
        <view v-if="rightIcon" class="flex items-center justify-center flex-shrink-0 mt-1">
          <view 
            class="p-2 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg"
            :class="iconBackgroundClass"
          >
            <C_Icon
              :name="rightIcon"
              :type="iconType"
              :size="iconSize"
              :color="iconColor"
            />
          </view>
        </view>
      </view>

      <!-- 底部分割线 -->
      <view
        v-if="showDivider && dividerPosition === 'bottom'"
        class="h-0.5 mx-4 mt-3 rounded-full opacity-60"
        :class="dividerGradientClass"
      ></view>

      <!-- 装饰元素 -->
      <view
        v-if="showDecoration"
        class="absolute -bottom-1 h-1 w-10 rounded-full"
        :class="[decorationGradientClass, decorationPositionClass]"
      ></view>
      
      <!-- 边框光效 -->
      <view class="absolute inset-0 rounded-2xl border border-white/30 pointer-events-none"></view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";

defineOptions({
  name: "CTitle",
});

const props = defineProps({
  // 主标题文字
  title: {
    type: String,
    required: true,
  },
  // 副标题/描述文字
  subtitle: {
    type: String,
    default: "",
  },
  // 标题级别 1-6
  level: {
    type: [Number, String],
    default: 2,
    validator: (value) => [1, 2, 3, 4, 5, 6].includes(Number(value)),
  },
  // 标题类型/主题
  type: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["default", "primary", "success", "warning", "danger", "info"].includes(
        value
      ),
  },
  // 对齐方式
  align: {
    type: String,
    default: "left",
    validator: (value) => ["left", "center", "right"].includes(value),
  },
  // 尺寸大小
  size: {
    type: String,
    default: "medium",
    validator: (value) => ["small", "medium", "large"].includes(value),
  },
  // 左侧图标
  leftIcon: {
    type: String,
    default: "",
  },
  // 右侧图标
  rightIcon: {
    type: String,
    default: "",
  },
  // 图标类型
  iconType: {
    type: String,
    default: "unocss",
  },
  // 是否加粗
  bold: {
    type: Boolean,
    default: true,
  },
  // 是否显示分割线
  showDivider: {
    type: Boolean,
    default: false,
  },
  // 分割线位置
  dividerPosition: {
    type: String,
    default: "bottom",
    validator: (value) => ["top", "bottom"].includes(value),
  },
  // 是否显示装饰元素
  showDecoration: {
    type: Boolean,
    default: false,
  },
  // 是否可点击
  clickable: {
    type: Boolean,
    default: false,
  },
  // 自定义样式
  customStyle: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["click"]);

// 计算图标尺寸
const iconSize = computed(() => {
  const sizeMap = {
    small: 16,
    medium: 18,
    large: 20,
  };
  return sizeMap[props.size];
});

// 计算图标颜色
const iconColor = computed(() => {
  const colorMap = {
    default: "#64748b",
    primary: "#3b82f6",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#6b7280",
  };
  return colorMap[props.type];
});

// 玻璃质感背景类
const glassBackgroundClass = computed(() => {
  const bgMap = {
    default: 'bg-slate-500/10',
    primary: 'bg-blue-500/15',
    success: 'bg-emerald-500/15', 
    warning: 'bg-amber-500/15',
    danger: 'bg-red-500/15',
    info: 'bg-gray-500/10'
  };
  return bgMap[props.type];
});

// 图标背景类
const iconBackgroundClass = computed(() => {
  const bgMap = {
    default: 'bg-slate-500/20',
    primary: 'bg-blue-500/20',
    success: 'bg-emerald-500/20',
    warning: 'bg-amber-500/20', 
    danger: 'bg-red-500/20',
    info: 'bg-gray-500/20'
  };
  return bgMap[props.type];
});

// 标题尺寸类
const titleSizeClass = computed(() => {
  const levelSizeMap = {
    1: { small: 'text-2xl', medium: 'text-3xl', large: 'text-4xl' },
    2: { small: 'text-xl', medium: 'text-2xl', large: 'text-3xl' },
    3: { small: 'text-lg', medium: 'text-xl', large: 'text-2xl' },
    4: { small: 'text-base', medium: 'text-lg', large: 'text-xl' },
    5: { small: 'text-sm', medium: 'text-base', large: 'text-lg' },
    6: { small: 'text-xs', medium: 'text-sm', large: 'text-base' },
  };
  return levelSizeMap[props.level][props.size];
});

// 标题颜色类
const titleColorClass = computed(() => {
  const colorMap = {
    default: 'text-slate-700',
    primary: 'text-blue-600',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    danger: 'text-red-600',
    info: 'text-gray-600',
  };
  return colorMap[props.type];
});

// 副标题颜色类
const subtitleColorClass = computed(() => {
  const colorMap = {
    default: 'text-slate-600',
    primary: 'text-blue-500',
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    danger: 'text-red-500',
    info: 'text-gray-500',
  };
  return colorMap[props.type];
});

// 分割线渐变类
const dividerGradientClass = computed(() => {
  const gradientMap = {
    default: 'bg-gradient-to-r from-slate-400 to-transparent',
    primary: 'bg-gradient-to-r from-blue-400 to-transparent',
    success: 'bg-gradient-to-r from-emerald-400 to-transparent',
    warning: 'bg-gradient-to-r from-amber-400 to-transparent',
    danger: 'bg-gradient-to-r from-red-400 to-transparent',
    info: 'bg-gradient-to-r from-gray-400 to-transparent',
  };
  return gradientMap[props.type];
});

// 装饰元素渐变类
const decorationGradientClass = computed(() => {
  const gradientMap = {
    default: 'bg-gradient-to-r from-slate-400 to-slate-300',
    primary: 'bg-gradient-to-r from-blue-500 to-blue-400',
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    warning: 'bg-gradient-to-r from-amber-500 to-amber-400',
    danger: 'bg-gradient-to-r from-red-500 to-red-400',
    info: 'bg-gradient-to-r from-gray-500 to-gray-400',
  };
  return gradientMap[props.type];
});

// 装饰元素位置类
const decorationPositionClass = computed(() => {
  const positionMap = {
    left: 'left-4',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-4',
  };
  return positionMap[props.align];
});

// 计算包装器样式
const wrapperStyle = computed(() => {
  return {
    ...props.customStyle,
  };
});

// 处理点击事件
const handleClick = (event) => {
  if (props.clickable) {
    emit("click", event);
  }
};
</script>