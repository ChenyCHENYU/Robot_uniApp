<!--
 * @Description: 扫码页面 - 二维码/条形码扫描
-->
<template>
  <view class="scan-page">
    <!-- 扫描视图 -->
    <view class="scan-view">
      <!-- 顶部导航 -->
      <view class="scan-nav">
        <view
          class="nav-btn"
          @click="goBack"
        >
          <wd-icon
            name="arrow-left"
            size="22px"
            color="#fff"
          />
        </view>
        <text class="nav-title">扫一扫</text>
        <view
          class="nav-btn"
          @click="toggleFlash"
        >
          <wd-icon
            :name="flashOn ? 'fill-camera' : 'camera'"
            size="22px"
            color="#fff"
          />
        </view>
      </view>

      <!-- 扫描区域 -->
      <view class="scan-area">
        <view class="scan-frame">
          <view class="corner corner-tl"></view>
          <view class="corner corner-tr"></view>
          <view class="corner corner-bl"></view>
          <view class="corner corner-br"></view>
          <view class="scan-line"></view>
        </view>
        <text class="scan-tip">将二维码/条形码放入框内，即可自动扫描</text>
      </view>

      <!-- 底部操作 -->
      <view class="scan-actions">
        <view
          class="action-item"
          @click="handleAlbum"
        >
          <view class="action-icon">
            <wd-icon
              name="picture"
              size="24px"
              color="#fff"
            />
          </view>
          <text class="action-text">相册</text>
        </view>
        <view
          class="action-item"
          @click="handleMyCode"
        >
          <view class="action-icon">
            <wd-icon
              name="qrcode"
              size="24px"
              color="#fff"
            />
          </view>
          <text class="action-text">我的码</text>
        </view>
      </view>
    </view>

    <!-- 扫描结果弹出 -->
    <view
      v-if="scanResult"
      class="result-overlay"
      @click="scanResult = ''"
    >
      <view
        class="result-card"
        @click.stop
      >
        <view class="result-header">
          <wd-icon
            name="check-circle"
            size="48px"
            color="#43e97b"
          />
          <text class="result-title">扫描成功</text>
        </view>
        <view class="result-content">
          <text class="result-label">扫描内容</text>
          <text class="result-text">{{ scanResult }}</text>
        </view>
        <view class="result-actions">
          <view
            class="result-btn secondary"
            @click="handleCopy"
          >
            <text class="btn-text">复制</text>
          </view>
          <view
            class="result-btn primary"
            @click="handleOpen"
          >
            <text class="btn-text white">打开</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const flashOn = ref(false)
  const scanResult = ref('')

  const goBack = () => uni.navigateBack()

  const toggleFlash = () => {
    flashOn.value = !flashOn.value
    uni.showToast({
      title: flashOn.value ? '闪光灯已开' : '闪光灯已关',
      icon: 'none',
    })
  }

  const handleAlbum = () => {
    uni.chooseImage({
      count: 1,
      sourceType: ['album'],
      success: () => {
        // 模拟从相册识别二维码
        scanResult.value = 'https://github.com/ChenyCHENYU/Robot_uniApp'
      },
    })
  }

  const handleMyCode = () => {
    uni.showToast({ title: '我的二维码', icon: 'none' })
  }

  // H5环境模拟扫码 — 实际运行依赖 uni.scanCode
  // #ifdef APP-PLUS || MP
  const startScan = () => {
    uni.scanCode({
      success: res => {
        scanResult.value = res.result
      },
      fail: () => {
        uni.showToast({ title: '扫码取消', icon: 'none' })
      },
    })
  }
  startScan()
  // #endif

  // #ifdef H5
  // H5下通过模拟按钮触发
  setTimeout(() => {
    scanResult.value = 'https://github.com/ChenyCHENYU/Robot_uniApp'
  }, 3000)
  // #endif

  const handleCopy = () => {
    uni.setClipboardData({
      data: scanResult.value,
      success: () => uni.showToast({ title: '已复制', icon: 'success' }),
    })
  }

  const handleOpen = () => {
    if (scanResult.value.startsWith('http')) {
      uni.navigateTo({
        url: `/pages/webview/index?url=${encodeURIComponent(scanResult.value)}`,
      })
    } else {
      uni.showToast({ title: scanResult.value, icon: 'none' })
    }
  }
