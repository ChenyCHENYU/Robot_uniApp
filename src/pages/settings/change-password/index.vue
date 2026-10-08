<!--
 * @Description: 修改密码页面
-->
<template>
  <C_Layout>
    <view class="change-password-page">
      <!-- 安全提示 -->
      <view class="security-tip">
        <view class="tip-icon-wrap">
          <wd-icon
            name="warning"
            size="20px"
            color="#e6a23c"
          />
        </view>
        <text class="tip-text">设置安全的新密码，保护你的账户</text>
      </view>

      <!-- 表单区域 -->
      <view class="form-section">
        <view class="form-card">
          <!-- 原密码 -->
          <view class="form-item">
            <view class="form-label">
              <wd-icon
                name="lock-on"
                size="16px"
                color="var(--r-color-primary)"
              />
              <text class="label-text">原密码</text>
            </view>
            <view class="form-input-wrap">
              <input
                class="form-input"
                :type="showOldPwd ? 'text' : 'password'"
                v-model="formData.oldPassword"
                placeholder="请输入原密码"
                maxlength="32"
              />
              <view
                class="eye-btn"
                @click="showOldPwd = !showOldPwd"
              >
                <wd-icon
                  :name="showOldPwd ? 'view' : 'eye-close'"
                  size="18px"
                  color="#909399"
                />
              </view>
            </view>
          </view>

          <view class="form-divider"></view>

          <!-- 新密码 -->
          <view class="form-item">
            <view class="form-label">
              <wd-icon
                name="lock-on"
                size="16px"
                color="var(--r-color-primary)"
              />
              <text class="label-text">新密码</text>
            </view>
            <view class="form-input-wrap">
              <input
                class="form-input"
                :type="showNewPwd ? 'text' : 'password'"
                v-model="formData.newPassword"
                placeholder="请输入新密码（6-32位）"
                maxlength="32"
              />
              <view
                class="eye-btn"
                @click="showNewPwd = !showNewPwd"
              >
                <wd-icon
                  :name="showNewPwd ? 'view' : 'eye-close'"
                  size="18px"
                  color="#909399"
                />
              </view>
            </view>
            <!-- 密码强度指示 -->
            <view
              v-if="formData.newPassword"
              class="strength-bar"
            >
              <view class="strength-segments">
                <view
                  class="segment"
                  :class="{ active: passwordStrength >= 1 }"
                  :style="{
                    background: passwordStrength >= 1 ? strengthColor : '',
                  }"
                ></view>
                <view
                  class="segment"
                  :class="{ active: passwordStrength >= 2 }"
                  :style="{
                    background: passwordStrength >= 2 ? strengthColor : '',
                  }"
                ></view>
                <view
                  class="segment"
                  :class="{ active: passwordStrength >= 3 }"
                  :style="{
                    background: passwordStrength >= 3 ? strengthColor : '',
                  }"
                ></view>
              </view>
              <text
                class="strength-text"
                :style="{ color: strengthColor }"
                >{{ strengthLabel }}</text
              >
            </view>
          </view>

          <view class="form-divider"></view>

          <!-- 确认密码 -->
          <view class="form-item">
            <view class="form-label">
              <wd-icon
                name="check-circle"
                size="16px"
                color="#67c23a"
              />
              <text class="label-text">确认密码</text>
            </view>
            <view class="form-input-wrap">
              <input
                class="form-input"
                :type="showConfirmPwd ? 'text' : 'password'"
                v-model="formData.confirmPassword"
                placeholder="请再次输入新密码"
                maxlength="32"
              />
              <view
                class="eye-btn"
                @click="showConfirmPwd = !showConfirmPwd"
              >
                <wd-icon
                  :name="showConfirmPwd ? 'view' : 'eye-close'"
                  size="18px"
                  color="#909399"
                />
              </view>
            </view>
            <text
              v-if="confirmError"
              class="form-error"
              >{{ confirmError }}</text
            >
          </view>
        </view>
      </view>

      <!-- 密码规则 -->
      <view class="rules-section">
        <text class="rules-title">密码要求</text>
        <view class="rules-list">
          <view
            class="rule-item"
            :class="{ fulfilled: formData.newPassword.length >= 6 }"
          >
            <wd-icon
              :name="
                formData.newPassword.length >= 6
                  ? 'check-circle'
                  : 'info-circle'
              "
              size="14px"
              :color="formData.newPassword.length >= 6 ? '#67c23a' : '#c0c4cc'"
            />
            <text class="rule-text">至少 6 个字符</text>
          </view>
          <view
            class="rule-item"
            :class="{ fulfilled: hasNumber }"
          >
            <wd-icon
              :name="hasNumber ? 'check-circle' : 'info-circle'"
              size="14px"
              :color="hasNumber ? '#67c23a' : '#c0c4cc'"
            />
            <text class="rule-text">包含数字</text>
          </view>
          <view
            class="rule-item"
            :class="{ fulfilled: hasLetter }"
          >
            <wd-icon
              :name="hasLetter ? 'check-circle' : 'info-circle'"
              size="14px"
              :color="hasLetter ? '#67c23a' : '#c0c4cc'"
            />
            <text class="rule-text">包含字母</text>
          </view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <view
          class="submit-btn"
          :class="{ disabled: !canSubmit }"
          @click="handleSubmit"
        >
          <text class="submit-text">{{
            submitting ? '提交中...' : '确认修改'
          }}</text>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { useSettingsChangePasswordPage } from './data'

  const {
    formData,
    showOldPwd,
    showNewPwd,
    showConfirmPwd,
    submitting,
    hasNumber,
    hasLetter,
    passwordStrength,
    strengthColor,
    strengthLabel,
    confirmError,
    canSubmit,
    handleSubmit,
  } = useSettingsChangePasswordPage()
</script>

<style lang="scss" scoped src="./index.scss"></style>
