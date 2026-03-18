<template>
  <C_Layout>
    <view class="component-management p-4">
      <!-- 页面说明 -->
      <view class="intro-section mb-6">
        <view
          class="intro-card p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white"
        >
          <view class="flex items-center mb-2">
            <C_Icon
              type="custom"
              :size="32"
              >✨</C_Icon
            >
            <text class="ml-3 text-lg font-bold">组件演示中心</text>
          </view>
          <text class="text-sm opacity-90">
            这里是项目中所有组件的演示页面集合，你可以直观地查看每个组件的效果和用法
          </text>
        </view>
      </view>

      <!-- 组件分类 -->
      <view class="category-section mb-6">
        <view class="section-title mb-4 text-lg font-bold text-gray-800"
          >🏷️ 组件分类</view
        >

        <view class="category-grid grid grid-cols-2 gap-3">
          <view
            v-for="category in categories"
            :key="category.key"
            class="category-card p-4 bg-white rounded-lg shadow-sm border-l-4"
            :style="{ borderLeftColor: category.color }"
            @click="filterByCategory(category.key)"
          >
            <view class="flex items-center mb-2">
              <C_Icon
                :name="category.icon"
                :size="20"
                :color="category.color"
              />
              <text class="ml-2 font-semibold text-gray-800">{{
                category.name
              }}</text>
            </view>
            <text class="text-xs text-gray-500">{{ category.desc }}</text>
            <view class="mt-2">
              <text class="text-xs bg-gray-100 px-2 py-1 rounded">
                {{ getComponentCountByCategory(category.key) }} 个组件
              </text>
            </view>
          </view>
        </view>
      </view>

      <!-- 组件列表 -->
      <view class="components-section">
        <view class="section-header flex items-center justify-between mb-4">
          <view class="section-title text-lg font-bold text-gray-800">
            🧩
            {{
              currentCategory ? getCategoryName(currentCategory) : '全部组件'
            }}
          </view>
          <view class="filter-actions flex gap-2">
            <button
              class="filter-btn px-3 py-1 text-xs rounded-full"
              :class="
                currentCategory
                  ? 'bg-gray-200 text-gray-600'
                  : 'bg-primary text-white'
              "
              @click="showAllComponents"
            >
              全部
            </button>
          </view>
        </view>

        <view class="components-grid space-y-3">
          <view
            v-for="component in filteredComponents"
            :key="component.id"
            class="component-card p-4 bg-white rounded-lg shadow-sm border border-gray-100"
            @click="navigateToDemo(component)"
          >
            <view class="card-header flex items-start justify-between mb-3">
              <view class="component-info flex-1">
                <view class="flex items-center mb-2">
                  <view
                    class="icon-wrapper w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                    :style="{ backgroundColor: component.color + '20' }"
                  >
                    <C_Icon
                      :name="component.icon"
                      :size="20"
                      :color="component.color"
                    />
                  </view>
                  <view>
                    <text
                      class="component-name text-base font-bold text-gray-800"
                      >{{ component.name }}</text
                    >
                    <view class="component-version mt-1">
                      <text
                        class="text-xs bg-green-100 text-green-600 px-2 py-1 rounded"
                      >
                        v{{ component.version }}
                      </text>
                    </view>
                  </view>
                </view>
                <text
                  class="component-desc text-sm text-gray-600 leading-relaxed"
                >
                  {{ component.description }}
                </text>
              </view>

              <view class="card-actions">
                <C_Icon
                  name="mdi-chevron-right"
                  :size="20"
                  color="#ccc"
                />
              </view>
            </view>

            <view class="card-footer">
              <view class="component-tags flex flex-wrap gap-2 mb-3">
                <text
                  v-for="tag in component.tags"
                  :key="tag"
                  class="tag text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {{ tag }}
                </text>
              </view>

              <view class="component-stats flex items-center justify-between">
                <view class="stats-left flex items-center gap-4">
                  <view class="stat-item flex items-center">
                    <C_Icon
                      name="mdi-eye"
                      :size="14"
                      color="#999"
                    />
                    <text class="ml-1 text-xs text-gray-500">{{
                      component.views || 0
                    }}</text>
                  </view>
                  <view class="stat-item flex items-center">
                    <C_Icon
                      name="mdi-calendar"
                      :size="14"
                      color="#999"
                    />
                    <text class="ml-1 text-xs text-gray-500">{{
                      component.updateDate
                    }}</text>
                  </view>
                </view>

                <view class="stats-right">
                  <view
                    class="status-badge px-2 py-1 rounded-full text-xs"
                    :class="getStatusClass(component.status)"
                  >
                    {{ getStatusText(component.status) }}
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view
          v-if="filteredComponents.length === 0"
          class="empty-state py-12 text-center"
        >
          <C_Icon
            name="mdi-package-variant"
            :size="48"
            color="#ddd"
          />
          <text class="empty-text block mt-4 text-gray-500">暂无组件</text>
          <text class="empty-desc block mt-2 text-sm text-gray-400">
            {{
              currentCategory ? '该分类下暂无组件' : '还没有添加任何组件演示'
            }}
          </text>
        </view>
      </view>

      <!-- 添加新组件按钮 -->
      <view class="add-component-section mt-8 mb-4">
        <view
          class="add-card p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white"
        >
          <view class="flex items-center justify-between">
            <view>
              <text class="text-base font-bold">想要添加新的组件演示？</text>
              <text class="block text-sm mt-1 opacity-90">
                联系开发团队或者按照文档规范创建新的演示页面
              </text>
            </view>
            <C_Icon
              name="mdi-plus-circle"
              :size="32"
              color="white"
            />
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'

  // 响应式数据
  const currentCategory = ref('')

  // 组件分类
  const categories = [
    {
      key: 'basic',
      name: '基础组件',
      desc: '图标、标签、徽章等基础UI元素',
      icon: 'mdi-cube-outline',
      color: '#409eff',
    },
    {
      key: 'layout',
      name: '布局组件',
      desc: '头部、导航、布局等结构组件',
      icon: 'mdi-view-dashboard',
      color: '#67c23a',
    },
    {
      key: 'form',
      name: '表单组件',
      desc: '输入框、选择器等表单控件',
      icon: 'mdi-form-select',
      color: '#e6a23c',
    },
    {
      key: 'display',
      name: '展示组件',
      desc: '列表、卡片、进度等信息展示',
      icon: 'mdi-view-list',
      color: '#f56c6c',
    },
    {
      key: 'feedback',
      name: '反馈组件',
      desc: '弹窗、通知、操作面板等反馈',
      icon: 'mdi-message-alert',
      color: '#9b59b6',
    },
  ]

  // 组件列表
  const components = [
    {
      id: 'c-icon',
      name: 'C_Icon',
      description:
        '通用图标组件，支持UnoCSS、wot-design-uni、SVG、图片和自定义内容五种类型',
      category: 'basic',
      version: '1.0.0',
      icon: 'mdi-palette',
      color: '#ff6b6b',
      tags: ['图标', 'UnoCSS', '多类型'],
      status: 'stable',
      updateDate: '2024-01-15',
      views: 156,
      path: '/pages/demo/01-icon/index',
    },
    {
      id: 'c-tag',
      name: 'C_Tag',
      description: '标签组件，支持多种颜色主题、尺寸、可关闭等功能',
      category: 'basic',
      version: '1.0.0',
      icon: 'mdi-tag',
      color: '#e6a23c',
      tags: ['标签', '颜色', '主题'],
      status: 'stable',
      updateDate: '2024-01-15',
      views: 102,
      path: '/pages/demo/02-tag/index',
    },
    {
      id: 'c-badge',
      name: 'C_Badge',
      description: '徽章组件，用于在图标或文字右上角展示数字或状态标记',
      category: 'basic',
      version: '1.0.0',
      icon: 'mdi-bell-badge',
      color: '#f56c6c',
      tags: ['徽章', '消息', '提醒'],
      status: 'stable',
      updateDate: '2024-01-14',
      views: 89,
      path: '/pages/demo/03-badge/index',
    },
    {
      id: 'c-float-button',
      name: 'C_FloatButton',
      description: '悬浮按钮组件，支持单按钮和菜单展开两种模式',
      category: 'basic',
      version: '1.0.0',
      icon: 'mdi-plus-circle',
      color: '#409eff',
      tags: ['悬浮', '按钮', '菜单'],
      status: 'stable',
      updateDate: '2024-01-13',
      views: 76,
      path: '/pages/demo/04-float-button/index',
    },
    {
      id: 'c-header',
      name: 'C_Header',
      description: '统一头部导航组件，支持返回按钮、标题自定义、右侧操作等',
      category: 'layout',
      version: '1.2.0',
      icon: 'mdi-page-layout-header',
      color: '#4ecdc4',
      tags: ['导航', '头部', '布局'],
      status: 'stable',
      updateDate: '2024-01-12',
      views: 134,
      path: '/pages/demo/05-header/index',
    },
    {
      id: 'c-layout',
      name: 'C_Layout',
      description: '页面布局组件，提供统一的页面结构和安全区域处理',
      category: 'layout',
      version: '1.1.0',
      icon: 'mdi-view-dashboard-outline',
      color: '#45b7d1',
      tags: ['布局', '结构', '安全区'],
      status: 'stable',
      updateDate: '2024-01-10',
      views: 124,
      path: '/pages/demo/06-layout/index',
    },
    {
      id: 'c-tabbar',
      name: 'C_Tabbar',
      description: '底部导航栏组件，支持自定义图标、文字显示和路由跳转',
      category: 'layout',
      version: '1.0.5',
      icon: 'mdi-view-dashboard-variant',
      color: '#96ceb4',
      tags: ['导航', '底部', 'Tab'],
      status: 'stable',
      updateDate: '2024-01-08',
      views: 78,
      path: '/pages/demo/07-tabbar/index',
    },
    {
      id: 'c-card',
      name: 'C_Card',
      description: '卡片组件，支持图片、标题、内容等多种布局形式',
      category: 'display',
      version: '1.0.0',
      icon: 'mdi-card-outline',
      color: '#ff9f43',
      tags: ['卡片', '容器', '展示'],
      status: 'stable',
      updateDate: '2024-01-12',
      views: 98,
      path: '/pages/demo/08-card/index',
    },
    {
      id: 'c-steps',
      name: 'C_Steps',
      description: '步骤条组件，展示操作流程的各个环节和当前状态',
      category: 'display',
      version: '1.0.0',
      icon: 'mdi-progress-check',
      color: '#2ed573',
      tags: ['步骤', '流程', '进度'],
      status: 'stable',
      updateDate: '2024-01-11',
      views: 67,
      path: '/pages/demo/09-steps/index',
    },
    {
      id: 'c-form',
      name: 'C_Form',
      description: '表单组件，集成表单验证、多种输入类型和布局模式',
      category: 'form',
      version: '1.0.0',
      icon: 'mdi-form-select',
      color: '#e6a23c',
      tags: ['表单', '验证', '输入'],
      status: 'stable',
      updateDate: '2024-01-10',
      views: 145,
      path: '/pages/demo/10-form/index',
    },
    {
      id: 'c-search',
      name: 'C_Search',
      description: '搜索组件，支持搜索历史记录、热门推荐和实时搜索',
      category: 'form',
      version: '1.0.0',
      icon: 'mdi-magnify',
      color: '#3498db',
      tags: ['搜索', '输入', '历史'],
      status: 'stable',
      updateDate: '2024-01-09',
      views: 112,
      path: '/pages/demo/11-search/index',
    },
    {
      id: 'c-upload',
      name: 'C_Upload',
      description: '上传组件，支持图片选择、裁剪、预览和批量上传',
      category: 'form',
      version: '1.0.0',
      icon: 'mdi-cloud-upload',
      color: '#1abc9c',
      tags: ['上传', '图片', '文件'],
      status: 'stable',
      updateDate: '2024-01-08',
      views: 93,
      path: '/pages/demo/12-upload/index',
    },
    {
      id: 'c-number-keyboard',
      name: 'C_NumberKeyboard',
      description: '数字键盘组件，支持数字、身份证和自定义键盘模式',
      category: 'form',
      version: '1.0.0',
      icon: 'mdi-dialpad',
      color: '#9b59b6',
      tags: ['键盘', '数字', '输入'],
      status: 'stable',
      updateDate: '2024-01-07',
      views: 54,
      path: '/pages/demo/13-number-keyboard/index',
    },
    {
      id: 'c-empty',
      name: 'C_Empty',
      description: '空状态组件，用于数据为空时的占位展示',
      category: 'display',
      version: '1.0.0',
      icon: 'mdi-package-variant',
      color: '#bdc3c7',
      tags: ['空状态', '占位', '提示'],
      status: 'stable',
      updateDate: '2024-01-06',
      views: 65,
      path: '/pages/demo/14-empty/index',
    },
    {
      id: 'c-skeleton',
      name: 'C_Skeleton',
      description: '骨架屏组件，在内容加载过程中展示占位图形',
      category: 'display',
      version: '1.0.0',
      icon: 'mdi-blur',
      color: '#636e72',
      tags: ['骨架屏', '加载', '占位'],
      status: 'stable',
      updateDate: '2024-01-05',
      views: 72,
      path: '/pages/demo/15-skeleton/index',
    },
    {
      id: 'c-list',
      name: 'C_List',
      description: '列表组件，支持下拉刷新、上拉加载和分页数据管理',
      category: 'display',
      version: '1.0.0',
      icon: 'mdi-format-list-bulleted',
      color: '#0984e3',
      tags: ['列表', '分页', '滚动'],
      status: 'stable',
      updateDate: '2024-01-04',
      views: 138,
      path: '/pages/demo/16-list/index',
    },
    {
      id: 'c-watermark',
      name: 'C_Watermark',
      description: '水印组件，支持文字和图片水印，可自定义间距和角度',
      category: 'display',
      version: '1.0.0',
      icon: 'mdi-watermark',
      color: '#6c5ce7',
      tags: ['水印', '安全', '防截图'],
      status: 'stable',
      updateDate: '2024-01-03',
      views: 48,
      path: '/pages/demo/17-watermark/index',
    },
    {
      id: 'c-modal',
      name: 'C_Modal',
      description: '模态框组件，支持确认、输入、自定义内容等多种弹窗形式',
      category: 'feedback',
      version: '1.0.0',
      icon: 'mdi-window-maximize',
      color: '#e17055',
      tags: ['弹窗', '确认', '对话框'],
      status: 'stable',
      updateDate: '2024-01-02',
      views: 156,
      path: '/pages/demo/18-modal/index',
    },
    {
      id: 'c-action-sheet',
      name: 'C_ActionSheet',
      description: '操作面板组件，从底部弹出的操作菜单，支持分组和取消按钮',
      category: 'feedback',
      version: '1.0.0',
      icon: 'mdi-menu',
      color: '#fdcb6e',
      tags: ['面板', '操作', '底部弹出'],
      status: 'stable',
      updateDate: '2024-01-01',
      views: 87,
      path: '/pages/demo/19-action-sheet/index',
    },
    {
      id: 'c-title',
      name: 'C_Title',
      description: '标题组件，支持多种样式的标题展示和装饰效果',
      category: 'basic',
      version: '1.0.0',
      icon: 'mdi-format-title',
      color: '#00b894',
      tags: ['标题', '文本', '装饰'],
      status: 'stable',
      updateDate: '2024-01-01',
      views: 63,
      path: '/pages/demo/20-title/index',
    },
    {
      id: 'c-swipe-action',
      name: 'C_SwipeAction',
      description: '滑动操作组件，支持左滑/右滑显示操作按钮',
      category: 'display',
      version: '1.0.0',
      icon: 'mdi-gesture-swipe-horizontal',
      color: '#e84393',
      tags: ['滑动', '手势', '操作'],
      status: 'stable',
      updateDate: '2024-02-01',
      views: 45,
      path: '/pages/demo/21-swipe-action/index',
    },
    {
      id: 'c-image-preview',
      name: 'C_ImagePreview',
      description: '图片预览组件，支持缩放、滑动切换和指示器',
      category: 'display',
      version: '1.0.0',
      icon: 'mdi-image-search',
      color: '#00cec9',
      tags: ['图片', '预览', '缩放'],
      status: 'stable',
      updateDate: '2024-02-01',
      views: 52,
      path: '/pages/demo/22-image-preview/index',
    },
    {
      id: 'c-signature',
      name: 'C_Signature',
      description: '签名组件，支持手写签名绘制和导出PNG图片',
      category: 'form',
      version: '1.0.0',
      icon: 'mdi-draw',
      color: '#6c5ce7',
      tags: ['签名', '手写', 'Canvas'],
      status: 'stable',
      updateDate: '2024-02-01',
      views: 38,
      path: '/pages/demo/23-signature/index',
    },
    {
      id: 'c-index-list',
      name: 'C_IndexList',
      description: '索引列表组件，支持字母索引快速定位和分组展示',
      category: 'display',
      version: '1.0.0',
      icon: 'mdi-format-list-numbered',
      color: '#0984e3',
      tags: ['索引', '列表', '字母'],
      status: 'stable',
      updateDate: '2024-02-01',
      views: 41,
      path: '/pages/demo/24-index-list/index',
    },
    {
      id: 'c-calendar',
      name: 'C_Calendar',
      description: '日历组件，支持单选/多选/范围选择和日期标记',
      category: 'form',
      version: '1.0.0',
      icon: 'mdi-calendar',
      color: '#e17055',
      tags: ['日历', '日期', '选择器'],
      status: 'stable',
      updateDate: '2024-02-01',
      views: 67,
      path: '/pages/demo/25-calendar/index',
    },
    {
      id: 'c-cascader',
      name: 'C_Cascader',
      description: '级联选择器组件，支持多级联动和动态加载数据',
      category: 'form',
      version: '1.0.0',
      icon: 'mdi-file-tree',
      color: '#00b894',
      tags: ['级联', '选择器', '树形'],
      status: 'stable',
      updateDate: '2024-02-01',
      views: 56,
      path: '/pages/demo/26-cascader/index',
    },
    {
      id: 'c-tab-nav',
      name: 'C_TabNav',
      description: '标签导航组件，支持滚动、滑动切换和徽章显示',
      category: 'layout',
      version: '1.0.0',
      icon: 'mdi-tab',
      color: '#fdcb6e',
      tags: ['标签', '导航', '切换'],
      status: 'stable',
      updateDate: '2024-02-01',
      views: 73,
      path: '/pages/demo/27-tab-nav/index',
    },
    {
      id: 'c-progress',
      name: 'C_Progress',
      description: '进度条组件，支持线形、环形和仪表盘等多种展示形式',
      category: 'display',
      version: '1.0.0',
      icon: 'mdi-progress-check',
      color: '#55efc4',
      tags: ['进度', '百分比', '加载'],
      status: 'stable',
      updateDate: '2024-02-01',
      views: 58,
      path: '/pages/demo/28-progress/index',
    },
    {
      id: 'c-timeline',
      name: 'C_Timeline',
      description: '时间线组件，用于展示时间流信息和操作记录',
      category: 'display',
      version: '1.0.0',
      icon: 'mdi-timeline',
      color: '#a29bfe',
      tags: ['时间线', '流程', '记录'],
      status: 'stable',
      updateDate: '2024-02-01',
      views: 44,
      path: '/pages/demo/29-timeline/index',
    },
    {
      id: 'c-notify',
      name: 'C_Notify',
      description: '消息通知组件，支持多种类型的顶部/底部通知提示',
      category: 'feedback',
      version: '1.0.0',
      icon: 'mdi-bell-ring',
      color: '#fd79a8',
      tags: ['通知', '消息', '提示'],
      status: 'stable',
      updateDate: '2024-02-01',
      views: 62,
      path: '/pages/demo/30-notify/index',
    },
    {
      id: 'c-rate',
      name: 'C_Rate',
      description: '评分组件，支持自定义图标、半星和只读模式',
      category: 'form',
      version: '1.0.0',
      icon: 'mdi-star',
      color: '#ffeaa7',
      tags: ['评分', '星级', '打分'],
      status: 'stable',
      updateDate: '2024-02-01',
      views: 49,
      path: '/pages/demo/31-rate/index',
    },
    {
      id: 'c-divider',
      name: 'C_Divider',
      description: '分割线组件，用于内容区域的分隔，支持文字嵌入',
      category: 'basic',
      version: '1.0.0',
      icon: 'mdi-minus',
      color: '#dfe6e9',
      tags: ['分割线', '分隔', '布局'],
      status: 'stable',
      updateDate: '2024-02-01',
      views: 35,
      path: '/pages/demo/32-divider/index',
    },
    {
      id: 'c-count-down',
      name: 'C_CountDown',
      description: '倒计时组件，支持自定义格式、毫秒级精度和手动控制',
      category: 'display',
      version: '1.0.0',
      icon: 'mdi-timer-sand',
      color: '#fab1a0',
      tags: ['倒计时', '计时器', '时间'],
      status: 'stable',
      updateDate: '2024-02-01',
      views: 51,
      path: '/pages/demo/33-count-down/index',
    },
  ]

  // 计算属性
  const filteredComponents = computed(() => {
    if (!currentCategory.value) {
      return components
    }
    return components.filter(comp => comp.category === currentCategory.value)
  })

  // 方法
  const getComponentCountByCategory = (categoryKey: string) => {
    return components.filter(comp => comp.category === categoryKey).length
  }

  const getCategoryName = (categoryKey: string) => {
    const category = categories.find(cat => cat.key === categoryKey)
    return category ? category.name : '未知分类'
  }

  const filterByCategory = (categoryKey: string) => {
    currentCategory.value =
      categoryKey === currentCategory.value ? '' : categoryKey
  }

  const showAllComponents = () => {
    currentCategory.value = ''
  }

  const navigateToDemo = (component: (typeof components)[number]) => {
    uni.navigateTo({
      url: component.path,
    })
  }

  const getStatusClass = (status: string) => {
    const statusClasses: Record<string, string> = {
      stable: 'bg-green-100 text-green-600',
      beta: 'bg-yellow-100 text-yellow-600',
      alpha: 'bg-orange-100 text-orange-600',
      deprecated: 'bg-red-100 text-red-600',
    }
    return statusClasses[status] || 'bg-gray-100 text-gray-600'
  }

  const getStatusText = (status: string) => {
    const statusTexts: Record<string, string> = {
      stable: '稳定版',
      beta: '测试版',
      alpha: '预览版',
      deprecated: '已废弃',
    }
    return statusTexts[status] || '未知'
  }
