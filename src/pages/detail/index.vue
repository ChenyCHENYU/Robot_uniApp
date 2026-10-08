<!--
 * @Description: 详情页模板 - 通用实体详情展示
-->
<template>
  <C_Layout
    title="记录详情"
    :refresher-enabled="true"
    :refresher-triggered="refreshing"
    @refresh="handleRefresh"
  >
    <view class="detail-page">
      <!-- 加载/空态 -->
      <view
        v-if="!detail"
        class="detail-loading"
      >
        <text class="loading-text">{{
          loading ? '正在加载记录…' : errorText
        }}</text
        ><button
          v-if="!loading"
          class="retry-btn"
          @click="loadDetail"
          >重新加载</button
        >
      </view>

      <template v-if="detail">
        <!-- 顶部封面 + 导航栏合一 -->
        <view class="detail-cover">
          <view class="cover-content">
            <view
              class="status-badge"
              :class="detail.status === 0 ? 'pending' : 'done'"
            >
              <text class="status-text">{{ statusText }}</text>
            </view>
            <text class="detail-title">{{ detail.title }}</text>
            <text class="detail-subtitle">工作记录</text>
          </view>
        </view>

        <!-- 基础信息卡片 -->
        <view class="info-card">
          <view class="card-title-row">
            <text class="card-title">基本信息</text>
          </view>
          <view class="info-grid">
            <view
              v-for="field in basicFields"
              :key="field.label"
              class="info-item"
            >
              <text class="info-label">{{ field.label }}</text>
              <text class="info-value">{{ field.value }}</text>
            </view>
          </view>
        </view>

        <!-- 描述内容 -->
        <view class="content-card">
          <view class="card-title-row">
            <text class="card-title">详细描述</text>
          </view>
          <text class="content-text">{{ detail.description }}</text>
        </view>

        <!-- 附件列表 -->
        <view class="attach-card">
          <view class="card-title-row">
            <text class="card-title">附件资料</text>
            <text class="card-extra">{{ attachments.length }} 个文件</text>
          </view>
          <text
            v-if="attachments.length === 0"
            class="section-empty"
            >该记录暂无附件</text
          ><view class="attach-list">
            <view
              v-for="file in attachments"
              :key="file.name"
              class="attach-item"
            >
              <view class="file-icon">
                <text class="file-type">{{ file.ext }}</text>
              </view>
              <view class="file-info">
                <text class="file-name">{{ file.name }}</text>
                <text class="file-size">{{ file.size }}</text>
              </view>
              <wd-icon
                name="download"
                size="18px"
                color="var(--r-color-primary)"
              />
            </view>
          </view>
        </view>

        <!-- 时间线 -->
        <view class="timeline-card">
          <view class="card-title-row">
            <text class="card-title">操作记录</text>
          </view>
          <view class="timeline-list">
            <view
              v-for="(log, index) in logs"
              :key="index"
              class="timeline-item"
            >
              <view
                class="timeline-dot"
                :class="{ first: index === 0 }"
              ></view>
              <view
                v-if="index < logs.length - 1"
                class="timeline-line"
              ></view>
              <view class="timeline-content">
                <text class="timeline-action">{{ log.action }}</text>
                <text class="timeline-user">{{ log.user }}</text>
                <text class="timeline-time">{{ log.time }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 底部操作 -->
        <view class="bottom-bar">
          <view
            class="bar-btn secondary"
            @click="handleShare"
          >
            <wd-icon
              name="share"
              size="18px"
              color="var(--r-color-primary)"
            />
            <text class="bar-btn-text">复制分享</text>
          </view>
          <view
            class="bar-btn primary"
            @click="handleEdit"
          >
            <wd-icon
              name="edit-outline"
              size="18px"
              color="#fff"
            />
            <text class="bar-btn-text white">{{
              acting ? '保存中…' : '编辑标题'
            }}</text>
          </view>
        </view>
      </template>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { useDetailPage } from './data'

  const {
    refreshing,
    handleRefresh,
    detail,
    loading,
    acting,
    errorText,
    statusText,
    basicFields,
    attachments,
    logs,
    loadDetail,
    handleShare,
    handleEdit,
  } = useDetailPage()
</script>

<style lang="scss" scoped src="./index.scss"></style>
