<template>
  <C_Layout :show-back="true" title="测试返回页面" @back-click="handleBack">
    <view class="test-content">
      <view class="content-card">
        <text class="title">返回按钮测试页面</text>
        <text class="desc">这个页面用于测试返回按钮是否正常显示和工作</text>

        <view class="info-section">
          <text class="info-title">测试说明：</text>
          <text class="info-item">1. 页面头部应显示返回按钮</text>
          <text class="info-item"
            >2. 返回按钮应使用 mdi:keyboard-return 图标</text
          >
          <text class="info-item">3. 点击返回按钮应触发返回功能</text>
        </view>

        <button class="test-btn" @click="handleBack">点击测试返回功能</button>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
const handleBack = () => {
  uni.navigateBack({
    fail: () => {
      // 如果没有上一页，跳转到首页
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
  });
};
</script>

<style lang="scss" scoped>
.test-content {
  padding: 40rpx;
  min-height: calc(100vh - 200rpx);

  .content-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 20rpx;
    padding: 40rpx;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);

    .title {
      display: block;
      font-size: 36rpx;
      font-weight: 700;
      color: #2c3e50;
      text-align: center;
      margin-bottom: 20rpx;
    }

    .desc {
      display: block;
      font-size: 28rpx;
      color: #6c757d;
      text-align: center;
      margin-bottom: 40rpx;
      line-height: 1.6;
    }

    .info-section {
      background: #f1f8ff;
      border-radius: 16rpx;
      padding: 30rpx;
      margin-bottom: 40rpx;

      .info-title {
        display: block;
        font-size: 32rpx;
        font-weight: 600;
        color: #409eff;
        margin-bottom: 20rpx;
      }

      .info-item {
        display: block;
        font-size: 26rpx;
        color: #555;
        margin-bottom: 15rpx;
        line-height: 1.5;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .test-btn {
      width: 100%;
      height: 80rpx;
      background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
      border: none;
      border-radius: 40rpx;
      color: white;
      font-size: 32rpx;
      font-weight: 500;
      box-shadow: 0 4px 15px rgba(64, 158, 255, 0.3);

      &:active {
        transform: scale(0.98);
      }
    }
  }
}
</style>
