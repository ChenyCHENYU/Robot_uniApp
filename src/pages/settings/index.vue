<!--
 * @Description: 个人设置页面 - 玻璃拟态风格
-->
<template>
  <C_Layout>
    <view class="settings-page">
      <!-- 头像区域 -->
      <view class="avatar-section">
        <view class="avatar-glass-bg"></view>
        <view class="avatar-content">
          <view class="avatar-wrapper" @click="handleChangeAvatar">
            <view class="avatar-ring">
              <image class="avatar-img" :src="userAvatar" mode="aspectFill" />
            </view>
            <view class="avatar-edit-icon">
              <wd-icon name="camera" size="14px" color="#fff" />
            </view>
          </view>
          <text class="avatar-tip">点击更换头像</text>
        </view>
      </view>

      <!-- 基本信息 -->
      <view class="settings-group">
        <text class="group-title">基本信息</text>
        <view class="group-card">
          <view class="setting-item" @click="handleEditNickname">
            <view class="item-left">
              <view class="item-icon" style="background: linear-gradient(135deg, #667eea, #764ba2)">
                <wd-icon name="user" size="16px" color="#fff" />
              </view>
              <text class="item-label">昵称</text>
            </view>
            <view class="item-right">
              <text class="item-value">{{ nickname }}</text>
              <wd-icon name="arrow-right" size="14px" color="#ccc" />
            </view>
          </view>
          <view class="setting-item" @click="handleEditBio">
            <view class="item-left">
              <view class="item-icon" style="background: linear-gradient(135deg, #43e97b, #38f9d7)">
                <wd-icon name="edit-outline" size="16px" color="#fff" />
              </view>
              <text class="item-label">个性签名</text>
            </view>
            <view class="item-right">
              <text class="item-value ellipsis">{{ bio || '未设置' }}</text>
              <wd-icon name="arrow-right" size="14px" color="#ccc" />
            </view>
          </view>
          <view class="setting-item" @click="handleEditPhone">
            <view class="item-left">
              <view class="item-icon" style="background: linear-gradient(135deg, #4facfe, #00f2fe)">
                <wd-icon name="chat" size="16px" color="#fff" />
              </view>
              <text class="item-label">手机号</text>
            </view>
            <view class="item-right">
              <text class="item-value">{{ maskedPhone }}</text>
              <wd-icon name="arrow-right" size="14px" color="#ccc" />
            </view>
          </view>
        </view>
      </view>

      <!-- 安全设置 -->
      <view class="settings-group">
        <text class="group-title">安全设置</text>
        <view class="group-card">
          <view class="setting-item" @click="handleChangePassword">
            <view class="item-left">
              <view class="item-icon" style="background: linear-gradient(135deg, #fa709a, #fee140)">
                <wd-icon name="warning" size="16px" color="#fff" />
              </view>
              <text class="item-label">修改密码</text>
            </view>
            <view class="item-right">
              <wd-icon name="arrow-right" size="14px" color="#ccc" />
            </view>
          </view>
          <view class="setting-item">
            <view class="item-left">
              <view class="item-icon" style="background: linear-gradient(135deg, #a8edea, #fed6e3)">
                <wd-icon name="check" size="16px" color="#fff" />
              </view>
              <text class="item-label">指纹/面容解锁</text>
            </view>
            <view class="item-right">
              <wd-switch v-model="biometricEnabled" size="20px" />
            </view>
          </view>
        </view>
      </view>

      <!-- 通知偏好 -->
      <view class="settings-group">
        <text class="group-title">通知偏好</text>
        <view class="group-card">
          <view class="setting-item">
            <view class="item-left">
              <view class="item-icon" style="background: linear-gradient(135deg, #f093fb, #f5576c)">
                <wd-icon name="notification" size="16px" color="#fff" />
              </view>
              <text class="item-label">推送通知</text>
            </view>
            <view class="item-right">
              <wd-switch v-model="pushEnabled" size="20px" />
            </view>
          </view>
          <view class="setting-item">
            <view class="item-left">
              <view class="item-icon" style="background: linear-gradient(135deg, #ffecd2, #fcb69f)">
                <wd-icon name="notification" size="16px" color="#fff" />
              </view>
              <text class="item-label">系统消息</text>
            </view>
            <view class="item-right">
              <wd-switch v-model="systemNotifyEnabled" size="20px" />
            </view>
          </view>
          <view class="setting-item">
            <view class="item-left">
              <view class="item-icon" style="background: linear-gradient(135deg, #c3cfe2, #f5f7fa)">
                <wd-icon name="notification" size="16px" color="#fff" />
              </view>
              <text class="item-label">声音提醒</text>
            </view>
            <view class="item-right">
              <wd-switch v-model="soundEnabled" size="20px" />
            </view>
          </view>
        </view>
      </view>

      <!-- 外观与显示 -->
      <view class="settings-group">
        <text class="group-title">外观与显示</text>
        <view class="group-card">
          <view class="setting-item" @click="goToTheme">
            <view class="item-left">
              <view class="item-icon" style="background: linear-gradient(135deg, #667eea, #764ba2)">
                <wd-icon name="browse" size="16px" color="#fff" />
              </view>
              <text class="item-label">主题切换</text>
            </view>
            <view class="item-right">
              <text class="item-value">{{ currentThemeLabel }}</text>
              <wd-icon name="arrow-right" size="14px" color="#ccc" />
            </view>
          </view>
          <view class="setting-item">
            <view class="item-left">
              <view class="item-icon" style="background: linear-gradient(135deg, #e0c3fc, #8ec5fc)">
                <wd-icon name="setting" size="16px" color="#fff" />
              </view>
              <text class="item-label">字体大小</text>
            </view>
            <view class="item-right">
              <text class="item-value">{{ fontSizeLabel }}</text>
              <wd-icon name="arrow-right" size="14px" color="#ccc" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { useAppStore } from '@/stores/modules/app'

