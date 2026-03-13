<template>
  <C_Layout>
    <view class="component-management p-4">
      <!-- 页面说明 -->
      <view class="intro-section mb-6">
        <view
          class="intro-card p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white"
        >
          <view class="flex items-center mb-2">
            <C_Icon type="custom" :size="32">✨</C_Icon>
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
              currentCategory ? getCategoryName(currentCategory) : "全部组件"
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
                <C_Icon name="mdi-chevron-right" :size="20" color="#ccc" />
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
                    <C_Icon name="mdi-eye" :size="14" color="#999" />
                    <text class="ml-1 text-xs text-gray-500">{{
                      component.views || 0
                    }}</text>
                  </view>
                  <view class="stat-item flex items-center">
                    <C_Icon name="mdi-calendar" :size="14" color="#999" />
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
          <C_Icon name="mdi-package-variant" :size="48" color="#ddd" />
          <text class="empty-text block mt-4 text-gray-500">暂无组件</text>
          <text class="empty-desc block mt-2 text-sm text-gray-400">
            {{
              currentCategory ? "该分类下暂无组件" : "还没有添加任何组件演示"
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
            <C_Icon name="mdi-plus-circle" :size="32" color="white" />
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
import { ref, computed } from "vue";

// 获取安全区域
const safeAreaTop = computed(() => {
  const systemInfo = uni.getSystemInfoSync();
  return systemInfo.safeArea?.top || systemInfo.statusBarHeight || 0;
});

// 返回功能
const goBack = () => {
  uni.navigateBack({
    fail: () => {
      // 如果没有上一页，跳转到机器人页面
      uni.switchTab({
        url: "/pages/robot/index",
      });
    },
  });
};

// 响应式数据
const currentCategory = ref("");

// 组件分类
const categories = [
  {
    key: "basic",
    name: "基础组件",
    desc: "按钮、图标、文本等基础UI组件",
    icon: "mdi-cube-outline",
    color: "#409eff",
  },
  {
    key: "layout",
    name: "布局组件",
    desc: "头部、导航、布局等结构组件",
    icon: "mdi-view-dashboard",
    color: "#67c23a",
  },
  {
    key: "form",
    name: "表单组件",
    desc: "输入框、选择器等表单控件",
    icon: "mdi-form-select",
    color: "#e6a23c",
  },
  {
    key: "display",
    name: "展示组件",
    desc: "列表、卡片、轮播等展示组件",
    icon: "mdi-view-list",
    color: "#f56c6c",
  },
];

// 组件列表
const components = [
  {
    id: "c-icon",
    name: "C_Icon",
    description:
      "通用图标组件，支持UnoCSS、wot-design-uni、SVG、图片和自定义内容五种类型，提供统一的API接口",
    category: "basic",
    version: "1.0.0",
    icon: "mdi-palette",
    color: "#ff6b6b",
    tags: ["图标", "UnoCSS", "wot-design-uni", "多类型"],
    status: "stable",
    updateDate: "2024-01-15",
    views: 156,
    path: "/pages/demo/01-icon/index",
  },
  {
    id: "c-header",
    name: "C_Header",
    description: "统一头部导航组件，支持返回按钮、标题自定义、右侧操作等功能",
    category: "layout",
    version: "1.2.0",
    icon: "mdi-page-layout-header",
    color: "#4ecdc4",
    tags: ["导航", "头部", "布局"],
    status: "stable",
    updateDate: "2024-01-12",
    views: 89,
    path: "/pages/demo/02-header/index",
  },
  {
    id: "c-layout",
    name: "C_Layout",
    description: "页面布局组件，提供统一的页面结构和安全区域处理",
    category: "layout",
    version: "1.1.0",
    icon: "mdi-view-dashboard-outline",
    color: "#45b7d1",
    tags: ["布局", "结构", "安全区"],
    status: "stable",
    updateDate: "2024-01-10",
    views: 124,
    path: "/pages/demo/03-layout/index",
  },
  {
    id: "c-tabbar",
    name: "C_Tabbar",
    description: "底部导航栏组件，支持自定义图标、文字显示和路由跳转",
    category: "layout",
    version: "1.0.5",
    icon: "mdi-view-dashboard-variant",
    color: "#96ceb4",
    tags: ["导航", "底部", "Tab"],
    status: "stable",
    updateDate: "2024-01-08",
    views: 78,
    path: "/pages/demo/04-tabbar/index",
  },
];

// 计算属性
const filteredComponents = computed(() => {
  if (!currentCategory.value) {
    return components;
  }
  return components.filter((comp) => comp.category === currentCategory.value);
});

// 方法
const getComponentCountByCategory = (categoryKey) => {
  return components.filter((comp) => comp.category === categoryKey).length;
};

const getCategoryName = (categoryKey) => {
  const category = categories.find((cat) => cat.key === categoryKey);
  return category ? category.name : "未知分类";
};

const filterByCategory = (categoryKey) => {
  currentCategory.value =
    categoryKey === currentCategory.value ? "" : categoryKey;
};

const showAllComponents = () => {
  currentCategory.value = "";
};

const navigateToDemo = (component) => {
  if (component.id === "c-icon") {
    // 图标组件已经实现，可以直接跳转
    uni.navigateTo({
      url: component.path,
    });
  } else {
    // 其他组件暂未实现，显示提示
    uni.showModal({
      title: "即将推出",
      content: `${component.name} 组件演示页面正在开发中，敬请期待！`,
      showCancel: false,
      confirmText: "知道了",
    });
  }
};

const getStatusClass = (status) => {
  const statusClasses = {
    stable: "bg-green-100 text-green-600",
    beta: "bg-yellow-100 text-yellow-600",
    alpha: "bg-orange-100 text-orange-600",
    deprecated: "bg-red-100 text-red-600",
  };
  return statusClasses[status] || "bg-gray-100 text-gray-600";
};

const getStatusText = (status) => {
  const statusTexts = {
    stable: "稳定版",
    beta: "测试版",
    alpha: "预览版",
    deprecated: "已废弃",
  };
  return statusTexts[status] || "未知";
};
</script>

<style lang="scss" scoped>
.demo-page {
  min-height: 100vh;
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
