import { createSSRApp } from 'vue'
import pinia from './stores'
import { initRouter, permissionDirectives } from './utils/router'
import { installGlobalComponents } from "./components/global";
import App from "./App.vue";
import uviewPlus from "uview-plus";

export function createApp() {
  const app = createSSRApp(App);

  app.use(pinia);
  app.use(uviewPlus);

  // 注册全局组件
  installGlobalComponents(app);

  // 注册权限指令
  Object.keys(permissionDirectives).forEach((key) => {
    app.directive(key, permissionDirectives[key]);
  });

  // 初始化路由系统
  initRouter();

  return { app, pinia };
}