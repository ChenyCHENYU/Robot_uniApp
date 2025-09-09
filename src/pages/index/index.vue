<template>
  <C_Layout
    :notification-count="notificationCount"
    @user-click="handleUserClick"
    @notification-click="handleNotificationClick"
    @settings-click="handleSettingsClick"
    @tab-change="handleTabChange"
  >
    <view class="homepage">
      <!-- 顶部横幅 -->
      <view class="hero-section">
      <view class="hero-content">
        <!-- 项目标识 -->
        <view class="project-header">
          <view class="project-badge">
            <text class="badge-text">企业级跨平台框架</text>
          </view>
          
          <view class="project-title">
            <text class="title-main">Robot UniApp</text>
            <text class="title-desc">一次开发，多端运行</text>
          </view>
          
          <text class="project-intro">
            基于 Vue3 + UniApp 的企业级跨平台应用开发解决方案，支持 H5、小程序、App 多端同步开发
          </text>
        </view>

        <!-- 平台支持 -->
        <view class="platform-support">
          <view class="platform-item" v-for="platform in supportedPlatforms" :key="platform.name">
            <text class="platform-icon">{{ platform.icon }}</text>
            <text class="platform-name">{{ platform.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 核心特色 -->
    <view class="features-section">
      <view class="section-header">
        <text class="section-title">核心特色</text>
        <text class="section-subtitle">企业级移动应用开发能力</text>
      </view>
      
      <view class="features-grid">
        <view class="feature-card" v-for="feature in coreFeatures" :key="feature.name">
          <view class="feature-icon-wrap" :style="{ background: feature.gradient }">
            <text class="feature-icon">{{ feature.icon }}</text>
          </view>
          <view class="feature-info">
            <text class="feature-name">{{ feature.name }}</text>
            <text class="feature-desc">{{ feature.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 技术栈 -->
    <view class="tech-section">
      <view class="section-header">
        <text class="section-title">技术架构</text>
        <text class="section-subtitle">现代化前端技术栈</text>
      </view>
      
      <view class="tech-stack">
        <view class="tech-category" v-for="category in techStack" :key="category.name">
          <view class="tech-header">
            <text class="tech-icon">{{ category.icon }}</text>
            <text class="tech-name">{{ category.name }}</text>
          </view>
          <view class="tech-items">
            <text class="tech-item" v-for="item in category.items" :key="item">{{ item }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 开发优势 -->
    <view class="advantages-section">
      <view class="section-header">
        <text class="section-title">开发优势</text>
        <text class="section-subtitle">高效的开发体验</text>
      </view>
      
      <view class="advantages-list">
        <view class="advantage-item" v-for="(advantage, index) in advantages" :key="advantage.title">
          <view class="advantage-number">{{ index + 1 }}</view>
          <view class="advantage-content">
            <text class="advantage-title">{{ advantage.title }}</text>
            <text class="advantage-desc">{{ advantage.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 应用场景 -->
    <view class="scenarios-section">
      <view class="section-header">
        <text class="section-title">应用场景</text>
        <text class="section-subtitle">适用于多种业务需求</text>
      </view>
      
      <view class="scenarios-grid">
        <view class="scenario-card" v-for="scenario in applicationScenarios" :key="scenario.name">
          <text class="scenario-icon">{{ scenario.icon }}</text>
          <text class="scenario-name">{{ scenario.name }}</text>
          <text class="scenario-desc">{{ scenario.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 快速开始 -->
    <view class="quickstart-section">
      <view class="quickstart-content">
        <text class="quickstart-title">准备开始开发？</text>
        <text class="quickstart-subtitle">几行命令即可启动你的跨平台应用</text>
        
        <view class="command-steps">
          <view class="command-item" v-for="(cmd, index) in quickCommands" :key="index">
            <view class="command-step">{{ index + 1 }}</view>
            <view class="command-content">
              <text class="command-desc">{{ cmd.desc }}</text>
              <view class="command-code">
                <text>{{ cmd.command }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="action-buttons">
          <view class="action-btn primary" @click="handleStart">
            <text>开始开发</text>
          </view>
          <view class="action-btn secondary" @click="handleDocs">
            <text>查看文档</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 项目信息 -->
    <view class="project-info">
      <view class="info-content">
        <text class="project-name">Robot UniApp Framework</text>
        <text class="project-version">v{{ version }}</text>
        <text class="project-license">MIT License</text>
        <text class="project-author">Created with ❤️ by ChenY</text>
      </view>
    </view>
    </view>
  </C_Layout>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/modules/user'

// 版本信息
const version = ref('1.0.0')

// 通知数量
const notificationCount = ref(0)

// 用户Store
const userStore = useUserStore()

// 支持平台
const supportedPlatforms = ref([
  { name: 'H5', icon: '🌐' },
  { name: '小程序', icon: '📱' },
  { name: 'Android', icon: '🤖' },
  { name: 'iOS', icon: '🍎' }
])

// 核心特色
const coreFeatures = ref([
  {
    name: '跨平台开发',
    desc: '一套代码多端运行',
    icon: '🚀',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    name: '企业级架构',
    desc: '完整的开发规范',
    icon: '🏗️',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    name: '组件丰富',
    desc: 'uView+ UI组件库',
    icon: '🧩',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    name: '状态管理',
    desc: 'Pinia数据管理',
    icon: '📊',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    name: '国际化支持',
    desc: '多语言切换',
    icon: '🌍',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    name: '原子化CSS',
    desc: 'UnoCSS样式引擎',
    icon: '🎨',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  }
])

// 技术栈
const techStack = ref([
  {
    name: '核心框架',
    icon: '⚡',
    items: ['Vue 3', 'UniApp', 'Vite']
  },
  {
    name: 'UI组件',
    icon: '🎨',
    items: ['uView+', 'UnoCSS']
  },
  {
    name: '状态管理',
    icon: '📦',
    items: ['Pinia', 'Persist']
  },
  {
    name: '工具链',
    icon: '🔧',
    items: ['Sass', 'Vue-i18n']
  }
])

// 开发优势
const advantages = ref([
  {
    title: '快速开发',
    desc: '丰富的组件库和工具链，大幅提升开发效率'
  },
  {
    title: '多端一致',
    desc: '统一的开发体验，确保各平台功能和体验一致'
  },
  {
    title: '易于维护',
    desc: '清晰的项目结构和规范，降低维护成本'
  },
  {
    title: '扩展灵活',
    desc: '模块化架构设计，支持业务快速扩展'
  }
])

// 应用场景
const applicationScenarios = ref([
  { name: '电商应用', desc: '商城、购物车、支付', icon: '🛒' },
  { name: '社交应用', desc: '聊天、动态、社区', icon: '💬' },
  { name: '办公应用', desc: '审批、协作、管理', icon: '💼' },
  { name: '工具应用', desc: '实用工具、生活服务', icon: '🔨' },
  { name: '内容应用', desc: '新闻、视频、音乐', icon: '📰' },
  { name: '教育应用', desc: '在线学习、考试', icon: '📚' }
])

// 快速命令
const quickCommands = ref([
  {
    desc: '克隆项目',
    command: 'git clone <your-repo-url>'
  },
  {
    desc: '安装依赖',
    command: 'npm install'
  },
  {
    desc: '启动开发',
    command: 'npm run dev:h5'
  }
])

// 事件处理
const handleUserClick = (user) => {
  uni.showToast({
    title: '查看用户资料',
    icon: 'none'
  })
}

const handleNotificationClick = (count) => {
  uni.showToast({
    title: `有${count}条新通知`,
    icon: 'none'
  })
}

const handleSettingsClick = () => {
  // 显示设置菜单
  uni.showActionSheet({
    itemList: ['个人设置', '主题切换', '关于应用', '退出登录', '清除缓存'],
    success: (res) => {
      const { tapIndex } = res
      switch (tapIndex) {
        case 0:
          // 个人设置
          uni.showToast({
            title: '个人设置功能开发中',
            icon: 'none'
          })
          break
        case 1:
          // 主题切换
          uni.showToast({
            title: '主题切换功能开发中',
            icon: 'none'
          })
          break
        case 2:
          // 关于应用
          uni.showModal({
            title: 'Robot UniApp',
            content: `版本: v${version.value}\n企业级跨平台应用开发框架\n基于 Vue3 + UniApp`,
            showCancel: false,
            confirmText: '确定'
          })
          break
        case 3:
          // 退出登录
          handleLogout()
          break
        case 4:
          // 清除缓存数据
          handleClearCache()
          break
      }
    }
  })
}

const handleTabChange = ({ item, index }) => {
  console.log('切换到:', item.text, '索引:', index)
}

// 清除缓存处理
const handleClearCache = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清除所有缓存数据吗？清除后需要重新登录。',
    success: (res) => {
      if (res.confirm) {
        try {
          // 清除用户数据
          userStore.clearUserInfo()
          
          // 清除所有本地存储
          uni.clearStorageSync()
          
          uni.showToast({
            title: '缓存已清除',
            icon: 'success'
          })
          
          // 延迟跳转到登录页
          setTimeout(() => {
            uni.reLaunch({ url: '/pages/login/index' })
          }, 1500)
        } catch (error) {
          uni.showToast({
            title: '清除失败，请重试',
            icon: 'error'
          })
          console.error('清除缓存错误:', error)
        }
      }
    }
  })
}

// 退出登录处理
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 显示Loading
        uni.showLoading({
          title: '退出中...'
        })
        
        // 执行退出登录
        userStore.logout().then(() => {
          uni.hideLoading()
          uni.showToast({
            title: '退出成功',
            icon: 'success'
          })
        }).catch((error) => {
          uni.hideLoading()
          uni.showToast({
            title: '退出失败，请重试',
            icon: 'error'
          })
          console.error('退出登录错误:', error)
        })
      }
    }
  })
}

// 原有事件处理
const handleStart = () => {
  uni.showToast({
    title: '开始你的开发之旅',
    icon: 'none'
  })
}

const handleDocs = () => {
  uni.showToast({
    title: '查看开发文档',
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
.homepage {
  // 移除原有的最小高度和背景，因为C_Layout会处理这些
  background: linear-gradient(180deg, #f8faff 0%, #f1f5f9 100%);
}

/* 顶部横幅 */
.hero-section {
  padding: 60rpx 40rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>');
    background-size: 100rpx 100rpx;
  }
  
  .hero-content {
    position: relative;
    z-index: 1;
  }
  
  .project-header {
    text-align: center;
    margin-bottom: 60rpx;
    
    .project-badge {
      display: inline-block;
      padding: 16rpx 32rpx;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50rpx;
      margin-bottom: 32rpx;
      backdrop-filter: blur(10px);
      
      .badge-text {
        color: #fff;
        font-size: 24rpx;
      }
    }
    
    .project-title {
      margin-bottom: 24rpx;
      
      .title-main {
        display: block;
        color: #fff;
        font-size: 56rpx;
        font-weight: bold;
        margin-bottom: 16rpx;
      }
      
      .title-desc {
        display: block;
        color: rgba(255, 255, 255, 0.9);
        font-size: 32rpx;
      }
    }
    
    .project-intro {
      color: rgba(255, 255, 255, 0.8);
      font-size: 28rpx;
      line-height: 1.6;
      padding: 0 20rpx;
    }
  }
  
  .platform-support {
    display: flex;
    justify-content: space-around;
    
    .platform-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24rpx;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 20rpx;
      backdrop-filter: blur(10px);
      
      .platform-icon {
        font-size: 40rpx;
        margin-bottom: 12rpx;
      }
      
      .platform-name {
        color: #fff;
        font-size: 24rpx;
      }
    }
  }
}

/* 公共样式 */
.section-header {
  text-align: center;
  margin-bottom: 60rpx;
  
  .section-title {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 16rpx;
  }
  
  .section-subtitle {
    display: block;
    font-size: 28rpx;
    color: #6b7280;
  }
}

/* 核心特色 */
.features-section {
  padding: 80rpx 40rpx;
  
  .features-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32rpx;
    
    .feature-card {
      display: flex;
      align-items: center;
      padding: 40rpx;
      background: #fff;
      border-radius: 24rpx;
      box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
      
      .feature-icon-wrap {
        width: 80rpx;
        height: 80rpx;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 32rpx;
        
        .feature-icon {
          font-size: 36rpx;
        }
      }
      
      .feature-info {
        flex: 1;
        
        .feature-name {
          display: block;
          font-size: 32rpx;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 8rpx;
        }
        
        .feature-desc {
          display: block;
          font-size: 26rpx;
          color: #6b7280;
        }
      }
    }
  }
}

/* 技术栈 */
.tech-section {
  padding: 80rpx 40rpx;
  background: #fff;
  
  .tech-stack {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32rpx;
    
    .tech-category {
      padding: 32rpx;
      background: linear-gradient(135deg, #f8faff 0%, #f1f5f9 100%);
      border-radius: 20rpx;
      border: 1px solid #e5e7eb;
      
      .tech-header {
        display: flex;
        align-items: center;
        margin-bottom: 24rpx;
        
        .tech-icon {
          font-size: 32rpx;
          margin-right: 16rpx;
        }
        
        .tech-name {
          font-size: 28rpx;
          font-weight: bold;
          color: #1f2937;
        }
      }
      
      .tech-items {
        display: flex;
        flex-wrap: wrap;
        gap: 16rpx;
        
        .tech-item {
          padding: 8rpx 16rpx;
          background: #fff;
          color: #4f46e5;
          font-size: 22rpx;
          border-radius: 12rpx;
          border: 1px solid #e0e7ff;
        }
      }
    }
  }
}

/* 开发优势 */
.advantages-section {
  padding: 80rpx 40rpx;
  
  .advantages-list {
    .advantage-item {
      display: flex;
      align-items: flex-start;
      padding: 32rpx;
      background: #fff;
      border-radius: 20rpx;
      margin-bottom: 24rpx;
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
      
      .advantage-number {
        width: 56rpx;
        height: 56rpx;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        margin-right: 24rpx;
        font-size: 24rpx;
      }
      
      .advantage-content {
        flex: 1;
        
        .advantage-title {
          display: block;
          font-size: 30rpx;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 8rpx;
        }
        
        .advantage-desc {
          display: block;
          font-size: 26rpx;
          color: #6b7280;
          line-height: 1.5;
        }
      }
    }
  }
}

/* 应用场景 */
.scenarios-section {
  padding: 80rpx 40rpx;
  background: #fff;
  
  .scenarios-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24rpx;
    
    .scenario-card {
      padding: 32rpx;
      text-align: center;
      background: linear-gradient(135deg, #f8faff 0%, #f1f5f9 100%);
      border-radius: 20rpx;
      border: 1px solid #e5e7eb;
      
      .scenario-icon {
        font-size: 48rpx;
        margin-bottom: 16rpx;
        display: block;
      }
      
      .scenario-name {
        display: block;
        font-size: 28rpx;
        font-weight: bold;
        color: #1f2937;
        margin-bottom: 8rpx;
      }
      
      .scenario-desc {
        display: block;
        font-size: 22rpx;
        color: #6b7280;
      }
    }
  }
}

/* 快速开始 */
.quickstart-section {
  padding: 80rpx 40rpx;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  
  .quickstart-content {
    text-align: center;
    
    .quickstart-title {
      display: block;
      font-size: 48rpx;
      font-weight: bold;
      color: #fff;
      margin-bottom: 16rpx;
    }
    
    .quickstart-subtitle {
      display: block;
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 60rpx;
    }
    
    .command-steps {
      margin-bottom: 60rpx;
      
      .command-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 32rpx;
        text-align: left;
        
        .command-step {
          width: 48rpx;
          height: 48rpx;
          background: #4f46e5;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 24rpx;
          font-size: 22rpx;
        }
        
        .command-content {
          flex: 1;
          
          .command-desc {
            display: block;
            color: rgba(255, 255, 255, 0.9);
            font-size: 26rpx;
            margin-bottom: 12rpx;
          }
          
          .command-code {
            padding: 16rpx 20rpx;
            background: #000;
            border-radius: 8rpx;
            font-family: 'Courier New', monospace;
            
            text {
              color: #10b981;
              font-size: 22rpx;
            }
          }
        }
      }
    }
    
    .action-buttons {
      display: flex;
      gap: 24rpx;
      justify-content: center;
      
      .action-btn {
        padding: 24rpx 48rpx;
        border-radius: 16rpx;
        font-size: 28rpx;
        font-weight: bold;
        
        &.primary {
          background: #4f46e5;
          color: #fff;
        }
        
        &.secondary {
          background: transparent;
          color: #fff;
          border: 2rpx solid #4f46e5;
        }
      }
    }
  }
}

/* 项目信息 */
.project-info {
  padding: 60rpx 40rpx;
  background: #f8faff;
  
  .info-content {
    text-align: center;
    
    .project-name {
      display: block;
      font-size: 32rpx;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 8rpx;
    }
    
    .project-version,
    .project-license {
      display: block;
      font-size: 24rpx;
      color: #6b7280;
      margin-bottom: 8rpx;
    }
    
    .project-author {
      display: block;
      font-size: 24rpx;
      color: #9ca3af;
    }
  }
}
</style>