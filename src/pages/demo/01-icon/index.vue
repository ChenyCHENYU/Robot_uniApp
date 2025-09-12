<template>
  <C_Layout>
    <view class="demo-container">
      <view class="demo-title">C_Icon 组件示例</view>

      <!-- 1. UnoCSS 图标 -->
      <view class="demo-section">
        <view class="section-header">
          <view class="section-title">1. UnoCSS 图标</view>
          <text class="section-desc">使用 UnoCSS 图标库，支持海量图标</text>
        </view>
        
        <view class="demo-content">
          <view class="effect-demo">
            <view class="icon-row">
              <C_Icon name="i-mdi-home" :size="24" color="#409eff" />
              <C_Icon name="i-mdi-heart" :size="24" color="#f56c6c" />
              <C_Icon name="i-mdi-star" :size="24" color="#e6a23c" />
              <C_Icon name="i-mdi-account" :size="24" color="#67c23a" />
            </view>
          </view>
          <view class="code-demo">
            <text class="code-title">基础用法：</text>
            <view class="code-block">
              <text class="code-text">&lt;C_Icon name="i-mdi-home" :size="24" color="#409eff" /&gt;</text>
              <text class="code-text">&lt;C_Icon name="i-mdi-heart" :size="24" color="#f56c6c" /&gt;</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 2. uView+ 图标 -->
      <view class="demo-section">
        <view class="section-header">
          <view class="section-title">2. uView+ 图标</view>
          <text class="section-desc">使用 uView+ 图标组件，需指定 type="uview"</text>
        </view>
        
        <view class="demo-content">
          <view class="effect-demo">
            <view class="icon-row">
              <C_Icon type="uview" name="home" :size="24" color="#409eff" />
              <C_Icon type="uview" name="heart-fill" :size="24" color="#f56c6c" />
              <C_Icon type="uview" name="star-fill" :size="24" color="#e6a23c" />
              <C_Icon type="uview" name="account" :size="24" color="#67c23a" />
            </view>
          </view>
          <view class="code-demo">
            <text class="code-title">基础用法：</text>
            <view class="code-block">
              <text class="code-text">&lt;C_Icon type="uview" name="home" :size="24" /&gt;</text>
              <text class="code-text">&lt;C_Icon type="uview" name="heart-fill" :size="24" :bold="true" /&gt;</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 3. SVG 图标 -->
      <view class="demo-section">
        <view class="section-header">
          <view class="section-title">3. SVG 图标</view>
          <text class="section-desc">支持本地SVG文件和Base64编码的内联SVG</text>
        </view>
        
        <view class="demo-content">
          <view class="effect-demo">
            <view class="icon-row">
              <C_Icon type="svg" name="/static/icons/icon-test.svg" :size="24" />
              <C_Icon 
                type="svg" 
                name="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2QjM1Ii8+Cjwvc3ZnPgo=" 
                :size="24" 
              />
            </view>
          </view>
          <view class="code-demo">
            <text class="code-title">基础用法：</text>
            <view class="code-block">
              <text class="code-text">&lt;!-- 本地SVG文件 --&gt;</text>
              <text class="code-text">&lt;C_Icon type="svg" name="/static/icons/icon.svg" :size="24" /&gt;</text>
              <text class="code-text">&lt;!-- Base64编码SVG --&gt;</text>
              <text class="code-text">&lt;C_Icon type="svg" name="data:image/svg+xml;base64,..." /&gt;</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 4. 图片图标 -->
      <view class="demo-section">
        <view class="section-header">
          <view class="section-title">4. 图片图标</view>
          <text class="section-desc">支持本地图片、远程URL和Base64编码图片</text>
        </view>
        
        <view class="demo-content">
          <view class="effect-demo">
            <view class="icon-row">
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
          </view>
          <view class="code-demo">
            <text class="code-title">基础用法：</text>
            <view class="code-block">
              <text class="code-text">&lt;!-- 本地图片 --&gt;</text>
              <text class="code-text">&lt;C_Icon type="image" name="/static/images/logo.png" /&gt;</text>
              <text class="code-text">&lt;!-- 远程图片 --&gt;</text>
              <text class="code-text">&lt;C_Icon type="image" name="https://example.com/icon.png" /&gt;</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 5. 自定义内容 -->
      <view class="demo-section">
        <view class="section-header">
          <view class="section-title">5. 自定义内容</view>
          <text class="section-desc">通过插槽支持任意自定义内容</text>
        </view>
        
        <view class="demo-content">
          <view class="effect-demo">
            <view class="icon-row">
              <C_Icon type="custom" :size="24">🏠</C_Icon>
              <C_Icon type="custom" :size="24">
                <text class="custom-text">A</text>
              </C_Icon>
              <C_Icon type="custom" :size="24">
                <view class="custom-shape"></view>
              </C_Icon>
            </view>
          </view>
          <view class="code-demo">
            <text class="code-title">基础用法：</text>
            <view class="code-block">
              <text class="code-text">&lt;!-- Emoji --&gt;</text>
              <text class="code-text">&lt;C_Icon type="custom" :size="24"&gt;🏠&lt;/C_Icon&gt;</text>
              <text class="code-text">&lt;!-- 自定义内容 --&gt;</text>
              <text class="code-text">&lt;C_Icon type="custom"&gt;&lt;text&gt;A&lt;/text&gt;&lt;/C_Icon&gt;</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 6. 高级用法 -->
      <view class="demo-section">
        <view class="section-header">
          <view class="section-title">6. 高级用法</view>
          <text class="section-desc">尺寸、颜色、事件处理等进阶用法</text>
        </view>
        
        <view class="demo-content">
          <view class="effect-demo">
            <view class="advanced-demo">
              <view class="size-row">
                <text class="demo-label">不同尺寸：</text>
                <C_Icon name="i-mdi-star" :size="16" color="#409eff" />
                <C_Icon name="i-mdi-star" :size="24" color="#409eff" />
                <C_Icon name="i-mdi-star" :size="32" color="#409eff" />
                <C_Icon name="i-mdi-star" :size="48" color="#409eff" />
              </view>
              <view class="color-row">
                <text class="demo-label">不同颜色：</text>
                <C_Icon name="i-mdi-heart" :size="24" color="#f56c6c" />
                <C_Icon name="i-mdi-heart" :size="24" color="#67c23a" />
                <C_Icon name="i-mdi-heart" :size="24" color="#409eff" />
                <C_Icon name="i-mdi-heart" :size="24" color="#e6a23c" />
              </view>
            </view>
          </view>
          <view class="code-demo">
            <text class="code-title">高级用法：</text>
            <view class="code-block">
              <text class="code-text">&lt;!-- 自定义尺寸和颜色 --&gt;</text>
              <text class="code-text">&lt;C_Icon name="i-mdi-home" :size="32" color="#409eff" /&gt;</text>
              <text class="code-text">&lt;!-- 事件处理 --&gt;</text>
              <text class="code-text">&lt;C_Icon name="i-mdi-heart" @click="handleClick" /&gt;</text>
              <text class="code-text">&lt;!-- 自定义样式 --&gt;</text>
              <text class="code-text">&lt;C_Icon name="i-mdi-star" :custom-style="{ margin: '10px' }" /&gt;</text>
            </view>
          </view>
        </view>
      </view>

    </view>
  </C_Layout>
</template>

<script setup>
// C_Icon 组件演示页面
const handleClick = () => {
  console.log('图标被点击了')
}
</script>

<style lang="scss" scoped>
.demo-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.demo-title {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.demo-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.section-desc {
  font-size: 14px;
  color: #606266;
}

.demo-content {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.effect-demo {
  flex: 1;
  min-width: 200px;
}

.code-demo {
  flex: 1.2;
  min-width: 300px;
}

.icon-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.advanced-demo {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.size-row, .color-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.demo-label {
  font-size: 14px;
  color: #606266;
  min-width: 80px;
}

.code-title {
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
  display: block;
  margin-bottom: 8px;
}

.code-block {
  background: #f8f9fa;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 12px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.code-text {
  display: block;
  font-size: 12px;
  line-height: 1.6;
  color: #2c3e50;
  margin-bottom: 4px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.custom-text {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
}

.custom-shape {
  width: 12px;
  height: 12px;
  background: linear-gradient(45deg, #409eff, #67c23a);
  border-radius: 50%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .demo-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .effect-demo, .code-demo {
    min-width: auto;
  }
}
</style>