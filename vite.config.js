/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-08 11:50:51
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-09-09 11:24:44
 * @FilePath: \Robot_uniApp\vite.config.js
 * @Description:
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
 */
import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [uni()],
    css: {
      preprocessorOptions: {
        scss: {
          // 抑制 Sass 的废弃警告，避免控制台大量警告信息
          silenceDeprecations: ["legacy-js-api", "import"],
          // 额外配置：抑制其他可能的警告
          quietDeps: true,
        },
      },
    },
    // 环境变量配置
    define: {
      // 将环境变量注入到应用中
      __ENV__: JSON.stringify(env.VITE_ENV || mode),
      __VERSION__: JSON.stringify(env.VITE_APP_VERSION || "1.0.0"),
    },
    // 开发服务器配置
    server: {
      host: "1.9.9.9",
      port: 1999,
      proxy:
        env.VITE_ENV === "development"
          ? {
              // 开发环境代理配置
              "/api": {
                target: env.VITE_API_BASE_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
              },
            }
          : {},
    },
  };
});
