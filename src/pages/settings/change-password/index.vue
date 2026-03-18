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
        <text class="tip-text">为了账户安全，请定期修改密码</text>
      </view>

      <!-- 表单区域 -->
      <view class="form-section">
        <view class="form-card">
          <!-- 原密码 -->
          <view class="form-item">
            <view class="form-label">
              <wd-icon
                name="lock"
                size="16px"
                color="#667eea"
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
                name="lock"
                size="16px"
                color="#409eff"
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
  import { ref, reactive, computed } from 'vue'

  const formData = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const showOldPwd = ref(false)
  const showNewPwd = ref(false)
  const showConfirmPwd = ref(false)
  const submitting = ref(false)

  const hasNumber = computed(() => /\d/.test(formData.newPassword))
  const hasLetter = computed(() => /[a-zA-Z]/.test(formData.newPassword))

  const passwordStrength = computed(() => {
    const pwd = formData.newPassword
    if (!pwd) return 0
    let score = 0
    if (pwd.length >= 6) score++
    if (/\d/.test(pwd) && /[a-zA-Z]/.test(pwd)) score++
    if (pwd.length >= 10 && /[^a-zA-Z0-9]/.test(pwd)) score++
    return score
  })

  const strengthColor = computed(() => {
    const colors = ['#f56c6c', '#e6a23c', '#67c23a']
    return colors[passwordStrength.value - 1] || '#c0c4cc'
  })

  const strengthLabel = computed(() => {
    const labels = ['弱', '中', '强']
    return labels[passwordStrength.value - 1] || ''
  })

  const confirmError = computed(() => {
    if (!formData.confirmPassword) return ''
    if (formData.confirmPassword !== formData.newPassword)
      return '两次密码不一致'
    return ''
  })

  const canSubmit = computed(() => {
    return (
      formData.oldPassword.length > 0 &&
      formData.newPassword.length >= 6 &&
      hasNumber.value &&
      hasLetter.value &&
      formData.confirmPassword === formData.newPassword &&
      !submitting.value
    )
  })

  const handleSubmit = async () => {
    if (!canSubmit.value) return

    submitting.value = true
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      uni.showToast({ title: '密码修改成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } catch {
      uni.showToast({ title: '修改失败，请重试', icon: 'error' })
    } finally {
      submitting.value = false
    }
  }
</script>

<style lang="scss" scoped>
  .change-password-page {
    background: var(--r-bg-page, #f0f2f8);
    min-height: 100vh;
    padding-bottom: env(safe-area-inset-bottom);
  }

  .security-tip {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin: 24rpx 32rpx;
    padding: 24rpx 28rpx;
    background: rgba(230, 162, 60, 0.08);
    border: 1rpx solid rgba(230, 162, 60, 0.15);
    border-radius: 16rpx;

    .tip-icon-wrap {
      flex-shrink: 0;
    }

    .tip-text {
      font-size: 24rpx;
      color: #e6a23c;
      line-height: 1.4;
    }
  }

  .form-section {
    margin: 0 32rpx;
  }

  .form-card {
    background: var(--r-bg-card, #fff);
    border-radius: 20rpx;
    padding: 8rpx 28rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    border: 1rpx solid var(--r-divider, #ebeef5);
  }

  .form-item {
    padding: 28rpx 0;
  }

  .form-label {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 16rpx;

    .label-text {
      font-size: 26rpx;
      font-weight: 500;
      color: var(--r-text-primary, #303133);
    }
  }

  .form-input-wrap {
    display: flex;
    align-items: center;
    background: var(--r-bg-page, #f5f7fa);
    border-radius: 12rpx;
    padding: 0 24rpx;
    height: 80rpx;
    border: 1rpx solid transparent;
    transition: all 0.3s ease;

    &:focus-within {
      border-color: var(--r-color-primary, #409eff);
      background: #fff;
    }

    .form-input {
      flex: 1;
      height: 100%;
      font-size: 28rpx;
      color: var(--r-text-primary, #303133);
    }

    .eye-btn {
      padding: 8rpx;
      flex-shrink: 0;
    }
  }

  .form-divider {
    height: 1rpx;
    background: var(--r-divider, #ebeef5);
  }

  .form-error {
    display: block;
    font-size: 22rpx;
    color: #f56c6c;
    margin-top: 8rpx;
    padding-left: 4rpx;
  }

  .strength-bar {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-top: 12rpx;

    .strength-segments {
      display: flex;
      gap: 8rpx;
      flex: 1;

      .segment {
        height: 6rpx;
        flex: 1;
        border-radius: 3rpx;
        background: var(--r-divider-strong, #dcdfe6);
        transition: all 0.3s ease;
      }
    }

    .strength-text {
      font-size: 22rpx;
      font-weight: 500;
      flex-shrink: 0;
    }
  }

  .rules-section {
    margin: 32rpx 32rpx 0;

    .rules-title {
      display: block;
      font-size: 24rpx;
      color: var(--r-text-secondary, #909399);
      margin-bottom: 16rpx;
      font-weight: 500;
    }

    .rules-list {
      display: flex;
      flex-direction: column;
      gap: 12rpx;
    }

    .rule-item {
      display: flex;
      align-items: center;
      gap: 10rpx;

      .rule-text {
        font-size: 24rpx;
        color: var(--r-text-secondary, #c0c4cc);
        transition: color 0.3s ease;
      }

      &.fulfilled .rule-text {
        color: #67c23a;
      }
    }
  }

  .submit-section {
    margin: 48rpx 32rpx 0;

    .submit-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 88rpx;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 44rpx;
      box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.97);
        box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
      }

      &.disabled {
        opacity: 0.5;
        pointer-events: none;
        box-shadow: none;
      }

      .submit-text {
        font-size: 30rpx;
        font-weight: 600;
        color: #fff;
        letter-spacing: 2rpx;
      }
    }
  }
</style>
