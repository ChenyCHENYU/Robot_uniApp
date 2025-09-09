import { createSSRApp } from 'vue'
import pinia from './stores'
import { initRouter } from "./utils/router";
import { installDirectives } from "./directives";
import App from "./App.vue";
import uviewPlus from "uview-plus";
import "virtual:uno.css";

export function createApp() {
  const app = createSSRApp(App);

  app.use(pinia);
  app.use(uviewPlus);

  // 注册指令
  installDirectives(app);

  // 初始化路由系统
  initRouter();

  return { app, pinia };
}