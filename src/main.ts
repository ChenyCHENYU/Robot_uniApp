import { createSSRApp } from 'vue'
import pinia from './stores'
import { useUserStore } from './stores/modules/user'
import { initRouter, setUserStore } from './utils/router'
import { installDirectives } from './directives'
import { setupErrorHandler } from './utils/error-handler'
import App from './App.vue'
import 'virtual:uno.css'

/** 创建 uni-app 应用实例 */
export function createApp() {
  const app = createSSRApp(App)

  // 全局错误处理
  setupErrorHandler(app)

  // 初始化 Pinia
  app.use(pinia)

  // 注册指令
  installDirectives(app)

  // 在 Pinia 初始化后注入路由守卫依赖（全平台可用，不依赖 window）
  setUserStore(useUserStore())

  // 初始化路由系统（守卫已在模块加载时安装）
  initRouter()

  // 开发环境挂载 Mock 拦截器（动态 import 确保生产构建不打包 mock）
  if (import.meta.env.DEV) {
    import('./mock').then(({ setupMock }) => setupMock())
  }

  return { app, pinia }
}
