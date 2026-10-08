# Robot_Uniapp 开发约定

本文件适用于本仓库及子目录。项目技术栈为 Vue 3、TypeScript、uni-app、Wot Design Uni、UnoCSS、SCSS 和 Pinia。

## 工作区指令适用范围

- 本仓库未安装或接入 `@agile-team/wl-skills-kit`。父目录中面向 PC 管理端和 Module Federation 子应用的 Kit 流程、模板及校验规则不作为本仓库的实施或验收标准。
- 不从兄弟项目借用 Kit CLI 扫描本仓库，不为满足 Kit 提示安装依赖、迁移组件或拆分空文件。只有用户明确要求接入 Kit，且确认移动端适用范围后，才考虑相关流程。
- 不套用 Element Plus、jh 组件、BaseTable/BaseForm、AG Grid、PC 菜单同步或联邦主应用约定。公共代码质量要求结合本项目实际实现判断。

## 实现边界

- 沿用所在目录已有的 `index.vue`、`data.ts`、`index.scss` 和 `api.md` 组织；需要拆分时依据职责与实际复杂度，不机械要求每个展示组件拥有全部文件。
- 请求复用现有 HTTP 封装；主题、反馈、导航和平台能力复用现有公共入口，保留 uni API 的回调与 Promise 契约。
- 浏览器 DOM 与宿主 SDK 的使用遵循条件编译和平台适配边界，不能把 H5 行为直接假定为微信、App、钉钉或 PDA 行为。
- 宿主识别不等于能力已接入；入口根据实际能力启用。正式联调与演示 Mock 分开，生产构建排除 Mock。

## 实际验收

- 按改动范围运行项目自身的 `pnpm type-check`、`pnpm lint:check`、`pnpm test`；需要完整质量检查时使用 `pnpm check:quality`。
- 涉及跨端公共代码时检查 `pnpm build:h5`、`pnpm build:wx`、`pnpm build:app` 和 `pnpm check:budget`。App 资源构建通过不等于安装包或真机验收通过。
- 界面改动检查实际交互、深浅主题、小屏和安全区；明确记录未验证的 SDK、正式接口与真机范围。
- 文档和约定调整只做相应格式、差异与事实核对，无需重复运行与改动无关的单测和构建。
