<template>
  <view class="c-tabbar" :class="{ 'is-fixed': fixed }">
    <!-- 玻璃风背景 -->
    <view class="tabbar-backdrop">
      <view class="glass-bg"></view>
      <view class="border-line"></view>
    </view>

    <!-- 内容区域 -->
    <view
      class="tabbar-container"
      :style="{ paddingBottom: safeAreaBottom + 'px' }"
    >
      <view
        class="tab-item"
        v-for="(item, index) in tabList"
        :key="item.id"
        :class="{ 'is-active': currentIndex === index }"
        @click="handleTabClick(item, index)"
      >
        <!-- 激活状态背景 -->
        <view class="active-indicator" v-show="currentIndex === index">
          <view class="glow-bg"></view>
        </view>

        <!-- 图标区域 -->
        <view class="icon-wrapper">
          <view
            class="icon-bg"
            :class="{ 'is-active': currentIndex === index }"
          >
            <u-icon
              :name="currentIndex === index ? item.activeIcon : item.icon"
              :size="currentIndex === index ? 28 : 24"
              :color="currentIndex === index ? '#ffffff' : inactiveColor"
            />
          </view>

          <!-- 角标 -->
          <u-badge
            v-if="item.badge > 0"
            :value="item.badge"
            :max="99"
            absolute
            offset="8,-8"
            bgColor="#FF3B30"
            color="#ffffff"
            size="mini"
          />
        </view>

        <!-- 文字标签 -->
        <text
          class="tab-label"
          :class="{ 'is-active': currentIndex === index }"
        >
          {{ item.text }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAppStore } from "@/stores/modules/app";

// Props
const props = defineProps({
  // 当前激活的索引
  modelValue: {
    type: Number,
    default: 0,
  },
  // 标签列表
  tabList: {
    type: Array,
    default: () => [
      {
        id: "home",
        text: "首页",
        icon: "home",
        activeIcon: "home-fill",
        path: "/pages/index/index",
        badge: 0,
      },
      {
        id: "chat",
        text: "AI对话",
        icon: "chat",
        activeIcon: "chat-fill",
        path: "/pages/chat/index",
        badge: 0,
      },
      {
        id: "robot",
        text: "机器人",
        icon: "robot",
        activeIcon: "robot",
        path: "/pages/robot/index",
        badge: 0,
      },
      {
        id: "profile",
        text: "我的",
        icon: "account",
        activeIcon: "account-fill",
        path: "/pages/profile/index",
        badge: 0,
      },
    ],
  },
  // 激活颜色
  activeColor: {
    type: String,
    default: "#00D4FF",
  },
  // 非激活颜色
  inactiveColor: {
    type: String,
    default: "#8E8E93",
  },
  // 是否固定在底部
  fixed: {
    type: Boolean,
    default: true,
  },
});

// Emits
const emit = defineEmits(["update:modelValue", "change", "tabClick"]);

// Store
const appStore = useAppStore();

// 计算属性
const currentIndex = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const safeAreaBottom = computed(() => appStore.safeArea.bottom || 0);

// 方法
const handleTabClick = (item, index) => {
  if (currentIndex.value === index) return;

  currentIndex.value = index;
  emit("change", { item, index });
  emit("tabClick", { item, index });

  // 如果有路径，则进行页面跳转
  if (item.path) {
    uni.navigateTo({
      url: item.path,
    });
  }
};

// 暴露方法给父组件
defineExpose({
  setBadge: (tabId, count) => {
    const tab = props.tabList.find((item) => item.id === tabId);
    if (tab) {
      tab.badge = count;
    }
  },
  setCurrentIndex: (index) => {
    currentIndex.value = index;
  },
});
</script>

<style lang="scss" scoped>
.c-tabbar {
  position: relative;
  z-index: 1000;

  &.is-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

.tabbar-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.glass-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(40rpx);
  border-top: 1rpx solid rgba(255, 255, 255, 0.3);
}

.border-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2rpx;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 212, 255, 0.4) 20%,
    rgba(0, 212, 255, 0.8) 50%,
    rgba(0, 212, 255, 0.4) 80%,
    transparent 100%
  );
}

.tabbar-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16rpx 20rpx 20rpx;
  min-height: 120rpx;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 16rpx 8rpx;
  transition: all 0.3s ease;

  &.is-active {
    transform: translateY(-6rpx);
  }
}

.active-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120rpx;
  height: 120rpx;
  pointer-events: none;
}

.glow-bg {
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    rgba(0, 212, 255, 0.15) 0%,
    rgba(0, 212, 255, 0.08) 50%,
    transparent 100%
  );
  border-radius: 50%;
  animation: pulse-glow 2s ease-in-out infinite;
}

.icon-wrapper {
  position: relative;
  margin-bottom: 8rpx;
  z-index: 2;
}

.icon-bg {
  width: 80rpx;
  height: 80rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  border: 1rpx solid rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;

  &.is-active {
    background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
    border-color: rgba(0, 212, 255, 0.3);
    box-shadow: 0 8rpx 32rpx rgba(0, 212, 255, 0.3);
    transform: scale(1.1);
  }
}

.tab-label {
  font-size: 22rpx;
  color: #8e8e93;
  font-weight: 500;
  transition: all 0.3s ease;
  text-align: center;
  z-index: 2;

  &.is-active {
    color: #00d4ff;
    font-weight: 600;
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}
</style>
