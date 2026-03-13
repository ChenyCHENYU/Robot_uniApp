<!--
 * @Description: 组件库页面
-->
<template>
  <C_Layout
    @settings-click="handleSettingsClick"
    @tab-change="handleTabChange"
  >
    <view class="components-page">
      <!-- 顶部横幅 -->
      <view class="hero-banner">
        <view class="banner-glass"></view>
        <view class="banner-content">
          <view class="banner-icon">
            <text class="icon-text">C</text>
          </view>
          <view class="banner-info">
            <text class="banner-title">组件库</text>
            <text class="banner-desc">{{ allComponents.length }} 个组件 · 统一风格 · 开箱即用</text>
          </view>
        </view>
      </view>

      <!-- 分类筛选 -->
      <view class="category-tabs">
        <view
          v-for="cat in categories"
          :key="cat.key"
          class="cat-tab"
          :class="{ active: activeCat === cat.key }"
          @click="activeCat = cat.key"
        >
          <text class="cat-text">{{ cat.label }}</text>
          <text class="cat-count">{{ getCount(cat.key) }}</text>
        </view>
      </view>

      <!-- 组件列表 -->
      <view class="comp-grid">
        <view
          v-for="comp in filteredComponents"
          :key="comp.id"
          class="comp-card"
          @click="navigateToDemo(comp)"
        >
          <view class="comp-icon-wrap" :style="{ background: comp.gradient }">
            <wd-icon :name="comp.icon" size="22px" color="#fff" />
          </view>
          <view class="comp-info">
            <text class="comp-name">{{ comp.name }}</text>
            <text class="comp-desc">{{ comp.desc }}</text>
          </view>
          <wd-icon name="arrow-right" size="14px" color="#ccc" />
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeCat = ref('all')

const categories = [
  { key: 'all', label: '全部' },
  { key: 'basic', label: '基础' },
  { key: 'layout', label: '布局' },
  { key: 'form', label: '表单' },
  { key: 'display', label: '展示' },
  { key: 'feedback', label: '反馈' },
  { key: 'business', label: '业务' },
]

