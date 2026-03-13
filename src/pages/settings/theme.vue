<!--
 * @Description: 主题切换页面 - 玻璃拟态风格
-->
<template>
  <C_Layout>
    <view class="theme-page">
      <!-- 预览卡片 -->
      <view class="preview-section">
        <view class="preview-card" :class="`preview-${activeTheme}`">
          <view class="preview-glass"></view>
          <view class="preview-content">
            <view class="preview-header-bar">
              <view class="preview-dot"></view>
              <view class="preview-title-bar"></view>
              <view class="preview-dots">
                <view class="preview-dot small"></view>
                <view class="preview-dot small"></view>
              </view>
            </view>
            <view class="preview-body">
              <view class="preview-card-item"></view>
              <view class="preview-card-item short"></view>
              <view class="preview-lines">
                <view class="preview-line"></view>
                <view class="preview-line medium"></view>
                <view class="preview-line short"></view>
              </view>
            </view>
            <view class="preview-tabbar">
              <view class="preview-tab" v-for="i in 4" :key="i" :class="{ active: i === 1 }"></view>
            </view>
          </view>
        </view>
        <text class="preview-label">{{ previewLabel }}</text>
      </view>

      <!-- 主题选择 -->
      <view class="theme-section">
        <text class="section-title">选择主题</text>
        <view class="theme-list">
          <view
            v-for="item in themeOptions"
            :key="item.id"
            class="theme-option"
            :class="{ active: activeTheme === item.id }"
            @click="selectTheme(item.id)"
          >
            <view class="option-glass"></view>
            <view class="option-content">
              <view class="option-visual" :class="`visual-${item.id}`">
                <view class="visual-top"></view>
                <view class="visual-body">
                  <view class="visual-block"></view>
                  <view class="visual-block small"></view>
                </view>
                <view class="visual-bottom"></view>
              </view>
              <view class="option-info">
                <text class="option-name">{{ item.name }}</text>
                <text class="option-desc">{{ item.desc }}</text>
              </view>
              <view class="option-check" v-if="activeTheme === item.id">
                <wd-icon name="check" size="16px" color="#fff" />
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 主题色选择 -->
      <view class="color-section">
        <text class="section-title">主题色</text>
        <view class="color-card">
          <view class="color-glass"></view>
          <view class="color-content">
            <view
              v-for="color in themeColors"
              :key="color.value"
              class="color-option"
              :class="{ active: activeColor === color.value }"
              @click="selectColor(color)"
            >
              <view class="color-circle" :style="{ background: color.gradient }">
                <wd-icon v-if="activeColor === color.value" name="check" size="14px" color="#fff" />
              </view>
              <text class="color-name">{{ color.name }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 提示信息 -->
      <view class="info-section">
        <view class="info-card">
          <wd-icon name="info-circle" size="16px" color="#667eea" />
          <text class="info-text">主题设置将在切换页面后全局生效，部分页面可能需要重新打开。</text>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()

const activeTheme = ref(appStore.themeMode || 'light')
const activeColor = ref(appStore.theme?.primary || '#007AFF')

const themeOptions = [
  { id: 'light', name: '浅色模式', desc: '清爽明亮，适合日间使用' },
  { id: 'dark', name: '深色模式', desc: '护眼舒适，适合夜间使用' },
  { id: 'auto', name: '跟随系统', desc: '自动适配系统深浅色设置' },
]

const themeColors = [
  { name: '极光蓝', value: '#007AFF', gradient: 'linear-gradient(135deg, #007AFF, #5856D6)' },
  { name: '翡翠绿', value: '#34C759', gradient: 'linear-gradient(135deg, #34C759, #30D158)' },
  { name: '珊瑚橙', value: '#FF9500', gradient: 'linear-gradient(135deg, #FF9500, #FF6B35)' },
  { name: '薰衣紫', value: '#AF52DE', gradient: 'linear-gradient(135deg, #AF52DE, #5856D6)' },
  { name: '樱花粉', value: '#FF2D55', gradient: 'linear-gradient(135deg, #FF2D55, #FF6B8A)' },
  { name: '水墨灰', value: '#8E8E93', gradient: 'linear-gradient(135deg, #8E8E93, #636366)' },
]

const previewLabel = computed(() => {
  const map = { light: '浅色模式预览', dark: '深色模式预览', auto: '跟随系统预览' }
  return map[activeTheme.value]
})

const selectTheme = (themeId) => {
  activeTheme.value = themeId
  appStore.setThemeMode(themeId)
  uni.showToast({ title: '主题已切换', icon: 'success' })
}

const selectColor = (color) => {
  activeColor.value = color.value
  appStore.theme = { ...appStore.theme, primary: color.value }
  uni.showToast({ title: `已切换为${color.name}`, icon: 'success' })
}
</script>

<style lang="scss" scoped>
.theme-page {
  background: var(--r-bg-page, #f0f2f8);
  padding-bottom: env(safe-area-inset-bottom);
}

// 预览区域
.preview-section {
  padding: 40rpx 32rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .preview-label {
    margin-top: 20rpx;
    font-size: 26rpx;
    color: var(--r-text-secondary);
    font-weight: 500;
  }
}

.preview-card {
  width: 320rpx;
  height: 460rpx;
  border-radius: 32rpx;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.12);

  .preview-glass {
    position: absolute;
    inset: 0;
    border: 2rpx solid rgba(255, 255, 255, 0.3);
    border-radius: 32rpx;
    z-index: 1;
  }

  .preview-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 20rpx;
  }

  &.preview-light {
    background: linear-gradient(180deg, #f8f9fc 0%, #fff 100%);

    .preview-header-bar { background: rgba(255, 255, 255, 0.9); }
    .preview-dot { background: #007AFF; }
    .preview-title-bar { background: #e5e7eb; }
    .preview-card-item { background: #f3f4f6; }
    .preview-line { background: #e5e7eb; }
    .preview-tabbar { background: rgba(255, 255, 255, 0.95); }
    .preview-tab { background: #d1d5db; &.active { background: #007AFF; } }
  }

  &.preview-dark {
    background: linear-gradient(180deg, #1c1c1e 0%, #2c2c2e 100%);

    .preview-header-bar { background: rgba(44, 44, 46, 0.9); }
    .preview-dot { background: #0A84FF; }
    .preview-title-bar { background: #3a3a3c; }
    .preview-card-item { background: #3a3a3c; }
    .preview-line { background: #48484a; }
    .preview-tabbar { background: rgba(28, 28, 30, 0.95); }
    .preview-tab { background: #48484a; &.active { background: #0A84FF; } }
  }

  &.preview-auto {
    background: linear-gradient(135deg, #f8f9fc 0%, #f8f9fc 50%, #1c1c1e 50%, #2c2c2e 100%);

    .preview-header-bar { background: rgba(200, 200, 200, 0.5); }
    .preview-dot { background: #007AFF; }
    .preview-title-bar { background: rgba(150, 150, 150, 0.3); }
    .preview-card-item { background: rgba(150, 150, 150, 0.2); }
    .preview-line { background: rgba(150, 150, 150, 0.3); }
    .preview-tabbar { background: rgba(200, 200, 200, 0.5); }
    .preview-tab { background: rgba(150, 150, 150, 0.3); &.active { background: #007AFF; } }
  }

  .preview-header-bar {
    display: flex;
    align-items: center;
    padding: 14rpx 16rpx;
    border-radius: 16rpx;
    margin-bottom: 16rpx;
    .preview-dot { width: 16rpx; height: 16rpx; border-radius: 50%; &.small { width: 12rpx; height: 12rpx; opacity: 0.5; } }
    .preview-title-bar { flex: 1; height: 12rpx; border-radius: 6rpx; margin: 0 12rpx; }
    .preview-dots { display: flex; gap: 6rpx; }
  }

  .preview-body {
    flex: 1;
    .preview-card-item { height: 80rpx; border-radius: 12rpx; margin-bottom: 12rpx; &.short { width: 70%; } }
    .preview-lines { margin-top: 16rpx; }
    .preview-line { height: 10rpx; border-radius: 5rpx; margin-bottom: 10rpx; &.medium { width: 80%; } &.short { width: 55%; } }
  }

  .preview-tabbar {
    display: flex;
    justify-content: space-around;
    padding: 14rpx 8rpx;
    border-radius: 16rpx;
    .preview-tab { width: 32rpx; height: 32rpx; border-radius: 8rpx; }
  }
}

// 主题选择
.theme-section, .color-section {
  margin: 0 32rpx 32rpx;
}

.section-title {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: var(--r-text-secondary);
  margin-bottom: 16rpx;
  padding-left: 8rpx;
  text-transform: uppercase;
  letter-spacing: 2rpx;
}

.theme-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.theme-option {
  position: relative;
  border-radius: 24rpx;
  overflow: hidden;
  transition: all 0.3s ease;

  .option-glass {
    position: absolute;
    inset: 0;
    background: var(--r-glass-bg);
    backdrop-filter: blur(20rpx);
    border: 1rpx solid var(--r-glass-border);
    border-radius: 24rpx;
    box-shadow: var(--r-glass-shadow);
  }

  &.active .option-glass {
    border-color: rgba(102, 126, 234, 0.3);
    box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.12);
  }

  .option-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    padding: 24rpx;
  }

  .option-visual {
    width: 88rpx;
    height: 88rpx;
    border-radius: 18rpx;
    overflow: hidden;
    margin-right: 24rpx;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;

    &.visual-light {
      background: #f8f9fc;
      .visual-top { background: #fff; }
      .visual-block { background: #e5e7eb; &.small { background: #f3f4f6; } }
      .visual-bottom { background: #fff; }
    }
    &.visual-dark {
      background: #1c1c1e;
      .visual-top { background: #2c2c2e; }
      .visual-block { background: #3a3a3c; &.small { background: #48484a; } }
      .visual-bottom { background: #2c2c2e; }
    }
    &.visual-auto {
      background: linear-gradient(135deg, #f8f9fc 50%, #1c1c1e 50%);
      .visual-top { background: rgba(150, 150, 150, 0.3); }
      .visual-block { background: rgba(150, 150, 150, 0.3); &.small { background: rgba(150, 150, 150, 0.2); } }
      .visual-bottom { background: rgba(150, 150, 150, 0.3); }
    }

    .visual-top { height: 20rpx; margin: 6rpx 6rpx 4rpx; border-radius: 4rpx; }
    .visual-body { flex: 1; padding: 0 6rpx; display: flex; gap: 4rpx; }
    .visual-block { flex: 1; border-radius: 4rpx; &.small { flex: 0.6; } }
    .visual-bottom { height: 16rpx; margin: 4rpx 6rpx 6rpx; border-radius: 4rpx; }
  }

  .option-info {
    flex: 1;
    .option-name { display: block; font-size: 30rpx; font-weight: 600; color: var(--r-text-primary); margin-bottom: 6rpx; }
    .option-desc { display: block; font-size: 24rpx; color: var(--r-text-secondary); }
  }

  .option-check {
    width: 44rpx;
    height: 44rpx;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
}

// 主题色
.color-card {
  position: relative;
  border-radius: 24rpx;
  overflow: hidden;

  .color-glass {
    position: absolute;
    inset: 0;
    background: var(--r-glass-bg);
    backdrop-filter: blur(20rpx);
    border: 1rpx solid var(--r-glass-border);
    border-radius: 24rpx;
    box-shadow: var(--r-glass-shadow);
  }

  .color-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    padding: 28rpx;
    gap: 24rpx;
    justify-content: space-between;
  }
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(33.33% - 16rpx);

  .color-circle {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  }

  &.active .color-circle {
    transform: scale(1.15);
    box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.2);
  }

  .color-name {
    margin-top: 12rpx;
    font-size: 22rpx;
    color: var(--r-text-regular);
    font-weight: 500;
  }
}

// 提示信息
.info-section {
  margin: 16rpx 32rpx 40rpx;

  .info-card {
    display: flex;
    align-items: flex-start;
    gap: 12rpx;
    padding: 24rpx;
    background: rgba(102, 126, 234, 0.06);
    border: 1rpx solid rgba(102, 126, 234, 0.1);
    border-radius: 20rpx;

    .info-text {
      flex: 1;
      font-size: 24rpx;
      color: #667eea;
      line-height: 1.6;
    }
  }
}
</style>
