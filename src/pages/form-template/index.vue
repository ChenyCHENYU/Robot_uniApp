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
              @blur="validateField('name')"
            /><text
              v-if="errors.name"
              class="field-error"
              >{{ errors.name }}</text
            >
          </view>
          <view class="form-item">
            <text class="form-label"
              >手机号 <text class="required">*</text></text
            >
            <input
              v-model="form.phone"
              type="number"
              maxlength="11"
              placeholder="请输入手机号"
              class="form-input"
              @blur="validateField('phone')"
            /><text
              v-if="errors.phone"
              class="field-error"
              >{{ errors.phone }}</text
            >
          </view>
          <view class="form-item">
            <text class="form-label">邮箱</text>
            <input
              v-model="form.email"
              placeholder="请输入邮箱地址"
              class="form-input"
              @blur="validateField('email')"
            /><text
              v-if="errors.email"
              class="field-error"
              >{{ errors.email }}</text
            >
          </view>
          <view class="form-item">
            <text class="form-label">性别 <text class="required">*</text></text>
            <view class="radio-group">
              <view
                v-for="opt in genderOptions"
                :key="opt.value"
                class="radio-item"
                :class="{ active: form.gender === opt.value }"
                @click="selectGender(opt.value)"
              >
                <view class="radio-dot"></view>
                <text class="radio-text">{{ opt.label }}</text>
              </view> </view
            ><text
              v-if="errors.gender"
              class="field-error"
              >{{ errors.gender }}</text
            >
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
              /> </view
            ><text
              v-if="errors.department"
              class="field-error"
              >{{ errors.department }}</text
            >
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
            <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
            <picker
              mode="date"
              :value="form.joinDate"
              @change="handleDateChange"
              ><view class="select-input">
                <text :class="['select-text', { placeholder: !form.joinDate }]">
                  {{ form.joinDate || '请选择日期' }}
                </text>
                <wd-icon
                  name="calendar"
                  size="14px"
                  color="#ccc"
                /> </view
            ></picker>
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
          :class="{ disabled: submitting }"
          @click="handleSubmit"
        >
          <C_LoadingIndicator
            v-if="submitting"
            size="small"
            color="var(--r-on-primary, #fff)"
          />
          <text class="btn-text white">{{
            submitting ? '提交中...' : '提交'
          }}</text>
        </view>
      </view>
    </view>

    <!-- 部门选择器 -->
    <C_ActionSheet
      v-model:visible="showDeptPicker"
      title="选择部门"
      :actions="deptActions"
      :selected-index="selectedDeptIndex"
      @select="onDeptSheetSelect"
    />
  </C_Layout>
</template>

<script setup lang="ts">
  import { useFormTemplatePage } from './data'
  import C_LoadingIndicator from '@/components/global/C_LoadingIndicator/index.vue'

  const {
    submitting,
    showDeptPicker,
    form,
    errors,
    genderOptions,
    deptActions,
    selectedDeptIndex,
    skillTags,
    validateField,
    toggleSkill,
    onDeptSheetSelect,
    selectGender,
    handleDateChange,
    handleReset,
    handleSubmit,
  } = useFormTemplatePage()
</script>

<style lang="scss" scoped src="./index.scss"></style>
