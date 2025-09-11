<template>
  <C_Layout>
    <view class="test-nav-content">
      <view class="content-card">
        <text class="title">导航测试页面</text>
        <text class="desc">点击下面的按钮跳转到测试返回页面</text>
        
        <button class="nav-btn" @click="goToBackTest">跳转到返回测试页面</button>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
const goToBackTest = () => {
  uni.navigateTo({
    url: "/pages/test-back/index"
  });
};
</script>

<style lang="scss" scoped>
.test-nav-content {
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
    
    .nav-btn {
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