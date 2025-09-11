<template>
  <C_Layout>
    <view class="demo-container p-4">
      <!-- 五种图标类型演示 -->
      <view class="demo-section">
        <view class="section-title mb-4 text-lg font-bold"
          >🎯 五种图标类型演示</view
        >
        <view class="section-desc mb-6 text-sm text-gray-600">
          C_Icon 组件支持的所有图标类型及其用法
        </view>

        <view class="types-grid space-y-4">
          <!-- 1. UnoCSS 图标 (默认) -->
          <view class="type-card p-4 bg-white rounded-lg shadow-sm">
            <view class="flex gap-4">
              <!-- 左侧文字说明 -->
              <view class="flex-1">
                <view class="type-header mb-3">
                  <text class="type-title text-base font-bold"
                    >1. UnoCSS 图标 (推荐)</text
                  >
                  <text class="type-desc block text-sm text-gray-600 mt-1"
                    >基于 UnoCSS 的原子化图标，性能最佳</text
                  >
                </view>
                <view
                  class="code-sample text-xs bg-gray-900 text-green-400 p-3 rounded font-mono"
                >
                  &lt;C_Icon name="mdi:home" :size="20" color="#409eff" /&gt;
                </view>
              </view>
              <!-- 右侧演示 -->
              <view class="demo-showcase flex-shrink-0 w-32">
                <view class="demo-grid space-y-2">
                  <view
                    class="demo-item flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <C_Icon name="mdi:home" :size="18" color="#409eff" />
                    <text class="text-xs">首页</text>
                  </view>
                  <view
                    class="demo-item flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <C_Icon name="mdi:heart" :size="18" color="#ff4757" />
                    <text class="text-xs">喜欢</text>
                  </view>
                  <view
                    class="demo-item flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <C_Icon name="mdi:star" :size="18" color="#ffba00" />
                    <text class="text-xs">收藏</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 2. uView+ 图标 -->
          <view class="type-card p-4 bg-white rounded-lg shadow-sm">
            <view class="flex gap-4">
              <view class="flex-1">
                <view class="type-header mb-3">
                  <text class="type-title text-base font-bold"
                    >2. uView+ 图标</text
                  >
                  <text class="type-desc block text-sm text-gray-600 mt-1"
                    >uView+ UI 库内置图标，支持加粗等特性</text
                  >
                </view>
                <view
                  class="code-sample text-xs bg-gray-900 text-green-400 p-3 rounded font-mono"
                >
                  &lt;C_Icon type="uview" name="heart" :bold="true" /&gt;
                </view>
              </view>
              <view class="demo-showcase flex-shrink-0 w-32">
                <view class="demo-grid space-y-2">
                  <view
                    class="demo-item flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <C_Icon type="uview" name="level" :size="18" />
                    <text class="text-xs">等级</text>
                  </view>
                  <view
                    class="demo-item flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <C_Icon
                      type="uview"
                      name="woman"
                      :size="18"
                      color="#ff4757"
                    />
                    <text class="text-xs">女性</text>
                  </view>
                  <view
                    class="demo-item flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <C_Icon type="uview" name="man" :size="18" />
                    <text class="text-xs">男性</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 3. SVG 文件 -->
          <view class="type-card p-4 bg-white rounded-lg shadow-sm">
            <view class="flex gap-4">
              <view class="flex-1">
                <view class="type-header mb-3">
                  <text class="type-title text-base font-bold"
                    >3. SVG 文件</text
                  >
                  <text class="type-desc block text-sm text-gray-600 mt-1"
                    >本地 SVG 文件，适合自定义图标</text
                  >
                </view>
                <view
                  class="code-sample text-xs bg-gray-900 text-green-400 p-3 rounded font-mono"
                >
                  &lt;C_Icon type="svg" name="/static/icons/custom.svg" /&gt;
                </view>
              </view>
              <view class="demo-showcase flex-shrink-0 w-32">
                <view
                  class="demo-placeholder p-3 bg-gray-50 rounded text-center"
                >
                  <C_Icon name="mdi:file-outline" :size="24" color="#999" />
                  <text class="block text-xs text-gray-500 mt-1">SVG 文件</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 4. 图片文件 -->
          <view class="type-card p-4 bg-white rounded-lg shadow-sm">
            <view class="flex gap-4">
              <view class="flex-1">
                <view class="type-header mb-3">
                  <text class="type-title text-base font-bold"
                    >4. 图片文件</text
                  >
                  <text class="type-desc block text-sm text-gray-600 mt-1"
                    >PNG、JPG 等图片格式</text
                  >
                </view>
                <view
                  class="code-sample text-xs bg-gray-900 text-green-400 p-3 rounded font-mono"
                >
                  &lt;C_Icon type="image" name="/static/images/logo.png" /&gt;
                </view>
              </view>
              <view class="demo-showcase flex-shrink-0 w-32">
                <view
                  class="demo-placeholder p-3 bg-gray-50 rounded text-center"
                >
                  <C_Icon name="mdi:image-outline" :size="24" color="#999" />
                  <text class="block text-xs text-gray-500 mt-1">图片文件</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 5. 自定义内容 -->
          <view class="type-card p-4 bg-white rounded-lg shadow-sm">
            <view class="flex gap-4">
              <view class="flex-1">
                <view class="type-header mb-3">
                  <text class="type-title text-base font-bold"
                    >5. 自定义内容</text
                  >
                  <text class="type-desc block text-sm text-gray-600 mt-1"
                    >通过插槽插入任意内容</text
                  >
                </view>
                <view
                  class="code-sample text-xs bg-gray-900 text-green-400 p-3 rounded font-mono"
                >
                  &lt;C_Icon type="custom"&gt;🚀&lt;/C_Icon&gt;
                </view>
              </view>
              <view class="demo-showcase flex-shrink-0 w-32">
                <view class="demo-grid space-y-2">
                  <view
                    class="demo-item flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <C_Icon name="emoji-rocket" type="custom" :size="18"
                      >🚀</C_Icon
                    >
                    <text class="text-xs">Emoji</text>
                  </view>
                  <view
                    class="demo-item flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <C_Icon name="text-a" type="custom" :size="18">
                      <text class="text-sm font-bold text-primary">A</text>
                    </C_Icon>
                    <text class="text-xs">文字</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 常用图标展示 -->
      <view class="demo-section mt-8">
        <view class="section-title mb-4 text-lg font-bold"
          >🎨 常用 MDI 图标</view
        >
        <view class="section-desc mb-4 text-sm text-gray-600">
          项目中常用的 Material Design Icons
        </view>

        <view class="icon-grid grid grid-cols-6 gap-3">
          <view
            v-for="icon in commonIcons"
            :key="icon.name"
            class="icon-item flex flex-col items-center p-3 bg-white rounded-lg shadow-sm"
            @click="showIconCode(icon)"
          >
            <C_Icon :name="icon.name" :size="20" color="#666" />
            <text class="text-xs text-gray-500 mt-2">{{ icon.label }}</text>
          </view>
        </view>
      </view>

      <!-- 实际应用 -->
      <view class="demo-section mt-8">
        <view class="section-title mb-4 text-lg font-bold">🎯 实际应用</view>
        <view class="section-desc mb-4 text-sm text-gray-600">
          图标在实际项目中的应用示例
        </view>

        <!-- 导航示例 -->
        <view class="demo-card p-4 bg-white rounded-lg shadow-sm mb-4">
          <view class="demo-label text-sm font-semibold mb-3">底部导航</view>
          <view class="nav-demo flex justify-around py-3 bg-gray-50 rounded-lg">
            <view
              v-for="nav in navItems"
              :key="nav.key"
              class="nav-item flex flex-col items-center py-1"
              :class="{ 'text-primary': currentNav === nav.key }"
              @click="currentNav = nav.key"
            >
              <C_Icon
                :name="nav.icon"
                :size="18"
                :color="currentNav === nav.key ? '#409eff' : '#999'"
              />
              <text class="text-xs mt-1">{{ nav.label }}</text>
            </view>
          </view>
        </view>

        <!-- 操作按钮示例 -->
        <view class="demo-card p-4 bg-white rounded-lg shadow-sm">
          <view class="demo-label text-sm font-semibold mb-3">操作按钮</view>
          <view class="action-demo flex gap-3">
            <view
              class="action-btn flex items-center px-3 py-2 bg-primary text-white rounded-lg text-sm"
            >
              <C_Icon name="mdi:download" :size="14" color="white" />
              <text class="ml-2">下载</text>
            </view>
            <view
              class="action-btn flex items-center px-3 py-2 bg-success text-white rounded-lg text-sm"
            >
              <C_Icon name="mdi:share" :size="14" color="white" />
              <text class="ml-2">分享</text>
            </view>
            <view
              class="action-btn flex items-center px-3 py-2 bg-warning text-white rounded-lg text-sm"
            >
              <C_Icon name="mdi:edit" :size="14" color="white" />
              <text class="ml-2">编辑</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 代码提示弹窗 -->
    <up-popup v-model="showCodeModal" mode="center" :round="8">
      <view class="code-modal p-6 bg-white" style="width: 320px">
        <view class="modal-title text-lg font-bold mb-4">图标代码</view>
        <view class="code-content p-3 bg-gray-100 rounded-lg mb-4">
          <text class="text-sm font-mono">{{ selectedIconCode }}</text>
        </view>
        <view class="modal-actions flex gap-3">
          <button
            class="flex-1 py-2 bg-primary text-white rounded-lg text-sm"
            @click="copyCode"
          >
            复制代码
          </button>
          <button
            class="flex-1 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm"
            @click="showCodeModal = false"
          >
            关闭
          </button>
        </view>
      </view>
    </up-popup>
  </C_Layout>
