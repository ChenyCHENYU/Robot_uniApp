<!--
 * @Description: 个人中心页面 - 玻璃拟态风格
-->
<template>
  <C_Layout>
    <view class="profile-page">
      <!-- 用户信息卡片 -->
      <view class="user-card">
        <view class="card-glass-bg"></view>
        <view class="card-content">
          <view class="avatar-section">
            <view class="avatar-ring">
              <image
                class="avatar-img"
                :src="userAvatar"
                mode="aspectFill"
              />
            </view>
            <view class="user-level">
              <text class="level-text">Pro</text>
            </view>
          </view>
          <view class="user-info-section">
            <text class="user-name">{{ userName }}</text>
            <text class="user-role">{{ userRole }}</text>
            <view class="user-id">
              <text class="id-label">ID: </text>
              <text class="id-value">{{ userId }}</text>
            </view>
          </view>
          <view
            class="edit-btn"
            @click="goToSettings"
          >
            <wd-icon
              name="edit-outline"
              size="16px"
              color="#667eea"
            />
          </view>
        </view>
      </view>

      <!-- 数据统计 -->
      <view class="stats-section">
        <view
          class="stat-item"
          v-for="stat in userStats"
          :key="stat.label"
        >
          <text class="stat-value">{{ stat.value }}</text>
          <text class="stat-label">{{ stat.label }}</text>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view
        class="menu-section"
        v-for="group in menuGroups"
        :key="group.title"
      >
        <text class="menu-group-title">{{ group.title }}</text>
        <view class="menu-list">
          <view
            v-for="item in group.items"
            :key="item.id"
            class="menu-item"
            @click="handleMenuClick(item)"
          >
            <view class="menu-left">
              <view
                class="menu-icon-wrap"
                :style="{ background: item.iconBg }"
              >
                <wd-icon
                  :name="item.icon"
                  size="18px"
                  color="#fff"
                />
              </view>
              <text class="menu-label">{{ item.label }}</text>
            </view>
            <view class="menu-right">
              <text
                v-if="item.extra"
                class="menu-extra"
                >{{ item.extra }}</text
              >
              <view
                v-if="item.badge"
                class="menu-badge"
              >
                <text class="badge-num">{{ item.badge }}</text>
              </view>
              <wd-icon
                name="arrow-right"
                size="14px"
                color="#ccc"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="logout-section">
        <view
          class="logout-btn"
          @click="handleLogout"
        >
          <wd-icon
            name="poweroff"
            size="18px"
            color="#f5576c"
          />
          <text class="logout-text">退出登录</text>
        </view>
      </view>

      <!-- 底部版本 -->
      <view class="footer-info">
        <text class="version-text">Robot UniApp v{{ appVersion }}</text>
        <text class="copyright-text">© 2025 CHENY. All Rights Reserved.</text>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useUserStore } from '@/stores/modules/user'
  import { APP_VERSION } from '@/constants'

  const appVersion = APP_VERSION

  const userStore = useUserStore()

  const userAvatar = computed(
    () => userStore.avatar || '/static/robot-avatar.png'
  )
  const userName = computed(() => userStore.userInfo?.nickname || 'CHENY')
  const userRole = computed(() => {
    if (userStore.isAdmin) return '系统管理员'
    if (userStore.roles?.length) return userStore.roles[0]
    return '普通用户'
  })
  const userId = computed(() => userStore.userInfo?.id || '100001')

  const userStats = ref([
    { value: '33', label: '组件' },
    { value: '8', label: 'Composables' },
    { value: '12', label: '常量' },
    { value: '5', label: '样式' },
  ])

  const menuGroups = ref([
    {
      title: '个人服务',
      items: [
        {
          id: 'settings',
          label: '个人设置',
          icon: 'setting',
          iconBg: 'linear-gradient(135deg, #667eea, #764ba2)',
          path: '/pages/settings/index',
        },
        {
          id: 'notification',
          label: '消息通知',
          icon: 'notification',
          iconBg: 'linear-gradient(135deg, #fa709a, #fee140)',
          badge: 8,
          path: '/pages/message/index',
        },
        {
          id: 'privacy',
          label: '隐私管理',
          icon: 'shield',
          iconBg: 'linear-gradient(135deg, #43e97b, #38f9d7)',
        },
      ],
    },
    {
      title: '开发工具',
      items: [
        {
          id: 'docs',
          label: '开发文档',
          icon: 'books',
          iconBg: 'linear-gradient(135deg, #f093fb, #f5576c)',
          path: '/pages/webview/index?url=https%3A%2F%2Funiapp.dcloud.net.cn&title=开发文档',
        },
        {
          id: 'templates',
          label: '业务模板',
          icon: 'list',
          iconBg: 'linear-gradient(135deg, #4facfe, #00f2fe)',
          path: '/pages/demo/index',
        },
        {
          id: 'changelog',
          label: '更新日志',
          icon: 'calendar',
          iconBg: 'linear-gradient(135deg, #a8edea, #fed6e3)',
          extra: `v${APP_VERSION}`,
        },
      ],
    },
    {
      title: '其他',
      items: [
        {
          id: 'feedback',
          label: '意见反馈',
          icon: 'edit-outline',
          iconBg: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
        },
        {
          id: 'about',
          label: '关于应用',
          icon: 'info-circle',
          iconBg: 'linear-gradient(135deg, #c3cfe2, #f5f7fa)',
          path: '/pages/about/index',
        },
        {
          id: 'cache',
          label: '清除缓存',
          icon: 'delete',
          iconBg: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
          extra: '12.5MB',
        },
      ],
    },
  ])

  const goToSettings = () => {
    uni.navigateTo({ url: '/pages/settings/index' })
  }

  const handleMenuClick = item => {
    if (item.path) {
      // tab页面用switchTab，普通页面用navigateTo
      const tabPaths = [
        '/pages/index/index',
        '/pages/message/index',
        '/pages/robot/index',
        '/pages/profile/index',
      ]
      if (tabPaths.includes(item.path)) {
        uni.switchTab({ url: item.path })
      } else {
        uni.navigateTo({ url: item.path })
      }
      return
    }

    const actions: Record<string, () => void> = {
      docs: () => uni.showToast({ title: '开发文档建设中', icon: 'none' }),
      changelog: () =>
        uni.showModal({
          title: '更新日志',
          content: `v${APP_VERSION}\n- 迁移 wot-design-uni 组件库\n- 搭建基础设施\n- 封装 33 个通用组件\n- 新增 11 个业务模板页\n- 新增消息中心、个人设置、主题切换\n- 首页 Dashboard 改版`,
          showCancel: false,
        }),
      feedback: () => uni.showToast({ title: '反馈功能开发中', icon: 'none' }),
      privacy: () =>
        uni.showModal({
          title: '隐私管理',
          content:
            '我们重视您的隐私保护。\n\n• 个人信息仅用于应用功能\n• 不会向第三方共享数据\n• 您可随时清除本地数据',
          showCancel: false,
          confirmText: '我知道了',
        }),
      about: () => uni.navigateTo({ url: '/pages/about/index' }),
      cache: () => {
        uni.showModal({
          title: '清除缓存',
          content: '确定要清除应用缓存吗？',
          success: ({ confirm }) => {
            if (confirm) uni.showToast({ title: '缓存已清除', icon: 'success' })
          },
        })
      },
    }
    actions[item.id]?.()
  }

  const handleLogout = () => {
    uni.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: ({ confirm }) => {
        if (!confirm) return
        uni.showLoading({ title: '退出中...' })
        userStore
          .logout()
          .then(() => uni.showToast({ title: '退出成功', icon: 'success' }))
          .catch(() => uni.showToast({ title: '退出失败', icon: 'error' }))
          .finally(() => uni.hideLoading())
      },
    })
  }
