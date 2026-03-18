<!--
 * @Description: 关于页面 - 应用信息展示
-->
<template>
  <C_Layout>
    <view class="about-page">
      <!-- 应用标识 -->
      <view class="app-header">
        <view class="app-logo">
          <view class="logo-circle">
            <text class="logo-text">R</text>
          </view>
        </view>
        <text class="app-name">Robot UniApp</text>
        <text class="app-version">Version {{ version }}</text>
        <text class="app-slogan">企业级跨平台应用开发框架</text>
      </view>

      <!-- 功能特点 -->
      <view class="feature-list">
        <view
          v-for="item in features"
          :key="item.title"
          class="feature-item"
        >
          <view
            class="feature-icon"
            :style="{ background: item.iconBg }"
          >
            <text class="icon-text">{{ item.icon }}</text>
          </view>
          <view class="feature-content">
            <text class="feature-title">{{ item.title }}</text>
            <text class="feature-desc">{{ item.desc }}</text>
          </view>
        </view>
      </view>

      <!-- 信息列表 -->
      <view class="info-card">
        <view
          v-for="item in infoList"
          :key="item.label"
          class="info-item"
          @click="item.action?.()"
        >
          <text class="info-label">{{ item.label }}</text>
          <view class="info-right">
            <text class="info-value">{{ item.value }}</text>
            <wd-icon
              v-if="item.action"
              name="arrow-right"
              size="14px"
              color="#ccc"
            />
          </view>
        </view>
      </view>

      <!-- 技术栈 -->
      <view class="tech-card">
        <text class="card-title">技术栈</text>
        <view class="tech-tags">
          <view
            v-for="tech in techStack"
            :key="tech"
            class="tech-tag"
          >
            <text class="tag-text">{{ tech }}</text>
          </view>
        </view>
      </view>

      <!-- 开源协议 -->
      <view class="license-card">
        <text class="card-title">开源协议</text>
        <text class="license-text"
          >本项目基于 MIT License 开源发布，你可以自由使用、修改和分发。</text
        >
      </view>

      <!-- 底部 -->
      <view class="footer">
        <text class="copyright">© 2025 CHENY.智启未来</text>
        <text
          class="footer-link"
          @click="handleFeedback"
          >意见反馈</text
        >
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const version = ref('1.0.0')

  const features = ref([
    {
      icon: '🚀',
      title: '跨平台',
      desc: 'H5、小程序、App 多端运行',
      iconBg: 'linear-gradient(135deg, #667eea, #764ba2)',
    },
    {
      icon: '🧩',
      title: '组件丰富',
      desc: '33+ 高质量 UI 组件',
      iconBg: 'linear-gradient(135deg, #f093fb, #f5576c)',
    },
    {
      icon: '⚡',
      title: '高性能',
      desc: '虚拟滚动、懒加载、骨架屏',
      iconBg: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    },
    {
      icon: '🛡️',
      title: '企业级',
      desc: '完善的权限、状态、请求管理',
      iconBg: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    },
  ])

  const infoList = ref([
    { label: '框架版本', value: 'UniApp 3.0' },
    { label: 'Vue 版本', value: 'Vue 3.5' },
    { label: '构建工具', value: 'Vite 5.x' },
    {
      label: '检查更新',
      value: '已是最新版',
      action: () => uni.showToast({ title: '已是最新版本', icon: 'none' }),
    },
    {
      label: '清除缓存',
      value: '',
      action: () => {
        uni.showModal({
          title: '确认清除',
          content: '将清除所有本地缓存数据',
          success: res => {
            if (res.confirm) {
              uni.clearStorageSync()
              uni.showToast({ title: '缓存已清除', icon: 'success' })
            }
          },
        })
      },
    },
  ])

  const techStack = [
    'Vue 3',
    'TypeScript',
    'UniApp',
    'Vite',
    'UnoCSS',
    'Pinia',
    'wot-design-uni',
    'Sass',
    'vue-i18n',
  ]

  const handleFeedback = () => {
    uni.showToast({ title: '意见反馈', icon: 'none' })
  }
</script>

<style lang="scss" scoped>
  .about-page {
    padding: 24rpx;
    background: var(--r-bg-page);
    min-height: 100vh;
  }

  .app-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48rpx 0 40rpx;

    .app-logo {
      margin-bottom: 20rpx;

      .logo-circle {
        width: 140rpx;
        height: 140rpx;
        border-radius: 36rpx;
        background: linear-gradient(135deg, #667eea, #764ba2);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 12rpx 40rpx rgba(102, 126, 234, 0.3);

        .logo-text {
          font-size: 60rpx;
          font-weight: 700;
          color: #fff;
        }
      }
    }

    .app-name {
      font-size: 36rpx;
      font-weight: 700;
      color: var(--r-text-primary);
    }

    .app-version {
      font-size: 24rpx;
      color: var(--r-text-secondary);
      margin-top: 4rpx;
    }

    .app-slogan {
      font-size: 24rpx;
      color: var(--r-text-placeholder);
      margin-top: 12rpx;
    }
  }

  .feature-list {
    margin-bottom: 24rpx;

    .feature-item {
      display: flex;
      align-items: center;
      gap: 20rpx;
      padding: 24rpx 28rpx;
      background: var(--r-bg-card);
      border-radius: 16rpx;
      margin-bottom: 12rpx;
      box-shadow: var(--r-shadow-sm);

      .feature-icon {
        width: 72rpx;
        height: 72rpx;
        border-radius: 18rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        .icon-text {
          font-size: 32rpx;
        }
      }

      .feature-content {
        flex: 1;

        .feature-title {
          display: block;
          font-size: 28rpx;
          font-weight: 600;
          color: var(--r-text-primary);
        }

        .feature-desc {
          font-size: 24rpx;
          color: var(--r-text-secondary);
        }
      }
    }
  }

  .info-card {
    background: var(--r-bg-card);
    border-radius: 20rpx;
    overflow: hidden;
    margin-bottom: 24rpx;
    box-shadow: var(--r-shadow-sm);

    .info-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 28rpx;
      border-bottom: 1rpx solid var(--r-border-light);

      &:last-child {
        border-bottom: none;
      }

      .info-label {
        font-size: 28rpx;
        color: var(--r-text-primary);
      }

      .info-right {
        display: flex;
        align-items: center;
        gap: 8rpx;

        .info-value {
          font-size: 26rpx;
          color: var(--r-text-secondary);
        }
      }
    }
  }

  .tech-card,
  .license-card {
    padding: 28rpx;
    background: var(--r-bg-card);
    border-radius: 20rpx;
    margin-bottom: 24rpx;
    box-shadow: var(--r-shadow-sm);

    .card-title {
      display: block;
      font-size: 30rpx;
      font-weight: 600;
      color: var(--r-text-primary);
      margin-bottom: 16rpx;
    }
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;

    .tech-tag {
      padding: 8rpx 24rpx;
      background: rgba(102, 126, 234, 0.08);
      border-radius: 24rpx;
      border: 1rpx solid rgba(102, 126, 234, 0.15);

      .tag-text {
        font-size: 24rpx;
        color: #667eea;
      }
    }
  }

  .license-text {
    font-size: 26rpx;
    color: var(--r-text-secondary);
    line-height: 1.7;
  }

  .footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 0 60rpx;
    gap: 12rpx;

    .copyright {
      font-size: 24rpx;
      color: var(--r-text-placeholder);
    }

    .footer-link {
      font-size: 24rpx;
      color: #667eea;
    }
  }
</style>
