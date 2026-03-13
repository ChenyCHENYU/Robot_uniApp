<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Badge 徽标</text>
        <text class="demo-subtitle">用于展示未读消息数、状态提示的角标组件</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <view class="badge-row">
            <C_Badge :value="5">
              <view class="badge-box">消息</view>
            </C_Badge>
            <C_Badge :value="12">
              <view class="badge-box">通知</view>
            </C_Badge>
            <C_Badge :value="100">
              <view class="badge-box">购物车</view>
            </C_Badge>
          </view>
          <view class="code-block">
            &lt;C_Badge :value="5"&gt;&lt;view&gt;消息&lt;/view&gt;&lt;/C_Badge&gt;
          </view>
        </view>
      </view>

      <!-- 最大值 -->
      <view class="demo-section">
        <text class="section-title">最大值</text>
        <view class="demo-card">
          <view class="badge-row">
            <C_Badge :value="100" :max="99">
              <view class="badge-box">默认99</view>
            </C_Badge>
            <C_Badge :value="21" :max="20">
              <view class="badge-box">最大20</view>
            </C_Badge>
            <C_Badge :value="200" :max="999">
              <view class="badge-box">最大999</view>
            </C_Badge>
          </view>
          <view class="code-block">
            &lt;C_Badge :value="100" :max="99"&gt;...&lt;/C_Badge&gt;
          </view>
        </view>
      </view>

      <!-- 圆点模式 -->
      <view class="demo-section">
        <text class="section-title">圆点模式</text>
        <view class="demo-card">
          <view class="badge-row">
            <C_Badge dot>
              <view class="badge-box">消息</view>
            </C_Badge>
            <C_Badge dot color="#67c23a">
              <view class="badge-box">在线</view>
            </C_Badge>
            <C_Badge dot color="#e6a23c">
              <view class="badge-box">离开</view>
            </C_Badge>
          </view>
          <view class="code-block">
            &lt;C_Badge dot&gt;...&lt;/C_Badge&gt;
          </view>
        </view>
      </view>

      <!-- 自定义颜色 -->
      <view class="demo-section">
        <text class="section-title">自定义颜色</text>
        <view class="demo-card">
          <view class="badge-row">
            <C_Badge :value="8" color="#007aff">
              <view class="badge-box">蓝色</view>
            </C_Badge>
            <C_Badge :value="8" color="#67c23a">
              <view class="badge-box">绿色</view>
            </C_Badge>
            <C_Badge :value="8" color="#e6a23c">
              <view class="badge-box">橙色</view>
            </C_Badge>
          </view>
          <view class="code-block">
            &lt;C_Badge :value="8" color="#007aff"&gt;...&lt;/C_Badge&gt;
          </view>
        </view>
      </view>

      <!-- 字符串值 -->
      <view class="demo-section">
        <text class="section-title">字符串值</text>
        <view class="demo-card">
          <view class="badge-row">
            <C_Badge value="NEW">
              <view class="badge-box">新品</view>
            </C_Badge>
            <C_Badge value="HOT" color="#f56c6c">
              <view class="badge-box">热销</view>
            </C_Badge>
          </view>
          <view class="code-block">
            &lt;C_Badge value="NEW"&gt;...&lt;/C_Badge&gt;
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
.badge-row {
  display: flex; flex-wrap: wrap; gap: 40rpx; align-items: center; margin-bottom: 20rpx;
}
.badge-box {
  width: 80rpx; height: 80rpx; background: #f0f0f0; border-radius: 12rpx; display: flex; align-items: center; justify-content: center; font-size: 22rpx; color: #666;
}
.code-block {
  background: #f5f5f5; border-radius: 8rpx; padding: 16rpx 20rpx; font-size: 22rpx; color: #555; font-family: monospace;
}
</style>