const allComponents = ref([
  { id: 'c-icon', name: 'C_Icon', desc: '图标组件', category: 'basic', icon: 'browse', gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', path: '/pages/demo/01-icon/index' },
  { id: 'c-tag', name: 'C_Tag', desc: '标签组件', category: 'basic', icon: 'tag', gradient: 'linear-gradient(135deg, #a29bfe, #6c5ce7)', path: '/pages/demo/02-tag/index' },
  { id: 'c-badge', name: 'C_Badge', desc: '徽标组件', category: 'basic', icon: 'notification-filled', gradient: 'linear-gradient(135deg, #fd79a8, #e84393)', path: '/pages/demo/03-badge/index' },
  { id: 'c-float-button', name: 'C_FloatButton', desc: '悬浮按钮', category: 'basic', icon: 'add-circle', gradient: 'linear-gradient(135deg, #00b894, #00cec9)', path: '/pages/demo/04-float-button/index' },
  { id: 'c-header', name: 'C_Header', desc: '头部导航', category: 'layout', icon: 'backtop', gradient: 'linear-gradient(135deg, #4ecdc4, #2bcbba)', path: '/pages/demo/05-header/index' },
  { id: 'c-layout', name: 'C_Layout', desc: '页面布局', category: 'layout', icon: 'dashboard', gradient: 'linear-gradient(135deg, #45b7d1, #4834d4)', path: '/pages/demo/06-layout/index' },
  { id: 'c-tabbar', name: 'C_Tabbar', desc: '底部导航', category: 'layout', icon: 'menu-fold', gradient: 'linear-gradient(135deg, #96ceb4, #88d8b0)', path: '/pages/demo/07-tabbar/index' },
  { id: 'c-card', name: 'C_Card', desc: '卡片组件', category: 'layout', icon: 'chart', gradient: 'linear-gradient(135deg, #dfe6e9, #b2bec3)', path: '/pages/demo/08-card/index' },
  { id: 'c-steps', name: 'C_Steps', desc: '步骤条', category: 'layout', icon: 'chart-bar', gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', path: '/pages/demo/09-steps/index' },
  { id: 'c-form', name: 'C_Form', desc: '表单组件', category: 'form', icon: 'edit-outline', gradient: 'linear-gradient(135deg, #e17055, #d63031)', path: '/pages/demo/10-form/index' },
  { id: 'c-search', name: 'C_Search', desc: '搜索组件', category: 'form', icon: 'search', gradient: 'linear-gradient(135deg, #74b9ff, #0984e3)', path: '/pages/demo/11-search/index' },
  { id: 'c-upload', name: 'C_Upload', desc: '文件上传', category: 'form', icon: 'camera', gradient: 'linear-gradient(135deg, #55efc4, #00b894)', path: '/pages/demo/12-upload/index' },
  { id: 'c-number-keyboard', name: 'C_NumberKeyboard', desc: '数字键盘', category: 'form', icon: 'keyboard', gradient: 'linear-gradient(135deg, #636e72, #2d3436)', path: '/pages/demo/13-number-keyboard/index' },
  { id: 'c-empty', name: 'C_Empty', desc: '空状态', category: 'display', icon: 'picture', gradient: 'linear-gradient(135deg, #b2bec3, #636e72)', path: '/pages/demo/14-empty/index' },
  { id: 'c-skeleton', name: 'C_Skeleton', desc: '骨架屏', category: 'display', icon: 'video', gradient: 'linear-gradient(135deg, #ffeaa7, #fdcb6e)', path: '/pages/demo/15-skeleton/index' },
  { id: 'c-list', name: 'C_List', desc: '列表组件', category: 'display', icon: 'bulletpoint', gradient: 'linear-gradient(135deg, #81ecec, #00cec9)', path: '/pages/demo/16-list/index' },
  { id: 'c-watermark', name: 'C_Watermark', desc: '水印组件', category: 'display', icon: 'bianjiliebiao', gradient: 'linear-gradient(135deg, #dfe6e9, #636e72)', path: '/pages/demo/17-watermark/index' },
  { id: 'c-modal', name: 'C_Modal', desc: '弹窗组件', category: 'feedback', icon: 'pop', gradient: 'linear-gradient(135deg, #f39c12, #e74c3c)', path: '/pages/demo/18-modal/index' },
  { id: 'c-action-sheet', name: 'C_ActionSheet', desc: '动作面板', category: 'feedback', icon: 'arrow-up', gradient: 'linear-gradient(135deg, #e056fd, #be2edd)', path: '/pages/demo/19-action-sheet/index' },
  { id: 'c-title', name: 'C_Title', desc: '标题组件', category: 'business', icon: 'star', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', path: '/pages/demo/20-title/index' },
])

const filteredComponents = computed(() => {
  if (activeCat.value === 'all') return allComponents.value
  return allComponents.value.filter(c => c.category === activeCat.value)
})

const getCount = (key) => {
  if (key === 'all') return allComponents.value.length
  return allComponents.value.filter(c => c.category === key).length
}

const navigateToDemo = (comp) => {
  uni.navigateTo({ url: comp.path })
}

const handleSettingsClick = () => {
  uni.navigateTo({ url: '/pages/settings/index' })
}

const handleTabChange = ({ item, index }) => {
  console.log('切换到:', item.text, '索引:', index)
}
</script>

<style lang="scss" scoped>
.components-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.hero-banner {
  position: relative;
  margin: 24rpx 32rpx;
  padding: 36rpx;
  border-radius: 24rpx;
  overflow: hidden;

  .banner-glass {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
      rgba(102, 126, 234, 0.15) 0%,
      rgba(118, 75, 162, 0.1) 50%,
      rgba(255, 255, 255, 0.9) 100%);
    backdrop-filter: blur(20rpx);
    border: 1rpx solid rgba(255, 255, 255, 0.5);
    border-radius: 24rpx;
    box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.12);
  }

  .banner-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 24rpx;
  }

  .banner-icon {
    width: 80rpx;
    height: 80rpx;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon-text {
      font-size: 36rpx;
      font-weight: 800;
      color: #fff;
      font-family: 'Courier New', monospace;
    }
  }

  .banner-info {
    flex: 1;
    .banner-title { display: block; font-size: 36rpx; font-weight: 700; color: #1f2937; }
    .banner-desc { display: block; font-size: 24rpx; color: #666; margin-top: 4rpx; }
  }
}

.category-tabs {
  display: flex;
  padding: 0 32rpx 20rpx;
  gap: 12rpx;
  overflow-x: auto;
  &::-webkit-scrollbar { display: none; }

  .cat-tab {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 12rpx 24rpx;
    border-radius: 32rpx;
    background: #fff;
    border: 1rpx solid rgba(0, 0, 0, 0.06);
    white-space: nowrap;
    flex-shrink: 0;
    transition: all 0.3s ease;

    &.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-color: transparent;
      .cat-text, .cat-count { color: #fff; }
    }

    .cat-text { font-size: 24rpx; color: #666; font-weight: 500; }
    .cat-count { font-size: 20rpx; color: #999; }
  }
}

.comp-grid {
  padding: 0 32rpx;

  .comp-card {
    display: flex;
    align-items: center;
    padding: 28rpx;
    margin-bottom: 16rpx;
    background: #fff;
    border-radius: 20rpx;
    border: 1rpx solid rgba(0, 0, 0, 0.04);
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
      background: rgba(102, 126, 234, 0.02);
    }

    .comp-icon-wrap {
      width: 72rpx;
      height: 72rpx;
      border-radius: 18rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .comp-info {
      flex: 1;
      margin: 0 24rpx;
      overflow: hidden;
      .comp-name { display: block; font-size: 28rpx; font-weight: 600; color: #1f2937; }
      .comp-desc { display: block; font-size: 22rpx; color: #999; margin-top: 4rpx; }
    }
  }
}
</style>
