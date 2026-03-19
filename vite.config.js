/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2025-09-09 15:22:30
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2025-09-12 11:18:51
 * @FilePath: \Robot_uniApp\vite.config.js
 * @Description: C_Icon 组件演示页面
 * Copyright (c) 2025 by CHENY, All Rights Reserved 😎.
 */
  import { defineConfig, loadEnv } from "vite";
  import uni from "@dcloudio/vite-plugin-uni";

  export default defineConfig(async ({ mode }) => {
    // 动态导入 ESM 插件，避免 ESM 模块问题
    const { default: UnoCSS } = await import("unocss/vite");
    const { default: AutoImport } = await import("unplugin-auto-import/vite");

    // Mock 插件仅开发环境加载
    const isDev = mode === 'development'
    const mockPlugin = isDev
      ? (await import('vite-plugin-mock-dev-server')).default
      : null

    // 加载环境变量
    const env = loadEnv(mode, process.cwd(), "");

    return {
      plugins: [
        UnoCSS(),
        mockPlugin && mockPlugin(),
        AutoImport({
          imports: [
            'vue',
            'pinia',
            {
              '@dcloudio/uni-app': [
                'onLaunch',
                'onShow',
                'onHide',
                'onLoad',
                'onReady',
                'onUnload',
                'onPullDownRefresh',
                'onReachBottom',
                'onShareAppMessage',
                'onShareTimeline',
                'onPageScroll',
                'onTabItemTap',
              ],
            },
          ],
          dirs: ['src/composables', 'src/stores/modules'],
          dts: false, // uni-app 项目不需要 .d.ts
          vueTemplate: true, // 支持 template 中自动导入
        }),
        uni(),
      ],
      css: {
        preprocessorOptions: {
          scss: {
            // 抑制 Sass 的废弃警告，避免控制台大量警告信息
            silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin'],
            // 额外配置：抑制其他可能的警告
            quietDeps: true,
            // 自动注入全局 mixins / variables，每个 Vue SFC <style> 均可直接使用
            additionalData: `@use "@/styles/mixins.scss" as *;\n`,
          },
        },
      },
      // 环境变量配置
      define: {
        // 将环境变量注入到应用中
        __ENV__: JSON.stringify(env.VITE_ENV || mode),
        __VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
      },
      // 开发服务器配置
      server: {
        port: 1999,
        open: true,
        // 限制最大宽度以模拟移动端展示
        headers: {
          'X-Frame-Options': 'SAMEORIGIN',
        },
        proxy: {
          '/api': {
            target: env.VITE_API_BASE_URL || 'http://localhost:3000',
            changeOrigin: true,
            rewrite: path => path.replace(/^\/api/, ''),
          },
        },
      },
    }
  });
