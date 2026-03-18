/// <reference types="@dcloudio/types" />
/// <reference types="vite/client" />

/** 全局声明：自动导入的 Vue / uni-app API */
declare const uni: (typeof import('@dcloudio/types'))['uni']

/** Vue SFC 模块声明 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<
    Record<string, never>,
    Record<string, never>,
    any
  >
  export default component
}
