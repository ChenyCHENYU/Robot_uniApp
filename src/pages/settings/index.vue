<!--
 * @Description: 个人设置页面
-->
<template>
  <C_Layout>
    <view class="settings-page"
      ><view class="page-heading"
        ><text class="page-eyebrow">WORKSPACE</text
        ><text class="page-title">账户设置</text
        ><text class="page-description"
          >管理个人信息、安全与使用偏好</text
        ></view
      >
      <!-- 头像区域 -->
      <view class="avatar-section">
        <view class="avatar-content">
          <view
            class="avatar-wrapper"
            @click="handleChangeAvatar"
          >
            <view class="avatar-ring">
              <image
                v-if="hasCustomAvatar"
                class="avatar-img"
                :src="userAvatar"
                mode="aspectFill"
                @error="handleAvatarError"
              />
              <view
                v-else
                class="avatar-initial"
                >{{ userInitial }}</view
              >
            </view>
            <view class="avatar-edit-icon">
              <wd-icon
                name="camera"
                size="14px"
                color="#fff"
              />
            </view>
          </view>
          <text class="avatar-tip">{{
            updatingAvatar ? '正在上传头像…' : '点击更换头像'
          }}</text>
        </view>
      </view>

      <!-- 基本信息 -->
      <view class="settings-group">
        <text class="group-title">基本信息</text>
        <view class="group-card">
          <view
            class="setting-item"
            @click="handleEditNickname"
          >
            <view class="item-left">
              <view class="item-icon">
                <wd-icon
                  name="user"
                  size="16px"
                  color="var(--r-color-primary)"
                />
              </view>
              <text class="item-label">昵称</text>
            </view>
            <view class="item-right">
              <text class="item-value">{{ nickname }}</text>
              <wd-icon
                name="arrow-right"
                size="14px"
                color="#ccc"
              />
            </view>
          </view>
          <view
            class="setting-item"
            @click="handleEditBio"
          >
            <view class="item-left">
              <view class="item-icon">
                <wd-icon
                  name="edit-outline"
                  size="16px"
                  color="var(--r-color-primary)"
                />
              </view>
              <view class="item-text"
                ><text class="item-label">个性签名</text
                ><text class="item-note">保存在当前设备</text></view
              >
            </view>
            <view class="item-right">
              <text class="item-value ellipsis">{{ bio || '未设置' }}</text>
              <wd-icon
                name="arrow-right"
                size="14px"
                color="#ccc"
              />
            </view>
          </view>
          <view
            class="setting-item"
            @click="handleEditPhone"
          >
            <view class="item-left">
              <view class="item-icon">
                <wd-icon
                  name="chat"
                  size="16px"
                  color="var(--r-color-primary)"
                />
              </view>
              <text class="item-label">手机号</text>
            </view>
            <view class="item-right">
              <text class="item-value">{{ maskedPhone }}</text>
              <wd-icon
                name="arrow-right"
                size="14px"
                color="#ccc"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 安全设置 -->
      <view class="settings-group">
        <text class="group-title">安全设置</text>
        <view class="group-card">
          <view
            class="setting-item"
            @click="handleChangePassword"
          >
            <view class="item-left">
              <view class="item-icon">
                <wd-icon
                  name="warning"
                  size="16px"
                  color="var(--r-color-primary)"
                />
              </view>
              <text class="item-label">修改密码</text>
            </view>
            <view class="item-right">
              <wd-icon
                name="arrow-right"
                size="14px"
                color="#ccc"
              />
            </view>
          </view>
          <view class="setting-item">
            <view class="item-left">
              <view class="item-icon">
                <wd-icon
                  name="check"
                  size="16px"
                  color="var(--r-color-primary)"
                />
              </view>
              <text class="item-label">指纹/面容解锁</text>
            </view>
            <view class="item-right">
              <text class="item-value">暂未启用</text>
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
              <view class="item-icon">
                <wd-icon
                  name="notification"
                  size="16px"
                  color="var(--r-color-primary)"
                />
              </view>
              <text class="item-label">推送通知</text>
            </view>
            <view class="item-right">
              <wd-switch
                v-model="preferences.push"
                size="20px"
              />
            </view>
          </view>
          <view class="setting-item">
            <view class="item-left">
              <view class="item-icon">
                <wd-icon
                  name="notification"
                  size="16px"
                  color="var(--r-color-primary)"
                />
              </view>
              <text class="item-label">系统消息</text>
            </view>
            <view class="item-right">
              <wd-switch
                v-model="preferences.systemNotify"
                size="20px"
              />
            </view>
          </view>
          <view class="setting-item">
            <view class="item-left">
              <view class="item-icon">
                <wd-icon
                  name="notification"
                  size="16px"
                  color="var(--r-color-primary)"
                />
              </view>
              <text class="item-label">声音提醒</text>
            </view>
            <view class="item-right">
              <wd-switch
                v-model="preferences.sound"
                size="20px"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 外观与显示 -->
      <view class="settings-group">
        <text class="group-title">外观与显示</text>
        <view class="group-card">
          <view
            class="setting-item"
            @click="handleThemeSelect"
          >
            <view class="item-left">
              <view class="item-icon">
                <C_Icon
                  name="i-mdi-theme-light-dark"
                  size="16px"
                  color="var(--r-color-primary)"
                />
              </view>
              <text class="item-label">外观模式</text>
            </view>
            <view class="item-right">
              <text class="item-value">{{ themeModeLabel }}</text>
              <wd-icon
                name="arrow-right"
                size="14px"
                color="#ccc"
              />
            </view>
          </view>

          <view
            class="setting-item"
            @click="cycleFontSize"
          >
            <view class="item-left">
              <view class="item-icon">
                <wd-icon
                  name="setting"
                  size="16px"
                  color="var(--r-color-primary)"
                />
              </view>
              <text class="item-label">字体大小</text>
            </view>
            <view class="item-right">
              <text class="item-value">{{ fontSizeLabel }}</text>
              <wd-icon
                name="arrow-right"
                size="14px"
                color="#ccc"
              />
            </view>
          </view>
          <view
            class="setting-item"
            @click="handleLanguageSelect"
          >
            <view class="item-left">
              <view class="item-icon">
                <wd-icon
                  name="translate-bold"
                  size="16px"
                  color="var(--r-color-primary)"
                />
              </view>
              <text class="item-label">语言设置</text>
            </view>
            <view class="item-right">
              <text class="item-value">{{ languageLabel }}</text>
              <wd-icon
                name="arrow-right"
                size="14px"
                color="#ccc"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { useSettingsPage } from './data'

  const {
    preferences,
    updatingAvatar,
    userAvatar,
    hasCustomAvatar,
    userInitial,
    handleAvatarError,
    nickname,
    bio,
    maskedPhone,
    fontSizeLabel,
    languageLabel,
    themeModeLabel,
    handleThemeSelect,
    cycleFontSize,
    handleLanguageSelect,
    handleChangeAvatar,
    handleEditNickname,
    handleEditBio,
    handleEditPhone,
    handleChangePassword,
  } = useSettingsPage()
</script>

<style lang="scss" scoped src="./index.scss"></style>
