<!--
 * @Description: 表单模板页 - 复杂表单提交
-->
<template>
  <C_Layout>
    <view class="form-page">
      <view class="form-header">
        <text class="form-title">信息填报</text>
        <text class="form-subtitle">请完整填写以下信息</text>
      </view>

      <!-- 基本信息 -->
      <view class="form-section">
        <text class="section-title">基本信息</text>
        <view class="section-card">
          <view class="form-item">
            <text class="form-label">姓名 <text class="required">*</text></text>
            <input
              v-model="form.name"
              placeholder="请输入姓名"
              class="form-input"
            />
          </view>
          <view class="form-item">
            <text class="form-label"
              >手机号 <text class="required">*</text></text
            >
            <input
              v-model="form.phone"
              type="number"
              placeholder="请输入手机号"
              class="form-input"
            />
          </view>
          <view class="form-item">
            <text class="form-label">邮箱</text>
            <input
              v-model="form.email"
              placeholder="请输入邮箱地址"
              class="form-input"
            />
          </view>
          <view class="form-item">
            <text class="form-label">性别 <text class="required">*</text></text>
            <view class="radio-group">
              <view
                v-for="opt in genderOptions"
                :key="opt.value"
                class="radio-item"
                :class="{ active: form.gender === opt.value }"
                @click="form.gender = opt.value"
              >
                <view class="radio-dot"></view>
                <text class="radio-text">{{ opt.label }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 详细信息 -->
      <view class="form-section">
        <text class="section-title">详细信息</text>
        <view class="section-card">
          <view class="form-item">
            <text class="form-label">部门 <text class="required">*</text></text>
            <view
              class="select-input"
              @click="showDeptPicker = true"
            >
              <text :class="['select-text', { placeholder: !form.department }]">
                {{ form.department || '请选择部门' }}
              </text>
              <wd-icon
                name="arrow-right"
                size="14px"
                color="#ccc"
              />
            </view>
          </view>
          <view class="form-item">
            <text class="form-label">职位</text>
            <input
              v-model="form.position"
              placeholder="请输入职位"
              class="form-input"
            />
          </view>
          <view class="form-item">
            <text class="form-label">入职日期</text>
            <view
              class="select-input"
              @click="pickDate"
            >
              <text :class="['select-text', { placeholder: !form.joinDate }]">
                {{ form.joinDate || '请选择日期' }}
              </text>
              <wd-icon
                name="calendar"
                size="14px"
                color="#ccc"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 补充信息 -->
      <view class="form-section">
        <text class="section-title">补充信息</text>
        <view class="section-card">
          <view class="form-item">
            <text class="form-label">技能标签</text>
            <view class="tags-wrap">
              <view
                v-for="tag in skillTags"
                :key="tag"
                class="skill-tag"
                :class="{ active: form.skills.includes(tag) }"
                @click="toggleSkill(tag)"
              >
                <text class="tag-text">{{ tag }}</text>
              </view>
            </view>
          </view>
          <view class="form-item">
            <text class="form-label">备注</text>
            <textarea
              v-model="form.remark"
              placeholder="请输入备注信息"
              class="form-textarea"
              :maxlength="200"
            />
            <text class="word-count">{{ form.remark.length }}/200</text>
          </view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <view
          class="submit-btn secondary"
          @click="handleReset"
        >
          <text class="btn-text">重置</text>
        </view>
        <view
          class="submit-btn primary"
          @click="handleSubmit"
        >
          <wd-loading
            v-if="submitting"
            :size="18"
            color="#fff"
          />
          <text class="btn-text white">{{
            submitting ? '提交中...' : '提交'
          }}</text>
        </view>
      </view>
    </view>

    <!-- 部门选择器 -->
    <wd-action-sheet
      v-model="showDeptPicker"
      :actions="deptActions"
      @select="onDeptSelect"
    />
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'

  const submitting = ref(false)
  const showDeptPicker = ref(false)

  const pickDate = () => {
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    form.joinDate = dateStr
    uni.showToast({ title: `已选择 ${dateStr}`, icon: 'none' })
  }

  const form = reactive({
    name: '',
    phone: '',
    email: '',
    gender: '',
    department: '',
    position: '',
    joinDate: '',
    skills: [] as string[],
    remark: '',
  })

  const genderOptions = [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
  ]

  const deptActions = [
    { name: '技术部' },
    { name: '产品部' },
    { name: '设计部' },
    { name: '市场部' },
    { name: '运营部' },
  ]

  const skillTags = [
    'Vue',
    'React',
    'UniApp',
    'TypeScript',
    'Node.js',
    'Python',
    'Java',
    'Go',
  ]

  const toggleSkill = (tag: string) => {
    const idx = form.skills.indexOf(tag)
    if (idx > -1) {
      form.skills.splice(idx, 1)
    } else {
      form.skills.push(tag)
    }
  }

  const onDeptSelect = (item: { name: string }) => {
    form.department = item.name
    showDeptPicker.value = false
  }

  const handleReset = () => {
    Object.assign(form, {
      name: '',
      phone: '',
      email: '',
      gender: '',
      department: '',
      position: '',
      joinDate: '',
      skills: [],
      remark: '',
    })
  }

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.gender || !form.department) {
      uni.showToast({ title: '请填写必填项', icon: 'none' })
      return
    }
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      uni.showToast({ title: '提交成功', icon: 'success' })
    }, 2000)
  }
