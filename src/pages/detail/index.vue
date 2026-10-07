<!--
 * @Description: 详情页模板 - 通用实体详情展示
-->
<template>
  <C_Layout force-layout-type="none">
    <view class="detail-page">
      <!-- 加载/空态 -->
      <view
        v-if="!detail"
        class="detail-loading"
      >
        <text class="loading-text">{{
          loading ? '加载中...' : '数据不存在'
        }}</text>
      </view>

      <template v-if="detail">
        <!-- 顶部封面 + 导航栏合一 -->
        <view class="detail-cover">
          <view class="cover-nav">
            <view
              class="nav-back"
              @click="handleBack"
            >
              <wd-icon
                name="arrow-left"
                size="20px"
                color="#fff"
              />
            </view>
            <text class="nav-title">详情</text>
            <view class="nav-placeholder"></view>
          </view>
          <view class="cover-gradient"></view>
          <view class="cover-content">
            <view
              class="status-badge"
              :class="detail.status === 0 ? 'pending' : 'done'"
            >
              <text class="status-text">{{ statusText }}</text>
            </view>
            <text class="detail-title">{{ detail.title }}</text>
            <text class="detail-subtitle">数据项 · 通用详情模板</text>
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
          <view class="attach-list">
            <view
              v-for="file in attachments"
              :key="file.name"
              class="attach-item"
            >
              <view
                class="file-icon"
                :style="{ background: file.iconBg }"
              >
                <text class="file-type">{{ file.ext }}</text>
              </view>
              <view class="file-info">
                <text class="file-name">{{ file.name }}</text>
                <text class="file-size">{{ file.size }}</text>
              </view>
              <wd-icon
                name="download"
                size="18px"
                color="#667eea"
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
              color="#667eea"
            />
            <text class="bar-btn-text">分享</text>
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
            <text class="bar-btn-text white">编辑</text>
          </view>
        </view>
      </template>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
  import { getCrudDetail, type CrudItem } from '@/api'
  import { useUserStore } from '@/stores/modules/user'
  import { CRUD_STATUS_TEXT, CRUD_STATUS } from '@/constants/status'

  const userStore = useUserStore()

  const detail = ref<CrudItem | null>(null)
  const loading = ref(true)

  const statusText = computed(
    () => CRUD_STATUS_TEXT[detail.value?.status ?? CRUD_STATUS.PENDING]
  )

  const basicFields = computed(() => {
    const d = detail.value
    if (!d) return []
    return [
      { label: '编号', value: d.id || '-' },
      { label: '状态', value: statusText.value },
      { label: '负责人', value: userStore.nickname },
      { label: '创建时间', value: d.createTime || '-' },
      { label: '更新时间', value: d.updatedTime || d.createTime || '-' },
    ]
  })

  const loadDetail = async (id: string) => {
    loading.value = true
    try {
      const res = await getCrudDetail({ id })
      if (!res) {
        uni.showToast({ title: '数据不存在', icon: 'none' })
        return
      }
      detail.value = res
    } catch {
      // http 层已提示
    } finally {
      loading.value = false
    }
  }

  onLoad(query => {
    if (query?.id) {
      loadDetail(String(query.id))
    } else {
      loadDetail('item_001')
    }
  })

  // 附件与日志为模板演示区块（接入后端后替换为真实数据）
  const attachments = ref([
    {
      name: '产品需求文档.pdf',
      ext: 'PDF',
      size: '2.4 MB',
      iconBg: 'linear-gradient(135deg, #f5576c, #f093fb)',
    },
    {
      name: 'UI设计稿.sketch',
      ext: 'SKT',
      size: '18.7 MB',
      iconBg: 'var(--r-gradient-info)',
    },
    {
      name: '技术方案.docx',
      ext: 'DOC',
      size: '1.1 MB',
      iconBg: 'var(--r-gradient-primary)',
    },
  ])

  const logs = ref([
    { action: '更新了项目进度至65%', user: 'ChenY', time: '2025-01-15 14:30' },
    { action: '上传了技术方案文档', user: 'ChenY', time: '2025-01-14 10:20' },
    { action: '修改了截止时间', user: '管理员', time: '2025-01-12 09:00' },
    { action: '创建了项目', user: 'ChenY', time: '2025-01-10 16:45' },
  ])

  // 下拉刷新详情
  onPullDownRefresh(async () => {
    if (detail.value?.id) {
      await loadDetail(String(detail.value.id)).catch(() => {})
    }
    uni.stopPullDownRefresh()
  })

  const handleBack = () => {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      uni.navigateBack()
    } else {
      uni.reLaunch({ url: '/pages/index/index' })
    }
  }

  const handleShare = () => uni.showToast({ title: '分享功能', icon: 'none' })
  const handleEdit = () => uni.navigateTo({ url: '/pages/form-template/index' })
</script>

