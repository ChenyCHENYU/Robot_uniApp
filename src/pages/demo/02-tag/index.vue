<template>
  <C_Layout>
    <view class="demo-page demo-tag">
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
        <!-- 基础类型 -->
        <view class="demo-section">
          <text class="section-title">基础类型</text>
          <text class="section-desc">五种语义色系</text>
          <view
            class="flex flex-wrap justify-center items-center gap-3 demo-preview"
          >
            <C_Tag
              text="主要"
              type="primary"
            />
            <C_Tag
              text="成功"
              type="success"
            />
            <C_Tag
              text="警告"
              type="warning"
            />
            <C_Tag
              text="错误"
              type="error"
            />
            <C_Tag
              text="信息"
              type="info"
            />
          </view>
        </view>

        <!-- 实心模式 -->
        <view class="demo-section">
          <text class="section-title">实心模式</text>
          <text class="section-desc">填充色更醒目</text>
          <view
            class="flex flex-wrap justify-center items-center gap-3 demo-preview"
          >
            <C_Tag
              text="主要"
              type="primary"
              :plain="false"
            />
            <C_Tag
              text="成功"
              type="success"
              :plain="false"
            />
            <C_Tag
              text="警告"
              type="warning"
              :plain="false"
            />
            <C_Tag
              text="错误"
              type="error"
              :plain="false"
            />
            <C_Tag
              text="信息"
              type="info"
              :plain="false"
            />
          </view>
        </view>

        <!-- 圆角标签 -->
        <view class="demo-section">
          <text class="section-title">圆角胶囊</text>
          <text class="section-desc">round 属性</text>
          <view
            class="flex flex-wrap justify-center items-center gap-3 demo-preview"
          >
            <C_Tag
              text="朴素圆角"
              type="primary"
              round
            />
            <C_Tag
              text="朴素圆角"
              type="success"
              round
            />
            <C_Tag
              text="实心圆角"
              type="warning"
              round
              :plain="false"
            />
            <C_Tag
              text="实心圆角"
              type="error"
              round
              :plain="false"
            />
          </view>
        </view>

        <!-- 尺寸 -->
        <view class="demo-section">
          <text class="section-title">标签尺寸</text>
          <text class="section-desc">small / default / large</text>
          <view
            class="flex flex-wrap justify-center items-end gap-3 demo-preview"
          >
            <C_Tag
              text="小号"
              type="primary"
              size="small"
            />
            <C_Tag
              text="默认"
              type="primary"
              size="default"
            />
            <C_Tag
              text="大号"
              type="primary"
              size="large"
            />
          </view>
        </view>

        <!-- 可关闭 -->
        <view class="demo-section">
          <text class="section-title">可关闭标签</text>
          <text class="section-desc">点击 × 移除</text>
          <view
            class="flex flex-wrap justify-center items-center gap-3 demo-preview min-h-12"
          >
            <C_Tag
              v-for="tag in closableTags"
              :key="tag"
              :text="tag"
              type="primary"
              closeable
              @close="removeTag(tag)"
            />
            <text
              v-if="!closableTags.length"
              class="text-sm demo-muted"
              >已全部移除</text
            >
          </view>
          <view
            v-if="!closableTags.length"
            class="text-center mt-2"
          >
            <button
              class="demo-button demo-button--quiet"
              @click="resetTags"
              >重置</button
            >
          </view>
        </view>

        <!-- 业务场景 -->
        <view class="demo-section">
          <text class="section-title">业务场景</text>
          <text class="section-desc">实际应用示例</text>
          <view class="demo-preview space-y-4">
            <view class="flex items-center gap-2">
              <text class="text-sm demo-regular w-16">订单：</text>
              <C_Tag
                text="待付款"
                type="warning"
                size="small"
              />
              <C_Tag
                text="已发货"
                type="primary"
                size="small"
              />
              <C_Tag
                text="已完成"
                type="success"
                size="small"
              />
            </view>
            <view class="flex items-center gap-2">
              <text class="text-sm demo-regular w-16">角色：</text>
              <C_Tag
                text="管理员"
                type="error"
                size="small"
                round
                :plain="false"
              />
              <C_Tag
                text="编辑"
                type="primary"
                size="small"
                round
                :plain="false"
              />
              <C_Tag
                text="访客"
                type="info"
                size="small"
                round
                :plain="false"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { PAGE_META, useDemo } from './data'
  const { closableTags, removeTag, resetTags } = useDemo()
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
