<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Watermark 水印</text>
        <text class="demo-subtitle">页面安全水印，防止截图泄露信息</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <view class="watermark-preview">
            <C_Watermark text="Robot App" :fullPage="false">
              <view class="preview-content">
                <text>这是带水印的内容区域，水印文字会平铺在内容之上。</text>
              </view>
            </C_Watermark>
          </view>
          <view class="code-block mt-3">
            &lt;C_Watermark text="Robot App"&gt;
              &lt;view&gt;内容&lt;/view&gt;
            &lt;/C_Watermark&gt;
          </view>
        </view>
      </view>

      <!-- 自定义文字 -->
      <view class="demo-section">
        <text class="section-title">自定义水印文字</text>
        <view class="demo-card">
          <view class="watermark-preview">
            <C_Watermark :text="customText" :fullPage="false">
              <view class="preview-content">
                <text>自定义水印文字内容展示区域</text>
              </view>
            </C_Watermark>
          </view>
          <view class="input-row">
            <text class="input-label">水印文字：</text>
            <input class="input-field" v-model="customText" placeholder="输入水印文字" />
          </view>
        </view>
      </view>

      <!-- 自定义旋转角度 -->
      <view class="demo-section">
        <text class="section-title">旋转角度</text>
        <view class="demo-card">
          <view class="angle-list">
            <view class="angle-item" v-for="angle in angles" :key="angle">
              <text class="angle-label">{{ angle }}°</text>
              <view class="watermark-small">
                <C_Watermark text="CONFIDENTIAL" :rotate="angle" :fullPage="false" :fontSize="12" color="rgba(255,0,0,0.08)">
                  <view class="small-content"></view>
                </C_Watermark>
              </view>
            </view>
          </view>
          <view class="code-block mt-3">
            &lt;C_Watermark text="CONFIDENTIAL" :rotate="-45" /&gt;
          </view>
        </view>
      </view>

      <!-- 全页面水印 -->
      <view class="demo-section">
        <text class="section-title">全页面水印</text>
        <view class="demo-card">
          <text class="demo-desc">设置 fullPage 为 true 时，水印覆盖整个页面（默认行为）</text>
          <view class="code-block">
            &lt;C_Watermark text="机密文件" :fullPage="true" /&gt;
          </view>
        </view>
      </view>

      <!-- Props -->
      <view class="demo-section">
        <text class="section-title">Props 一览</text>
        <view class="demo-card">
          <view class="prop-list">
            <view class="prop-item">
              <text class="prop-name">text</text>
              <text class="prop-desc">水印文字</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">fontSize</text>
              <text class="prop-desc">字号(px)，默认 14</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">color</text>
              <text class="prop-desc">颜色，默认 rgba(0,0,0,0.05)</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">rotate</text>
              <text class="prop-desc">旋转角度，默认 -22</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">gap</text>
              <text class="prop-desc">间距 [x, y]，默认 [100,100]</text>
            </view>
            <view class="prop-item">
              <text class="prop-name">fullPage</text>
              <text class="prop-desc">是否覆盖整个页面</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
import { ref } from 'vue'

const customText = ref('Robot App')
const angles = [-45, -22, 0, 22]
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
.demo-desc {
  display: block; font-size: 26rpx; color: #666; margin-bottom: 16rpx;
}
.watermark-preview {
  border: 1rpx solid #e4e7ed; border-radius: 12rpx; overflow: hidden; margin-bottom: 16rpx;
}
.preview-content {
  padding: 40rpx; min-height: 200rpx; display: flex; align-items: center; justify-content: center; font-size: 28rpx; color: #666;
}
.input-row {
  display: flex; align-items: center; margin-top: 16rpx;
  .input-label { font-size: 26rpx; color: #333; min-width: 140rpx; }
  .input-field { flex: 1; border: 1rpx solid #e4e7ed; padding: 12rpx 16rpx; border-radius: 8rpx; font-size: 26rpx; }
}
.angle-list {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 16rpx; margin-bottom: 16rpx;
  .angle-item { text-align: center; }
  .angle-label { display: block; font-size: 22rpx; color: #999; margin-bottom: 8rpx; }
  .watermark-small { border: 1rpx solid #f0f0f0; border-radius: 8rpx; overflow: hidden; }
  .small-content { height: 120rpx; }
}
.mt-3 { margin-top: 20rpx; }
.code-block {
  background: #f5f5f5; border-radius: 8rpx; padding: 16rpx 20rpx; font-size: 22rpx; color: #555; font-family: monospace;
}
.prop-list {
  .prop-item { display: flex; justify-content: space-between; padding: 12rpx 0; border-bottom: 1rpx solid #f0f0f0; }
  .prop-name { font-size: 24rpx; color: #007aff; font-weight: 600; font-family: monospace; }
  .prop-desc { font-size: 24rpx; color: #666; }
}
</style>
