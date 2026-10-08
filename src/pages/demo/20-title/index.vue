<template>
  <C_Layout>
    <view class="demo-page demo-title">
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
        <!-- 标题类型 -->
        <view class="demo-section">
          <text class="section-title">五种类型</text>
          <text class="section-desc">type 属性</text>
          <view class="my-6 space-y-4">
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="Primary 主要"
                subtitle="默认类型"
                type="primary"
              />
            </view>
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="Success 成功"
                subtitle="操作成功"
                type="success"
              />
            </view>
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="Warning 警告"
                subtitle="需要注意"
                type="warning"
              />
            </view>
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="Danger 危险"
                subtitle="危险操作"
                type="danger"
              />
            </view>
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="Info 信息"
                subtitle="一般提示"
                type="info"
              />
            </view>
          </view>
        </view>

        <!-- 标题层级 -->
        <view class="demo-section">
          <text class="section-title">标题层级</text>
          <text class="section-desc">level 属性</text>
          <view class="my-6 space-y-4">
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="Level 1 一级标题"
                :level="1"
                type="primary"
              />
            </view>
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="Level 2 二级标题"
                :level="2"
                type="primary"
              />
            </view>
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="Level 3 三级标题"
                :level="3"
                type="primary"
              />
            </view>
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="Level 4 四级标题"
                :level="4"
                type="primary"
              />
            </view>
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="Level 5 五级标题"
                :level="5"
                type="primary"
              />
            </view>
          </view>
        </view>

        <!-- 图标与装饰 -->
        <view class="demo-section">
          <text class="section-title">图标与装饰</text>
          <text class="section-desc">left-icon & show-decoration</text>
          <view class="my-6 space-y-4">
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="带图标标题"
                subtitle="带装饰条"
                left-icon="i-mdi-rocket-launch"
                :show-decoration="true"
                type="primary"
              />
            </view>
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="纯文字标题"
                subtitle="无图标无装饰"
                type="success"
              />
            </view>
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="仅图标"
                left-icon="i-mdi-heart"
                type="danger"
              />
            </view>
          </view>
        </view>

        <!-- 对齐方式 -->
        <view class="demo-section">
          <text class="section-title">对齐方式</text>
          <text class="section-desc">align 属性</text>
          <view class="my-6 space-y-4">
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="左对齐"
                subtitle="align=left"
                type="primary"
                align="left"
              />
            </view>
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="居中对齐"
                subtitle="align=center"
                type="success"
                align="center"
              />
            </view>
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="右对齐"
                subtitle="align=right"
                type="warning"
                align="right"
              />
            </view>
          </view>
        </view>

        <!-- 分割线 -->
        <view class="demo-section">
          <text class="section-title">分割线</text>
          <text class="section-desc">show-divider 属性</text>
          <view class="my-6 space-y-4">
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="底部分割线"
                subtitle="默认位置"
                :show-divider="true"
                type="primary"
              />
            </view>
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="顶部分割线"
                subtitle="divider-position=top"
                :show-divider="true"
                divider-position="top"
                type="success"
              />
            </view>
          </view>
        </view>

        <!-- 尺寸 -->
        <view class="demo-section">
          <text class="section-title">尺寸</text>
          <text class="section-desc">size 属性</text>
          <view class="my-6 space-y-4">
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="小尺寸"
                size="small"
                type="primary"
                left-icon="i-mdi-minus"
              />
            </view>
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="中等尺寸"
                size="medium"
                type="success"
                left-icon="i-mdi-circle-outline"
              />
            </view>
            <view class="p-3 demo-subtle rounded-lg">
              <C_Title
                title="大尺寸"
                size="large"
                type="danger"
                left-icon="i-mdi-plus"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META } from './data'
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
