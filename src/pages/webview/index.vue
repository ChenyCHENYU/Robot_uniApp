<!--
 * @Description: WebView页面 - 内嵌网页浏览器（带域名白名单校验）
-->
<template>
  <view
    class="webview-page"
    :class="themeClass"
  >
    <wd-config-provider
      :theme="wotTheme"
      custom-style="height: 100%; display: flex; flex-direction: column;"
    >
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
            role="status"
            aria-label="正在加载网页"
          >
            <C_LoadingIndicator size="small" />
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

      <!-- 进度条由真实加载事件控制，部分平台以超时结束提示。 -->
      <view
        v-if="loading"
        class="progress-bar"
      >
        <view class="progress-fill"></view>
      </view>

      <view
        v-if="errorText"
        class="webview-error"
        ><C_Icon
          name="i-mdi-web-off"
          :size="52"
          color="var(--r-text-secondary)"
        /><text class="error-title">网页暂不可用</text
        ><text class="error-text">{{ errorText }}</text
        ><view class="error-actions"
          ><button
            v-if="url"
            class="retry-btn"
            @click="handleRefresh"
            >重新加载</button
          ><button
            class="back-btn"
            @click="goBack"
            >返回</button
          ></view
        ></view
      >
      <!-- WebView（仅加载白名单内地址） -->
      <web-view
        v-if="url && !errorText"
        :key="viewKey"
        :src="url"
        :fullscreen="false"
        class="webview-frame"
        style="width: 100%; height: 100%"
        @load="onLoadComplete"
        @error="onLoadError"
        @message="onMessage"
      ></web-view>
    </wd-config-provider>
    <!-- #ifndef H5 -->
    <C_NativeFeedbackHost />
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
  // #ifndef H5
  import C_NativeFeedbackHost from '@/components/global/C_NativeFeedbackHost/index.vue'
  // #endif
  import { useWebviewPage } from './data'
  import C_LoadingIndicator from '@/components/global/C_LoadingIndicator/index.vue'

  const {
    themeClass,
    wotTheme,
    url,
    pageTitle,
    loading,
    errorText,
    viewKey,
    host,
    onLoadComplete,
    onLoadError,
    onMessage,
    goBack,
    handleRefresh,
    handleMore,
  } = useWebviewPage()
</script>

<style lang="scss" scoped src="./index.scss"></style>
