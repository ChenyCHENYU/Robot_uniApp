import { createSSRApp } from 'vue'
import pinia from "./stores";
import App from "./App.vue";
import uviewPlus from "uview-plus";

export function createApp() {
  const app = createSSRApp(App);

  // 注册 Pinia
  app.use(pinia);

  // 注册 uview-plus
  app.use(uviewPlus);

  return {
    app,
    pinia,
  };
}