</script>

<style lang="scss" scoped>
  .form-page {
    padding: 24rpx;
    padding-bottom: 140rpx;
    background: var(--r-bg-page);
    min-height: 100vh;
  }

  .form-header {
    padding: 20rpx 8rpx 32rpx;

    .form-title {
      display: block;
      font-size: 40rpx;
      font-weight: 700;
      color: var(--r-text-primary);
    }

    .form-subtitle {
      display: block;
      font-size: 26rpx;
      color: var(--r-text-secondary);
      margin-top: 8rpx;
    }
  }

  .form-section {
    margin-bottom: 28rpx;

    .section-title {
      display: block;
      font-size: 28rpx;
      font-weight: 600;
      color: var(--r-text-primary);
      margin-bottom: 16rpx;
      padding-left: 8rpx;
    }

    .section-card {
      padding: 8rpx 28rpx;
      background: var(--r-bg-card);
      border-radius: 20rpx;
      box-shadow: var(--r-shadow-sm);
    }
  }

  .form-item {
    padding: 24rpx 0;
    border-bottom: 1rpx solid var(--r-border-light);

    &:last-child {
      border-bottom: none;
    }

    .form-label {
      display: block;
      font-size: 26rpx;
      color: var(--r-text-secondary);
      margin-bottom: 12rpx;

      .required {
        color: #f56c6c;
      }
    }

    .form-input {
      width: 100%;
      height: 72rpx;
      font-size: 28rpx;
      color: var(--r-text-primary);
    }

    .select-input {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72rpx;

      .select-text {
        font-size: 28rpx;
        color: var(--r-text-primary);

        &.placeholder {
          color: var(--r-text-placeholder);
        }
      }
    }
  }

  .radio-group {
    display: flex;
    gap: 32rpx;

    .radio-item {
      display: flex;
      align-items: center;
      gap: 10rpx;

      .radio-dot {
        width: 36rpx;
        height: 36rpx;
        border-radius: 50%;
        border: 2rpx solid #ddd;
        position: relative;
      }

      &.active .radio-dot {
        border-color: #667eea;

        &::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20rpx;
          height: 20rpx;
          border-radius: 50%;
          background: #667eea;
        }
      }

      .radio-text {
        font-size: 28rpx;
        color: var(--r-text-primary);
      }
    }
  }

  .tags-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;

    .skill-tag {
      padding: 10rpx 24rpx;
      border-radius: 24rpx;
      background: var(--r-bg-page);
      border: 1rpx solid transparent;

      &.active {
        background: rgba(102, 126, 234, 0.1);
        border-color: #667eea;

        .tag-text {
          color: #667eea;
        }
      }

      .tag-text {
        font-size: 24rpx;
        color: var(--r-text-secondary);
      }
    }
  }

  .form-textarea {
    width: 100%;
    height: 200rpx;
    font-size: 28rpx;
    color: var(--r-text-primary);
    line-height: 1.6;
  }

  .word-count {
    display: block;
    text-align: right;
    font-size: 22rpx;
    color: var(--r-text-placeholder);
    margin-top: 8rpx;
  }

  .submit-section {
    display: flex;
    gap: 20rpx;
    padding: 20rpx 0;

    .submit-btn {
      flex: 1;
      height: 92rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8rpx;
      border-radius: 18rpx;

      &.secondary {
        background: var(--r-bg-card);
        border: 1rpx solid var(--r-border-light);
      }

      &.primary {
        background: linear-gradient(135deg, #667eea, #764ba2);
      }

      .btn-text {
        font-size: 30rpx;
        font-weight: 600;
        color: var(--r-text-primary);

        &.white {
          color: #fff;
        }
      }
    }
  }
</style>
