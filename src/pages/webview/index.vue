<!--
 * @Description: WebView页面 - 内嵌网页浏览器
-->
<template>
  <view class="webview-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-left">
        <view
          class="nav-btn"
          @click="goBack"
        >
          <wd-icon
            name="arrow-left"
            size="20px"
            color="var(--r-text-primary)"
          />
        </view>
        <view
          v-if="canGoBack"
          class="nav-btn"
          @click="handleClose"
        >
          <wd-icon
            name="close"
            size="18px"
            color="var(--r-text-primary)"
          />
        </view>
      </view>
      <view class="nav-title-wrap">
        <text class="nav-title">{{ pageTitle || '网页浏览' }}</text>
        <view
          v-if="loading"
          class="loading-indicator"
        >
          <wd-loading
            :size="12"
            color="#667eea"
          />
        </view>
      </view>
      <view class="nav-right">
        <view
          class="nav-btn"
          @click="handleRefresh"
        >
          <wd-icon
            name="refresh"
            size="18px"
            color="var(--r-text-primary)"
          />
        </view>
        <view
          class="nav-btn"
          @click="handleMore"
        >
          <wd-icon
            name="more"
            size="18px"
            color="var(--r-text-primary)"
          />
        </view>
      </view>
    </view>

    <!-- 进度条 -->
    <view
      v-if="loading"
      class="progress-bar"
    >
      <view
        class="progress-fill"
        :style="{ width: progress + '%' }"
      ></view>
    </view>

    <!-- WebView -->
    <WebView
      :src="url"
      @message="onMessage"
    ></WebView>
  </view>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'

  const url = ref('')
  const pageTitle = ref('')
  const loading = ref(true)
  const progress = ref(30)
  const canGoBack = ref(false)

  onLoad(query => {
    if (query?.url) {
      url.value = decodeURIComponent(query.url)
    }
    if (query?.title) {
      pageTitle.value = decodeURIComponent(query.title)
    }
    // 模拟加载进度
    simulateProgress()
  })

  const simulateProgress = () => {
    const timer = setInterval(() => {
      if (progress.value < 90) {
        progress.value += Math.random() * 15
      }
    }, 300)
    setTimeout(() => {
      clearInterval(timer)
      progress.value = 100
      setTimeout(() => {
        loading.value = false
      }, 200)
    }, 2000)
  }

  const onMessage = (e: { detail: { data: unknown[] } }) => {
    const { data } = e.detail
    if (data && data.length > 0) {
      const msg = data[data.length - 1] as Record<string, string>
      if (msg.title) {
        pageTitle.value = msg.title
      }
    }
  }

  const goBack = () => {
    uni.navigateBack()
  }

  const handleClose = () => {
    uni.navigateBack()
  }

  const handleRefresh = () => {
    loading.value = true
    progress.value = 0
    // 通过重新设置url触发刷新
    const currentUrl = url.value
    url.value = ''
    setTimeout(() => {
      url.value = currentUrl
      simulateProgress()
    }, 100)
  }

  const handleMore = () => {
    uni.showActionSheet({
      itemList: ['复制链接', '在浏览器中打开', '分享'],
      success: res => {
        switch (res.tapIndex) {
          case 0:
            uni.setClipboardData({ data: url.value })
            break
          case 1:
            // #ifdef H5
            window.open(url.value)
            // #endif
            // #ifndef H5
            uni.showToast({ title: '请使用浏览器打开', icon: 'none' })
            // #endif
            break
          case 2:
            uni.showToast({ title: '分享功能', icon: 'none' })
            break
        }
      },
    })
  }
</script>

<style lang="scss" scoped>
  .webview-page {
    min-height: 100vh;
    background: var(--r-bg-page);
  }

  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16rpx;
    height: 88rpx;
    padding-top: var(--status-bar-height, 44px);
    background: var(--r-bg-card);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 10;

    .nav-left,
    .nav-right {
      display: flex;
      align-items: center;
      gap: 4rpx;
    }

    .nav-btn {
      width: 72rpx;
      height: 72rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-title-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8rpx;
      overflow: hidden;

      .nav-title {
        font-size: 30rpx;
        font-weight: 600;
        color: var(--r-text-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 400rpx;
      }
    }
  }

  .progress-bar {
    height: 4rpx;
    background: transparent;
    position: relative;
    z-index: 10;

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }
  }
</style>
