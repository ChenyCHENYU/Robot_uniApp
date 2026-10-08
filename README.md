<div align="center">
  <h1>🤖 Robot UniApp</h1>
  <p><strong>企业级跨平台移动应用开发框架</strong></p>
  <p><em>一次开发，多端运行 | 现代化架构 | 开箱即用</em></p>

  <p>
    <img src="https://img.shields.io/badge/vue-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue Version">
    <img src="https://img.shields.io/badge/UniApp-3.0-07C160?style=for-the-badge&logo=wechat&logoColor=white" alt="UniApp Version">
    <img src="https://img.shields.io/badge/Pinia-2.3-FFD43B?style=for-the-badge&logo=pinia&logoColor=black" alt="Pinia Version">
    <img src="https://img.shields.io/badge/UnoCSS-66.5-FF6B35?style=for-the-badge&logo=css3&logoColor=white" alt="UnoCSS Version">
    <img src="https://img.shields.io/badge/wot--design--uni-1.14-0078D7?style=for-the-badge" alt="wot-design-uni">
    <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite Version">
  </p>
</div>

---

## 🚀 项目简介

**Robot UniApp** 是基于 **Vue 3 + uni-app + TypeScript + UnoCSS + Pinia + wot-design-uni** 的跨平台移动应用模板，支持 H5 / 微信小程序 / App 多端开发。

- H5 / 小程序 / App 共用一套业务代码，静态演示页隔离在独立分包
- 请求层内置去重、指数退避重试（仅网络错误/5xx）、页面级取消、401 统一处理与登录回跳
- 身份代次（request-context）：登出/切号自动中止在途请求并隔离去重缓存
- 开发环境通过 `uni.addInterceptor` 拦截请求返回 Mock 数据（与 HTTP 层同协议：`code === 0` 为成功）
- 分级日志（`VITE_LOG_LEVEL`）与全局错误脱敏收集（token/openid 自动打码，可注册上报钩子）
- 平台能力抽象层（`src/platform`）：扫码/定位/拍照统一接口 + H5/小程序/App 实现 + 降级链
- 断点续传上传（App/MP 分片+重试+持久化 job）、App 热更新服务（manifest + sha256 校验）
- 简繁转换（`VITE_FEATURE_TW` 开关，opencc 字典懒加载，默认零包体成本）
- 契约测试 5 项（版本同步/路由守卫/HTTP 协议/API↔Mock 同步/平台隔离）+ vitest 单测 52 例；包体预算门禁（`pnpm check:budget`）
- 路由守卫采用「默认需登录 + 白名单放行」，并支持按页面配置角色/权限
- 34 个自研 `C_*` 组件（easycom 自动注册）+ wot-design-uni 按需引入
- 类型检查（vue-tsc）、oxlint + ESLint、commitlint + husky 全链路质量保障

---

## ⚡ 快速开始

### 环境要求

- Node.js **≥ 18**（推荐 20+）
- pnpm **≥ 10**

### 安装与启动

```bash
pnpm install        # 安装依赖（pnpm-workspace.yaml 已声明允许构建的依赖）
pnpm dev            # H5 开发（端口 1999，自动加载 Mock）
pnpm dev:wx         # 微信小程序开发（需微信开发者工具）
pnpm dev:app        # App 开发（需 HBuilderX）
```

> 开发环境演示账号：`CHENY / 123456`（仅 Mock，登录页有提示；`admin / admin123` 亦可）。短信登录任意合法手机号 + 4-6 位验证码。

### 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` / `dev:wx` / `dev:app` | 各端开发模式（Mock 自动启用） |
| `pnpm dev:test` / `dev:staging` | 测试/预发布环境 dev server |
| `pnpm build` / `build:wx` / `build:app` | 生产构建 |
| `pnpm build:test` / `build:staging` | 测试/预发布构建 |
| `pnpm type-check` | vue-tsc 全量类型检查 |
| `pnpm test` | 契约测试（守卫/协议/Mock 同步/平台隔离）+ 单元测试 |
| `pnpm test:unit` | vitest 单元测试（tests/，纯逻辑层） |
| `pnpm check:budget` | 构建产物包体预算门禁 |
| `pnpm check:quality` | type-check + lint + test 一键全检 |
| `pnpm lint` | oxlint + ESLint 检查并修复 |
| `pnpm cz` | 交互式规范化提交 |
| `pnpm push` | 推送当前分支到 origin |

