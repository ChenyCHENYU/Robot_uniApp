<template>
  <C_Layout>
    <view class="demo-page demo-form">
      <view class="demo-hero">
        <view class="demo-hero__eyebrow"
          ><text>{{ PAGE_META.category }}</text
          ><text>{{ PAGE_META.component }}</text></view
        >
        <text class="demo-hero__title">{{ PAGE_META.title }}</text>
        <text class="demo-hero__desc">{{ PAGE_META.summary }}</text>
      </view>
      <view class="demo-tip"
        ><C_Icon
          name="i-mdi-gesture-tap"
          :size="16"
        /><text>{{ PAGE_META.instruction }}</text></view
      >

      <view class="demo-grid">
        <!-- 基础表单 -->
        <view class="demo-section">
          <text class="section-title">基础表单</text>
          <text class="section-desc">常见输入项组合</text>
          <view class="demo-preview">
            <C_Form
              ref="formRef"
              :model="formData"
              :rules="rules"
            >
              <view class="form-field"
                ><text class="form-field__label"
                  >用户名 <text class="form-field__required">*</text></text
                >
                <input
                  v-model="formData.username"
                  placeholder="请输入用户名"
                  class="w-full demo-surface border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
                <text
                  v-if="formErrors.username"
                  class="form-field__error"
                  >{{ formErrors.username }}</text
                ></view
              >
              <view class="form-field"
                ><text class="form-field__label"
                  >密码 <text class="form-field__required">*</text></text
                >
                <input
                  v-model="formData.password"
                  type="password"
                  placeholder="请输入密码"
                  class="w-full demo-surface border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
                <text
                  v-if="formErrors.password"
                  class="form-field__error"
                  >{{ formErrors.password }}</text
                ></view
              >
              <view class="form-field"
                ><text class="form-field__label">备注</text>
                <textarea
                  v-model="formData.remark"
                  placeholder="请输入备注"
                  class="w-full demo-surface border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  style="height: 80px"
                />
              </view>
            </C_Form>
            <view class="flex justify-center gap-3 mt-4">
              <button
                class="demo-button demo-button--quiet"
                @click="onReset"
                >重置</button
              >
              <button
                class="demo-button"
                @click="onSubmit"
                >提交校验</button
              >
            </view>
            <view
              v-if="validateResult !== ''"
              class="mt-3 text-center"
            >
              <text
                class="text-sm"
                :class="
                  validateResult === '校验通过'
                    ? 'text-green-500'
                    : 'text-red-500'
                "
                >{{ validateResult }}</text
              >
            </view>
          </view>
        </view>

        <!-- 校验规则 -->
        <view class="demo-section">
          <text class="section-title">表单校验</text>
          <text class="section-desc">必填 / 格式 / 长度</text>
          <view class="demo-preview space-y-3">
            <view class="flex items-center gap-3 p-3 demo-surface rounded-lg">
              <text class="i-mdi-asterisk text-lg text-red-500"></text>
              <view>
                <text class="text-sm font-medium demo-regular block"
                  >必填校验</text
                >
                <text class="text-xs demo-muted">required: true</text>
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 demo-surface rounded-lg">
              <text class="i-mdi-regex text-lg text-blue-500"></text>
              <view>
                <text class="text-sm font-medium demo-regular block"
                  >正则校验</text
                >
                <text class="text-xs demo-muted"
                  >pattern: /^[a-zA-Z0-9]+$/</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 demo-surface rounded-lg">
              <text class="i-mdi-counter text-lg text-green-500"></text>
              <view>
                <text class="text-sm font-medium demo-regular block"
                  >长度限制</text
                >
                <text class="text-xs demo-muted">min / max 属性</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 标签位置 -->
        <view class="demo-section">
          <text class="section-title">标签位置</text>
          <text class="section-desc">labelPosition 属性</text>
          <view class="demo-preview space-y-3">
            <view class="flex items-center gap-3 p-3 demo-surface rounded-lg">
              <text
                class="i-mdi-format-align-left text-lg text-blue-500"
              ></text>
              <view>
                <text class="text-sm font-medium demo-regular block"
                  >左侧标签（默认）</text
                >
                <text class="text-xs demo-muted">labelPosition="left"</text>
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 demo-surface rounded-lg">
              <text
                class="i-mdi-format-align-center text-lg text-green-500"
              ></text>
              <view>
                <text class="text-sm font-medium demo-regular block"
                  >顶部标签</text
                >
                <text class="text-xs demo-muted">labelPosition="top"</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const {
    formRef,
    formData,
    formErrors,
    validateResult,
    rules,
    onSubmit,
    onReset,
  } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
