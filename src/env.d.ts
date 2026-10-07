/// <reference types="@dcloudio/types" />
/// <reference types="vite/client" />

// uni 全局类型由 @dcloudio/types 提供（上面 reference 已覆盖）

/** vite.config.js define 注入的全局常量 */
declare const __ENV__: string
declare const __VERSION__: string

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
