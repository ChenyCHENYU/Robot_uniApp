import { createSSRApp } from 'vue'
import pinia from './stores'
import { initRouter, setUserStore } from "./utils/router";
import { installDirectives } from "./directives";
import App from "./App.vue";
import "virtual:uno.css";

export function createApp() {
  const app = createSSRApp(App);

  // 初始化 Pinia
  app.use(pinia);

  // 注册指令
  installDirectives(app);

  // 在 Pinia 初始化后设置路由器依赖
  if (typeof window !== "undefined") {
    // 客户端环境下初始化路由
    import("./stores/modules/user").then(({ useUserStore }) => {
      const userStore = useUserStore();
      setUserStore(userStore);
    });
  }

  // 初始化路由系统
  initRouter();

  return { app, pinia };
}