</script>

<style lang="scss" scoped>
  .scan-page {
    min-height: 100vh;
    background: #000;
    position: relative;
  }

  .scan-view {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .scan-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24rpx;
    padding-top: calc(var(--status-bar-height, 44px) + 10rpx);
    height: calc(var(--status-bar-height, 44px) + 88rpx);

    .nav-btn {
      width: 72rpx;
      height: 72rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #fff;
    }
  }

  .scan-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .scan-frame {
      width: 480rpx;
      height: 480rpx;
      position: relative;

      .corner {
        position: absolute;
        width: 40rpx;
        height: 40rpx;

        &::before,
        &::after {
          content: '';
          position: absolute;
          background: #667eea;
        }

        &-tl {
          top: 0;
          left: 0;
          &::before {
            width: 40rpx;
            height: 6rpx;
            top: 0;
            left: 0;
          }
          &::after {
            width: 6rpx;
            height: 40rpx;
            top: 0;
            left: 0;
          }
        }
        &-tr {
          top: 0;
          right: 0;
          &::before {
            width: 40rpx;
            height: 6rpx;
            top: 0;
            right: 0;
          }
          &::after {
            width: 6rpx;
            height: 40rpx;
            top: 0;
            right: 0;
          }
        }
        &-bl {
          bottom: 0;
          left: 0;
          &::before {
            width: 40rpx;
            height: 6rpx;
            bottom: 0;
            left: 0;
          }
          &::after {
            width: 6rpx;
            height: 40rpx;
            bottom: 0;
            left: 0;
          }
        }
        &-br {
          bottom: 0;
          right: 0;
          &::before {
            width: 40rpx;
            height: 6rpx;
            bottom: 0;
            right: 0;
          }
          &::after {
            width: 6rpx;
            height: 40rpx;
            bottom: 0;
            right: 0;
          }
        }
      }

      .scan-line {
        position: absolute;
        top: 0;
        left: 10rpx;
        right: 10rpx;
        height: 4rpx;
        background: linear-gradient(90deg, transparent, #667eea, transparent);
        animation: scanMove 2s linear infinite;
      }
    }

    .scan-tip {
      margin-top: 40rpx;
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  @keyframes scanMove {
    0% {
      top: 0;
    }
    100% {
      top: 100%;
    }
  }

  .scan-actions {
    display: flex;
    justify-content: center;
    gap: 120rpx;
    padding: 48rpx 0;
    padding-bottom: calc(env(safe-area-inset-bottom) + 48rpx);

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;

      .action-icon {
        width: 88rpx;
        height: 88rpx;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .action-text {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  .result-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 48rpx;

    .result-card {
      width: 100%;
      background: var(--r-bg-card, #fff);
      border-radius: 28rpx;
      padding: 48rpx;
    }

    .result-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;
      margin-bottom: 32rpx;

      .result-title {
        font-size: 36rpx;
        font-weight: 700;
        color: var(--r-text-primary, #333);
      }
    }

    .result-content {
      margin-bottom: 32rpx;

      .result-label {
        display: block;
        font-size: 24rpx;
        color: var(--r-text-secondary, #999);
        margin-bottom: 8rpx;
      }

      .result-text {
        display: block;
        font-size: 28rpx;
        color: var(--r-text-primary, #333);
        word-break: break-all;
        padding: 20rpx;
        background: var(--r-bg-page, #f5f5f5);
        border-radius: 12rpx;
      }
    }

    .result-actions {
      display: flex;
      gap: 20rpx;

      .result-btn {
        flex: 1;
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 16rpx;

        &.secondary {
          background: rgba(102, 126, 234, 0.1);
        }
        &.primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .btn-text {
          font-size: 28rpx;
          font-weight: 600;
          color: #667eea;

          &.white {
            color: #fff;
          }
        }
      }
    }
  }
</style>
