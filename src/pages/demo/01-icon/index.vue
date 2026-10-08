<template>
  <C_Layout>
    <view class="demo-page demo-icon">
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

      <view class="demo-section icon-playground">
        <view class="icon-playground__selection">
          <button
            class="icon-playground__preview"
            aria-label="点击当前图标"
            @click="handleIconClick"
          >
            <C_Icon
              :name="selectedIcon.name"
              :size="selectedSize"
              :color="selectedColor"
            />
          </button>
          <view class="icon-playground__detail">
            <text class="icon-playground__label">{{ selectedIcon.label }}</text>
            <text class="icon-playground__name">{{ selectedIcon.name }}</text>
            <text class="icon-playground__status">{{ lastIconAction }}</text>
          </view>
        </view>
        <view class="icon-control">
          <text class="icon-control__label">尺寸</text>
          <view class="icon-control__options">
            <button
              v-for="size in SIZE_OPTIONS"
              :key="size"
              class="icon-option"
              :class="{ 'icon-option--selected': selectedSize === size }"
              :aria-pressed="selectedSize === size"
              @click="selectedSize = size"
              >{{ size }}</button
            >
          </view>
        </view>
        <view class="icon-control">
          <text class="icon-control__label">颜色</text>
          <view class="icon-control__options">
            <button
              v-for="color in COLOR_OPTIONS"
              :key="color.id"
              class="icon-option"
              :class="{
                'icon-option--selected': selectedColor === color.value,
              }"
              :aria-pressed="selectedColor === color.value"
              :disabled="isColored"
              @click="selectedColor = color.value"
              >{{ color.label }}</button
            >
          </view>
        </view>
        <view class="icon-playground__footer">
          <text class="icon-playground__note">{{
            isColored ? '彩色图标使用原始配色' : '单色图标跟随所选颜色'
          }}</text>
          <button
            class="icon-copy"
            @click="copyIconName"
            >复制名称</button
          >
        </view>
      </view>

      <view class="demo-grid">
        <view
          v-for="collection in ICON_COLLECTIONS"
          :key="collection.id"
          class="demo-section icon-collection"
          :data-collection="collection.id"
        >
          <view class="icon-collection__heading">
            <text class="icon-collection__title">{{ collection.title }}</text>
            <text class="icon-collection__kind">{{
              collection.colored ? '彩色' : '单色'
            }}</text>
          </view>
          <text class="section-desc">{{ collection.description }}</text>
          <view class="icon-sample-grid">
            <button
              v-for="icon in collection.icons"
              :key="icon.name"
              class="icon-sample"
              :class="{
                'icon-sample--selected': selectedIcon.name === icon.name,
              }"
              :aria-pressed="selectedIcon.name === icon.name"
              :aria-label="collection.title + ' ' + icon.label"
              @click="selectIcon(icon)"
            >
              <C_Icon
                :name="icon.name"
                :size="30"
                color="var(--r-text-primary)"
              />
              <text class="icon-sample__label">{{ icon.label }}</text>
            </button>
          </view>
        </view>

        <view class="demo-section icon-font-section">
          <view class="icon-collection__heading"
            ><text class="icon-collection__title">Wot 字体图标</text
            ><text class="icon-collection__kind">字体</text></view
          >
          <text class="section-desc">组件库内置字形，颜色与尺寸保持一致。</text>
          <view class="icon-sample-grid">
            <view
              v-for="icon in WOT_SAMPLES"
              :key="icon.name"
              class="icon-sample"
            >
              <C_Icon
                type="wot"
                :name="icon.name"
                :size="30"
                color="var(--r-text-primary)"
              />
              <text class="icon-sample__label">{{ icon.label }}</text>
            </view>
          </view>
        </view>

        <view class="demo-section icon-resource-section">
          <text class="section-title">SVG 与图片</text>
          <text class="section-desc"
            >真实 SVG 图形与本地图片资源，加载失败会显示提示。</text
          >
          <view class="icon-resource-grid">
            <view class="icon-resource"
              ><C_Icon
                type="svg"
                name="/static/icons/demo-symbol.svg"
                :size="36"
              /><text>本地 SVG</text></view
            >
            <view class="icon-resource"
              ><C_Icon
                type="svg"
                :name="SVG_DATA_URI"
                :size="36"
              /><text>Base64 SVG</text></view
            >
            <view class="icon-resource"
              ><C_Icon
                type="image"
                name="/static/images/logo.png"
                :size="36"
              /><text>品牌图片</text></view
            >
            <view class="icon-resource"
              ><C_Icon
                type="image"
                name="/static/images/default-avatar.png"
                :size="36"
              /><text>头像图片</text></view
            >
          </view>
        </view>

        <view class="demo-section icon-custom-section">
          <text class="section-title">自定义内容</text>
          <text class="section-desc">用字母或组合图形表达清晰含义。</text>
          <view class="icon-custom-grid">
            <view class="icon-resource"
              ><C_Icon type="custom"><view class="icon-letter">A</view></C_Icon
              ><text>字母标记</text></view
            >
            <view class="icon-resource"
              ><C_Icon type="custom"
                ><view class="icon-composed"
                  ><C_Icon
                    name="i-mdi-check"
                    :size="22"
                    color="var(--r-color-success)" /></view></C_Icon
              ><text>完成标记</text></view
            >
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import {
    PAGE_META,
    ICON_COLLECTIONS,
    WOT_SAMPLES,
    SIZE_OPTIONS,
    COLOR_OPTIONS,
    SVG_DATA_URI,
    useDemo,
  } from './data'
  const {
    selectedIcon,
    selectedSize,
    selectedColor,
    isColored,
    lastIconAction,
    selectIcon,
    handleIconClick,
    copyIconName,
  } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