</script>

<style lang="scss" scoped>
  .profile-page {
    background: var(--r-bg-page, #f0f2f8);
    padding-bottom: 40rpx;
  }

  .user-card {
    position: relative;
    margin: 24rpx 32rpx;
    padding: 40rpx;
    border-radius: 28rpx;
    overflow: hidden;

    .card-glass-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        var(--r-bg-hover) 0%,
        var(--r-glass-bg) 100%
      );
      backdrop-filter: blur(24rpx);
      border: 1rpx solid var(--r-glass-border);
      border-radius: 28rpx;
      box-shadow: var(--r-shadow-md), var(--r-glass-inner-shadow);
    }

    .card-content {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
    }

    .avatar-section {
      position: relative;
      margin-right: 28rpx;

      .avatar-ring {
        padding: 4rpx;
        background: linear-gradient(
          135deg,
          var(--r-color-primary),
          var(--r-color-primary-light)
        );
        border-radius: 50%;

        .avatar-img {
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
          border: 4rpx solid var(--r-bg-card);
        }
      }

      .user-level {
        position: absolute;
        bottom: -4rpx;
        right: -4rpx;
        padding: 4rpx 12rpx;
        background: linear-gradient(
          135deg,
          var(--r-color-primary),
          var(--r-color-primary-light)
        );
        border-radius: 16rpx;
        border: 2rpx solid var(--r-bg-card);

        .level-text {
          font-size: 18rpx;
          color: var(--r-text-inverse);
          font-weight: 700;
        }
      }
    }

    .user-info-section {
      flex: 1;

      .user-name {
        display: block;
        font-size: 36rpx;
        font-weight: 700;
        color: var(--r-text-primary);
        margin-bottom: 6rpx;
      }

      .user-role {
        display: block;
        font-size: 24rpx;
        color: var(--r-color-primary);
        font-weight: 500;
        margin-bottom: 8rpx;
      }

      .user-id {
        .id-label {
          font-size: 22rpx;
          color: var(--r-text-secondary);
        }
        .id-value {
          font-size: 22rpx;
          color: var(--r-text-regular);
          font-family: 'Courier New', monospace;
        }
      }
    }

    .edit-btn {
      width: 64rpx;
      height: 64rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--r-bg-hover);
      border: 1rpx solid var(--r-border-light);
      border-radius: 50%;
      backdrop-filter: blur(10rpx);
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.92);
      }
    }
  }

  .stats-section {
    display: flex;
    margin: 0 32rpx 24rpx;
    padding: 28rpx 0;
    background: var(--r-bg-card);
    border-radius: 20rpx;
    box-shadow: var(--r-glass-shadow);
    border: 1rpx solid var(--r-divider);

    .stat-item {
      flex: 1;
      text-align: center;
      position: relative;

      &:not(:last-child)::after {
        content: '';
        position: absolute;
        right: 0;
        top: 20%;
        height: 60%;
        width: 1rpx;
        background: var(--r-divider-strong);
      }

      .stat-value {
        display: block;
        font-size: 36rpx;
        font-weight: 700;
        color: var(--r-color-primary);
      }

      .stat-label {
        display: block;
        font-size: 22rpx;
        color: var(--r-text-secondary);
        margin-top: 4rpx;
      }
    }
  }

  .menu-section {
    margin: 0 32rpx 24rpx;

    .menu-group-title {
      display: block;
      font-size: 24rpx;
      color: var(--r-text-secondary);
      font-weight: 500;
      padding: 0 8rpx 16rpx;
    }

    .menu-list {
      background: var(--r-bg-card);
      border-radius: 20rpx;
      overflow: hidden;
      box-shadow: var(--r-glass-shadow);
      border: 1rpx solid var(--r-divider);
    }

    .menu-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 28rpx;
      transition: all 0.2s ease;
      position: relative;

      &:not(:last-child)::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 100rpx;
        right: 28rpx;
        height: 1rpx;
        background: var(--r-divider);
      }

      &:active {
        background: var(--r-bg-hover);
      }

      .menu-left {
        display: flex;
        align-items: center;
        gap: 24rpx;

        .menu-icon-wrap {
          width: 56rpx;
          height: 56rpx;
          border-radius: 14rpx;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-label {
          font-size: 28rpx;
          color: var(--r-text-primary);
          font-weight: 500;
        }
      }

      .menu-right {
        display: flex;
        align-items: center;
        gap: 12rpx;

        .menu-extra {
          font-size: 24rpx;
          color: var(--r-text-secondary);
        }

        .menu-badge {
          min-width: 32rpx;
          height: 32rpx;
          padding: 0 10rpx;
          background: var(--r-color-error);
          border-radius: 16rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          .badge-num {
            font-size: 20rpx;
            color: var(--r-text-inverse);
            font-weight: 600;
          }
        }
      }
    }
  }

  .logout-section {
    margin: 40rpx 32rpx 0;

    .logout-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12rpx;
      padding: 28rpx;
      background: var(--r-bg-card);
      border-radius: 20rpx;
      border: 1rpx solid rgba(245, 87, 108, 0.15);
      box-shadow: var(--r-glass-shadow);
      transition: all 0.3s ease;

      &:active {
        background: rgba(245, 87, 108, 0.04);
        transform: scale(0.98);
      }

      .logout-text {
        font-size: 28rpx;
        color: var(--r-color-error);
        font-weight: 500;
      }
    }
  }

  .footer-info {
    text-align: center;
    padding: 32rpx 0 20rpx;

    .version-text {
      display: block;
      font-size: 22rpx;
      color: var(--r-text-secondary);
      margin-bottom: 8rpx;
    }
    .copyright-text {
      display: block;
      font-size: 20rpx;
      color: var(--r-text-placeholder);
    }
  }
</style>
