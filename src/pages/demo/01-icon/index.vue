<template>
  <C_Layout>
    <view class="max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      <!-- 页面标题 -->
      <view class="text-center mb-8">
        <C_Title
          title="C_Icon 图标组件演示"
          subtitle="五种图标类型，统一API，通用解决方案"
          type="primary"
          :level="3"
          size="large"
          align="center"
          left-icon="i-mdi-star"
          :show-decoration="true"
          :show-divider="true"
        />
      </view>

      <!-- 演示卡片网格 -->
      <view class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- 1. UnoCSS 图标卡片 -->
        <view class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <C_Title
            title="UnoCSS 图标"
            subtitle="海量图标库支持"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-palette"
            :show-decoration="true"
          />
          
          <view class="flex justify-center items-center gap-4 my-6 p-4 bg-gray-50 rounded-lg">
            <C_Icon name="i-mdi-home" :size="28" color="#409eff" />
            <C_Icon name="i-mdi-heart" :size="28" color="#f56c6c" />
            <C_Icon name="i-mdi-star" :size="28" color="#e6a23c" />
            <C_Icon name="i-mdi-account" :size="28" color="#67c23a" />
          </view>
          
          <view class="text-center">
            <text class="text-sm text-gray-600 block mb-2">基础用法：</text>
            <view class="bg-gray-100 rounded p-3 text-xs font-mono text-gray-800">
              &lt;C_Icon name="i-mdi-home" :size="28" /&gt;
            </view>
          </view>
        </view>

        <!-- 2. wot-design-uni 图标卡片 -->
        <view class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <C_Title
            title="wot-design-uni 图标"
            subtitle="wot-design-uni 组件库图标"
            :level="4"
            type="success"
            align="center"
            left-icon="i-mdi-view-grid"
            :show-decoration="true"
          />
          
          <view class="flex justify-center items-center gap-4 my-6 p-4 bg-gray-50 rounded-lg">
            <C_Icon type="wot" name="home" :size="28" color="#67c23a" />
            <C_Icon type="wot" name="heart" :size="28" color="#f56c6c" />
            <C_Icon type="wot" name="star" :size="28" color="#e6a23c" />
            <C_Icon type="wot" name="user" :size="28" color="#409eff" />
          </view>
          
          <view class="text-center">
            <text class="text-sm text-gray-600 block mb-2">基础用法：</text>
            <view class="bg-gray-100 rounded p-3 text-xs font-mono text-gray-800">
              &lt;C_Icon type="wot" name="home" /&gt;
            </view>
          </view>
        </view>

        <!-- 3. SVG 图标卡片 -->
        <view class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <C_Title
            title="SVG 图标"
            subtitle="本地和Base64 SVG"
            :level="4"
            type="warning"
            align="center"
            left-icon="i-mdi-svg"
            :show-decoration="true"
          />
          
          <view class="flex justify-center items-center gap-4 my-6 p-4 bg-gray-50 rounded-lg">
            <C_Icon type="svg" name="/static/icons/icon-test.svg" :size="32" />
            <C_Icon 
              type="svg" 
              name="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2QjM1Ii8+Cjwvc3ZnPgo=" 
              :size="32" 
            />
          </view>
          
          <view class="text-center">
            <text class="text-sm text-gray-600 block mb-2">基础用法：</text>
            <view class="bg-gray-100 rounded p-3 text-xs font-mono text-gray-800">
              &lt;C_Icon type="svg" name="/static/icon.svg" /&gt;
            </view>
          </view>
        </view>

        <!-- 4. 图片图标卡片 -->
        <view class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <C_Title
            title="图片图标"
            subtitle="本地、远程、Base64图片"
            :level="4"
            type="danger"
            align="center"
            left-icon="i-mdi-image"
            :show-decoration="true"
          />
          
          <view class="flex justify-center items-center gap-4 my-6 p-4 bg-gray-50 rounded-lg">
            <C_Icon type="image" name="/static/images/test-1.png" :size="32" />
            <C_Icon 
              type="image" 
              name="https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/robot_admin/login.png" 
              :size="32" 
            />
            <C_Icon 
              type="image" 
              name="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" 
              :size="32" 
            />
          </view>
          
          <view class="text-center">
            <text class="text-sm text-gray-600 block mb-2">基础用法：</text>
            <view class="bg-gray-100 rounded p-3 text-xs font-mono text-gray-800">
              &lt;C_Icon type="image" name="/path/to/image.png" /&gt;
            </view>
          </view>
        </view>

        <!-- 5. 自定义内容卡片 -->
        <view class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <C_Title
            title="自定义内容"
            subtitle="插槽支持任意内容"
            :level="4"
            type="info"
            align="center"
            left-icon="i-mdi-puzzle"
            :show-decoration="true"
          />
          
          <view class="flex justify-center items-center gap-4 my-6 p-4 bg-gray-50 rounded-lg">
            <C_Icon type="custom" :size="32">🏠</C_Icon>
            <C_Icon type="custom" :size="32">
              <text class="text-lg font-bold text-blue-500">A</text>
            </C_Icon>
            <C_Icon type="custom" :size="32">
              <view class="w-4 h-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></view>
            </C_Icon>
          </view>
          
          <view class="text-center">
            <text class="text-sm text-gray-600 block mb-2">基础用法：</text>
            <view class="bg-gray-100 rounded p-3 text-xs font-mono text-gray-800">
              &lt;C_Icon type="custom"&gt;🏠&lt;/C_Icon&gt;
            </view>
          </view>
        </view>

        <!-- 6. 高级功能卡片 -->
        <view class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <C_Title
            title="高级功能"
            subtitle="尺寸、颜色、事件处理"
            :level="4"
            type="primary"
            align="center"
            left-icon="i-mdi-cog"
            :show-decoration="true"
          />
          
          <view class="my-6 p-4 bg-gray-50 rounded-lg">
            <!-- 尺寸演示 -->
            <view class="flex justify-center items-end gap-3 mb-4">
              <C_Icon name="i-mdi-star" :size="16" color="#409eff" @click="handleIconClick" />
              <C_Icon name="i-mdi-star" :size="24" color="#409eff" @click="handleIconClick" />
              <C_Icon name="i-mdi-star" :size="32" color="#409eff" @click="handleIconClick" />
              <C_Icon name="i-mdi-star" :size="40" color="#409eff" @click="handleIconClick" />
            </view>
            
            <!-- 颜色演示 -->
            <view class="flex justify-center items-center gap-3">
              <C_Icon name="i-mdi-heart" :size="24" color="#f56c6c" @click="handleIconClick" />
              <C_Icon name="i-mdi-heart" :size="24" color="#67c23a" @click="handleIconClick" />
              <C_Icon name="i-mdi-heart" :size="24" color="#409eff" @click="handleIconClick" />
              <C_Icon name="i-mdi-heart" :size="24" color="#e6a23c" @click="handleIconClick" />
              <C_Icon name="i-mdi-heart" :size="24" color="#909399" @click="handleIconClick" />
            </view>
          </view>
          
          <view class="text-center">
            <text class="text-sm text-gray-600 block mb-2">点击图标试试：</text>
            <view class="bg-gray-100 rounded p-3 text-xs font-mono text-gray-800">
              &lt;C_Icon name="i-mdi-heart" @click="handleClick" /&gt;
            </view>
          </view>
        </view>

      </view>

      <!-- 底部说明 -->
      <view class="mt-8 text-center">
        <C_Title
          title="功能完整，使用简单"
          subtitle="企业级图标组件解决方案，支持多平台，零配置使用"
          :level="5"
          type="info"
          align="center"
          :show-divider="true"
          divider-position="top"
        />
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
// 图标点击事件处理
const handleIconClick = () => {
  console.log('图标被点击了！')
  // 这里可以添加更多交互逻辑
}
</script>