---

## 🏗️ 项目架构

```
├── env/                      # 环境变量（单一配置源，vite envDir 指向此处）
│   ├── .env                  # 通用配置
│   ├── .env.development      # 开发（H5 走 /api 代理 → VITE_API_PROXY_TARGET）
│   ├── .env.test / staging / production
├── src/
│   ├── api/                  # API 工厂 + 业务接口模块（类型化）
│   ├── components/global/    # 34 个 C_* 全局组件（easycom: C_Xxx → 自动注册）
│   ├── composables/          # useUpload / useWebSocket / useModal / usePagination ...
│   ├── config/env.ts         # 读取 VITE_* 并导出类型化运行时配置
│   ├── constants/            # RESPONSE_CODE / 业务枚举 / 正则
│   ├── directives/           # v-auth / v-role 权限指令（仅 H5，小程序用 v-if 方案）
│   ├── mock/                 # Mock 拦截器（DEV 自动挂载，code:0 协议）
│   ├── pages/                # 主包 7 页 + 12 个分包（demo 33 页独立分包）
│   ├── stores/               # Pinia + 持久化（uni storage 适配器）
│   ├── styles/               # 设计 token（:root + page 双挂载）/ reset / mixins
│   ├── types/                # UserInfo / LoginResult / PageResult 等共享类型
│   ├── utils/                # http(+helpers/types) / router(守卫) / url-policy / logger / format / error-handler
│   └── main.ts               # 入口：错误处理 → Pinia → 守卫依赖注入 → Mock 挂载
├── uno.config.js             # UnoCSS（图标集显式声明，避免环境性加载失败）
└── vite.config.js            # envDir=env / AutoImport / 生产 drop console
```

---

## 🔧 核心机制说明

### 请求层（`src/utils/http.ts`）

- 响应协议：HTTP 200 且 `code === 0`（`RESPONSE_CODE.SUCCESS`）为成功
- GET 默认重试 2 次，**仅网络错误/5xx 重试**（指数退避），业务错误不重试
- 401 统一处理：清登录态 → 保存 `REDIRECT_URL` → reLaunch 登录页（并发去重）；登录成功后由 `consumeRedirectUrl()` 回跳
- 页面级请求取消：`C_Layout` 在页面 `onUnload` 时自动调用 `http.cancelPageRequests`

### 路由守卫（`src/utils/router.ts`）

- 模型：**默认所有页面需要登录**，`WHITE_LIST` 放行（登录/注册/引导）
- 基于 `uni.addInterceptor` 拦截 navigateTo/redirectTo/reLaunch/switchTab
- `PERMISSION_PAGES` 可按页面声明角色/权限要求

### Mock（`src/mock/`）

- 仅 `import.meta.env.DEV` 生效，`main.ts` 动态挂载（生产构建不打包）
- 拦截 `uni.request`，按 `METHOD /path` 匹配（自动剥离 baseURL 前缀）
- 与业务层同一成功协议（`success()` 返回 `code: 0`）

### 环境配置

- 单一配置源：`env/` 目录的 `VITE_*` 变量（`vite.config.js` 已设 `envDir: 'env'`）
- `src/config/env.ts` 负责读取并导出类型化配置；`VITE_ENV` 决定环境（development/test/staging/production）
- H5 开发用相对路径 `/api` 走 vite proxy；小程序/App 自动回退到 `VITE_API_PROXY_TARGET` 绝对地址
- H5 可用 `?env=xxx` 临时切换环境（**仅开发构建**，生产被摇树移除）
- 功能开关：`VITE_FEATURE_TW`（简繁转换，默认关）等见 `env/.env`

