<template>
  <C_Layout>
    <view class="demo-page demo-cascader">
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
        <!-- 地区选择 -->
        <view class="demo-section">
          <text class="section-title">地区选择</text>
          <text class="section-desc">省/市/区 三级联动</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button"
              @click="showArea = true"
            >
              {{ areaText || '请选择地区' }}
            </button>
          </view>
          <C_Cascader
            v-model:visible="showArea"
            :options="areaOptions"
            :defaultValue="areaValues"
            title="选择地区"
            valueKey="code"
            labelKey="name"
            @confirm="onAreaConfirm"
          />
        </view>

        <!-- 分类选择 -->
        <view class="demo-section">
          <text class="section-title">分类选择</text>
          <text class="section-desc">自定义高亮颜色</text>
          <view class="demo-preview text-center">
            <button
              class="demo-button"
              @click="showCategory = true"
              >选择分类</button
            >
            <text
              v-if="categoryText"
              class="text-xs demo-muted block mt-3"
              >{{ categoryText }}</text
            >
          </view>
          <C_Cascader
            v-model:visible="showCategory"
            :options="categoryOptions"
            :defaultValue="categoryValues"
            title="选择分类"
            class="cascader-custom"
            @confirm="onCategoryConfirm"
          />
        </view>

        <!-- 应用场景 -->
        <view class="demo-section">
          <text class="section-title">应用场景</text>
          <view class="my-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-map-marker-outline"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">地区选择</text>
              <text class="text-xs demo-muted">省市区联动</text>
            </view>
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-folder-outline"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">分类导航</text>
              <text class="text-xs demo-muted">多层级分类</text>
            </view>
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-office-building-outline"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">组织架构</text>
              <text class="text-xs demo-muted">部门/组/人</text>
            </view>
            <view class="p-4 demo-subtle rounded-lg text-center">
              <C_Icon
                name="i-mdi-magnify"
                :size="24"
                class="demo-feature-icon"
              />
              <text class="text-sm font-bold block">搜索过滤</text>
              <text class="text-xs demo-muted">filterable</text>
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
    showArea,
    showCategory,
    areaText,
    areaValues,
    categoryValues,
    categoryText,
    areaOptions,
    categoryOptions,
    onAreaConfirm,
    onCategoryConfirm,
  } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
