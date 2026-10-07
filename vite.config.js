/**
 * @Description: Vite 构建配置（uni-app 跨端）
 */
import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'node:path'

export default defineConfig(async ({ mode }) => {
  // 环境文件统一放在 env/ 目录（.env / .env.development / .env.test / ...）
  const envDir = resolve(__dirname, 'env')
  const env = loadEnv(mode, envDir, '')

  const isProd = mode === 'production'

  // 动态导入 ESM 插件，避免 ESM 模块问题
  const { default: UnoCSS } = await import('unocss/vite')
  const { default: AutoImport } = await import('unplugin-auto-import/vite')

  return {
    // 指定环境文件目录（import.meta.env 与 loadEnv 保持同源）
    envDir: 'env',
    plugins: [
      UnoCSS(),
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
        dts: 'src/auto-imports.d.ts',
        vueTemplate: true,
      }),
      uni(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // 抑制 Sass 的废弃警告，避免控制台大量警告信息
          silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin'],
          quietDeps: true,
          // 自动注入全局 mixins / variables，每个 Vue SFC <style> 均可直接使用
          additionalData: `@use "@/styles/mixins.scss" as *;\n`,
        },
      },
    },
    // 环境变量注入
    define: {
      __ENV__: JSON.stringify(env.VITE_ENV || mode),
      __VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
    },
    esbuild: {
      // 生产构建移除 console / debugger
      drop: isProd ? ['console', 'debugger'] : [],
    },
    build: {
      sourcemap: false,
    },
    // 开发服务器配置
    server: {
      port: 1999,
      headers: {
        'X-Frame-Options': 'SAMEORIGIN',
      },
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