### WebView 安全（`src/utils/url-policy.ts`）

- WebView 页面仅允许加载**白名单内**的 https 地址（`WEBVIEW_ALLOWED_HOSTS`，支持 `*.example.com` 通配）
- 扫码结果打开链接前弹窗展示域名并要求用户确认
- 接入业务时请把业务域名加入白名单

### 设计 Token 与双主题（`src/styles/variables.scss` + `composables/useTheme`）

- 命名约定 `--r-{类别}-{语义}`，同时挂载 `:root`（H5）与 `page`（小程序/App）
- **亮/暗双主题**：暗色值经 `.theme-dark`（C_Layout 根节点类，CSS 变量向子树级联）
  与 `[data-theme='dark']`（H5 html）双选择器覆盖，全端生效
- **wot-design-uni 官方暗色集成**：C_Layout/webview/scan 内容经 `wd-config-provider`
  包裹，`:theme` 随应用主题联动；`themeVars` 将品牌 token（colorTheme/语义色/文字色）
  注入组件库，业务 token 与组件库 token 单向统一
- 主题模式：浅色 / 深色 / 跟随系统（`uni.onThemeChange` 实时跟随），设置页可切换，选择持久化
- 组件内请使用 `var(--r-color-primary)` 等 token，避免硬编码色值（破坏暗色）
- 全局网络状态监听：断网/恢复 toast 提示（App.vue）

---

## 📱 页面一览

| 分类 | 页面 | 数据来源 |
| --- | --- | --- |
| 主包 | 登录（账号/短信）、首页主控台、消息中心、组件库、个人中心、设置、修改密码 | 真实 API（登录/用户/消息） |
| 业务模板 | crud-list 列表 / form-template 表单 / approval 审批 / dashboard 看板 / detail 详情 | 真实 API（crud/approval/dashboard/form） |
| 功能 | scan 扫码（URL 确认）/ webview（白名单）/ guide 首次启动引导 / about / register | register 接真实 API |
| 组件演示 | `pages/demo` 分包，33 个组件逐一演示 | 本地演示数据 |

> 「真实 API」在开发环境由 `src/mock` 供应（同一 `code:0` 协议），接入真实后端只需替换 `env/` 中的 API 地址并核对返回结构。

---

## 🧪 质量保障

```bash
pnpm type-check   # vue-tsc --noEmit（0 错误）
pnpm lint         # oxlint + eslint
pnpm build:h5     # H5 生产构建
pnpm build:wx     # 微信小程序构建（主包约 1MB，含分包优化/按需注入/预下载配置）
```

- 提交：husky + lint-staged（本地 `pnpm exec`，无需联网）+ commitlint
- CI：GitHub Actions（lint → type-check → test → 双端构建 → 包体预算），见 `.github/workflows/ci.yml`
- 变更记录：[CHANGELOG.md](./CHANGELOG.md)
- 生产构建自动移除 `console`/`debugger`
- 已知限制：wot-design-uni@1.14.0 内部存在一个上游类型错误（`useUpload.ts`），为通过 `type-check` 暂未启用其 `global.d.ts` 全局组件模板类型；升级新版后可恢复

---

## 📄 接入指引（新项目 Checklist）

1. 替换 `env/` 中的 API/WS/CDN 地址为真实后端（业务页已按 mock 契约请求，仅需后端对齐 `code:0` 协议与字段）
2. 在 `src/utils/url-policy.ts` 配置 WebView 域名白名单
3. 在 `src/manifest.json` 填入微信 `appid`（或使用 CI 注入），并按需调整 App 权限
4. 对照 `src/api/modules/` 替换真实接口定义与返回类型（各页已按类型消费）
5. 按需调整 `src/utils/router.ts` 的 `WHITE_LIST` 与 `PERMISSION_PAGES`
6. 首页待办（todoList）、设置页附件等少量纯演示区块按需接入业务

---

## 📜 License

私有项目，未配置开源许可证。
