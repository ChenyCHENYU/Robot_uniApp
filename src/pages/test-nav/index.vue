<template>
  <view class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
    <!-- 背景装饰 -->
    <view class="absolute inset-0 opacity-30">
      <view class="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></view>
      <view class="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></view>
      <view class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></view>
    </view>

    <view class="relative z-10 max-w-6xl mx-auto px-6 py-12">
      <!-- 页面标题 -->
      <view class="text-center mb-16">
        <C_Title
          title="玻璃质感标题组件"
          subtitle="现代化设计，精致视觉体验"
          type="primary"
          :level="1"
          size="large"
          align="center"
          left-icon="i-mdi-glass-fragile"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <!-- 主题色彩演示 -->
      <view class="mb-16">
        <view class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white mb-2">主题色彩</h2>
          <p class="text-white/70">六种主题色彩，每种都有独特的玻璃质感</p>
        </view>
        
        <view class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <C_Title
            title="默认主题"
            subtitle="经典优雅的设计风格"
            type="default"
            :level="3"
            align="center"
            left-icon="i-mdi-circle"
            :show-decoration="true"
          />
          <C_Title
            title="主要主题"
            subtitle="现代科技感的蓝色调"
            type="primary"
            :level="3"
            align="center"
            left-icon="i-mdi-star"
            :show-decoration="true"
          />
          <C_Title
            title="成功主题"
            subtitle="清新自然的绿色调"
            type="success"
            :level="3"
            align="center"
            left-icon="i-mdi-check-circle"
            :show-decoration="true"
          />
          <C_Title
            title="警告主题"
            subtitle="温暖活力的橙色调"
            type="warning"
            :level="3"
            align="center"
            left-icon="i-mdi-alert-circle"
            :show-decoration="true"
          />
          <C_Title
            title="危险主题"
            subtitle="醒目强烈的红色调"
            type="danger"
            :level="3"
            align="center"
            left-icon="i-mdi-close-circle"
            :show-decoration="true"
          />
          <C_Title
            title="信息主题"
            subtitle="沉稳专业的灰色调"
            type="info"
            :level="3"
            align="center"
            left-icon="i-mdi-information"
            :show-decoration="true"
          />
        </view>
      </view>

      <!-- 尺寸演示 -->
      <view class="mb-16">
        <view class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white mb-2">尺寸规格</h2>
          <p class="text-white/70">三种尺寸规格，适应不同使用场景</p>
        </view>
        
        <view class="space-y-6">
          <C_Title
            title="小尺寸标题 - Small"
            subtitle="适用于列表项、卡片副标题等紧凑场景"
            type="primary"
            :level="4"
            size="small"
            align="center"
            left-icon="i-mdi-format-size"
            :show-divider="true"
          />
          <C_Title
            title="中等尺寸标题 - Medium"
            subtitle="适用于章节标题、模块标题等常规场景"
            type="success"
            :level="3"
            size="medium"
            align="center"
            left-icon="i-mdi-format-size"
            :show-divider="true"
          />
          <C_Title
            title="大尺寸标题 - Large"
            subtitle="适用于页面主标题、重要区块标题等突出场景"
            type="warning"
            :level="2"
            size="large"
            align="center"
            left-icon="i-mdi-format-size"
            :show-divider="true"
          />
        </view>
      </view>

      <!-- 对齐方式演示 -->
      <view class="mb-16">
        <view class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white mb-2">对齐方式</h2>
          <p class="text-white/70">支持左对齐、居中、右对齐三种方式</p>
        </view>
        
        <view class="space-y-6">
          <C_Title
            title="左对齐标题"
            subtitle="适用于常规内容排版，遵循阅读习惯"
            type="primary"
            :level="3"
            align="left"
            left-icon="i-mdi-format-align-left"
            :show-decoration="true"
          />
          <C_Title
            title="居中对齐标题"
            subtitle="适用于封面标题、重点突出等居中展示"
            type="success"
            :level="3"
            align="center"
            left-icon="i-mdi-format-align-center"
            :show-decoration="true"
          />
          <C_Title
            title="右对齐标题"
            subtitle="适用于特殊设计需求，营造独特视觉效果"
            type="warning"
            :level="3"
            align="right"
            left-icon="i-mdi-format-align-right"
            :show-decoration="true"
          />
        </view>
      </view>

      <!-- 交互功能演示 -->
      <view class="mb-16">
        <view class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white mb-2">交互功能</h2>
          <p class="text-white/70">支持点击交互，可用于导航、切换等场景</p>
        </view>
        
        <view class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <C_Title
            title="可点击标题"
            subtitle="鼠标悬浮时会有轻微上浮效果，点击试试看"
            type="primary"
            :level="3"
            align="center"
            left-icon="i-mdi-cursor-pointer"
            right-icon="i-mdi-chevron-right"
            :clickable="true"
            :show-decoration="true"
            @click="handleTitleClick"
          />
          <C_Title
            title="静态标题"
            subtitle="普通展示状态，无交互效果"
            type="info"
            :level="3"
            align="center"
            left-icon="i-mdi-information"
            :show-decoration="true"
          />
        </view>
      </view>

      <!-- 高级配置演示 -->
      <view class="mb-16">
        <view class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white mb-2">高级配置</h2>
          <p class="text-white/70">分割线、装饰元素等高级功能</p>
        </view>
        
        <view class="space-y-8">
          <C_Title
            title="顶部分割线"
            subtitle="分割线在标题上方，用于区分内容区块"
            type="primary"
            :level="3"
            align="center"
            left-icon="i-mdi-minus"
            :show-divider="true"
            divider-position="top"
            :show-decoration="true"
          />
          <C_Title
            title="底部分割线"
            subtitle="分割线在标题下方，是最常用的配置"
            type="success"
            :level="3"
            align="center"
            left-icon="i-mdi-minus"
            :show-divider="true"
            divider-position="bottom"
            :show-decoration="true"
          />
          <C_Title
            title="完整配置示例"
            subtitle="展示组件的全部功能：图标、分割线、装饰、交互"
            type="danger"
            :level="2"
            size="large"
            align="center"
            left-icon="i-mdi-star"
            right-icon="i-mdi-heart"
            :show-divider="true"
            :show-decoration="true"
            :clickable="true"
            @click="handleFullConfigClick"
          />
        </view>
      </view>

      <!-- 设计说明 -->
      <view class="text-center">
        <view class="max-w-2xl mx-auto">
          <C_Title
            title="玻璃质感设计"
            subtitle="采用现代化的Glassmorphism设计风格，通过模糊背景、半透明色彩、渐变光影等技术，营造出精致的视觉层次和质感体验"
            type="info"
            :level="4"
            align="center"
            left-icon="i-mdi-auto-awesome"
            :show-divider="true"
            divider-position="top"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const handleTitleClick = () => {
  console.log('可点击标题被点击了！')
}

const handleFullConfigClick = () => {
  console.log('完整配置标题被点击了！')
}
</script>