<template>
  <view
    class="c-title-wrapper"
    :class="[
      `c-title-${type}`,
      `c-title-align-${align}`,
      `c-title-size-${size}`,
      { 'c-title-clickable': clickable },
    ]"
    :style="wrapperStyle"
    @click="handleClick"
  >
    <!-- 顶部分割线 -->
    <view
      v-if="showDivider && dividerPosition === 'top'"
      class="c-title-divider c-title-divider-top"
      :class="`c-title-divider-${type}`"
    ></view>

    <!-- 主体内容 -->
    <view class="c-title-content">
      <!-- 左侧图标 -->
      <view v-if="leftIcon" class="c-title-icon c-title-icon-left">
        <C_Icon
          :name="leftIcon"
          :type="iconType"
          :size="iconSize"
          :color="iconColor"
        />
      </view>

      <!-- 文字内容区 -->
      <view class="c-title-text-area">
        <!-- 主标题 -->
        <view
          class="c-title-main"
          :class="[`c-title-level-${level}`, { 'c-title-bold': bold }]"
        >
          {{ title }}
        </view>

        <!-- 副标题 -->
        <view
          v-if="subtitle"
          class="c-title-subtitle"
          :class="`c-title-subtitle-${type}`"
        >
          {{ subtitle }}
        </view>
      </view>

      <!-- 右侧图标 -->
      <view v-if="rightIcon" class="c-title-icon c-title-icon-right">
        <C_Icon
          :name="rightIcon"
          :type="iconType"
          :size="iconSize"
          :color="iconColor"
        />
      </view>
    </view>

    <!-- 底部分割线 -->
    <view
      v-if="showDivider && dividerPosition === 'bottom'"
      class="c-title-divider c-title-divider-bottom"
      :class="`c-title-divider-${type}`"
    ></view>

    <!-- 装饰元素 -->
    <view
      v-if="showDecoration"
      class="c-title-decoration"
      :class="`c-title-decoration-${type}`"
    ></view>
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
    medium: 20,
    large: 24,
  };
  return sizeMap[props.size];
});

// 计算图标颜色
const iconColor = computed(() => {
  const colorMap = {
    default: "#606266",
    primary: "#409eff",
    success: "#67c23a",
    warning: "#e6a23c",
    danger: "#f56c6c",
    info: "#909399",
  };
  return colorMap[props.type];
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

<style lang="scss" scoped>
.c-title-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;

  &.c-title-clickable {
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// 对齐方式
.c-title-align-left {
  text-align: left;
  align-items: flex-start;
}

.c-title-align-center {
  text-align: center;
  align-items: center;
}

.c-title-align-right {
  text-align: right;
  align-items: flex-end;
}

// 主体内容
.c-title-content {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.c-title-text-area {
  flex: 1;
  min-width: 0;
}

// 图标样式
.c-title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.c-title-icon-left {
  margin-top: 2px;
}

.c-title-icon-right {
  margin-top: 2px;
}

// 主标题样式
.c-title-main {
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
  word-break: break-word;

  &.c-title-bold {
    font-weight: 600;
  }
}

// 标题级别样式
.c-title-level-1 {
  font-size: 28px;
}

.c-title-level-2 {
  font-size: 24px;
}

.c-title-level-3 {
  font-size: 20px;
}

.c-title-level-4 {
  font-size: 18px;
}

.c-title-level-5 {
  font-size: 16px;
}

.c-title-level-6 {
  font-size: 14px;
}

// 尺寸调整
.c-title-size-small {
  .c-title-level-1 {
    font-size: 24px;
  }
  .c-title-level-2 {
    font-size: 20px;
  }
  .c-title-level-3 {
    font-size: 18px;
  }
  .c-title-level-4 {
    font-size: 16px;
  }
  .c-title-level-5 {
    font-size: 14px;
  }
  .c-title-level-6 {
    font-size: 12px;
  }
}

.c-title-size-large {
  .c-title-level-1 {
    font-size: 32px;
  }
  .c-title-level-2 {
    font-size: 28px;
  }
  .c-title-level-3 {
    font-size: 24px;
  }
  .c-title-level-4 {
    font-size: 20px;
  }
  .c-title-level-5 {
    font-size: 18px;
  }
  .c-title-level-6 {
    font-size: 16px;
  }
}

// 副标题样式
.c-title-subtitle {
  font-size: 14px;
  line-height: 1.5;
  margin-top: 4px;
  opacity: 0.8;
}

// 主题颜色
.c-title-default {
  .c-title-main {
    color: #2c3e50;
  }

  .c-title-subtitle-default {
    color: #606266;
  }
}

.c-title-primary {
  .c-title-main {
    color: #409eff;
  }

  .c-title-subtitle-primary {
    color: #409eff;
  }
}

.c-title-success {
  .c-title-main {
    color: #67c23a;
  }

  .c-title-subtitle-success {
    color: #67c23a;
  }
}

.c-title-warning {
  .c-title-main {
    color: #e6a23c;
  }

  .c-title-subtitle-warning {
    color: #e6a23c;
  }
}

.c-title-danger {
  .c-title-main {
    color: #f56c6c;
  }

  .c-title-subtitle-danger {
    color: #f56c6c;
  }
}

.c-title-info {
  .c-title-main {
    color: #909399;
  }

  .c-title-subtitle-info {
    color: #909399;
  }
}

// 分割线样式
.c-title-divider {
  height: 2px;
  border-radius: 1px;
  margin: 8px 0;

  &.c-title-divider-top {
    margin-bottom: 12px;
  }

  &.c-title-divider-bottom {
    margin-top: 12px;
  }
}

.c-title-divider-default {
  background: linear-gradient(90deg, #ddd 0%, transparent 100%);
}

.c-title-divider-primary {
  background: linear-gradient(90deg, #409eff 0%, transparent 100%);
}

.c-title-divider-success {
  background: linear-gradient(90deg, #67c23a 0%, transparent 100%);
}

.c-title-divider-warning {
  background: linear-gradient(90deg, #e6a23c 0%, transparent 100%);
}

.c-title-divider-danger {
  background: linear-gradient(90deg, #f56c6c 0%, transparent 100%);
}

.c-title-divider-info {
  background: linear-gradient(90deg, #909399 0%, transparent 100%);
}

// 装饰元素
.c-title-decoration {
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 3px;
  width: 40px;
  border-radius: 2px;

  .c-title-align-center & {
    left: 50%;
    transform: translateX(-50%);
  }

  .c-title-align-right & {
    right: 0;
    left: auto;
  }
}

.c-title-decoration-default {
  background: #ddd;
}

.c-title-decoration-primary {
  background: linear-gradient(90deg, #409eff, #66b1ff);
}

.c-title-decoration-success {
  background: linear-gradient(90deg, #67c23a, #85ce61);
}

.c-title-decoration-warning {
  background: linear-gradient(90deg, #e6a23c, #ebb563);
}

.c-title-decoration-danger {
  background: linear-gradient(90deg, #f56c6c, #f78989);
}

.c-title-decoration-info {
  background: linear-gradient(90deg, #909399, #a6a9ad);
}

// 响应式设计
@media (max-width: 768px) {
  .c-title-size-large {
    .c-title-level-1 {
      font-size: 28px;
    }
    .c-title-level-2 {
      font-size: 24px;
    }
    .c-title-level-3 {
      font-size: 20px;
    }
    .c-title-level-4 {
      font-size: 18px;
    }
    .c-title-level-5 {
      font-size: 16px;
    }
    .c-title-level-6 {
      font-size: 14px;
    }
  }

  .c-title-content {
    gap: 6px;
  }
}
</style>
