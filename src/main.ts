import { createSSRApp } from 'vue'
import pinia from './stores'
import { useUserStore } from './stores/modules/user'
import { initRouter, setUserStore } from './utils/router'
import { installDirectives } from './directives'
import { setupErrorHandler } from './utils/error-handler'
import App from './App.vue'
import 'virtual:uno.css'
import { installUniFeedback } from './utils/feedback'
import { installNavigationFeedback } from './utils/navigation-feedback'
import config from './config/env'
// #ifdef H5
import { installH5Feedback } from './utils/feedback-h5'
// #endif

/** 创建 uni-app 应用实例 */
export function createApp() {
  const app = createSSRApp(App)

  // 全局错误处理
  setupErrorHandler(app)

  // 初始化 Pinia
  app.use(pinia)
  installUniFeedback()

  // #ifdef H5
  installH5Feedback(app)
  // #endif

  // 注册指令
  installDirectives(app)

  // 在 Pinia 初始化后注入路由守卫依赖（全平台可用，不依赖 window）
  setUserStore(useUserStore())

  // 初始化路由系统（守卫已在模块加载时安装）
  initRouter()
  installNavigationFeedback(app)

  // 演示拦截由显式开关控制；DEV 常量确保任何构建产物都不包含 Mock。
  if (import.meta.env.DEV && config.MOCK_ENABLED) {
    import('./mock').then(({ setupMock }) => setupMock())
  }

  return { app, pinia }
}
