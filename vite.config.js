import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
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
});