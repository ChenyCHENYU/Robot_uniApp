<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_IndexList 索引列表</text>
        <text class="demo-subtitle">通讯录样式索引列表，右侧快速导航</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card demo-card--full">
          <C_IndexList :list="contactList" />
          <view class="code-block">
            &lt;C_IndexList :list="contactList" /&gt;
          </view>
        </view>
      </view>

      <!-- 自定义颜色 -->
      <view class="demo-section">
        <text class="section-title">自定义高亮色</text>
        <view class="demo-card demo-card--full">
          <C_IndexList
            :list="shortList"
            activeColor="#ee0a24"
          />
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  const contactList = [
    { title: 'A', items: [{ name: '阿里巴巴' }, { name: '安踏' }] },
    {
      title: 'B',
      items: [{ name: '百度' }, { name: '比亚迪' }, { name: '北京银行' }],
    },
    { title: 'C', items: [{ name: '长城汽车' }, { name: '创维' }] },
    { title: 'D', items: [{ name: '大疆' }, { name: '滴滴出行' }] },
    {
      title: 'H',
      items: [{ name: '华为' }, { name: '海尔' }, { name: '好未来' }],
    },
    { title: 'J', items: [{ name: '京东' }, { name: '极氪' }] },
    { title: 'M', items: [{ name: '美团' }, { name: '蚂蚁集团' }] },
    { title: 'T', items: [{ name: '腾讯' }, { name: '头条' }] },
    { title: 'X', items: [{ name: '小米' }, { name: '携程' }] },
    { title: 'Z', items: [{ name: '字节跳动' }, { name: '中兴' }] },
  ]

  const shortList = [
    { title: 'A', items: [{ name: 'Apple' }, { name: 'Amazon' }] },
    { title: 'G', items: [{ name: 'Google' }, { name: 'GitHub' }] },
    { title: 'M', items: [{ name: 'Microsoft' }, { name: 'Meta' }] },
  ]
</script>

<style lang="scss" scoped>
  .demo-page {
    min-height: 100%;
    background: #f5f7fa;
    padding: 24rpx 32rpx;
  }
  .demo-header {
    margin-bottom: 40rpx;
    .demo-title {
      display: block;
      font-size: 44rpx;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8rpx;
    }
    .demo-subtitle {
      display: block;
      font-size: 26rpx;
      color: #666;
    }
  }
  .demo-section {
    margin-bottom: 40rpx;
    .section-title {
      display: block;
      font-size: 30rpx;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 20rpx;
      padding-left: 16rpx;
      border-left: 6rpx solid #667eea;
    }
  }
  .demo-card {
    background: #fff;
    border-radius: 20rpx;
    padding: 32rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    border: 1rpx solid rgba(0, 0, 0, 0.04);
    &--full {
      padding: 0;
      overflow: hidden;
    }
  }
  .code-block {
    background: #f5f5f5;
    border-radius: 8rpx;
    padding: 16rpx 20rpx;
    font-size: 22rpx;
    color: #555;
    font-family: monospace;
    margin: 16rpx;
  }
</style>
