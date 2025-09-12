<template>
  <C_Layout>
    <view class="demo-container">
      <view class="page-header">
        <C_Title
          title="C_Title 精致标题组件"
          subtitle="企业级标题组件，支持多种样式和配置"
          type="primary"
          :level="1"
          size="large"
          align="center"
          :show-decoration="true"
        />
      </view>

      <!-- 基础用法 -->
      <view class="demo-section">
        <C_Title
          title="基础用法"
          subtitle="最简单的标题使用方式"
          :level="2"
          type="default"
          :show-divider="true"
          left-icon="i-mdi-lightbulb"
        />
        
        <view class="demo-grid">
          <view class="demo-item">
            <C_Title title="默认标题" />
            <view class="code-snippet">
              <text>&lt;C_Title title="默认标题" /&gt;</text>
            </view>
          </view>
          <view class="demo-item">
            <C_Title title="带副标题" subtitle="这是一个副标题描述" />
            <view class="code-snippet">
              <text>&lt;C_Title title="带副标题" subtitle="这是一个副标题描述" /&gt;</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 标题级别 -->
      <view class="demo-section">
        <C_Title
          title="标题级别"
          subtitle="支持 h1-h6 六个级别"
          :level="2"
          type="primary"
          :show-divider="true"
          left-icon="i-mdi-format-header"
        />
        
        <view class="level-demo">
          <C_Title title="一级标题 H1" :level="1" />
          <C_Title title="二级标题 H2" :level="2" />
          <C_Title title="三级标题 H3" :level="3" />
          <C_Title title="四级标题 H4" :level="4" />
          <C_Title title="五级标题 H5" :level="5" />
          <C_Title title="六级标题 H6" :level="6" />
        </view>
      </view>

      <!-- 主题类型 -->
      <view class="demo-section">
        <C_Title
          title="主题类型"
          subtitle="支持多种主题颜色"
          :level="2"
          type="success"
          :show-divider="true"
          left-icon="i-mdi-palette"
        />
        
        <view class="theme-demo">
          <view class="theme-item">
            <C_Title title="默认主题" type="default" :show-decoration="true" />
          </view>
          <view class="theme-item">
            <C_Title title="主要主题" type="primary" :show-decoration="true" />
          </view>
          <view class="theme-item">
            <C_Title title="成功主题" type="success" :show-decoration="true" />
          </view>
          <view class="theme-item">
            <C_Title title="警告主题" type="warning" :show-decoration="true" />
          </view>
          <view class="theme-item">
            <C_Title title="危险主题" type="danger" :show-decoration="true" />
          </view>
          <view class="theme-item">
            <C_Title title="信息主题" type="info" :show-decoration="true" />
          </view>
        </view>
      </view>

      <!-- 对齐方式 -->
      <view class="demo-section">
        <C_Title
          title="对齐方式"
          subtitle="支持左对齐、居中、右对齐"
          :level="2"
          type="warning"
          :show-divider="true"
          left-icon="i-mdi-format-align-center"
        />
        
        <view class="align-demo">
          <view class="align-item">
            <C_Title 
              title="左对齐标题" 
              subtitle="Left aligned title"
              align="left" 
              type="primary"
              :show-decoration="true"
            />
          </view>
          <view class="align-item">
            <C_Title 
              title="居中标题" 
              subtitle="Center aligned title"
              align="center" 
              type="success"
              :show-decoration="true"
            />
          </view>
          <view class="align-item">
            <C_Title 
              title="右对齐标题" 
              subtitle="Right aligned title"
              align="right" 
              type="danger"
              :show-decoration="true"
            />
          </view>
        </view>
      </view>

      <!-- 图标使用 -->
      <view class="demo-section">
        <C_Title
          title="图标配置"
          subtitle="支持左侧和右侧图标"
          :level="2"
          type="info"
          :show-divider="true"
          left-icon="i-mdi-star"
        />
        
        <view class="icon-demo">
          <view class="icon-item">
            <C_Title 
              title="左侧图标" 
              subtitle="使用 left-icon 属性"
              left-icon="i-mdi-home"
              type="primary"
            />
          </view>
          <view class="icon-item">
            <C_Title 
              title="右侧图标" 
              subtitle="使用 right-icon 属性"
              right-icon="i-mdi-arrow-right"
              type="success"
            />
          </view>
          <view class="icon-item">
            <C_Title 
              title="双侧图标" 
              subtitle="同时使用左右图标"
              left-icon="i-mdi-account"
              right-icon="i-mdi-chevron-down"
              type="warning"
            />
          </view>
        </view>
      </view>

      <!-- 尺寸大小 -->
      <view class="demo-section">
        <C_Title
          title="尺寸大小"
          subtitle="支持小、中、大三种尺寸"
          :level="2"
          type="danger"
          :show-divider="true"
          left-icon="i-mdi-resize"
        />
        
        <view class="size-demo">
          <view class="size-item">
            <C_Title 
              title="小尺寸标题" 
              subtitle="size='small'"
              size="small"
              type="primary"
              left-icon="i-mdi-format-size"
              :show-decoration="true"
            />
          </view>
          <view class="size-item">
            <C_Title 
              title="中等尺寸标题" 
              subtitle="size='medium' (默认)"
              size="medium"
              type="success"
              left-icon="i-mdi-format-size"
              :show-decoration="true"
            />
          </view>
          <view class="size-item">
            <C_Title 
              title="大尺寸标题" 
              subtitle="size='large'"
              size="large"
              type="warning"
              left-icon="i-mdi-format-size"
              :show-decoration="true"
            />
          </view>
        </view>
      </view>

      <!-- 分割线样式 -->
      <view class="demo-section">
        <C_Title
          title="分割线样式"
          subtitle="支持顶部和底部分割线"
          :level="2"
          type="primary"
          :show-divider="true"
          left-icon="i-mdi-minus"
        />
        
        <view class="divider-demo">
          <view class="divider-item">
            <C_Title 
              title="顶部分割线" 
              subtitle="divider-position='top'"
              type="primary"
              :show-divider="true"
              divider-position="top"
            />
          </view>
          <view class="divider-item">
            <C_Title 
              title="底部分割线" 
              subtitle="divider-position='bottom'"
              type="success"
              :show-divider="true"
              divider-position="bottom"
            />
          </view>
          <view class="divider-item">
            <C_Title 
              title="不同主题分割线" 
              subtitle="分割线会自动匹配主题颜色"
              type="danger"
              :show-divider="true"
            />
          </view>
        </view>
      </view>

      <!-- 交互功能 -->
      <view class="demo-section">
        <C_Title
          title="交互功能"
          subtitle="支持点击事件和悬浮效果"
          :level="2"
          type="success"
          :show-divider="true"
          left-icon="i-mdi-cursor-pointer"
        />
        
        <view class="interactive-demo">
          <view class="interactive-item">
            <C_Title 
              title="可点击标题" 
              subtitle="设置 clickable 为 true，点击试试"
              type="primary"
              :clickable="true"
              left-icon="i-mdi-hand-pointing-up"
              @click="handleTitleClick"
            />
          </view>
          <view class="interactive-item">
            <C_Title 
              title="非交互标题" 
              subtitle="默认状态，不可点击"
              type="info"
              left-icon="i-mdi-information"
            />
          </view>
        </view>
      </view>

      <!-- 综合示例 -->
      <view class="demo-section">
        <C_Title
          title="综合示例"
          subtitle="展示组件的完整功能配置"
          :level="2"
          type="primary"
          :show-divider="true"
          left-icon="i-mdi-star"
        />
        
        <view class="comprehensive-demo">
          <C_Title 
            title="企业级产品标题" 
            subtitle="集成多种功能的完整配置示例，包含图标、装饰、交互等"
            :level="2"
            type="primary"
            size="large"
            align="center"
            left-icon="i-mdi-rocket"
            :show-decoration="true"
            :show-divider="true"
            :clickable="true"
            :bold="true"
            @click="handleComprehensiveClick"
          />
        </view>
      </view>

      <!-- 使用代码示例 -->
      <view class="demo-section">
        <C_Title
          title="代码示例"
          subtitle="复制即可使用的完整代码"
          :level="2"
          type="info"
          :show-divider="true"
          left-icon="i-mdi-code-tags"
        />
        
        <view class="code-example">
          <view class="code-block">
            <text class="code-title">基础用法：</text>
            <text class="code-text">&lt;C_Title title="页面标题" subtitle="页面描述" /&gt;</text>
          </view>
          
          <view class="code-block">
            <text class="code-title">完整配置：</text>
            <text class="code-text">&lt;C_Title</text>
            <text class="code-text">  title="企业级标题"</text>
            <text class="code-text">  subtitle="功能丰富的标题组件"</text>
            <text class="code-text">  :level="2"</text>
            <text class="code-text">  type="primary"</text>
            <text class="code-text">  size="large"</text>
            <text class="code-text">  align="center"</text>
            <text class="code-text">  left-icon="i-mdi-star"</text>
            <text class="code-text">  :show-decoration="true"</text>
            <text class="code-text">  :show-divider="true"</text>
            <text class="code-text">  :clickable="true"</text>
            <text class="code-text">  @click="handleClick"</text>
            <text class="code-text">/&gt;</text>
          </view>
        </view>
      </view>
    </view>
  </C_Layout>