const userStore = useUserStore()
const appStore = useAppStore()

// 用户信息
const userAvatar = computed(() => userStore.avatar || '/static/robot-avatar.png')
const nickname = ref(userStore.userInfo?.nickname || 'CHENY')
const bio = ref('')
const maskedPhone = computed(() => {
  const phone = userStore.userInfo?.phone || '13800138000'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
})

// 安全设置
const biometricEnabled = ref(false)

// 通知偏好
const pushEnabled = ref(true)
const systemNotifyEnabled = ref(true)
const soundEnabled = ref(true)

// 外观
const currentThemeLabel = computed(() => {
  const map = { light: '浅色', dark: '深色', auto: '跟随系统' }
  return map[appStore.themeMode] || '浅色'
})
const fontSizeLabel = ref('标准')

// 事件处理
const handleChangeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempPath = res.tempFilePaths[0]
      // 更新store中的头像（实际项目需上传至服务器）
      if (userStore.userInfo) {
        userStore.userInfo.avatar = tempPath
      } else {
        userStore.userInfo = { avatar: tempPath }
      }
      uni.showToast({ title: '头像已更新', icon: 'success' })
    },
    fail: () => {}
  })
}

const handleEditNickname = () => {
  uni.showModal({
    title: '修改昵称',
    editable: true,
    placeholderText: '请输入新昵称',
    content: nickname.value,
    success: ({ confirm, content }) => {
      if (confirm && content?.trim()) {
        nickname.value = content.trim()
        uni.showToast({ title: '昵称已更新', icon: 'success' })
      }
    }
  })
}

const handleEditBio = () => {
  uni.showModal({
    title: '修改签名',
    editable: true,
    placeholderText: '一句话介绍自己',
    content: bio.value,
    success: ({ confirm, content }) => {
      if (confirm) {
        bio.value = content?.trim() || ''
        uni.showToast({ title: '签名已更新', icon: 'success' })
      }
    }
  })
}

const handleEditPhone = () => {
  uni.showToast({ title: '手机号修改功能开发中', icon: 'none' })
}

const handleChangePassword = () => {
  uni.showToast({ title: '密码修改功能开发中', icon: 'none' })
}

const goToTheme = () => {
  uni.navigateTo({ url: '/pages/settings/theme' })
}
</script>

<style lang="scss" scoped>
.settings-page {
  background: var(--r-bg-page, #f0f2f8);
  padding-bottom: env(safe-area-inset-bottom);
}

.avatar-section {
  position: relative;
  padding: 48rpx 32rpx 40rpx;
  margin-bottom: 8rpx;

  .avatar-glass-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
      rgba(102, 126, 234, 0.1) 0%,
      rgba(118, 75, 162, 0.06) 50%,
      var(--r-glass-bg) 100%);
    backdrop-filter: blur(20rpx);
  }

  .avatar-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .avatar-wrapper {
    position: relative;

    .avatar-ring {
      padding: 6rpx;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;

      .avatar-img {
        width: 140rpx;
        height: 140rpx;
        border-radius: 50%;
        border: 4rpx solid var(--r-bg-card);
      }
    }

    .avatar-edit-icon {
      position: absolute;
      bottom: 4rpx;
      right: 4rpx;
      width: 44rpx;
      height: 44rpx;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border: 3rpx solid var(--r-bg-card);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .avatar-tip {
    margin-top: 16rpx;
    font-size: 24rpx;
    color: var(--r-text-secondary);
  }
}

.settings-group {
  margin: 0 32rpx 24rpx;

  .group-title {
    display: block;
    font-size: 26rpx;
    font-weight: 600;
    color: var(--r-text-secondary);
    margin-bottom: 16rpx;
    padding-left: 8rpx;
    text-transform: uppercase;
    letter-spacing: 2rpx;
  }

  .group-card {
    background: var(--r-glass-bg);
    backdrop-filter: blur(20rpx);
    border: 1rpx solid var(--r-glass-border);
    border-radius: 24rpx;
    overflow: hidden;
    box-shadow: var(--r-glass-shadow), var(--r-glass-inner-shadow);
  }
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 28rpx;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 92rpx;
    right: 28rpx;
    height: 1rpx;
    background: var(--r-divider);
  }

  &:active {
    background: rgba(0, 0, 0, 0.02);
  }

  .item-left {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;

    .item-icon {
      width: 56rpx;
      height: 56rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
      flex-shrink: 0;
    }

    .item-label {
      font-size: 30rpx;
      color: var(--r-text-primary);
      font-weight: 500;
    }
  }

  .item-right {
    display: flex;
    align-items: center;
    gap: 12rpx;
    flex-shrink: 0;

    .item-value {
      font-size: 28rpx;
      color: var(--r-text-secondary);
      max-width: 240rpx;

      &.ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
