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
          <view class="feature-icon">
            <C_Icon
              :name="item.icon"
              :size="24"
              color="var(--r-color-primary)"
            />
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
        <text class="copyright">CHENY · Robot UniApp</text>
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
  import { useAboutPage } from './data'

  const { version, features, infoList, techStack, handleFeedback } =
    useAboutPage()
</script>

<style lang="scss" scoped src="./index.scss"></style>
