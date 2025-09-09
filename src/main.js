import { createSSRApp } from 'vue'
import pinia from './stores'
import { initRouter } from './utils/router'  // 移除 permissionDirectives 导入
import { installGlobalComponents } from "./components/global"
import { installDirectives } from "./directives"  // 新增指令安装函数导入
import App from "./App.vue"
import uviewPlus from "uview-plus"

export function createApp() {
  const app = createSSRApp(App)

  app.use(pinia)
  app.use(uviewPlus)

  // 注册全局组件
  installGlobalComponents(app)

  // 注册指令（替换原来的手动注册）
  installDirectives(app)

  // 初始化路由系统
  initRouter()

  return { app, pinia }
}