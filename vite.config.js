import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig(async ({ mode }) => {
  // 动态导入 UnoCSS，避免 ESM 模块问题
  const { default: UnoCSS } = await import("unocss/vite");

  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      UnoCSS(), // 添加 UnoCSS 插件
      uni(),
    ],
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