</template>

<script setup>
import { ref } from "vue";

// 页面数据
const currentNav = ref("home");
const showCodeModal = ref(false);
const selectedIconCode = ref("");

// 返回功能
const goBack = () => {
  uni.navigateBack({
    fail: () => {
      // 如果没有上一页，跳转到组件管理页面
      uni.redirectTo({
        url: "/pages/demo/index",
      });
    },
  });
};

// 常用图标数据
const commonIcons = [
  { name: "mdi:home", label: "首页" },
  { name: "mdi:account", label: "用户" },
  { name: "mdi:cog", label: "设置" },
  { name: "mdi:heart", label: "喜欢" },
  { name: "mdi:star", label: "收藏" },
  { name: "mdi:bell", label: "通知" },
  { name: "mdi:email", label: "邮件" },
  { name: "mdi:phone", label: "电话" },
  { name: "mdi:calendar", label: "日历" },
  { name: "mdi:camera", label: "相机" },
  { name: "mdi:file", label: "文件" },
  { name: "mdi:folder", label: "文件夹" },
];

const navItems = [
  { key: "home", icon: "mdi:home", label: "首页" },
  { key: "discover", icon: "mdi:compass", label: "发现" },
  { key: "message", icon: "mdi:message", label: "消息" },
  { key: "profile", icon: "mdi:account", label: "我的" },
];

