<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Title 标题</text>
        <text class="demo-subtitle">通用标题组件，支持多种类型、级别、装饰和图标</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <view class="title-list">
            <C_Title title="默认标题" />
            <C_Title title="带副标题" subtitle="这是一段副标题描述文字" />
          </view>
          <view class="code-block mt-3">
            &lt;C_Title title="标题" subtitle="副标题" /&gt;
          </view>
        </view>
      </view>

      <!-- 类型 -->
      <view class="demo-section">
        <text class="section-title">主题类型</text>
        <view class="demo-card">
          <view class="title-list">
            <C_Title title="Default" type="default" />
            <C_Title title="Primary" type="primary" />
            <C_Title title="Success" type="success" />
            <C_Title title="Warning" type="warning" />
            <C_Title title="Danger" type="danger" />
            <C_Title title="Info" type="info" />
          </view>
          <view class="code-block mt-3">
            &lt;C_Title title="Primary" type="primary" /&gt;
          </view>
        </view>
      </view>

      <!-- 级别 -->
      <view class="demo-section">
        <text class="section-title">标题级别</text>
        <view class="demo-card">
          <view class="title-list">
            <C_Title title="Level 1" :level="1" type="primary" />
            <C_Title title="Level 2" :level="2" type="primary" />
            <C_Title title="Level 3" :level="3" type="primary" />
            <C_Title title="Level 4" :level="4" type="primary" />
            <C_Title title="Level 5" :level="5" type="primary" />
          </view>
          <view class="code-block mt-3">
            &lt;C_Title title="Level 1" :level="1" /&gt;
          </view>
        </view>
      </view>

      <!-- 尺寸 -->
      <view class="demo-section">
        <text class="section-title">尺寸</text>
        <view class="demo-card">
          <view class="title-list">
            <C_Title title="Small" size="small" type="success" />
            <C_Title title="Medium" size="medium" type="success" />
            <C_Title title="Large" size="large" type="success" />
          </view>
          <view class="code-block mt-3">
            &lt;C_Title title="Large" size="large" /&gt;
          </view>
        </view>
      </view>

      <!-- 图标 -->
      <view class="demo-section">
        <text class="section-title">带图标</text>
        <view class="demo-card">
          <view class="title-list">
            <C_Title title="左侧图标" left-icon="i-mdi-star" type="warning" />
            <C_Title title="右侧图标" right-icon="i-mdi-arrow-right" type="primary" />
            <C_Title title="双侧图标" left-icon="i-mdi-heart" right-icon="i-mdi-chevron-right" type="danger" />
          </view>
          <view class="code-block mt-3">
            &lt;C_Title title="左侧图标" left-icon="i-mdi-star" /&gt;
          </view>
        </view>
      </view>

      <!-- 对齐方式 -->
      <view class="demo-section">
        <text class="section-title">对齐方式</text>
        <view class="demo-card">
          <view class="title-list">
            <C_Title title="左对齐" align="left" type="info" />
            <C_Title title="居中" align="center" type="info" />
            <C_Title title="右对齐" align="right" type="info" />
          </view>
        </view>
      </view>

      <!-- 装饰 -->
      <view class="demo-section">
        <text class="section-title">装饰 & 分割线</text>
        <view class="demo-card">
          <view class="title-list">
            <C_Title title="带装饰" type="primary" :showDecoration="true" />
            <C_Title title="带分割线" type="success" :showDivider="true" />
            <C_Title title="顶部分割线" type="warning" :showDivider="true" dividerPosition="top" />
          </view>
          <view class="code-block mt-3">
            &lt;C_Title title="带装饰" :showDecoration="true" /&gt;
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.demo-page {
  min-height: 100%;
  background: #f5f7fa;
  padding: 24rpx 32rpx;
}
.demo-header {
  margin-bottom: 40rpx;
  .demo-title { display: block; font-size: 44rpx; font-weight: 700; color: #1f2937; margin-bottom: 8rpx; }
  .demo-subtitle { display: block; font-size: 26rpx; color: #666; }
}
.demo-section {
  margin-bottom: 40rpx;
  .section-title { display: block; font-size: 30rpx; font-weight: 600; color: #1f2937; margin-bottom: 20rpx; padding-left: 16rpx; border-left: 6rpx solid #667eea; }
}
.demo-card {
  background: #fff; border-radius: 20rpx; padding: 32rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04); border: 1rpx solid rgba(0,0,0,0.04);
}
.title-list {
  display: flex; flex-direction: column; gap: 20rpx;
}
.mt-3 { margin-top: 20rpx; }
.code-block {
  background: #f5f5f5; border-radius: 8rpx; padding: 16rpx 20rpx; font-size: 22rpx; color: #555; font-family: monospace;
}
</style>
