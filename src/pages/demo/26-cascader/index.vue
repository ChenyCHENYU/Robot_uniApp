<template>
  <C_Layout>
    <view class="demo-page">
      <view class="demo-header">
        <text class="demo-title">C_Cascader 级联选择</text>
        <text class="demo-subtitle">多级联动选择器，用于地区、分类等场景</text>
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        <view class="demo-card">
          <view
            class="action-btn"
            @click="showBasic = true"
          >
            {{ selectedText || '请选择地区' }}
          </view>
          <C_Cascader
            :visible="showBasic"
            :options="areaOptions"
            title="选择地区"
            @confirm="onBasicConfirm"
            @close="showBasic = false"
          />
          <view class="code-block">
            &lt;C_Cascader :visible="show" :options="options"
            @confirm="onConfirm" /&gt;
          </view>
        </view>
      </view>

      <!-- 自定义颜色 -->
      <view class="demo-section">
        <text class="section-title">自定义高亮颜色</text>
        <view class="demo-card">
          <view
            class="action-btn action-btn--green"
            @click="showCustom = true"
            >选择分类</view
          >
          <C_Cascader
            :visible="showCustom"
            :options="categoryOptions"
            title="选择分类"
            activeColor="#07c160"
            @confirm="onCategoryConfirm"
            @close="showCustom = false"
          />
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const showBasic = ref(false)
  const showCustom = ref(false)
  const selectedText = ref('')

  const areaOptions = [
    {
      text: '北京市',
      value: '110000',
      children: [
        { text: '朝阳区', value: '110105' },
        { text: '海淀区', value: '110108' },
        { text: '西城区', value: '110102' },
      ],
    },
    {
      text: '上海市',
      value: '310000',
      children: [
        { text: '浦东新区', value: '310115' },
        { text: '徐汇区', value: '310104' },
        { text: '静安区', value: '310106' },
      ],
    },
    {
      text: '广东省',
      value: '440000',
      children: [
        {
          text: '广州市',
          value: '440100',
          children: [
            { text: '天河区', value: '440106' },
            { text: '越秀区', value: '440104' },
          ],
        },
        {
          text: '深圳市',
          value: '440300',
          children: [
            { text: '南山区', value: '440305' },
            { text: '福田区', value: '440304' },
          ],
        },
      ],
    },
  ]

  const categoryOptions = [
    {
      text: '电子产品',
      value: 'electronics',
      children: [
        { text: '手机', value: 'phone' },
        { text: '电脑', value: 'computer' },
        { text: '平板', value: 'tablet' },
      ],
    },
    {
      text: '服装',
      value: 'clothing',
      children: [
        { text: '男装', value: 'men' },
        { text: '女装', value: 'women' },
      ],
    },
  ]

  const onBasicConfirm = (values: { selectedOptions: { text: string }[] }) => {
    selectedText.value = values.selectedOptions.map(o => o.text).join(' / ')
    showBasic.value = false
  }

  const onCategoryConfirm = (values: {
    selectedOptions: { text: string }[]
  }) => {
    uni.showToast({
      title: values.selectedOptions.map(o => o.text).join(' > '),
      icon: 'none',
    })
    showCustom.value = false
  }
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
  }
  .action-btn {
    text-align: center;
    padding: 20rpx;
    background: #667eea;
    color: #fff;
    border-radius: 12rpx;
    font-size: 28rpx;
    &--green {
      background: #07c160;
    }
  }
  .code-block {
    background: #f5f5f5;
    border-radius: 8rpx;
    padding: 16rpx 20rpx;
    font-size: 22rpx;
    color: #555;
    font-family: monospace;
    margin-top: 16rpx;
  }
</style>