</template>

<script setup>
// 演示页面逻辑
const handleTitleClick = () => {
  console.log('标题被点击了！')
  // 可以添加更多交互逻辑
}

const handleComprehensiveClick = () => {
  console.log('综合示例标题被点击了！')
  // 可以添加路由跳转等逻辑
}
</script>

<style lang="scss" scoped>
.demo-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 40px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  
  :deep(.c-title-main) {
    color: white !important;
  }
  
  :deep(.c-title-subtitle) {
    color: rgba(255, 255, 255, 0.9) !important;
  }
  
  :deep(.c-title-decoration) {
    background: rgba(255, 255, 255, 0.8) !important;
  }
}

.demo-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.demo-item {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  background: #fafafa;
}

.level-demo {
  margin-top: 20px;
  
  :deep(.c-title-wrapper) {
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.theme-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.theme-item {
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.align-demo {
  margin-top: 20px;
}

.align-item {
  margin-bottom: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.icon-demo, .size-demo {
  margin-top: 20px;
}

.icon-item, .size-item {
  margin-bottom: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.divider-demo {
  margin-top: 20px;
}

.divider-item {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.interactive-demo {
  margin-top: 20px;
}

.interactive-item {
  margin-bottom: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  border: 2px dashed #ddd;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.comprehensive-demo {
  margin-top: 20px;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  border: 2px solid #409eff;
}

.code-snippet {
  margin-top: 8px;
  padding: 8px;
  background: #f4f4f5;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  color: #666;
}

.code-example {
  margin-top: 20px;
}

.code-block {
  margin-bottom: 16px;
  padding: 16px;
  background: #f4f4f5;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.code-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 8px;
}

.code-text {
  display: block;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #2c3e50;
  margin-bottom: 2px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .demo-container {
    padding: 10px;
  }
  
  .page-header {
    padding: 20px 16px;
    margin-bottom: 20px;
  }
  
  .demo-section {
    padding: 16px;
    margin-bottom: 16px;
  }
  
  .demo-grid {
    grid-template-columns: 1fr;
  }
  
  .theme-demo {
    grid-template-columns: 1fr;
  }
}
</style>