</script>

<style lang="scss" scoped>
  .demo-page {
    min-height: 100%;
    background: #f8fafc;
  }

  .custom-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;

    .header-content {
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;

      .back-btn {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        &:active {
          transform: scale(0.95);
        }
      }

      .header-title {
        color: white;
        font-size: 18px;
        font-weight: 600;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .header-right {
        width: 32px;
      }
    }
  }

  .component-management {
    padding: 16px;
  }

  .intro-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
  }

  .category-card {
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
  }

  .component-card {
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      border-color: #409eff;
    }
  }

  .filter-btn {
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: scale(1.05);
    }
  }

  .icon-wrapper {
    transition: all 0.3s ease;
  }

  .component-card:hover .icon-wrapper {
    transform: scale(1.1);
  }

  .tag {
    transition: all 0.3s ease;

    &:hover {
      background-color: #409eff;
      color: white;
    }
  }

  .add-card {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
  }

  .empty-state {
    .empty-text {
      font-size: 16px;
    }

    .empty-desc {
      line-height: 1.5;
    }
  }

  // 状态徽章动画
  .status-badge {
    transition: all 0.3s ease;
  }

  .component-card:hover .status-badge {
    transform: scale(1.05);
  }

  // UnoCSS 工具类补充
  .bg-primary {
    background-color: #409eff;
  }

  .text-primary {
    color: #409eff;
  }
</style>
