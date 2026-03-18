<!--
 * @Description: 引导页 - 新手引导流程
-->
<template>
  <view class="guide-page">
    <Swiper
      class="guide-swiper"
      :current="current"
      :indicator-dots="false"
      :circular="false"
      @change="onSwiperChange"
    >
      <SwiperItem
        v-for="(item, index) in steps"
        :key="index"
      >
        <view class="guide-slide">
          <view class="slide-illustration">
            <view
              class="illust-circle"
              :style="{ background: item.gradient }"
            >
              <text class="illust-icon">{{ item.icon }}</text>
            </view>
            <view class="illust-decoration">
              <view
                class="deco-ring ring-1"
                :style="{ borderColor: item.ringColor }"
              ></view>
              <view
                class="deco-ring ring-2"
                :style="{ borderColor: item.ringColor }"
              ></view>
            </view>
          </view>
          <view class="slide-content">
            <text class="slide-title">{{ item.title }}</text>
            <text class="slide-desc">{{ item.desc }}</text>
          </view>
        </view>
      </SwiperItem>
    </Swiper>

    <!-- 指示器 -->
    <view class="indicator-bar">
      <view
        v-for="(_, index) in steps"
        :key="index"
        class="indicator-dot"
        :class="{ active: current === index }"
      ></view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-actions">
      <view
        v-if="current < steps.length - 1"
        class="actions-row"
      >
        <text
          class="skip-btn"
          @click="handleSkip"
          >跳过</text
        >
        <view
          class="next-btn"
          @click="handleNext"
        >
          <text class="next-text">下一步</text>
          <wd-icon
            name="arrow-right"
            size="16px"
            color="#fff"
          />
        </view>
      </view>
      <view
        v-else
        class="actions-row center"
      >
        <view
          class="start-btn"
          @click="handleStart"
        >
          <text class="start-text">开始使用</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const current = ref(0)

  interface GuideStep {
    icon: string
    title: string
    desc: string
    gradient: string
    ringColor: string
  }

  const steps = ref<GuideStep[]>([
    {
      icon: '🚀',
      title: '跨平台开发',
      desc: '一套代码，同时运行在 H5、小程序、App 多个平台，大幅降低开发成本',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      ringColor: 'rgba(102, 126, 234, 0.3)',
    },
    {
      icon: '🧩',
      title: '丰富组件',
      desc: '内置33+高质量UI组件，覆盖表单、列表、导航等常见场景，开箱即用',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      ringColor: 'rgba(240, 147, 251, 0.3)',
    },
    {
      icon: '⚡',
      title: '极致性能',
      desc: '虚拟滚动、图片懒加载、骨架屏预渲染，为用户带来流畅的使用体验',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      ringColor: 'rgba(79, 172, 254, 0.3)',
    },
    {
      icon: '🛡️',
      title: '企业级架构',
      desc: '完善的权限管理、状态管理、请求拦截，满足企业级应用开发需求',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      ringColor: 'rgba(67, 233, 123, 0.3)',
    },
  ])

  const onSwiperChange = (e: { detail: { current: number } }) => {
    current.value = e.detail.current
  }

  const handleNext = () => {
    if (current.value < steps.value.length - 1) {
      current.value++
    }
  }

  const handleSkip = () => {
    finishGuide()
  }

  const handleStart = () => {
    finishGuide()
  }

  const finishGuide = () => {
    uni.setStorageSync('guide_completed', true)
    uni.reLaunch({ url: '/pages/login/index' })
  }
</script>

<style lang="scss" scoped>
  .guide-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #f8faff 0%, #eef2ff 100%);
    position: relative;
  }

  .guide-swiper {
    height: 75vh;
  }

  .guide-slide {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 60rpx;
  }

  .slide-illustration {
    position: relative;
    margin-bottom: 80rpx;

    .illust-circle {
      width: 280rpx;
      height: 280rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 20rpx 60rpx rgba(102, 126, 234, 0.25);
    }

    .illust-icon {
      font-size: 100rpx;
    }

    .illust-decoration {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .deco-ring {
        position: absolute;
        border-radius: 50%;
        border: 2rpx solid;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        &.ring-1 {
          width: 360rpx;
          height: 360rpx;
          opacity: 0.5;
        }

        &.ring-2 {
          width: 440rpx;
          height: 440rpx;
          opacity: 0.25;
        }
      }
    }
  }

  .slide-content {
    text-align: center;

    .slide-title {
      display: block;
      font-size: 44rpx;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 20rpx;
    }

    .slide-desc {
      display: block;
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
    }
  }

  .indicator-bar {
    display: flex;
    justify-content: center;
    gap: 16rpx;

    .indicator-dot {
      width: 16rpx;
      height: 16rpx;
      border-radius: 8rpx;
      background: #ddd;
      transition: all 0.3s;

      &.active {
        width: 48rpx;
        background: linear-gradient(135deg, #667eea, #764ba2);
      }
    }
  }

  .bottom-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 40rpx 48rpx;
    padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);

    .actions-row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &.center {
        justify-content: center;
      }
    }

    .skip-btn {
      font-size: 28rpx;
      color: #999;
      padding: 16rpx 24rpx;
    }

    .next-btn {
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 20rpx 48rpx;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 48rpx;

      .next-text {
        font-size: 28rpx;
        color: #fff;
        font-weight: 600;
      }
    }

    .start-btn {
      width: 100%;
      height: 96rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 48rpx;

      .start-text {
        font-size: 32rpx;
        color: #fff;
        font-weight: 600;
      }
    }
  }
</style>
