<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Card 卡片</text>
        <text class="demo-subtitle">通用的内容容器卡片组件，支持标题、阴影、插槽</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <C_Card title="卡片标题" subtitle="这是副标题">
            <text class="card-content">这是卡片的内容区域，可以放置任意内容。</text>
          </C_Card>
          <view class="code-block mt-3">
            &lt;C_Card title="卡片标题" subtitle="副标题"&gt;
              内容
            &lt;/C_Card&gt;
          </view>
        </view>
      </view>

      <!-- 阴影等级 -->
      <view class="demo-section">
        <text class="section-title">阴影等级</text>
        <view class="demo-card">
          <view class="card-list">
            <C_Card title="无阴影" shadow="none">
              <text>shadow="none"</text>
            </C_Card>
            <C_Card title="小阴影" shadow="sm">
              <text>shadow="sm"</text>
            </C_Card>
            <C_Card title="中阴影" shadow="md">
              <text>shadow="md"</text>
            </C_Card>
            <C_Card title="大阴影" shadow="lg">
              <text>shadow="lg"</text>
            </C_Card>
          </view>
        </view>
      </view>

      <!-- 可点击 -->
      <view class="demo-section">
        <text class="section-title">可点击卡片</text>
        <view class="demo-card">
          <C_Card title="点击我试试" clickable @click="onCardClick">
            <text class="card-content">设置 clickable 属性后，卡片会有点击态效果</text>
          </C_Card>
          <view class="code-block mt-3">
            &lt;C_Card title="点击我" clickable @click="onCardClick" /&gt;
          </view>
        </view>
      </view>

      <!-- 头部插槽 -->
      <view class="demo-section">
        <text class="section-title">自定义头部 & 底部</text>
        <view class="demo-card">
          <C_Card>
            <template #header>
              <view class="custom-header">
                <text class="custom-header-title">自定义头部</text>
                <C_Tag text="标签" type="primary" size="small" />
              </view>
            </template>
            <text class="card-content">使用 header 插槽自定义头部内容</text>
            <template #footer>
              <view class="custom-footer">
                <text class="footer-text">底部操作区</text>
              </view>
            </template>
          </C_Card>
          <view class="code-block mt-3">
            &lt;C_Card&gt;
              &lt;template #header&gt;自定义&lt;/template&gt;
              &lt;template #footer&gt;底部&lt;/template&gt;
            &lt;/C_Card&gt;
          </view>
        </view>
      </view>

      <!-- 无内边距 -->
      <view class="demo-section">
        <text class="section-title">无内边距</text>
        <view class="demo-card">
          <C_Card title="无内边距" :padding="false">
            <image
              src="https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/robot_admin/login.png"
              mode="widthFix"
              style="width: 100%"
            />
          </C_Card>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
const onCardClick = () => {
  uni.showToast({ title: '卡片被点击', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.demo-page {
  min-height: 100vh;
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
.card-content {
  font-size: 26rpx; color: #666;
}
.card-list {
  display: flex; flex-direction: column; gap: 20rpx;
}
.custom-header {
  display: flex; justify-content: space-between; align-items: center;
  .custom-header-title { font-size: 30rpx; font-weight: 600; color: #1f2937; }
}
.custom-footer {
  display: flex; justify-content: flex-end;
  .footer-text { font-size: 24rpx; color: #007aff; }
}
.mt-3 { margin-top: 20rpx; }
.code-block {
  background: #f5f5f5; border-radius: 8rpx; padding: 16rpx 20rpx; font-size: 22rpx; color: #555; font-family: monospace; white-space: pre-wrap;
}
</style>