// 方法
const showIconCode = (icon) => {
  selectedIconCode.value = `<C_Icon name="${icon.name}" :size="20" color="#666" />`;
  showCodeModal.value = true;
};

const copyCode = () => {
  uni.setClipboardData({
    data: selectedIconCode.value,
    success: () => {
      uni.showToast({
        title: "代码已复制",
        icon: "success",
      });
      showCodeModal.value = false;
    },
  });
};
</script>

<style lang="scss" scoped>
.demo-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%);
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

.demo-container {
  padding: 16px;

  .section-title {
    color: #2c3e50;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .section-desc {
    color: #6c757d;
    line-height: 1.6;
  }
}

.type-card {
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: #409eff;
  }

  .type-title {
    color: #2c3e50;
    font-weight: 600;
  }

  .type-desc {
    color: #6c757d;
  }

  .demo-row {
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .demo-item {
    padding: 8px 12px;
    background: white;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }
  }

  .code-sample {
    background: #2d3748;
    color: #68d391;
    border: 1px solid #4a5568;
  }
}

.demo-card {
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .demo-label {
    color: #2c3e50;
    font-weight: 600;
  }

  .nav-demo {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 1px solid #dee2e6;
  }

  .action-demo {
    .action-btn {
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
      }
    }
  }
}

.icon-item {
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e4e7ed;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    border-color: #409eff;
    background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%);

    .C_Icon {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: translateY(-1px);
  }
}

.nav-item {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 8px;
  padding: 8px;

  &:hover {
    background: rgba(64, 158, 255, 0.1);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
}

.code-sample {
  word-break: break-all;
  line-height: 1.4;
  font-family: "Consolas", "Monaco", "Courier New", monospace;
}

.demo-placeholder {
  border: 2px dashed #cbd5e0;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);

  &:hover {
    border-color: #a0aec0;
  }
}

// UnoCSS 工具类补充
.text-primary {
  color: #409eff;
}

.text-success {
  color: #67c23a;
}

.text-warning {
  color: #e6a23c;
}

.bg-primary {
  background-color: #409eff;
}

.bg-success {
  background-color: #67c23a;
}

.bg-warning {
  background-color: #e6a23c;
}
</style>
