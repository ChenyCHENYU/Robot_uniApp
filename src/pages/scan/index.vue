<!-- @Description: 扫码工具与跨平台能力提示 -->
<template>
  <view
    class="scan-page"
    :class="themeClass"
  >
    <wd-config-provider
      :theme="wotTheme"
      custom-style="height: 100%;"
    >
      <view class="scan-view">
        <view class="scan-nav">
          <button
            class="nav-btn"
            @click="goBack"
            ><C_Icon
              name="i-mdi-chevron-left"
              :size="26"
              color="#fff"
          /></button>
          <text class="nav-title">扫一扫</text>
          <view class="nav-spacer"></view>
        </view>
        <view class="scan-area">
          <text class="scan-eyebrow">SCAN & CONNECT</text>
          <text class="scan-title">连接每一份信息</text>
          <view
            class="scan-frame"
            :class="{ unavailable: !supported }"
          >
            <C_Icon
              name="i-mdi-qrcode-scan"
              :size="104"
              color="#b4c8ff"
            />
            <view class="corner corner-tl"></view
            ><view class="corner corner-tr"></view
            ><view class="corner corner-bl"></view
            ><view class="corner corner-br"></view>
          </view>
          <text class="scan-tip">{{ scanTip }}</text>
          <button
            class="start-btn"
            role="button"
            :disabled="!supported || scanning"
            :aria-disabled="!supported || scanning"
            @click="startScan"
            >{{
              scanning
                ? '正在识别…'
                : supported
                  ? '开始扫码'
                  : '当前环境暂不支持扫码'
            }}</button
          >
          <button
            v-if="albumSupported"
            class="album-btn"
            role="button"
            :disabled="!supported || scanning"
            :aria-disabled="!supported || scanning"
            @click="handleAlbum"
            ><C_Icon
              name="i-mdi-image-outline"
              :size="20"
              color="#c5d2ef"
            /><text>从相册识别</text></button
          >
        </view>
        <view class="scan-footer"
          ><C_Icon
            name="i-mdi-shield-check-outline"
            :size="16"
            color="#8294bb"
          /><text>打开扫描链接前，请确认来源可信</text></view
        >
      </view>
      <view
        v-if="scanResult"
        class="result-overlay"
        @click="scanResult = ''"
      >
        <view
          class="result-card"
          @click.stop
        >
          <view class="result-header"
            ><view class="result-icon"
              ><C_Icon
                name="i-mdi-check"
                :size="30"
                color="var(--r-color-success)" /></view
            ><text class="result-title">识别成功</text
            ><text class="result-caption">{{
              isLink ? '链接已识别' : '文本内容已识别'
            }}</text></view
          >
          <view class="result-content"
            ><text class="result-label">扫描内容</text
            ><text
              class="result-text"
              selectable
              >{{ scanResult }}</text
            ></view
          >
          <view class="result-actions"
            ><button
              class="result-btn secondary"
              @click="handleCopy"
              >复制内容</button
            ><button
              class="result-btn primary"
              @click="handleOpen"
              >{{ isLink ? '打开链接' : '复制并使用' }}</button
            ></view
          >
          <button
            class="close-result"
            @click="scanResult = ''"
            >完成</button
          >
        </view>
      </view>
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
  import { useScanPage } from './data'
  const {
    themeClass,
    wotTheme,
    scanResult,
    scanning,
    supported,
    albumSupported,
    scanTip,
    goBack,
    startScan,
    handleAlbum,
    handleCopy,
    isLink,
    handleOpen,
  } = useScanPage()
</script>
<style lang="scss" scoped src="./index.scss"></style>