<style lang="scss" scoped>
  .detail-page {
    background: var(--r-bg-page);
    min-height: 100vh;
    padding-bottom: 140rpx;
  }

  .detail-loading {
    padding-top: calc(var(--status-bar-height, 0px) + 200rpx);
    text-align: center;

    .loading-text {
      font-size: 26rpx;
      color: var(--r-text-secondary);
    }
  }

  .detail-cover {
    position: relative;
    padding: 0 32rpx 40rpx;
    padding-top: calc(var(--status-bar-height, 0px) + 8rpx);
    background: var(--r-gradient-primary);

    .cover-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 88rpx;

      .nav-back {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .nav-title {
        font-size: 30rpx;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
      }

      .nav-placeholder {
        width: 64rpx;
      }
    }

    .cover-gradient {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40rpx;
      background: linear-gradient(180deg, transparent, var(--r-bg-page));
    }

    .cover-content {
      position: relative;
      z-index: 1;
    }

    .status-badge {
      display: inline-block;
      padding: 6rpx 20rpx;
      border-radius: 8rpx;
      margin-bottom: 16rpx;

      &.active {
        background: rgba(255, 255, 255, 0.2);
      }
      &.done {
        background: rgba(67, 233, 123, 0.3);
      }
      &.pending {
        background: rgba(250, 173, 20, 0.3);
      }

      .status-text {
        font-size: 22rpx;
        color: #fff;
      }
    }

    .detail-title {
      display: block;
      font-size: 40rpx;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8rpx;
    }

    .detail-subtitle {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .info-card,
  .content-card,
  .attach-card,
  .timeline-card {
    margin: 20rpx 24rpx;
    padding: 28rpx;
    background: var(--r-bg-card);
    border-radius: 20rpx;
    box-shadow: var(--r-shadow-sm);
  }

  .card-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .card-title {
      font-size: 30rpx;
      font-weight: 600;
      color: var(--r-text-primary);
    }

    .card-extra {
      font-size: 24rpx;
      color: var(--r-text-secondary);
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20rpx;

    .info-item {
      .info-label {
        display: block;
        font-size: 22rpx;
        color: var(--r-text-placeholder);
        margin-bottom: 4rpx;
      }
      .info-value {
        font-size: 28rpx;
        color: var(--r-text-primary);
        font-weight: 500;
      }
    }
  }

  .content-text {
    font-size: 28rpx;
    color: var(--r-text-secondary);
    line-height: 1.8;
  }

  .attach-list {
    .attach-item {
      display: flex;
      align-items: center;
      gap: 16rpx;
      padding: 16rpx 0;
      border-bottom: 1rpx solid var(--r-border-light);

      &:last-child {
        border-bottom: none;
      }

      .file-icon {
        width: 72rpx;
        height: 72rpx;
        border-radius: 14rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        .file-type {
          font-size: 20rpx;
          color: #fff;
          font-weight: 700;
        }
      }

      .file-info {
        flex: 1;

        .file-name {
          display: block;
          font-size: 26rpx;
          color: var(--r-text-primary);
        }
        .file-size {
          font-size: 22rpx;
          color: var(--r-text-placeholder);
        }
      }
    }
  }

  .timeline-list {
    .timeline-item {
      display: flex;
      position: relative;
      padding-left: 32rpx;
      padding-bottom: 28rpx;

      &:last-child {
        padding-bottom: 0;
      }

      .timeline-dot {
        position: absolute;
        left: 0;
        top: 8rpx;
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        background: #ddd;

        &.first {
          background: #667eea;
        }
      }

      .timeline-line {
        position: absolute;
        left: 7rpx;
        top: 28rpx;
        width: 2rpx;
        bottom: 0;
        background: var(--r-border-light);
      }

      .timeline-content {
        .timeline-action {
          display: block;
          font-size: 26rpx;
          color: var(--r-text-primary);
          margin-bottom: 4rpx;
        }
        .timeline-user {
          font-size: 22rpx;
          color: var(--r-text-secondary);
          margin-right: 16rpx;
        }
        .timeline-time {
          font-size: 22rpx;
          color: var(--r-text-placeholder);
        }
      }
    }
  }

  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    gap: 20rpx;
    padding: 16rpx 32rpx;
    padding-bottom: calc(env(safe-area-inset-bottom) + 16rpx);
    background: var(--r-bg-card);
    box-shadow: 0 -2rpx 16rpx rgba(0, 0, 0, 0.06);

    .bar-btn {
      flex: 1;
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8rpx;
      border-radius: 16rpx;

      &.secondary {
        background: rgba(102, 126, 234, 0.1);
      }
      &.primary {
        background: var(--r-gradient-primary);
      }

      .bar-btn-text {
        font-size: 28rpx;
        color: #667eea;
        font-weight: 600;

        &.white {
          color: #fff;
        }
      }
    }
  }
</style>
