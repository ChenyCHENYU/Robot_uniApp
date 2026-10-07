<!--
 * @Description: WebView页面 - 内嵌网页浏览器（带域名白名单校验）
-->
<template>
  <view
    class="webview-page"
    :class="themeClass"
  >
    <wd-config-provider :theme="wotTheme">
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
        </view>
        <view class="nav-title-wrap">
          <text class="nav-title">{{ pageTitle || host || '网页浏览' }}</text>
          <view
            v-if="loading"
            class="loading-indicator"
          >
            <wd-loading
              :size="12"
              color="var(--r-color-primary)"
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

      <!-- 进度条（真实加载态，@load 后隐藏；5s 兜底超时） -->
      <view
        v-if="loading"
        class="progress-bar"
      >
        <view class="progress-fill"></view>
      </view>

      <!-- WebView（仅加载白名单内地址） -->
      <web-view
        v-if="url"
        :src="url"
        @load="onLoadComplete"
        @error="onLoadError"
        @message="onMessage"
      ></web-view>
    </wd-config-provider>
  </view>
</template>

<script setup lang="ts">
  import { useTheme } from '@/composables/useTheme'

  const { themeClass, wotTheme } = useTheme()
  import { ref, computed, onUnmounted } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import { isUrlAllowed } from '@/utils/url-policy'

  const url = ref('')
  const pageTitle = ref('')
  const loading = ref(false)
  /** 兜底超时：部分平台不触发 @load，5s 后强制结束加载态 */
  let fallbackTimer: ReturnType<typeof setTimeout> | null = null

  /** 当前页面的域名（标题缺省时展示） */
  const host = computed(() => {
    if (!url.value) return ''
    try {
      return url.value.split('/')[2] || ''
    } catch {
      return ''
    }
  })

  const startLoading = () => {
    loading.value = true
    if (fallbackTimer) clearTimeout(fallbackTimer)
    fallbackTimer = setTimeout(() => {
      loading.value = false
    }, 5000)
  }

  onLoad(query => {
    if (query?.url) {
      const target = decodeURIComponent(query.url)
      // 安全校验：强制 https + 域名白名单
      if (!isUrlAllowed(target)) {
        uni.showToast({ title: '不允许打开该链接', icon: 'none' })
        setTimeout(
          () =>
            uni.navigateBack({
              fail: () => uni.reLaunch({ url: '/pages/index/index' }),
            }),
          600
        )
        return
      }
      url.value = target
      startLoading()
    }
    if (query?.title) {
      pageTitle.value = decodeURIComponent(query.title)
    }
  })

  const onLoadComplete = () => {
    if (fallbackTimer) {
      clearTimeout(fallbackTimer)
      fallbackTimer = null
    }
    loading.value = false
  }

  const onLoadError = () => {
    onLoadComplete()
    uni.showToast({ title: '页面加载失败', icon: 'none' })
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
    const pages = getCurrentPages()
    if (pages.length > 1) {
      uni.navigateBack()
    } else {
      uni.reLaunch({ url: '/pages/index/index' })
    }
  }

  const handleRefresh = () => {
    // 通过重新设置 src 触发刷新
    const currentUrl = url.value
    url.value = ''
    setTimeout(() => {
      url.value = currentUrl
      startLoading()
    }, 100)
  }

  const handleMore = () => {
    uni.showActionSheet({
      itemList: ['复制链接', '在浏览器中打开'],
      success: res => {
        if (res.tapIndex === 0) {
          uni.setClipboardData({ data: url.value })
        } else if (res.tapIndex === 1) {
          // url 已通过白名单校验
          // #ifdef H5
          window.open(url.value, '_blank', 'noopener')
          // #endif
          // #ifndef H5
          uni.showToast({ title: '请复制链接后使用浏览器打开', icon: 'none' })
          // #endif
        }
      },
    })
  }

  onUnmounted(() => {
    if (fallbackTimer) {
      clearTimeout(fallbackTimer)
      fallbackTimer = null
    }
  })
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
    padding-top: var(--status-bar-height, 0px);
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
    overflow: hidden;

    .progress-fill {
      height: 100%;
      width: 40%;
      background: linear-gradient(
        90deg,
        var(--r-color-primary),
        var(--r-color-primary-dark)
      );
      animation: webview-loading 1.2s ease-in-out infinite;
    }
  }

  @keyframes webview-loading {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(350%);
    }
  }
</style>
