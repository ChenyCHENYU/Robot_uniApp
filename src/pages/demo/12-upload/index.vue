<template>
  <C_Layout>
    <view class="demo-page demo-upload">
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
        <!-- 基础上传 -->
        <view class="demo-section">
          <text class="section-title">基础用法</text>
          <text class="section-desc">选择本地图片，可预览或删除</text>
          <view class="demo-preview">
            <C_Upload
              v-model="fileList1"
              :maxCount="3"
            />
          </view>
          <text class="text-xs demo-muted text-center block"
            >已选 {{ fileList1.length }} / 3 张</text
          >
        </view>

        <!-- 限制数量 -->
        <view class="demo-section">
          <text class="section-title">数量限制</text>
          <text class="section-desc">maxCount 控制上传数量</text>
          <view class="demo-preview">
            <C_Upload
              v-model="fileList2"
              :maxCount="6"
            />
          </view>
          <text class="text-xs demo-muted text-center block"
            >已选 {{ fileList2.length }} / 6 张</text
          >
        </view>

        <!-- 禁用状态 -->
        <view class="demo-section">
          <text class="section-title">禁用状态</text>
          <text class="section-desc">disabled 属性</text>
          <view class="demo-preview">
            <C_Upload
              v-model="disabledList"
              disabled
            />
            <view
              class="mt-3 p-3 bg-amber-50 rounded-lg flex items-center gap-2"
            >
              <text class="i-mdi-lock text-amber-500 text-lg"></text>
              <text class="text-xs text-amber-700"
                >禁用状态：不可新增、不可删除已有图片</text
              >
            </view>
          </view>
          <text class="text-xs demo-muted text-center block"
            >禁用状态下不可新增或删除</text
          >
        </view>

        <!-- 功能特性 -->
        <view class="demo-section">
          <text class="section-title">核心能力</text>
          <view class="demo-preview grid grid-cols-1 gap-3">
            <view class="flex items-center gap-3 p-3 demo-surface rounded-lg">
              <text
                class="i-mdi-image-size-select-large text-xl text-blue-500"
              ></text>
              <view>
                <text class="text-sm font-medium demo-regular block"
                  >预览尺寸</text
                >
                <text class="text-xs demo-muted"
                  >previewSize 自定义缩略图大小</text
                >
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 demo-surface rounded-lg">
              <text class="i-mdi-file-alert text-xl text-orange-500"></text>
              <view>
                <text class="text-sm font-medium demo-regular block"
                  >大小限制</text
                >
                <text class="text-xs demo-muted">maxSize 默认 10MB</text>
              </view>
            </view>
            <view class="flex items-center gap-3 p-3 demo-surface rounded-lg">
              <text class="i-mdi-delete text-xl text-red-500"></text>
              <view>
                <text class="text-sm font-medium demo-regular block"
                  >可删除</text
                >
                <text class="text-xs demo-muted"
                  >deletable 控制删除按钮显示</text
                >
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
  const { fileList1, fileList2, disabledList } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
